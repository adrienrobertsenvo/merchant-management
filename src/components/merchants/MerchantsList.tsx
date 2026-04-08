import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, type GridColDef, type GridSortModel } from '@mui/x-data-grid';
import { mockMonthlyMargins } from '../../data/mockMerchantMargins';
import type { BillingEntity, MerchantAlias, UnresolvedAlias, UnmappedShipment } from '../../types/merchant';

interface MerchantsListProps {
  entities: BillingEntity[];
  onSelectEntity: (entity: BillingEntity) => void;
  onAddMerchant: () => void;
  unresolvedAliases?: UnresolvedAlias[];
  unmappedShipments?: UnmappedShipment[];
  onSelectUnmapped?: () => void;
}

type TimePeriod = '3m' | '6m' | '12m' | 'all';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function cutoffMonth(period: TimePeriod): string | null {
  if (period === 'all') return null;
  const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

interface EnrichedRow extends BillingEntity {
  periodShipments: number;
  buyingCost: number;
  sellingRevenue: number;
  netRevenue: number;
  marginPct: number;
  isUnmapped?: boolean;
}

const columns: GridColDef<EnrichedRow>[] = [
  {
    field: 'name',
    headerName: 'Merchant Name',
    flex: 1.2,
    minWidth: 180,
    renderCell: (params) => {
      if (params.row.isUnmapped) return null;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: params.row.archived ? '#9ca3af' : '#111827' }}>
            {params.value}
          </Typography>
          {params.row.archived && (
            <Chip label="Archived" size="small" sx={{ bgcolor: '#f3f4f6', color: '#9ca3af', fontSize: 10, fontWeight: 500, height: 20 }} />
          )}
        </Box>
      );
    },
  },
  {
    field: 'aliases',
    headerName: 'Aliases',
    flex: 1.5,
    minWidth: 200,
    sortable: false,
    renderCell: (params) => {
      const aliases = params.value as MerchantAlias[];
      const isUnmapped = params.row.isUnmapped;
      const isArchived = params.row.archived;
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5, alignItems: 'center' }}>
          {aliases.slice(0, 3).map((alias) => (
            <Chip
              key={alias.name}
              label={alias.name}
              size="small"
              sx={{
                bgcolor: isUnmapped ? '#fef3c7' : isArchived ? '#f9fafb' : '#f3f4f6',
                color: isUnmapped ? '#92400e' : isArchived ? '#d1d5db' : '#374151',
                fontSize: 11, fontWeight: 500, border: 'none', height: 22,
              }}
            />
          ))}
          {aliases.length > 3 && (
            <Typography sx={{ fontSize: 11, color: isUnmapped ? '#b45309' : '#9ca3af', ml: 0.5 }}>
              +{aliases.length - 3} more
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 100,
    renderCell: (params) => {
      if (params.row.isUnmapped) return <Typography sx={{ fontSize: 13, color: '#d1d5db' }}>—</Typography>;
      return <Typography sx={{ fontSize: 13, color: params.row.archived ? '#d1d5db' : '#6b7280' }}>{params.value}</Typography>;
    },
  },
  {
    field: 'periodShipments',
    headerName: 'Shipments',
    width: 95,
    type: 'number',
    renderCell: (params) => (
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: params.row.isUnmapped ? '#92400e' : params.row.archived ? '#d1d5db' : undefined }}>
        {(params.value as number).toLocaleString()}
      </Typography>
    ),
  },
  {
    field: 'buyingCost',
    headerName: 'Buying',
    width: 100,
    type: 'number',
    renderCell: (params) => (
      <Typography sx={{ fontSize: 13, color: params.row.isUnmapped ? '#92400e' : params.row.archived ? '#d1d5db' : '#374151' }}>
        €{(params.value as number).toLocaleString()}
      </Typography>
    ),
  },
  {
    field: 'sellingRevenue',
    headerName: 'Selling',
    width: 100,
    type: 'number',
    renderCell: (params) => {
      if (params.row.isUnmapped) return <Typography sx={{ fontSize: 13, color: '#d1d5db' }}>—</Typography>;
      return <Typography sx={{ fontSize: 13, color: params.row.archived ? '#d1d5db' : '#374151' }}>€{(params.value as number).toLocaleString()}</Typography>;
    },
  },
  {
    field: 'netRevenue',
    headerName: 'Net',
    width: 95,
    type: 'number',
    renderCell: (params) => {
      if (params.row.isUnmapped) return <Typography sx={{ fontSize: 13, color: '#d1d5db' }}>—</Typography>;
      const v = params.value as number;
      return (
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: params.row.archived ? '#d1d5db' : (v >= 0 ? '#059669' : '#dc2626') }}>
          {v >= 0 ? '+' : ''}{v < 0 ? '-' : ''}€{Math.abs(v).toLocaleString()}
        </Typography>
      );
    },
  },
  {
    field: 'marginPct',
    headerName: 'Margin',
    width: 80,
    type: 'number',
    renderCell: (params) => {
      if (params.row.isUnmapped) return <Typography sx={{ fontSize: 13, color: '#d1d5db' }}>—</Typography>;
      const v = params.value as number;
      return (
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: params.row.archived ? '#d1d5db' : (v >= 0 ? '#059669' : '#dc2626') }}>
          {v >= 0 ? '+' : ''}{v.toFixed(1)}%
        </Typography>
      );
    },
  },
  {
    field: 'lastActivity',
    headerName: 'Last Edit',
    width: 105,
    renderCell: (params) => {
      if (params.row.isUnmapped && !params.value) return <Typography sx={{ fontSize: 12.5, color: '#d1d5db' }}>—</Typography>;
      return (
        <Typography sx={{ fontSize: 12.5, color: params.row.isUnmapped ? '#92400e' : params.row.archived ? '#d1d5db' : '#6b7280' }}>
          {formatDate(params.value as string)}
        </Typography>
      );
    },
  },
];

export default function MerchantsList({ entities, onSelectEntity, onAddMerchant, unresolvedAliases, unmappedShipments, onSelectUnmapped }: MerchantsListProps) {
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('12m');
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'periodShipments', sort: 'desc' }]);

  const hasArchived = useMemo(() => entities.some(e => e.archived), [entities]);
  const cutoff = useMemo(() => cutoffMonth(timePeriod), [timePeriod]);

  const enriched = useMemo<EnrichedRow[]>(() => {
    return entities.map(e => {
      const months = (mockMonthlyMargins[e.id] ?? []).filter(m => !cutoff || m.month >= cutoff);
      const periodShipments = months.reduce((s, m) => s + m.shipments, 0);
      const buyingCost = months.reduce((s, m) => s + m.buyingCost, 0);
      const sellingRevenue = months.reduce((s, m) => s + m.sellingRevenue, 0);
      const netRevenue = sellingRevenue - buyingCost;
      const marginPct = sellingRevenue > 0 ? (1 - buyingCost / sellingRevenue) * 100 : 0;
      return { ...e, periodShipments, buyingCost, sellingRevenue, netRevenue, marginPct };
    });
  }, [entities, cutoff]);

  const hasUnmapped = (unresolvedAliases?.length ?? 0) > 0 || (unmappedShipments?.length ?? 0) > 0;

  const filtered = useMemo(() => {
    let result = showArchived ? enriched : enriched.filter(e => !e.archived);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.aliases.some(a => a.name.toLowerCase().includes(q)) ||
        e.country.toLowerCase().includes(q) ||
        e.contactEmail.toLowerCase().includes(q)
      );
    }

    // Sort manually so we can pin the unmapped row at the top
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      result = [...result].sort((a, b) => {
        const va = (a as Record<string, unknown>)[field];
        const vb = (b as Record<string, unknown>)[field];
        let cmp: number;
        if (typeof va === 'number' && typeof vb === 'number') {
          cmp = va - vb;
        } else {
          cmp = String(va ?? '').localeCompare(String(vb ?? ''));
        }
        return sort === 'desc' ? -cmp : cmp;
      });
    }

    return result;
  }, [enriched, search, showArchived, sortModel, hasUnmapped, unresolvedAliases, unmappedShipments]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search merchants, aliases, account numbers..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <ToggleButtonGroup
          value={timePeriod}
          exclusive
          onChange={(_, v) => { if (v) setTimePeriod(v as TimePeriod); }}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              fontSize: 11,
              fontWeight: 600,
              px: 1.5,
              py: 0.25,
              textTransform: 'none',
              border: '1px solid #e8ebf0',
              color: '#6b7280',
              '&.Mui-selected': { bgcolor: '#3b82f6', color: '#fff', borderColor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } },
            },
          }}
        >
          <ToggleButton value="3m">3M</ToggleButton>
          <ToggleButton value="6m">6M</ToggleButton>
          <ToggleButton value="12m">12M</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
        {hasArchived && (
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
            }
            label={<Typography sx={{ fontSize: 13, color: '#6b7280' }}>Show archived</Typography>}
            sx={{ ml: 0, mr: 0 }}
          />
        )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddMerchant}
          sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
        >
          Add Merchant
        </Button>
      </Box>
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          getRowClassName={(params) => params.row.isUnmapped ? 'unmapped-row' : ''}
          onRowClick={(params) => {
            if (params.row.isUnmapped) {
              onSelectUnmapped?.();
            } else {
              onSelectEntity(params.row);
            }
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { backgroundColor: '#f8faff' } },
            '& .MuiDataGrid-row.unmapped-row': { bgcolor: '#fffbeb', '&:hover': { backgroundColor: '#fef3c7 !important' } },
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#fafbfc' },
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
          }}
        />
      </Box>
    </Box>
  );
}

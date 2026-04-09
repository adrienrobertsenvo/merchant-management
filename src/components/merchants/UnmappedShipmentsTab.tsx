import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DataGrid, type GridColDef, type GridRowSelectionModel, type GridRowId } from '@mui/x-data-grid';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SearchIcon from '@mui/icons-material/Search';
import CarrierChip from '../rate-cards/CarrierChip';
import { countryFlag } from '../../utils/format';
import { CARRIERS, CARRIER_IDS } from '../../constants/rateCardConfig';
import type { CarrierId } from '../../types/rateCard';
import type { BillingEntity, UnmappedShipment } from '../../types/merchant';

interface UnmappedShipmentsTabProps {
  shipments: UnmappedShipment[];
  entities: BillingEntity[];
  onAssign: (shipmentIds: string[], merchantId: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

import Chip from '@mui/material/Chip';

const transitStatusConfig: Record<UnmappedShipment['transitStatus'], { label: string; color: string; bg: string }> = {
  delivered: { label: 'Delivered', color: '#16a34a', bg: '#dcfce7' },
  in_transit: { label: 'In Transit', color: '#2563eb', bg: '#dbeafe' },
  exception: { label: 'Exception', color: '#dc2626', bg: '#fee2e2' },
  returned: { label: 'Returned', color: '#9a3412', bg: '#fff7ed' },
};

const columns: GridColDef<UnmappedShipment>[] = [
  {
    field: 'carrier',
    headerName: 'Carrier',
    width: 110,
    renderCell: (params) => <CarrierChip carrierId={params.value as CarrierId} />,
  },
  {
    field: 'shipmentNumber',
    headerName: 'Shipment Number',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 13, fontWeight: 500, fontFamily: 'monospace' }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'reference',
    headerName: 'Reference',
    width: 120,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 13, fontFamily: 'monospace', color: '#374151' }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'invoiceNumber',
    headerName: 'Invoice',
    width: 160,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 12, color: '#6b7280' }}>{params.value}</Typography>
    ),
  },
  {
    field: 'accountNumber',
    headerName: 'Account',
    width: 130,
    renderCell: (params) => (
      <Chip label={params.value} size="small" variant="outlined" sx={{ fontSize: 10, fontWeight: 500, height: 20, color: '#374151', borderColor: '#d1d5db' }} />
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 110,
    renderCell: (params) => (
      <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
        {formatDate(params.value as string)}
      </Typography>
    ),
  },
  {
    field: 'transitStatus',
    headerName: 'Transit',
    width: 100,
    renderCell: (params) => {
      const cfg = transitStatusConfig[params.value as UnmappedShipment['transitStatus']];
      return <Chip label={cfg.label} size="small" sx={{ fontSize: 10, fontWeight: 600, height: 20, bgcolor: cfg.bg, color: cfg.color }} />;
    },
  },
  {
    field: 'originCountry',
    headerName: 'Route',
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: 18, lineHeight: 1 }}>{countryFlag(params.row.originCountry)}</Typography>
        <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>&rarr;</Typography>
        <Typography sx={{ fontSize: 18, lineHeight: 1 }}>{countryFlag(params.row.destinationCountry)}</Typography>
      </Box>
    ),
  },
];

export default function UnmappedShipmentsTab({ shipments, entities, onAssign }: UnmappedShipmentsTabProps) {
  const [selection, setSelection] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set<GridRowId>() });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<BillingEntity | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<CarrierId | ''>('');
  const [originFilter, setOriginFilter] = useState('');
  const [destFilter, setDestFilter] = useState('');

  const activeEntities = useMemo(() => entities.filter(e => !e.archived), [entities]);

  const uniqueOrigins = useMemo(() => [...new Set(shipments.map(s => s.originCountry))].sort(), [shipments]);
  const uniqueDests = useMemo(() => [...new Set(shipments.map(s => s.destinationCountry))].sort(), [shipments]);

  const filtered = useMemo(() => {
    let result = shipments;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.shipmentNumber.toLowerCase().includes(q) ||
        s.reference.toLowerCase().includes(q)
      );
    }
    if (carrierFilter) result = result.filter(s => s.carrier === carrierFilter);
    if (originFilter) result = result.filter(s => s.originCountry === originFilter);
    if (destFilter) result = result.filter(s => s.destinationCountry === destFilter);
    return result;
  }, [shipments, search, carrierFilter, originFilter, destFilter]);

  const selectedIds = useMemo(() => {
    if (selection.type === 'exclude') {
      // "Select all" — all filtered rows minus explicit exclusions in selection.ids
      const excluded = selection.ids;
      return filtered.map(s => s.id).filter(id => !excluded.has(id));
    }
    // "include" — only explicitly selected ids
    return Array.from(selection.ids).map(String);
  }, [selection, filtered]);

  // Show action bar whenever there's at least 1 selected
  const hasSelection = selectedIds.length > 0;

  const handleOpenAssign = () => {
    setSelectedMerchant(null);
    setAssignDialogOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedMerchant || selectedIds.length === 0) return;
    onAssign(selectedIds, selectedMerchant.id);
    setAssignDialogOpen(false);
    setSelection({ type: 'include', ids: new Set<GridRowId>() });
    setSelectedMerchant(null);
  };

  return (
    <Box>
      {/* Search + Filters */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search shipment numbers, references..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                </InputAdornment>
              ),
              sx: { fontSize: 13 },
            },
          }}
        />

        <TextField
          select
          size="small"
          value={carrierFilter}
          onChange={(e) => setCarrierFilter(e.target.value as CarrierId | '')}
          sx={{ width: 140, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>All Carriers</MenuItem>
          {CARRIER_IDS.map(id => (
            <MenuItem key={id} value={id} sx={{ fontSize: 13 }}>{CARRIERS[id].label}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value)}
          sx={{ width: 120, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>All Origins</MenuItem>
          {uniqueOrigins.map(c => (
            <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>{countryFlag(c)} {c}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          value={destFilter}
          onChange={(e) => setDestFilter(e.target.value)}
          sx={{ width: 140, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>All Destinations</MenuItem>
          {uniqueDests.map(c => (
            <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>{countryFlag(c)} {c}</MenuItem>
          ))}
        </TextField>

        <Typography sx={{ ml: 'auto', fontSize: 12, color: '#6b7280' }}>
          {filtered.length} shipment{filtered.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Action bar */}
      {hasSelection && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 1.5, bgcolor: '#eff6ff', borderRadius: 1.5, border: '1px solid #bfdbfe' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>
            {selectedIds.length} shipment{selectedIds.length !== 1 ? 's' : ''} selected
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<AssignmentIndIcon sx={{ fontSize: 16 }} />}
            onClick={handleOpenAssign}
            sx={{ fontWeight: 600, fontSize: 12 }}
          >
            Assign to Merchant
          </Button>
        </Box>
      )}

      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          checkboxSelection
          rowSelectionModel={selection}
          onRowSelectionModelChange={(newSelection) => setSelection(newSelection)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#fafbfc' },
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#f8faff' },
          }}
        />
      </Box>

      {/* Assign dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>
          Assign {selectedIds.length} Shipment{selectedIds.length !== 1 ? 's' : ''} to Merchant
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 2 }}>
            Select a merchant to assign the selected shipments to.
          </Typography>
          <Autocomplete
            options={activeEntities}
            getOptionLabel={(option) => option.name}
            value={selectedMerchant}
            onChange={(_, value) => setSelectedMerchant(value)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search merchants..." size="small" />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <li key={key} {...rest}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{option.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>{option.country} &middot; {option.shipmentCount.toLocaleString()} shipments</Typography>
                  </Box>
                </li>
              );
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssignDialogOpen(false)} sx={{ color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedMerchant}
            onClick={handleConfirmAssign}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

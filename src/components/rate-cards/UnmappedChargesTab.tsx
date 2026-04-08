import { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import CarrierChip from './CarrierChip';
import RateCardDetailDrawer from '../merchants/RateCardDetailDrawer';
import SurchargeEditDialog from '../billing/SurchargeEditDialog';
import { mockUnmappedCharges } from '../../data/mockBillingCharges';
import { resolveRateCard } from '../../utils/rateCardResolver';
import { mockMerchantGroups, mockAssignments } from '../../data/mockRateCards';
import { CARRIERS, CARRIER_IDS } from '../../constants/rateCardConfig';
import type { CarrierId, RateCard, UnmappedCharge, Surcharge } from '../../types/rateCard';

interface UnmappedChargesTabProps {
  rateCards: RateCard[];
  onEditSurcharges: (rateCardId: string, surcharges: Surcharge[]) => void;
}

const fmtEur = (v: number) => `€${v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function parseFixedEuro(value: string): number | null {
  if (value.startsWith('€')) {
    const n = parseFloat(value.slice(1));
    return isNaN(n) ? null : n;
  }
  return null;
}

function parsePercentage(value: string): number | null {
  const match = value.match(/^\+?(\d+(?:\.\d+)?)%$/);
  return match ? parseFloat(match[1]) : null;
}

export default function UnmappedChargesTab({ rateCards, onEditSurcharges }: UnmappedChargesTabProps) {
  const [charges, setCharges] = useState<UnmappedCharge[]>(mockUnmappedCharges);
  const [search, setSearch] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<CarrierId | ''>('');
  const [chargeNameFilter, setChargeNameFilter] = useState('');
  const [editDialogRateCard, setEditDialogRateCard] = useState<RateCard | null>(null);
  const [drawerRateCard, setDrawerRateCard] = useState<RateCard | null>(null);
  // Per-row mapping state
  const [mappedCharges, setMappedCharges] = useState<Record<string, { rcId: string; surchargeName: string }>>({});

  const uniqueChargeNames = useMemo(
    () => [...new Set(charges.map(c => c.chargeName))].sort(),
    [charges],
  );

  // Resolve the sell rate card for each merchant+carrier combo
  const resolvedSellingMap = useMemo(() => {
    const map = new Map<string, { rateCard: RateCard; surchargeNames: string[] } | null>();
    for (const charge of charges) {
      const key = `${charge.merchantId}:${charge.carrierId}`;
      if (!map.has(key)) {
        const resolved = resolveRateCard(charge.merchantId, charge.carrierId, mockAssignments, rateCards, mockMerchantGroups);
        if (resolved?.rateCard.pricing?.surcharges) {
          map.set(key, {
            rateCard: resolved.rateCard,
            surchargeNames: ['Base Product', ...resolved.rateCard.pricing.surcharges.map(s => s.name)],
          });
        } else {
          map.set(key, null);
        }
      }
    }
    return map;
  }, [rateCards, charges]);

  const getMapping = useCallback((charge: UnmappedCharge) => {
    // Check explicit mapping first
    const explicit = mappedCharges[charge.id];
    if (explicit) {
      const rc = rateCards.find(r => r.id === explicit.rcId);
      return rc ? { rateCard: rc, surchargeName: explicit.surchargeName } : null;
    }
    // Check if charge has pre-existing mapping
    if (charge.sellingRateCardId && charge.sellingChargeName) {
      const rc = rateCards.find(r => r.id === charge.sellingRateCardId);
      return rc ? { rateCard: rc, surchargeName: charge.sellingChargeName } : null;
    }
    return null;
  }, [mappedCharges, rateCards]);

  const getSellUnit = useCallback((charge: UnmappedCharge): { display: string; value: number | null } => {
    const mapping = getMapping(charge);
    if (!mapping) return { display: '—', value: null };

    if (mapping.surchargeName === 'Base Product') {
      // Base product — use first zone's lowest tier price
      const firstZone = mapping.rateCard.pricing?.zones?.[0];
      if (firstZone?.tiers.length) {
        const lowest = Math.min(...firstZone.tiers.map(t => t.price));
        return { display: `from €${lowest.toFixed(2)}`, value: null };
      }
      return { display: '—', value: null };
    }
    const surcharge = mapping.rateCard.pricing?.surcharges.find(s => s.name === mapping.surchargeName);
    if (!surcharge) return { display: '—', value: null };

    const fixed = parseFixedEuro(surcharge.value);
    if (fixed !== null) return { display: surcharge.value, value: fixed };
    const pct = parsePercentage(surcharge.value);
    if (pct !== null) return { display: surcharge.value, value: null };
    return { display: surcharge.value, value: null };
  }, [getMapping]);

  const getSellTotal = useCallback((charge: UnmappedCharge): number | null => {
    const mapping = getMapping(charge);
    if (!mapping) return null;

    if (mapping.surchargeName === 'Base Product') {
      // Base product — estimate using first zone's average tier price × occurrences
      const firstZone = mapping.rateCard.pricing?.zones?.[0];
      if (firstZone?.tiers.length) {
        const avg = firstZone.tiers.reduce((s, t) => s + t.price, 0) / firstZone.tiers.length;
        return avg * charge.occurrenceCount;
      }
      return null;
    }
    const surcharge = mapping.rateCard.pricing?.surcharges.find(s => s.name === mapping.surchargeName);
    if (!surcharge) return null;

    const fixed = parseFixedEuro(surcharge.value);
    if (fixed !== null) return fixed * charge.occurrenceCount;
    const pct = parsePercentage(surcharge.value);
    if (pct !== null) return charge.buyingPriceTotal * (1 + pct / 100);
    return null;
  }, [getMapping]);

  const filtered = useMemo(() => {
    let result = charges;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.chargeName.toLowerCase().includes(q) ||
        c.merchantName.toLowerCase().includes(q) ||
        c.buyingRateCardName.toLowerCase().includes(q)
      );
    }
    if (carrierFilter) result = result.filter(c => c.carrierId === carrierFilter);
    if (chargeNameFilter) result = result.filter(c => c.chargeName === chargeNameFilter);
    return result;
  }, [charges, search, carrierFilter, chargeNameFilter]);

  const summary = useMemo(() => {
    const total = charges.length;
    const mapped = charges.filter(c => getMapping(c) !== null).length;
    const unmapped = total - mapped;
    const totalBuying = charges.reduce((s, c) => s + c.buyingPriceTotal, 0);
    const unmappedBuying = charges.filter(c => !getMapping(c)).reduce((s, c) => s + c.buyingPriceTotal, 0);
    const totalOccurrences = charges.reduce((s, c) => s + c.occurrenceCount, 0);
    const uniqueCharges = new Set(charges.map(c => c.chargeName)).size;
    const affectedMerchants = new Set(charges.map(c => c.merchantId)).size;

    let totalSelling = 0;
    for (const c of charges) {
      const st = getSellTotal(c);
      if (st !== null) totalSelling += st;
    }
    const totalMargin = totalSelling - totalBuying;

    return { total, mapped, unmapped, totalBuying, unmappedBuying, totalOccurrences, uniqueCharges, affectedMerchants, totalSelling, totalMargin };
  }, [charges, getMapping, getSellTotal]);

  const columns: GridColDef<UnmappedCharge>[] = useMemo(() => [
    {
      field: 'chargeName',
      headerName: 'Charge Name',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{params.value}</Typography>
      ),
    },
    {
      field: 'carrierId',
      headerName: 'Carrier',
      width: 110,
      renderCell: (params) => <CarrierChip carrierId={params.value as CarrierId} />,
    },
    {
      field: 'merchantName',
      headerName: 'Merchant',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'occurrenceCount',
      headerName: 'Qty',
      width: 70,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'buyingPriceTotal',
      headerName: 'Buy Total',
      width: 100,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {fmtEur(params.value)}
        </Typography>
      ),
    },
    {
      field: 'buyingRateCardName',
      headerName: 'Buy Rate Card',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} size="small" sx={{ fontSize: 10, fontWeight: 500, height: 22, bgcolor: '#eff6ff', color: '#1e40af' }} />
      ),
    },
    // ── Sell Rate Card ──
    {
      field: 'sellRateCard',
      headerName: 'Sell Rate Card',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const charge = params.row;
        const key = `${charge.merchantId}:${charge.carrierId}`;
        const resolved = resolvedSellingMap.get(key);

        if (!resolved) {
          return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>;
        }

        return (
          <Typography sx={{ fontSize: 12 }}>{resolved.rateCard.name}</Typography>
        );
      },
    },
    // ── Sell Mapping (surcharge picker) ──
    {
      field: 'sellMapping',
      headerName: 'Sell Mapping',
      flex: 1.2,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        const charge = params.row;
        const key = `${charge.merchantId}:${charge.carrierId}`;
        const resolved = resolvedSellingMap.get(key);
        const mapping = getMapping(charge);

        if (!resolved) return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
            <Autocomplete
              size="small"
              options={resolved.surchargeNames}
              groupBy={(option) => option === 'Base Product' ? 'Product' : 'Surcharges'}
              value={mapping?.surchargeName ?? null}
              onChange={(_e, newValue) => {
                if (newValue) {
                  setMappedCharges(prev => ({ ...prev, [charge.id]: { rcId: resolved.rateCard.id, surchargeName: newValue } }));
                } else {
                  setMappedCharges(prev => {
                    const next = { ...prev };
                    delete next[charge.id];
                    return next;
                  });
                }
              }}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  placeholder="Select charge…"
                  sx={{
                    '& .MuiInputBase-root': { fontSize: 12, py: 0 },
                    '& .MuiInputBase-input': { py: '4px !important' },
                  }}
                />
              )}
              sx={{ flex: 1, minWidth: 0 }}
              disableClearable={false}
              forcePopupIcon
              slotProps={{
                paper: { sx: { fontSize: 12 } },
                listbox: { sx: { '& .MuiAutocomplete-option': { fontSize: 12 } } },
              }}
            />
            {mapping ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: '#16a34a', flexShrink: 0 }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 16, color: '#d97706', flexShrink: 0 }} />
            )}
          </Box>
        );
      },
    },
    // ── Status ──
    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const mapping = getMapping(params.row);
        if (mapping) return <Chip label="Mapped" size="small" sx={{ fontSize: 10, fontWeight: 600, height: 20, bgcolor: '#dcfce7', color: '#16a34a' }} />;
        return <Chip label="Unmapped" size="small" sx={{ fontSize: 10, fontWeight: 600, height: 20, bgcolor: '#fef3c7', color: '#92400e' }} />;
      },
    },
  ], [rateCards, resolvedSellingMap, getMapping]);

  return (
    <Box>
      {/* Summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
            <Box component="span" sx={{ fontWeight: 700, fontSize: 20, color: '#111827', mr: 0.75 }}>{summary.total}</Box>
            charge entries across {summary.affectedMerchants} merchants
          </Typography>
        </Box>
        <Box sx={{ height: 24, width: 1, bgcolor: '#e8ebf0' }} />
        <Box>
          <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
            Buy exposure: <Box component="span" sx={{ fontWeight: 600, color: '#111827' }}>{fmtEur(summary.totalBuying)}</Box>
          </Typography>
        </Box>
        <Box sx={{ height: 24, width: 1, bgcolor: '#e8ebf0' }} />
        {summary.mapped > 0 && (
          <Chip label={`${summary.mapped} mapped`} size="small" sx={{ fontSize: 11, fontWeight: 600, height: 24, bgcolor: '#dcfce7', color: '#16a34a' }} />
        )}
        {summary.unmapped > 0 && (
          <Chip label={`${summary.unmapped} unmapped`} size="small" sx={{ fontSize: 11, fontWeight: 600, height: 24, bgcolor: '#fef3c7', color: '#92400e' }} />
        )}
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search charges, merchants, rate cards..."
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
          value={chargeNameFilter}
          onChange={(e) => setChargeNameFilter(e.target.value)}
          sx={{ width: 180, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>All Charge Types</MenuItem>
          {uniqueChargeNames.map(name => (
            <MenuItem key={name} value={name} sx={{ fontSize: 13 }}>{name}</MenuItem>
          ))}
        </TextField>

        {summary.unmapped > 0 && (
          <Typography sx={{ ml: 'auto', fontSize: 12, color: '#d97706', fontWeight: 500 }}>
            {summary.unmapped} unmapped charges need attention
          </Typography>
        )}
      </Box>

      {/* Table */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          density="compact"
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'buyingPriceTotal', sort: 'desc' }] },
          }}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          rowHeight={48}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { fontSize: 12, fontWeight: 600, color: '#64748b', bgcolor: '#f8f9fb' },
            '& .MuiDataGrid-cell': { fontSize: 13, display: 'flex', alignItems: 'center', overflow: 'visible' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#f8f9fb' },
          }}
        />
      </Box>

      {/* Rate card detail drawer */}
      <RateCardDetailDrawer
        rateCard={drawerRateCard}
        open={!!drawerRateCard}
        onClose={() => setDrawerRateCard(null)}
      />

      {/* Surcharge edit dialog */}
      <SurchargeEditDialog
        open={!!editDialogRateCard}
        rateCard={editDialogRateCard}
        onClose={() => setEditDialogRateCard(null)}
        onSave={onEditSurcharges}
      />
    </Box>
  );
}

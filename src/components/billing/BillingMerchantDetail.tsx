import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DataGrid, type GridColDef, type GridRowSelectionModel, type GridRowId } from '@mui/x-data-grid';
import CarrierChip from '../rate-cards/CarrierChip';
import { getMerchantShipments, getMerchantCharges, type BillingShipment, type BillingCharge } from '../../data/mockBillingEngine';
import { CARRIERS, CARRIER_IDS } from '../../constants/rateCardConfig';
import type { CarrierId } from '../../types/rateCard';

interface BillingMerchantDetailProps {
  merchantId: string;
  merchantName: string;
  onBack: () => void;
}

const fmtEur = (v: number) => `€${v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const deDE = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type TimePeriod = '30d' | '90d' | 'custom';

const chargeTypeColors: Record<BillingCharge['chargeType'], string> = { base: '#e3f2fd', surcharge: '#fff3e0', discount: '#e8f5e9' };
const chargeTypeTextColors: Record<BillingCharge['chargeType'], string> = { base: '#1565c0', surcharge: '#e65100', discount: '#2e7d32' };

const issueLabels: Record<BillingShipment['issue'], string> = {
  none: '',
  price_dispute: 'Price Dispute',
  lost: 'Lost Shipment',
  damaged: 'Damaged',
  delayed: 'Delayed',
};
const issueColors: Record<BillingShipment['issue'], string> = {
  none: '',
  price_dispute: '#f59e0b',
  lost: '#dc2626',
  damaged: '#ea580c',
  delayed: '#6366f1',
};

export default function BillingMerchantDetail({ merchantId, merchantName, onBack }: BillingMerchantDetailProps) {
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState<TimePeriod>('90d');
  const [customFrom, setCustomFrom] = useState('2026-03-01');
  const [customTo, setCustomTo] = useState('2026-03-31');
  const [search, setSearch] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<CarrierId | ''>('');
  const [billedFilter, setBilledFilter] = useState<'all' | 'billed' | 'unbilled'>('all');
  const [issueFilter, setIssueFilter] = useState<'all' | 'has_issue'>('all');
  const [matchedFilter, setMatchedFilter] = useState<'all' | 'matched' | 'unmatched'>('all');
  const [chargeTypeFilter, setChargeTypeFilter] = useState<BillingCharge['chargeType'] | ''>('');
  const [selection, setSelection] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set<GridRowId>() });

  const allShipments = useMemo(() => getMerchantShipments(merchantId), [merchantId]);
  const allCharges = useMemo(() => getMerchantCharges(merchantId), [merchantId]);

  // Date range
  const dateRange = useMemo(() => {
    const to = new Date();
    if (period === '30d') {
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
    }
    if (period === '90d') {
      const from = new Date();
      from.setDate(from.getDate() - 90);
      return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
    }
    return { from: customFrom, to: customTo };
  }, [period, customFrom, customTo]);

  const shipments = useMemo(
    () => allShipments.filter(s => s.shipmentDate >= dateRange.from && s.shipmentDate <= dateRange.to),
    [allShipments, dateRange],
  );
  const charges = useMemo(
    () => allCharges.filter(c => {
      const shp = allShipments.find(s => s.shipmentNumber === c.shipmentNumber);
      return shp && shp.shipmentDate >= dateRange.from && shp.shipmentDate <= dateRange.to;
    }),
    [allCharges, allShipments, dateRange],
  );

  // Summary
  const summary = useMemo(() => {
    const totalBuying = shipments.reduce((s, sh) => s + sh.buyingCost, 0);
    const totalSelling = shipments.reduce((s, sh) => s + sh.sellingCost, 0);
    const billed = shipments.filter(s => s.billedDate).length;
    const unbilled = shipments.length - billed;
    const withIssues = shipments.filter(s => s.issue !== 'none').length;
    const totalRefund = shipments.reduce((s, sh) => s + sh.expectedRefund, 0);
    const unassignedCharges = charges.filter(c => !c.matched).length;
    return { totalBuying, totalSelling, billed, unbilled, withIssues, totalRefund, unassignedCharges };
  }, [shipments, charges]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    let result = shipments;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.shipmentNumber.toLowerCase().includes(q) || s.invoiceNumber.toLowerCase().includes(q));
    }
    if (carrierFilter) result = result.filter(s => s.carrierId === carrierFilter);
    if (billedFilter === 'billed') result = result.filter(s => s.billedDate !== null);
    if (billedFilter === 'unbilled') result = result.filter(s => s.billedDate === null);
    if (issueFilter === 'has_issue') result = result.filter(s => s.issue !== 'none');
    return result;
  }, [shipments, search, carrierFilter, billedFilter, issueFilter]);

  // Filtered charges
  const filteredCharges = useMemo(() => {
    let result = charges;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.shipmentNumber.toLowerCase().includes(q) || c.chargeName.toLowerCase().includes(q));
    }
    if (carrierFilter) result = result.filter(c => c.carrierId === carrierFilter);
    if (matchedFilter === 'matched') result = result.filter(c => c.matched);
    if (matchedFilter === 'unmatched') result = result.filter(c => !c.matched);
    if (chargeTypeFilter) result = result.filter(c => c.chargeType === chargeTypeFilter);
    return result;
  }, [charges, search, carrierFilter, matchedFilter, chargeTypeFilter]);

  // Invoices
  interface InvoiceRow {
    id: string; invoiceNumber: string; invoiceDate: string; carrierId: CarrierId;
    shipmentCount: number; chargeCount: number; totalBuying: number; totalSelling: number;
    margin: number; unmatchedCharges: number; billedShipments: number; unbilledShipments: number;
    issueCount: number; totalRefund: number; allChargesAssigned: boolean;
  }
  const invoiceRows = useMemo((): InvoiceRow[] => {
    const map = new Map<string, InvoiceRow>();
    for (const shp of shipments) {
      const key = shp.invoiceNumber;
      if (!map.has(key)) map.set(key, {
        id: key, invoiceNumber: key, invoiceDate: shp.invoiceDate, carrierId: shp.carrierId,
        shipmentCount: 0, chargeCount: 0, totalBuying: 0, totalSelling: 0, margin: 0,
        unmatchedCharges: 0, billedShipments: 0, unbilledShipments: 0,
        issueCount: 0, totalRefund: 0, allChargesAssigned: true,
      });
      const row = map.get(key)!;
      row.shipmentCount += 1;
      row.totalBuying += shp.buyingCost;
      row.totalSelling += shp.sellingCost;
      if (shp.billedDate) row.billedShipments += 1; else row.unbilledShipments += 1;
      if (shp.issue !== 'none') row.issueCount += 1;
      row.totalRefund += shp.expectedRefund;
      if (!shp.allChargesAssigned) row.allChargesAssigned = false;
    }
    for (const chg of charges) {
      const row = map.get(chg.invoiceNumber);
      if (row) { row.chargeCount += 1; if (!chg.matched) row.unmatchedCharges += 1; }
    }
    for (const row of map.values()) {
      row.margin = row.totalSelling - row.totalBuying;
    }
    return [...map.values()];
  }, [shipments, charges]);

  const selectedCount = useMemo(() => {
    if (selection.type === 'all') return filteredShipments.length - selection.ids.size;
    return selection.ids.size;
  }, [selection, filteredShipments]);

  // Shipment columns
  const shipmentColumns: GridColDef<BillingShipment>[] = [
    { field: 'shipmentNumber', headerName: 'Shipment Number', flex: 1, minWidth: 130 },
    { field: 'shipmentDate', headerName: 'Shipment Date', width: 105 },
    { field: 'invoiceNumber', headerName: 'Invoice', flex: 1, minWidth: 120 },
    { field: 'carrierId', headerName: 'Carrier', width: 100, renderCell: (p) => <CarrierChip carrierId={p.value as CarrierId} /> },
    { field: 'origin', headerName: 'Origin', width: 60 },
    { field: 'destination', headerName: 'Dest', width: 55 },
    { field: 'buyingCost', headerName: 'Buy (€)', width: 85, type: 'number', valueFormatter: (v: number) => deDE.format(v) },
    { field: 'sellingCost', headerName: 'Sell (€)', width: 85, type: 'number', valueFormatter: (v: number) => deDE.format(v) },
    {
      field: 'billedDate', headerName: 'Date Billed', width: 100,
      renderCell: (p) => p.value
        ? <Typography sx={{ fontSize: 12, color: '#6b7280' }}>{p.value}</Typography>
        : <Chip label="Unbilled" size="small" sx={{ fontSize: 10, fontWeight: 600, height: 20, bgcolor: '#dbeafe', color: '#1d4ed8' }} />,
    },
    {
      field: 'chargeCount', headerName: 'Charges', width: 75, align: 'center', headerAlign: 'center',
      renderCell: (p) => {
        const shp = p.row as BillingShipment;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 12 }}>{shp.chargeCount}</Typography>
            {shp.allChargesAssigned
              ? <CheckCircleIcon sx={{ fontSize: 14, color: '#16a34a' }} />
              : <WarningAmberIcon sx={{ fontSize: 14, color: '#d97706' }} />}
          </Box>
        );
      },
    },
    {
      field: 'issue', headerName: 'Issue', width: 110,
      renderCell: (p) => {
        const issue = p.value as BillingShipment['issue'];
        if (issue === 'none') return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>;
        return <Chip label={issueLabels[issue]} size="small" sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: `${issueColors[issue]}18`, color: issueColors[issue], border: `1px solid ${issueColors[issue]}40` }} />;
      },
    },
    {
      field: 'expectedRefund', headerName: 'Exp. Refund', width: 95, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p) => {
        if (!p.value || p.value === 0) return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>;
        return <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>{fmtEur(p.value)}</Typography>;
      },
    },
  ];

  // Invoice columns
  const invoiceColumns: GridColDef<InvoiceRow>[] = [
    { field: 'invoiceNumber', headerName: 'Invoice Number', flex: 1, minWidth: 150 },
    { field: 'invoiceDate', headerName: 'Invoice Date', width: 100 },
    { field: 'carrierId', headerName: 'Carrier', width: 100, renderCell: (p) => <CarrierChip carrierId={p.value as CarrierId} /> },
    {
      field: 'shipmentCount', headerName: 'Shipments', width: 90, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p) => <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{(p.value as number).toLocaleString('de-DE')}</Typography>,
    },
    {
      field: 'totalBuying', headerName: 'Buy (€)', width: 110, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p) => <Typography sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{fmtEur(p.value as number)}</Typography>,
    },
    {
      field: 'totalSelling', headerName: 'Sell (€)', width: 110, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p) => <Typography sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{fmtEur(p.value as number)}</Typography>,
    },
    {
      field: 'margin', headerName: 'Margin', width: 100, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: (p.value as number) >= 0 ? '#16a34a' : '#dc2626' }}>
          {(p.value as number) >= 0 ? '+' : ''}{fmtEur(p.value as number)}
        </Typography>
      ),
    },
    {
      field: 'billedShipments', headerName: 'Status', width: 85, align: 'center', headerAlign: 'center',
      renderCell: (p) => {
        const row = p.row as InvoiceRow;
        if (row.billedShipments === 0) return <Chip label="Unbilled" size="small" sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: '#dbeafe', color: '#1d4ed8' }} />;
        if (row.unbilledShipments === 0) return <Chip label="Billed" size="small" sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: '#dcfce7', color: '#16a34a' }} />;
        return <Chip label="Partial" size="small" sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: '#fef3c7', color: '#92400e' }} />;
      },
    },
    {
      field: 'unmatchedCharges', headerName: 'Charge Mapping', width: 120, align: 'center', headerAlign: 'center',
      renderCell: (p) => {
        const row = p.row as InvoiceRow;
        if (row.unmatchedCharges === 0 && row.allChargesAssigned) {
          return <Chip label="Complete" size="small" sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: '#dcfce7', color: '#16a34a' }} />;
        }
        return (
          <Chip
            icon={<WarningAmberIcon sx={{ fontSize: 12 }} />}
            label={`${row.unmatchedCharges} unassigned`}
            size="small"
            sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: '#fef3c7', color: '#92400e', '& .MuiChip-icon': { color: '#d97706' } }}
          />
        );
      },
    },
    {
      field: 'issueCount', headerName: 'Issues', width: 70, align: 'center', headerAlign: 'center',
      renderCell: (p) => {
        if (!p.value || p.value === 0) return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>;
        return <Chip label={p.value} size="small" sx={{ fontSize: 10, fontWeight: 600, height: 20, bgcolor: '#fee2e2', color: '#991b1b' }} />;
      },
    },
  ];

  // Charge columns
  const chargeColumns: GridColDef<BillingCharge>[] = [
    { field: 'shipmentNumber', headerName: 'Shipment', flex: 1, minWidth: 120 },
    { field: 'invoiceNumber', headerName: 'Invoice', flex: 1, minWidth: 110 },
    { field: 'carrierId', headerName: 'Carrier', width: 100, renderCell: (p) => <CarrierChip carrierId={p.value as CarrierId} /> },
    { field: 'chargeName', headerName: 'Charge Name', flex: 1, minWidth: 130 },
    {
      field: 'chargeType', headerName: 'Type', width: 95,
      renderCell: (p) => {
        const t = p.value as BillingCharge['chargeType'];
        return <Chip label={t} size="small" sx={{ fontWeight: 600, fontSize: 10, height: 22, bgcolor: chargeTypeColors[t], color: chargeTypeTextColors[t], textTransform: 'capitalize' }} />;
      },
    },
    { field: 'buyingAmount', headerName: 'Buy (€)', width: 90, type: 'number', valueFormatter: (v: number) => deDE.format(v) },
    { field: 'sellingAmount', headerName: 'Sell (€)', width: 90, type: 'number', valueFormatter: (v: number | null) => v != null ? deDE.format(v) : '—' },
    {
      field: 'matched', headerName: 'Assigned', width: 80,
      renderCell: (p) => p.value ? <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} /> : <WarningIcon sx={{ color: '#f44336', fontSize: 18 }} />,
    },
  ];

  const dgSx = {
    border: 'none',
    '& .MuiDataGrid-columnHeaders': { fontSize: 12, fontWeight: 600, color: '#64748b', bgcolor: '#f8f9fb' },
    '& .MuiDataGrid-cell': { fontSize: 13, display: 'flex', alignItems: 'center' },
    '& .MuiDataGrid-row:hover': { bgcolor: '#f8f9fb' },
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Button onClick={onBack} startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          sx={{ color: '#64748b', textTransform: 'none', fontWeight: 500, fontSize: 13, px: 1.5, py: 0.5, minWidth: 'auto', '&:hover': { bgcolor: '#f1f5f9' } }}>
          Back to overview
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: '#1e293b' }}>{merchantName}</Typography>
      </Box>

      {/* Timeline picker */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
        <ToggleButtonGroup value={period} exclusive onChange={(_, v) => { if (v) setPeriod(v); }} size="small"
          sx={{ '& .MuiToggleButton-root': { fontSize: 12, fontWeight: 600, px: 1.5, py: 0.25, textTransform: 'none', border: '1px solid #e8ebf0', color: '#6b7280', '&.Mui-selected': { bgcolor: '#3b82f6', color: '#fff', borderColor: '#3b82f6' } } }}>
          <ToggleButton value="30d">Last 30 Days</ToggleButton>
          <ToggleButton value="90d">Last 90 Days</ToggleButton>
          <ToggleButton value="custom">Custom</ToggleButton>
        </ToggleButtonGroup>
        {period === 'custom' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField type="date" size="small" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} sx={{ width: 150 }} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField type="date" size="small" value={customTo} onChange={(e) => setCustomTo(e.target.value)} sx={{ width: 150 }} slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
        )}
        <Typography sx={{ ml: 'auto', fontSize: 12, color: '#6b7280' }}>
          {dateRange.from} — {dateRange.to}
        </Typography>
      </Box>

      {/* KPIs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ px: 2, py: 1.5, border: '1px solid #e8ebf0', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <LocalShippingIcon sx={{ fontSize: 16, color: '#6366f1' }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Shipments</Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{shipments.length}</Typography>
          <Typography sx={{ fontSize: 10, color: '#6b7280' }}>{summary.unbilled} unbilled · {summary.billed} billed</Typography>
        </Paper>
        <Paper elevation={0} sx={{ px: 2, py: 1.5, border: '1px solid #e8ebf0', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <ReceiptLongIcon sx={{ fontSize: 16, color: '#2563eb' }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Total Buy</Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{fmtEur(summary.totalBuying)}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ px: 2, py: 1.5, border: '1px solid #e8ebf0', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <ReceiptIcon sx={{ fontSize: 16, color: '#16a34a' }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Total Sell</Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{fmtEur(summary.totalSelling)}</Typography>
          <Typography sx={{ fontSize: 10, color: '#16a34a', fontWeight: 500 }}>Margin: +{fmtEur(summary.totalSelling - summary.totalBuying)}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ px: 2, py: 1.5, border: summary.withIssues > 0 ? '1px solid #fca5a5' : '1px solid #e8ebf0', borderRadius: 2, bgcolor: summary.withIssues > 0 ? '#fef2f2' : undefined }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <ErrorOutlineIcon sx={{ fontSize: 16, color: '#dc2626' }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#991b1b', textTransform: 'uppercase', letterSpacing: 0.3 }}>Issues</Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#991b1b' }}>{summary.withIssues}</Typography>
          <Typography sx={{ fontSize: 10, color: '#b91c1c', fontWeight: 500 }}>Exp. refund: {fmtEur(summary.totalRefund)}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ px: 2, py: 1.5, border: summary.unassignedCharges > 0 ? '1px solid #fde68a' : '1px solid #e8ebf0', borderRadius: 2, bgcolor: summary.unassignedCharges > 0 ? '#fffbeb' : undefined }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <WarningAmberIcon sx={{ fontSize: 16, color: '#d97706' }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: 0.3 }}>Unassigned</Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#92400e' }}>{summary.unassignedCharges} charges</Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setSearch(''); setBilledFilter('all'); setIssueFilter('all'); setMatchedFilter('all'); setChargeTypeFilter(''); }}
          sx={{ px: 2, borderBottom: '1px solid #e8ebf0', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: 13, minHeight: 48 } }}>
          <Tab label={`Shipments (${filteredShipments.length})`} />
          <Tab label={`Invoices (${invoiceRows.length})`} />
          <Tab label={`Charges (${filteredCharges.length})`} />
        </Tabs>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 1.5, px: 2, py: 1.5, borderBottom: '1px solid #f0f2f5', bgcolor: '#fafbfc', flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField placeholder={tab === 2 ? 'Search charges...' : 'Search shipments, invoices...'} size="small" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: 220 }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#9ca3af' }} /></InputAdornment>, sx: { fontSize: 13 } } }} />
          <TextField select size="small" value={carrierFilter} onChange={(e) => setCarrierFilter(e.target.value as CarrierId | '')} sx={{ width: 130, '& .MuiSelect-select': { fontSize: 13 } }} slotProps={{ select: { displayEmpty: true } }}>
            <MenuItem value="" sx={{ fontSize: 13 }}>All Carriers</MenuItem>
            {CARRIER_IDS.map(id => <MenuItem key={id} value={id} sx={{ fontSize: 13 }}>{CARRIERS[id].label}</MenuItem>)}
          </TextField>
          {tab === 0 && (
            <>
              <TextField select size="small" value={billedFilter} onChange={(e) => setBilledFilter(e.target.value as 'all' | 'billed' | 'unbilled')} sx={{ width: 120, '& .MuiSelect-select': { fontSize: 13 } }}>
                <MenuItem value="all" sx={{ fontSize: 13 }}>All Status</MenuItem>
                <MenuItem value="unbilled" sx={{ fontSize: 13 }}>Unbilled</MenuItem>
                <MenuItem value="billed" sx={{ fontSize: 13 }}>Billed</MenuItem>
              </TextField>
              <TextField select size="small" value={issueFilter} onChange={(e) => setIssueFilter(e.target.value as 'all' | 'has_issue')} sx={{ width: 120, '& .MuiSelect-select': { fontSize: 13 } }}>
                <MenuItem value="all" sx={{ fontSize: 13 }}>All Issues</MenuItem>
                <MenuItem value="has_issue" sx={{ fontSize: 13 }}>Has Issues</MenuItem>
              </TextField>
            </>
          )}
          {tab === 2 && (
            <>
              <TextField select size="small" value={matchedFilter} onChange={(e) => setMatchedFilter(e.target.value as 'all' | 'matched' | 'unmatched')} sx={{ width: 130, '& .MuiSelect-select': { fontSize: 13 } }}>
                <MenuItem value="all" sx={{ fontSize: 13 }}>All Charges</MenuItem>
                <MenuItem value="matched" sx={{ fontSize: 13 }}>Assigned</MenuItem>
                <MenuItem value="unmatched" sx={{ fontSize: 13 }}>Unassigned</MenuItem>
              </TextField>
              <TextField select size="small" value={chargeTypeFilter} onChange={(e) => setChargeTypeFilter(e.target.value as BillingCharge['chargeType'] | '')} sx={{ width: 120, '& .MuiSelect-select': { fontSize: 13 } }} slotProps={{ select: { displayEmpty: true } }}>
                <MenuItem value="" sx={{ fontSize: 13 }}>All Types</MenuItem>
                <MenuItem value="base" sx={{ fontSize: 13 }}>Base</MenuItem>
                <MenuItem value="surcharge" sx={{ fontSize: 13 }}>Surcharge</MenuItem>
                <MenuItem value="discount" sx={{ fontSize: 13 }}>Discount</MenuItem>
              </TextField>
            </>
          )}
          {tab === 0 && selectedCount > 0 && (
            <Typography sx={{ ml: 'auto', fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>
              {selectedCount} selected
            </Typography>
          )}
        </Box>

        <Box sx={{ height: 560 }}>
          {tab === 0 && (
            <DataGrid rows={filteredShipments} columns={shipmentColumns} density="compact" checkboxSelection
              rowSelectionModel={selection} onRowSelectionModelChange={setSelection}
              initialState={{ pagination: { paginationModel: { pageSize: 25 } }, sorting: { sortModel: [{ field: 'shipmentDate', sort: 'desc' }] } }}
              pageSizeOptions={[25, 50, 100]} disableRowSelectionOnClick sx={dgSx} />
          )}
          {tab === 1 && (
            <DataGrid rows={invoiceRows} columns={invoiceColumns} density="compact"
              initialState={{ pagination: { paginationModel: { pageSize: 25 } }, sorting: { sortModel: [{ field: 'invoiceDate', sort: 'desc' }] } }}
              pageSizeOptions={[25, 50, 100]} disableRowSelectionOnClick sx={dgSx} />
          )}
          {tab === 2 && (
            <DataGrid rows={filteredCharges} columns={chargeColumns} density="compact"
              initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
              pageSizeOptions={[25, 50, 100]} disableRowSelectionOnClick sx={dgSx} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

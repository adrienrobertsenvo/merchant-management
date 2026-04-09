import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { DataGrid, type GridColDef, type GridRowSelectionModel, type GridRowId } from '@mui/x-data-grid';
import { mockMerchantBillingSummaries, type MerchantBillingSummary } from '../../data/mockBillingEngine';

export type AggregationMethod = 'shipment' | 'invoice';

interface BillingMerchantTableProps {
  onMerchantClick: (merchantId: string, merchantName: string) => void;
}

export default function BillingMerchantTable({ onMerchantClick }: BillingMerchantTableProps) {
  const [aggregation, setAggregation] = useState<AggregationMethod>('shipment');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set<GridRowId>() });
  const [dateFrom, setDateFrom] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 10); });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [showAlreadyBilled, setShowAlreadyBilled] = useState(false);
  const [showNeverBilled, setShowNeverBilled] = useState(false);

  const filteredData = useMemo(() => {
    let result = mockMerchantBillingSummaries;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.merchantName.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        (m.groupName?.toLowerCase().includes(q) ?? false)
      );
    }
    if (showUnassigned) {
      const stats = (m: MerchantBillingSummary) => aggregation === 'shipment' ? m.shipmentDateStats : m.invoiceDateStats;
      result = result.filter(m => stats(m).unmatchedItems > 0);
    }
    if (showAlreadyBilled) {
      const stats = (m: MerchantBillingSummary) => aggregation === 'shipment' ? m.shipmentDateStats : m.invoiceDateStats;
      result = result.filter(m => stats(m).alreadyBilledCharges > 0);
    }
    if (showNeverBilled) {
      result = result.filter(m => !m.lastBilledDate);
    }
    return result;
  }, [search, showUnassigned, showAlreadyBilled, showNeverBilled, aggregation]);

  const rows = useMemo(() =>
    filteredData.map(m => {
      const stats = aggregation === 'shipment' ? m.shipmentDateStats : m.invoiceDateStats;
      return {
        id: m.merchantId,
        merchantName: m.merchantName,
        country: m.country,
        groupName: m.groupName,
        count: aggregation === 'shipment' ? m.shipmentDateStats.shipmentCount : m.invoiceDateStats.invoiceCount,
        totalBuying: stats.totalBuyingCost,
        totalSelling: stats.totalSellingCost,
        margin: stats.totalSellingCost - stats.totalBuyingCost,
        unmatchedItems: stats.unmatchedItems,
        alreadyBilled: stats.alreadyBilledCharges,
        lastBilledDate: m.lastBilledDate,
      };
    }),
  [filteredData, aggregation]);

  const totalBuying = rows.reduce((sum, r) => sum + r.totalBuying, 0);
  const totalSelling = rows.reduce((sum, r) => sum + r.totalSelling, 0);
  const totalUnmatched = rows.reduce((sum, r) => sum + r.unmatchedItems, 0);

  const fmtEur = (v: number) => `€${v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns: GridColDef[] = [
    {
      field: 'merchantName',
      headerName: 'Merchant',
      flex: 1.5,
      minWidth: 160,
      renderCell: (params) => (
        <Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1d4ed8',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={(e) => { e.stopPropagation(); onMerchantClick(params.row.id, params.value); }}
          >
            {params.value}
          </Typography>
          <Typography sx={{ fontSize: 10, color: '#9ca3af' }}>
            {params.row.country}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'count',
      headerName: aggregation === 'shipment' ? '# Shipments' : '# Invoices',
      width: 110,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {params.value.toLocaleString('de-DE')}
        </Typography>
      ),
    },
    {
      field: 'totalBuying',
      headerName: 'Total Buy',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {fmtEur(params.value)}
        </Typography>
      ),
    },
    {
      field: 'totalSelling',
      headerName: 'Total Sell',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {fmtEur(params.value)}
        </Typography>
      ),
    },
    {
      field: 'margin',
      headerName: 'Margin',
      width: 110,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography sx={{
          fontSize: 13,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          color: params.value >= 0 ? '#16a34a' : '#dc2626',
        }}>
          {params.value >= 0 ? '+' : ''}{fmtEur(params.value)}
        </Typography>
      ),
    },
    {
      field: 'unmatchedItems',
      headerName: 'Unassigned Charges',
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        if (params.value === 0) {
          return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>;
        }
        return (
          <Chip
            icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
            label={params.value}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 600,
              height: 24,
              bgcolor: '#fef3c7',
              color: '#92400e',
              '& .MuiChip-icon': { color: '#d97706' },
            }}
          />
        );
      },
    },
    {
      field: 'alreadyBilled',
      headerName: 'Already Billed',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        if (!params.value || params.value === 0) {
          return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>;
        }
        return (
          <Tooltip title="Charges already included in a previous billing period">
            <Chip
              icon={<ErrorOutlineIcon sx={{ fontSize: 14 }} />}
              label={params.value}
              size="small"
              sx={{
                fontSize: 11,
                fontWeight: 600,
                height: 24,
                bgcolor: '#fff7ed',
                color: '#9a3412',
                '& .MuiChip-icon': { color: '#f59e0b' },
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      field: 'lastBilledDate',
      headerName: 'Last Billed',
      width: 110,
      renderCell: (params) => {
        if (!params.value) {
          return <Chip label="Never" size="small" sx={{ fontSize: 10, fontWeight: 500, height: 20, bgcolor: '#fee2e2', color: '#991b1b' }} />;
        }
        return (
          <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
            {new Date(params.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </Typography>
        );
      },
    },
  ];

  return (
    <Box>
      {/* Controls row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <ToggleButtonGroup
          value={aggregation}
          exclusive
          onChange={(_, v) => { if (v) setAggregation(v); }}
          size="small"
        >
          <ToggleButton value="shipment" sx={{ textTransform: 'none', fontSize: 13, px: 1.5 }}>
            <LocalShippingIcon sx={{ fontSize: 18, mr: 0.5 }} />
            By Shipment Date
          </ToggleButton>
          <ToggleButton value="invoice" sx={{ textTransform: 'none', fontSize: 13, px: 1.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.5 }} />
            By Invoice Date
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          placeholder="Search merchants..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 240 }}
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

        <TextField type="date" size="small" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          label="From" sx={{ width: 150 }} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField type="date" size="small" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          label="To" sx={{ width: 150 }} slotProps={{ inputLabel: { shrink: true } }} />

        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 13 }}
          >
            Export Invoice{selectedRows.ids.size > 0 ? ` (${selectedRows.ids.size})` : ''}
          </Button>
        </Box>
      </Box>

      {/* Quick filters */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
        <Typography sx={{ fontSize: 12, color: '#6b7280', mr: 0.5 }}>Filter:</Typography>
        <Chip
          label="Has Unassigned Charges"
          size="small"
          onClick={() => setShowUnassigned(prev => !prev)}
          sx={{
            fontSize: 11, fontWeight: 600, height: 26, cursor: 'pointer',
            bgcolor: showUnassigned ? '#fef3c7' : '#f3f4f6',
            color: showUnassigned ? '#92400e' : '#6b7280',
            border: showUnassigned ? '1px solid #fcd34d' : '1px solid transparent',
            '&:hover': { bgcolor: showUnassigned ? '#fde68a' : '#e5e7eb' },
          }}
          onDelete={showUnassigned ? () => setShowUnassigned(false) : undefined}
        />
        <Chip
          label="Has Already Billed"
          size="small"
          onClick={() => setShowAlreadyBilled(prev => !prev)}
          sx={{
            fontSize: 11, fontWeight: 600, height: 26, cursor: 'pointer',
            bgcolor: showAlreadyBilled ? '#fff7ed' : '#f3f4f6',
            color: showAlreadyBilled ? '#9a3412' : '#6b7280',
            border: showAlreadyBilled ? '1px solid #fdba74' : '1px solid transparent',
            '&:hover': { bgcolor: showAlreadyBilled ? '#fed7aa' : '#e5e7eb' },
          }}
          onDelete={showAlreadyBilled ? () => setShowAlreadyBilled(false) : undefined}
        />
        <Chip
          label="Never Billed"
          size="small"
          onClick={() => setShowNeverBilled(prev => !prev)}
          sx={{
            fontSize: 11, fontWeight: 600, height: 26, cursor: 'pointer',
            bgcolor: showNeverBilled ? '#fee2e2' : '#f3f4f6',
            color: showNeverBilled ? '#991b1b' : '#6b7280',
            border: showNeverBilled ? '1px solid #fca5a5' : '1px solid transparent',
            '&:hover': { bgcolor: showNeverBilled ? '#fecaca' : '#e5e7eb' },
          }}
          onDelete={showNeverBilled ? () => setShowNeverBilled(false) : undefined}
        />
        {(showUnassigned || showAlreadyBilled || showNeverBilled) && (
          <Typography
            onClick={() => { setShowUnassigned(false); setShowAlreadyBilled(false); setShowNeverBilled(false); }}
            sx={{ fontSize: 11, color: '#6b7280', cursor: 'pointer', ml: 0.5, '&:hover': { color: '#dc2626', textDecoration: 'underline' } }}
          >
            Clear
          </Typography>
        )}
      </Box>

      {/* Summary bar */}
      <Box sx={{ display: 'flex', gap: 3, mb: 1.5, px: 1 }}>
        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
          <Box component="span" sx={{ fontWeight: 600 }}>{rows.length}</Box> merchants
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
          Total Buy: <Box component="span" sx={{ fontWeight: 600, color: '#111827' }}>{fmtEur(totalBuying)}</Box>
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
          Total Sell: <Box component="span" sx={{ fontWeight: 600, color: '#111827' }}>{fmtEur(totalSelling)}</Box>
        </Typography>
        {totalUnmatched > 0 && (
          <Typography sx={{ fontSize: 12, color: '#d97706', fontWeight: 500 }}>
            {totalUnmatched} unassigned charges
          </Typography>
        )}
      </Box>

      {/* Data grid */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={setSelectedRows}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'totalBuying', sort: 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          rowHeight={56}
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { backgroundColor: '#f8faff' } },
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#fafbfc' },
            '& .MuiDataGrid-columnHeaderTitle': { fontSize: 12, fontWeight: 600 },
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
          }}
          onRowClick={(params) => onMerchantClick(params.row.id, params.row.merchantName)}
        />
      </Box>
    </Box>
  );
}

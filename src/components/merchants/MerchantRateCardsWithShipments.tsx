import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import MerchantRateCardsTab from './MerchantRateCardsTab';
import CarrierChip from '../rate-cards/CarrierChip';
import { CARRIERS, CARRIER_IDS } from '../../constants/rateCardConfig';
import { getMerchantShipments, type BillingShipment } from '../../data/mockBillingEngine';
import type { CarrierId } from '../../types/rateCard';

interface MerchantRateCardsWithShipmentsProps {
  merchantId: string;
  hideRateCardsTable?: boolean;
}

const eurFormatter = (value: number) =>
  `€${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Status derived from billedDate

export default function MerchantRateCardsWithShipments({ merchantId, hideRateCardsTable }: MerchantRateCardsWithShipmentsProps) {
  const shipments = useMemo(() => getMerchantShipments(merchantId), [merchantId]);

  // Filters
  const [search, setSearch] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');

  // Unique values for dropdowns
  const origins = useMemo(() => [...new Set(shipments.map((s) => s.origin))].sort(), [shipments]);
  const destinations = useMemo(() => [...new Set(shipments.map((s) => s.destination))].sort(), [shipments]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.shipmentNumber.toLowerCase().includes(q) && !s.invoiceNumber.toLowerCase().includes(q)) return false;
      }
      if (carrierFilter !== 'all' && s.carrierId !== carrierFilter) return false;
      if (statusFilter === 'billed' && !s.billedDate) return false;
      if (statusFilter === 'unbilled' && s.billedDate) return false;
      if (originFilter !== 'all' && s.origin !== originFilter) return false;
      if (destinationFilter !== 'all' && s.destination !== destinationFilter) return false;
      return true;
    });
  }, [shipments, search, carrierFilter, statusFilter, originFilter, destinationFilter]);

  // KPI calculations (based on filtered data)
  const totalBuying = useMemo(() => filteredShipments.reduce((sum, s) => sum + s.buyingCost, 0), [filteredShipments]);
  const totalSelling = useMemo(() => filteredShipments.reduce((sum, s) => sum + s.sellingCost, 0), [filteredShipments]);
  const avgMarginPct = useMemo(
    () => (totalBuying > 0 ? ((totalSelling - totalBuying) / totalBuying) * 100 : 0),
    [totalBuying, totalSelling],
  );

  const kpis: Array<{ label: string; value: string; sub?: string; icon: React.ReactNode; color: string; bgColor: string }> = [
    {
      label: 'Total Shipments',
      value: filteredShipments.length.toLocaleString('de-DE'),
      icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
      color: '#0891b2',
      bgColor: '#ecfeff',
    },
    {
      label: 'Total Buying Cost',
      value: eurFormatter(totalBuying),
      icon: <ReceiptLongIcon sx={{ fontSize: 20 }} />,
      color: '#6366f1',
      bgColor: '#eef2ff',
    },
    {
      label: 'Total Selling Cost',
      value: eurFormatter(totalSelling),
      icon: <ReceiptIcon sx={{ fontSize: 20 }} />,
      color: '#16a34a',
      bgColor: '#f0fdf4',
    },
    {
      label: 'Avg Margin',
      value: `${avgMarginPct.toFixed(1)}%`,
      sub: `${eurFormatter(totalSelling - totalBuying)} net`,
      icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
      color: avgMarginPct >= 0 ? '#16a34a' : '#dc2626',
      bgColor: avgMarginPct >= 0 ? '#f0fdf4' : '#fef2f2',
    },
  ];

  const columns: GridColDef[] = [
    { field: 'shipmentNumber', headerName: 'Shipment Number', flex: 1, minWidth: 140 },
    { field: 'shipmentDate', headerName: 'Shipment Date', width: 110 },
    { field: 'invoiceDate', headerName: 'Invoice Date', width: 110 },
    { field: 'invoiceNumber', headerName: 'Invoice Number', flex: 1, minWidth: 140 },
    {
      field: 'carrierId',
      headerName: 'Carrier',
      width: 130,
      renderCell: (params) => <CarrierChip carrierId={params.value as CarrierId} />,
    },
    { field: 'origin', headerName: 'Origin', width: 80 },
    { field: 'destination', headerName: 'Destination', width: 100 },
    {
      field: 'weight',
      headerName: 'Weight (kg)',
      width: 100,
      type: 'number',
      valueFormatter: (value: number) => `${value.toFixed(1)} kg`,
    },
    {
      field: 'buyingCost',
      headerName: 'Buy Cost (€)',
      width: 110,
      type: 'number',
      valueFormatter: (value: number) => eurFormatter(value),
    },
    {
      field: 'sellingCost',
      headerName: 'Sell Cost (€)',
      width: 110,
      type: 'number',
      valueFormatter: (value: number) => eurFormatter(value),
    },
    {
      field: 'margin',
      headerName: 'Margin (€)',
      width: 110,
      type: 'number',
      valueGetter: (_value: unknown, row: BillingShipment) => row.sellingCost - row.buyingCost,
      renderCell: (params) => {
        const val = params.value as number;
        return (
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: val >= 0 ? '#16a34a' : '#dc2626',
              lineHeight: '52px',
            }}
          >
            {val >= 0 ? '+' : ''}{eurFormatter(val)}
          </Typography>
        );
      },
    },
    {
      field: 'billedDate',
      headerName: 'Date Billed',
      width: 100,
      renderCell: (params) => {
        if (params.value) return <Typography sx={{ fontSize: 12, color: '#6b7280' }}>{params.value}</Typography>;
        return (
          <Chip
            label="Unbilled"
            size="small"
            sx={{
              bgcolor: '#dbeafe',
              color: '#1d4ed8',
              fontWeight: 600,
              fontSize: 10,
              height: 20,
              border: 'none',
            }}
          />
        );
      },
    },
  ];

  return (
    <Box>
      {/* Existing rate card assignments */}
      {!hideRateCardsTable && (
        <>
          <MerchantRateCardsTab merchantId={merchantId} />
          <Divider sx={{ my: 4 }} />
        </>
      )}

      {/* Section header */}
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827', mb: 2 }}>
        Shipment Analytics
      </Typography>

      {/* KPI cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        {kpis.map((kpi) => (
          <Paper
            key={kpi.label}
            elevation={0}
            sx={{ px: 2.5, py: 2, border: '1px solid #e8ebf0', borderRadius: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: kpi.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: kpi.color,
                }}
              >
                {kpi.icon}
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                {kpi.label}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
              {kpi.value}
            </Typography>
            {kpi.sub && (
              <Typography sx={{ fontSize: 11, color: kpi.color, fontWeight: 500, mt: 0.25 }}>
                {kpi.sub}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>

      {/* Filters row */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search shipment or invoice number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
        />
        <TextField
          select
          label="Carrier"
          value={carrierFilter}
          onChange={(e) => setCarrierFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All Carriers</MenuItem>
          {CARRIER_IDS.map((id) => (
            <MenuItem key={id} value={id}>{CARRIERS[id].label}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="billed">Billed</MenuItem>
          <MenuItem value="unbilled">Unbilled</MenuItem>
        </TextField>
        <TextField
          select
          label="Origin"
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 110 }}
        >
          <MenuItem value="all">All</MenuItem>
          {origins.map((o) => (
            <MenuItem key={o} value={o}>{o}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Destination"
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="all">All</MenuItem>
          {destinations.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* DataGrid */}
      <Paper elevation={0} sx={{ border: '1px solid #e8ebf0', borderRadius: 2 }}>
        <DataGrid
          rows={filteredShipments}
          columns={columns}
          density="compact"
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'shipmentDate', sort: 'desc' }] },
          }}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#f9fafb',
              fontSize: 11,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: 0.3,
            },
            '& .MuiDataGrid-cell': {
              fontSize: 12,
              color: '#374151',
            },
            '& .MuiDataGrid-footerContainer': {
              fontSize: 12,
            },
          }}
        />
      </Paper>
    </Box>
  );
}

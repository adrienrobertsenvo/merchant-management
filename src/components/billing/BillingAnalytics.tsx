import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getPeriodAnalytics } from '../../data/mockBillingEngine';

export default function BillingAnalytics() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-03-26');

  const analytics = useMemo(() => getPeriodAnalytics(dateFrom, dateTo), [dateFrom, dateTo]);

  const margin = analytics.totalSellingCost - analytics.totalBuyingCost;
  const marginPct = analytics.totalBuyingCost > 0
    ? ((margin / analytics.totalBuyingCost) * 100).toFixed(1)
    : '0.0';

  const kpis: Array<{ label: string; value: string; sub?: string; icon: React.ReactNode; color: string; bgColor: string }> = [
    {
      label: 'Buying Cost',
      value: `€${analytics.totalBuyingCost.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <ReceiptLongIcon sx={{ fontSize: 20 }} />,
      color: '#6366f1',
      bgColor: '#eef2ff',
    },
    {
      label: 'Selling Cost',
      value: `€${analytics.totalSellingCost.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `Margin: +€${margin.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${marginPct}%)`,
      icon: <ReceiptIcon sx={{ fontSize: 20 }} />,
      color: '#16a34a',
      bgColor: '#f0fdf4',
    },
    {
      label: 'Invoices',
      value: analytics.invoiceCount.toLocaleString('de-DE'),
      icon: <DescriptionIcon sx={{ fontSize: 20 }} />,
      color: '#2563eb',
      bgColor: '#eff6ff',
    },
    {
      label: 'Credit Notes',
      value: analytics.creditNoteCount.toLocaleString('de-DE'),
      icon: <DescriptionIcon sx={{ fontSize: 20 }} />,
      color: '#dc2626',
      bgColor: '#fef2f2',
    },
    {
      label: 'Other Docs',
      value: analytics.otherDocCount.toLocaleString('de-DE'),
      icon: <DescriptionIcon sx={{ fontSize: 20 }} />,
      color: '#6b7280',
      bgColor: '#f9fafb',
    },
    {
      label: 'Shipments (Invoice Date)',
      value: analytics.shipmentsByInvoiceDate.toLocaleString('de-DE'),
      icon: <CalendarTodayIcon sx={{ fontSize: 20 }} />,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
    },
    {
      label: 'Shipments (Shipment Date)',
      value: analytics.shipmentsByShipmentDate.toLocaleString('de-DE'),
      icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
      color: '#0891b2',
      bgColor: '#ecfeff',
    },
  ];

  return (
    <Box>
      {/* Period picker */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
          Period Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <TextField
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 160 }}
          />
          <TextField
            label="To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 160 }}
          />
        </Box>
      </Box>

      {/* KPI cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
        {kpis.map((kpi) => (
          <Paper
            key={kpi.label}
            elevation={0}
            sx={{ px: 2.5, py: 2, border: '1px solid #e8ebf0', borderRadius: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: kpi.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
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
              <Typography sx={{ fontSize: 11, color: '#16a34a', fontWeight: 500, mt: 0.25 }}>
                {kpi.sub}
              </Typography>
            )}
          </Paper>
        ))}

        {/* Missing charges card */}
        <Paper
          elevation={0}
          sx={{ px: 2.5, py: 2, border: '1px solid #fde68a', borderRadius: 2, bgcolor: '#fffbeb' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <WarningAmberIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: 0.3 }}>
              Missing Charges
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#92400e' }}>
            {analytics.missingCharges.elementCount} elements
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#b45309', fontWeight: 500, mt: 0.25 }}>
            €{analytics.missingCharges.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total exposure
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

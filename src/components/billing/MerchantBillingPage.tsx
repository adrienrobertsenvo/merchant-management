import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MonthlyMarginChart from './MonthlyMarginChart';
import BillingAnalytics from './BillingAnalytics';
import BillingMerchantTable from './BillingMerchantTable';
import BillingMerchantDetail from './BillingMerchantDetail';

export default function MerchantBillingPage() {
  const [selectedMerchant, setSelectedMerchant] = useState<{ id: string; name: string } | null>(null);

  if (selectedMerchant) {
    return (
      <BillingMerchantDetail
        merchantId={selectedMerchant.id}
        merchantName={selectedMerchant.name}
        onBack={() => setSelectedMerchant(null)}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111827', mb: 0.25 }}>
          Billing Engine
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: '#6b7280' }}>
          Overview of merchant billing, cost analysis, and batch billing operations
        </Typography>
      </Box>

      {/* Monthly Margin chart */}
      <Box sx={{ mb: 3 }}>
        <MonthlyMarginChart />
      </Box>

      {/* Analytics KPIs */}
      <Box sx={{ mb: 3 }}>
        <BillingAnalytics />
      </Box>

      {/* Merchant billing table */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827', mb: 1.5 }}>
          Merchants
        </Typography>
        <BillingMerchantTable
          onMerchantClick={(id, name) => setSelectedMerchant({ id, name })}
        />
      </Box>
    </Box>
  );
}

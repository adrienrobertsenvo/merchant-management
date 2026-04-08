import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FilterListIcon from '@mui/icons-material/FilterList';
import CarrierPerformanceTab from './CarrierPerformanceTab';
import AuditClaimsTab from './AuditClaimsTab';
import CostTransparencyTab from './CostTransparencyTab';
import { mockMonthlyTransitMetrics } from '../../data/mockTransitMetrics';
import { mockMonthlySurchargeBreakdown } from '../../data/mockCostBreakdown';
import { CARRIERS } from '../../constants/rateCardConfig';
import type { CarrierId } from '../../types/rateCard';
import type { ServiceType } from '../../types/analytics';

type TimePeriod = '3m' | '6m' | '12m' | 'all';
type TabValue = 'carrier-performance' | 'audit-claims' | 'cost-transparency';

export interface AnalyticsFilters {
  carrierFilter: CarrierId | '';
  destinationFilter: string;
  serviceTypeFilter: ServiceType | '';
}

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  express: 'Express',
  standard: 'Standard',
  economy: 'Economy',
};

const DESTINATION_LABELS: Record<string, string> = {
  DE: 'Germany', AT: 'Austria', FR: 'France', NL: 'Netherlands', BE: 'Belgium', SE: 'Sweden',
};

function cutoffMonth(period: TimePeriod): string | null {
  if (period === 'all') return null;
  const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function AnalyticsDashboardPage() {
  const [tab, setTab] = useState<TabValue>('carrier-performance');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('12m');

  // Filter state
  const [carrierFilter, setCarrierFilter] = useState<CarrierId | ''>('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | ''>('');
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const filterOpen = Boolean(filterAnchor);

  const cutoff = useMemo(() => cutoffMonth(timePeriod), [timePeriod]);

  const filters: AnalyticsFilters = { carrierFilter, destinationFilter, serviceTypeFilter };

  // Unique destinations for dropdown
  const destinations = useMemo(
    () => [...new Set(mockMonthlyTransitMetrics.map(m => m.destination))].sort(),
    [],
  );

  // Active filter count & chips
  const activeFilterCount = [carrierFilter, destinationFilter, serviceTypeFilter].filter(Boolean).length;

  const activeFilterChips: { label: string; onDelete: () => void }[] = [];
  if (carrierFilter) {
    activeFilterChips.push({ label: CARRIERS[carrierFilter].label, onDelete: () => setCarrierFilter('') });
  }
  if (destinationFilter) {
    activeFilterChips.push({ label: DESTINATION_LABELS[destinationFilter] ?? destinationFilter, onDelete: () => setDestinationFilter('') });
  }
  if (serviceTypeFilter) {
    activeFilterChips.push({ label: SERVICE_TYPE_LABELS[serviceTypeFilter], onDelete: () => setServiceTypeFilter('') });
  }

  const clearAllFilters = () => {
    setCarrierFilter('');
    setDestinationFilter('');
    setServiceTypeFilter('');
  };

  // Helper to apply all filters to any dataset with the standard fields
  const applyFilters = <T extends { month: string; carrierId: CarrierId; destination: string; serviceType: ServiceType }>(data: T[]): T[] =>
    data.filter(m =>
      (!cutoff || m.month >= cutoff) &&
      (!carrierFilter || m.carrierId === carrierFilter) &&
      (!destinationFilter || m.destination === destinationFilter) &&
      (!serviceTypeFilter || m.serviceType === serviceTypeFilter)
    );

  // Top-level summary KPIs
  const summary = useMemo(() => {
    const transitFiltered = applyFilters(mockMonthlyTransitMetrics);
    const costFiltered = applyFilters(mockMonthlySurchargeBreakdown);

    const totalShipments = transitFiltered.reduce((s, m) => s + m.totalShipments, 0);
    const totalBuyingCost = costFiltered.reduce((s, m) => s + m.totalCost, 0);
    const totalSellingRevenue = Math.round(totalBuyingCost * 1.155);
    const blendedMargin = totalSellingRevenue > 0
      ? ((1 - totalBuyingCost / totalSellingRevenue) * 100)
      : 0;

    return { totalShipments, totalSellingRevenue, blendedMargin };
  }, [cutoff, carrierFilter, destinationFilter, serviceTypeFilter]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
          Analytics Dashboard
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
          Carrier performance, claims resolution, and cost transparency across all merchants.
        </Typography>
      </Box>

      {/* Time period toggle + Filters button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: activeFilterChips.length > 0 ? 1.5 : 2.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>Period:</Typography>
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

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant={activeFilterCount > 0 ? 'contained' : 'outlined'}
            size="small"
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 13,
              minWidth: 100,
              ...(activeFilterCount > 0 ? {} : { color: '#374151', borderColor: '#d1d5db' }),
            }}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Button>
          {activeFilterCount > 0 && (
            <Button
              size="small"
              onClick={clearAllFilters}
              sx={{ textTransform: 'none', fontWeight: 500, fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Active filter chips */}
      {activeFilterChips.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.75, mb: 2.5, flexWrap: 'wrap' }}>
          {activeFilterChips.map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              onDelete={chip.onDelete}
              size="small"
              sx={{ fontSize: 12, fontWeight: 500, bgcolor: '#f3f4f6', color: '#374151' }}
            />
          ))}
        </Box>
      )}

      {/* Filters popover */}
      <Popover
        open={filterOpen}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } } }}
      >
        <Box sx={{ p: 2.5, width: 400 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Filters</Typography>
            <IconButton size="small" onClick={() => setFilterAnchor(null)} sx={{ color: '#6b7280' }}>
              <FilterListIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: 13 }}>Carrier</InputLabel>
              <Select
                value={carrierFilter}
                label="Carrier"
                onChange={(e) => setCarrierFilter(e.target.value as CarrierId | '')}
                sx={{ fontSize: 13 }}
              >
                <MenuItem value="" sx={{ fontSize: 13 }}>All Carriers</MenuItem>
                {(Object.entries(CARRIERS) as [CarrierId, { label: string }][]).map(([id, c]) => (
                  <MenuItem key={id} value={id} sx={{ fontSize: 13 }}>{c.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ fontSize: 13 }}>Destination</InputLabel>
              <Select
                value={destinationFilter}
                label="Destination"
                onChange={(e) => setDestinationFilter(e.target.value)}
                sx={{ fontSize: 13 }}
              >
                <MenuItem value="" sx={{ fontSize: 13 }}>All Destinations</MenuItem>
                {destinations.map(d => (
                  <MenuItem key={d} value={d} sx={{ fontSize: 13 }}>{DESTINATION_LABELS[d] ?? d}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth sx={{ gridColumn: '1 / -1' }}>
              <InputLabel sx={{ fontSize: 13 }}>Service Type</InputLabel>
              <Select
                value={serviceTypeFilter}
                label="Service Type"
                onChange={(e) => setServiceTypeFilter(e.target.value as ServiceType | '')}
                sx={{ fontSize: 13 }}
              >
                <MenuItem value="" sx={{ fontSize: 13 }}>All Service Types</MenuItem>
                {(Object.entries(SERVICE_TYPE_LABELS) as [ServiceType, string][]).map(([key, label]) => (
                  <MenuItem key={key} value={key} sx={{ fontSize: 13 }}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Popover>

      {/* Summary stat cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ px: 3, py: 2, border: '1px solid #e8ebf0', borderRadius: 2, flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Total Shipments
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <LocalShippingIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
              {summary.totalShipments.toLocaleString()}
            </Typography>
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ px: 3, py: 2, border: '1px solid #e8ebf0', borderRadius: 2, flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Total Revenue
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111827', mt: 0.5 }}>
            &euro;{summary.totalSellingRevenue.toLocaleString()}
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ px: 3, py: 2, border: '1px solid #e8ebf0', borderRadius: 2, flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Blended Margin
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#059669', mt: 0.5 }}>
            {summary.blendedMargin.toFixed(1)}%
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ px: 3, py: 2, border: '1px solid #e8ebf0', borderRadius: 2, flex: 1 }}>
          <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Active Carriers
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111827', mt: 0.5 }}>
            5
          </Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid #e8ebf0', mb: 2.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: 14 },
            '& .Mui-selected': { fontWeight: 600 },
          }}
        >
          <Tab label="Carrier Performance" value="carrier-performance" />
          <Tab label="Audit & Claims" value="audit-claims" />
          <Tab label="Cost Transparency" value="cost-transparency" />
        </Tabs>
      </Box>

      {/* Tab content */}
      {tab === 'carrier-performance' && <CarrierPerformanceTab cutoff={cutoff} filters={filters} />}
      {tab === 'audit-claims' && <AuditClaimsTab cutoff={cutoff} filters={filters} />}
      {tab === 'cost-transparency' && <CostTransparencyTab cutoff={cutoff} filters={filters} />}
    </Box>
  );
}

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid,
} from 'recharts';
import CarrierChip from '../rate-cards/CarrierChip';
import { mockMonthlySurchargeBreakdown } from '../../data/mockCostBreakdown';
import { mockUnmappedCharges } from '../../data/mockBillingCharges';
import { CARRIERS } from '../../constants/rateCardConfig';
import type { CarrierId } from '../../types/rateCard';
import type { AnalyticsFilters } from './AnalyticsDashboardPage';

const CARRIER_IDS: CarrierId[] = ['dhl-de', 'dhl-nl', 'dhl-at', 'gls-de', 'gls-nl', 'fedex-de', 'fedex-nl', 'fedex-gb', 'dpd-de', 'dpd-at', 'ups-de', 'ups-nl'];

const COST_COLORS = {
  baseCost: '#3b82f6',
  fuelSurcharge: '#f59e0b',
  handlingFee: '#8b5cf6',
  securityFee: '#6b7280',
  otherSurcharges: '#ec4899',
};

const COST_LABELS: Record<string, string> = {
  baseCost: 'Base Cost',
  fuelSurcharge: 'Fuel',
  handlingFee: 'Handling',
  securityFee: 'Security',
  otherSurcharges: 'Other',
};

function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-');
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

interface CostTransparencyTabProps {
  cutoff: string | null;
  filters: AnalyticsFilters;
}

export default function CostTransparencyTab({ cutoff, filters }: CostTransparencyTabProps) {
  const filtered = useMemo(
    () => mockMonthlySurchargeBreakdown.filter(m =>
      (!cutoff || m.month >= cutoff) &&
      (!filters.carrierFilter || m.carrierId === filters.carrierFilter) &&
      (!filters.destinationFilter || m.destination === filters.destinationFilter) &&
      (!filters.serviceTypeFilter || m.serviceType === filters.serviceTypeFilter)
    ),
    [cutoff, filters],
  );

  // KPIs
  const kpis = useMemo(() => {
    const totalBuying = filtered.reduce((s, m) => s + m.totalCost, 0);
    const totalSurcharges = filtered.reduce((s, m) => s + m.fuelSurcharge + m.handlingFee + m.securityFee + m.otherSurcharges, 0);
    const surchargesPct = totalBuying > 0 ? (totalSurcharges / totalBuying) * 100 : 0;
    return { totalBuying, totalSurcharges, surchargesPct, unmappedCount: mockUnmappedCharges.length };
  }, [filtered]);

  // Monthly cost composition chart
  const monthlyChartData = useMemo(() => {
    const months = [...new Set(filtered.map(m => m.month))].sort();
    return months.map(month => {
      const recs = filtered.filter(m => m.month === month);
      return {
        month: formatMonth(month),
        baseCost: recs.reduce((s, r) => s + r.baseCost, 0),
        fuelSurcharge: recs.reduce((s, r) => s + r.fuelSurcharge, 0),
        handlingFee: recs.reduce((s, r) => s + r.handlingFee, 0),
        securityFee: recs.reduce((s, r) => s + r.securityFee, 0),
        otherSurcharges: recs.reduce((s, r) => s + r.otherSurcharges, 0),
      };
    });
  }, [filtered]);

  // Carrier cost breakdown
  const carrierCostData = useMemo(() => {
    return CARRIER_IDS.map(cid => {
      const recs = filtered.filter(m => m.carrierId === cid);
      const base = recs.reduce((s, r) => s + r.baseCost, 0);
      const fuel = recs.reduce((s, r) => s + r.fuelSurcharge, 0);
      const handling = recs.reduce((s, r) => s + r.handlingFee, 0);
      const security = recs.reduce((s, r) => s + r.securityFee, 0);
      const other = recs.reduce((s, r) => s + r.otherSurcharges, 0);
      const total = recs.reduce((s, r) => s + r.totalCost, 0);
      const surcharges = fuel + handling + security + other;
      return {
        carrierId: cid,
        label: CARRIERS[cid].label,
        baseCost: base,
        fuelSurcharge: fuel,
        handlingFee: handling,
        securityFee: security,
        otherSurcharges: other,
        totalCost: total,
        surcharges,
        surchargesPct: total > 0 ? (surcharges / total) * 100 : 0,
      };
    }).sort((a, b) => b.totalCost - a.totalCost);
  }, [filtered]);

  // Surcharge distribution chart data (per carrier)
  const surchargeDistData = useMemo(
    () => carrierCostData.map(c => ({
      label: c.label,
      Fuel: c.fuelSurcharge,
      Handling: c.handlingFee,
      Security: c.securityFee,
      Other: c.otherSurcharges,
    })),
    [carrierCostData],
  );

  // Unmapped charges summary
  const unmappedSummary = useMemo(() => {
    const totalExposure = mockUnmappedCharges.reduce((s, c) => s + c.buyingPriceTotal, 0);
    const byType: Record<string, { count: number; total: number }> = {};
    for (const c of mockUnmappedCharges) {
      if (!byType[c.chargeName]) byType[c.chargeName] = { count: 0, total: 0 };
      byType[c.chargeName].count += c.occurrenceCount;
      byType[c.chargeName].total += c.buyingPriceTotal;
    }
    const types = Object.entries(byType)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
    return { totalExposure, types };
  }, []);

  const statCard = (label: string, value: string, color?: string) => (
    <Paper elevation={0} sx={{ px: 3, py: 2, border: '1px solid #e8ebf0', borderRadius: 2, flex: 1 }}>
      <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: color ?? '#111827', mt: 0.5 }}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box>
      {/* KPI row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {statCard('Total Buying Cost', `€${kpis.totalBuying.toLocaleString()}`)}
        {statCard('Total Surcharges', `€${kpis.totalSurcharges.toLocaleString()}`, '#f59e0b')}
        {statCard('Surcharge %', `${kpis.surchargesPct.toFixed(1)}%`)}
        {statCard('Unmapped Charges', kpis.unmappedCount.toString(), '#dc2626')}
      </Box>

      {/* Monthly cost composition */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
          Monthly Cost Composition
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value: unknown, name: string) => [`€${(value as number).toLocaleString()}`, COST_LABELS[name] ?? name]}
            />
            <Legend verticalAlign="bottom" height={28} formatter={(value: string) => (
              <span style={{ fontSize: 11, color: '#6b7280' }}>{COST_LABELS[value] ?? value}</span>
            )} />
            <Bar dataKey="baseCost" stackId="cost" fill={COST_COLORS.baseCost} />
            <Bar dataKey="fuelSurcharge" stackId="cost" fill={COST_COLORS.fuelSurcharge} />
            <Bar dataKey="handlingFee" stackId="cost" fill={COST_COLORS.handlingFee} />
            <Bar dataKey="securityFee" stackId="cost" fill={COST_COLORS.securityFee} />
            <Bar dataKey="otherSurcharges" stackId="cost" fill={COST_COLORS.otherSurcharges} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Carrier cost breakdown chart + table */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
            Cost Breakdown by Carrier
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={carrierCostData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(value: unknown, name: string) => [`€${(value as number).toLocaleString()}`, COST_LABELS[name] ?? name]}
              />
              <Legend verticalAlign="bottom" height={28} formatter={(value: string) => (
                <span style={{ fontSize: 11, color: '#6b7280' }}>{COST_LABELS[value] ?? value}</span>
              )} />
              <Bar dataKey="baseCost" stackId="cost" fill={COST_COLORS.baseCost} />
              <Bar dataKey="fuelSurcharge" stackId="cost" fill={COST_COLORS.fuelSurcharge} />
              <Bar dataKey="handlingFee" stackId="cost" fill={COST_COLORS.handlingFee} />
              <Bar dataKey="securityFee" stackId="cost" fill={COST_COLORS.securityFee} />
              <Bar dataKey="otherSurcharges" stackId="cost" fill={COST_COLORS.otherSurcharges} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ flexShrink: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
            Cost Summary by Carrier
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Carrier', 'Base', 'Surcharges', 'Total', 'Surch. %'].map(h => (
                    <TableCell key={h} align={h === 'Carrier' ? 'left' : 'right'} sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {carrierCostData.map(row => (
                  <TableRow key={row.carrierId}>
                    <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 0.75 }}><CarrierChip carrierId={row.carrierId} /></TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', color: '#374151', py: 0.75 }}>€{row.baseCost.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', color: '#f59e0b', fontWeight: 500, py: 0.75 }}>€{row.surcharges.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>€{row.totalCost.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>{row.surchargesPct.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
                {(() => {
                  const totBase = carrierCostData.reduce((s, r) => s + r.baseCost, 0);
                  const totSurch = carrierCostData.reduce((s, r) => s + r.surcharges, 0);
                  const totTotal = carrierCostData.reduce((s, r) => s + r.totalCost, 0);
                  const totPct = totTotal > 0 ? (totSurch / totTotal) * 100 : 0;
                  return (
                    <TableRow>
                      <TableCell sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>€{totBase.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', borderBottom: 0, py: 0.75 }}>€{totSurch.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>€{totTotal.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>{totPct.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Surcharge distribution */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
          Surcharge Distribution by Carrier
        </Typography>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={surchargeDistData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value: unknown) => [`€${(value as number).toLocaleString()}`]}
            />
            <Legend verticalAlign="bottom" height={28} formatter={(value: string) => (
              <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>
            )} />
            <Bar dataKey="Fuel" fill={COST_COLORS.fuelSurcharge} barSize={14} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Handling" fill={COST_COLORS.handlingFee} barSize={14} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Security" fill={COST_COLORS.securityFee} barSize={14} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Other" fill={COST_COLORS.otherSurcharges} barSize={14} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Unmapped charges impact */}
      <Paper elevation={0} sx={{ border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
            Unmapped Charges — Cost Exposure
          </Typography>
          <Chip
            label={`€${unmappedSummary.totalExposure.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            size="small"
            sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 600, fontSize: 12, ml: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {unmappedSummary.types.map(t => (
            <Chip
              key={t.name}
              label={`${t.name}: €${t.total.toLocaleString('de-DE', { minimumFractionDigits: 2 })} (${t.count}×)`}
              size="small"
              sx={{ bgcolor: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 500 }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

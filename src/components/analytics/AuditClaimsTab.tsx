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
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Legend, CartesianGrid, ReferenceLine, Cell,
} from 'recharts';
import CarrierChip from '../rate-cards/CarrierChip';
import { mockMonthlyClaims, mockClaimTypeSummaries } from '../../data/mockClaimsData';
import { CARRIERS } from '../../constants/rateCardConfig';
import type { CarrierId } from '../../types/rateCard';
import type { ClaimType } from '../../types/analytics';
import type { AnalyticsFilters } from './AnalyticsDashboardPage';

const CARRIER_CHART_COLORS: Record<CarrierId, string> = {
  'dhl-de': '#FFCC00', 'dhl-nl': '#FFCC00', 'dhl-at': '#FFCC00',
  'gls-de': '#1B3D8F', 'gls-nl': '#1B3D8F',
  'fedex-de': '#4D148C', 'fedex-nl': '#4D148C', 'fedex-gb': '#4D148C',
  'dpd-de': '#DC0032', 'dpd-at': '#DC0032',
  'ups-de': '#351C15', 'ups-nl': '#351C15',
};

const CARRIER_IDS: CarrierId[] = ['dhl-de', 'dhl-nl', 'dhl-at', 'gls-de', 'gls-nl', 'fedex-de', 'fedex-nl', 'fedex-gb', 'dpd-de', 'dpd-at', 'ups-de', 'ups-nl'];

const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  delay: 'Delay', damage: 'Damage', overcharge: 'Overcharge', loss: 'Loss', misdelivery: 'Misdelivery',
};

function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-');
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

interface AuditClaimsTabProps {
  cutoff: string | null;
  filters: AnalyticsFilters;
}

export default function AuditClaimsTab({ cutoff, filters }: AuditClaimsTabProps) {
  const filtered = useMemo(
    () => mockMonthlyClaims.filter(m =>
      (!cutoff || m.month >= cutoff) &&
      (!filters.carrierFilter || m.carrierId === filters.carrierFilter) &&
      (!filters.destinationFilter || m.destination === filters.destinationFilter) &&
      (!filters.serviceTypeFilter || m.serviceType === filters.serviceTypeFilter)
    ),
    [cutoff, filters],
  );

  // KPI aggregates
  const kpis = useMemo(() => {
    const totalClaims = filtered.reduce((s, m) => s + m.claimsSubmitted, 0);
    const totalRefunded = filtered.reduce((s, m) => s + m.refundAmount, 0);
    const totalAccepted = filtered.reduce((s, m) => s + m.claimsAccepted, 0);
    const resolutionRate = totalClaims > 0 ? (totalAccepted / totalClaims) * 100 : 0;
    const weightedResponse = filtered.reduce((s, m) => s + m.avgResponseDays * m.claimsSubmitted, 0);
    const avgResponse = totalClaims > 0 ? weightedResponse / totalClaims : 0;
    return { totalClaims, totalRefunded, resolutionRate, avgResponse };
  }, [filtered]);

  // Claims over time chart data — stacked by carrier + refund line
  const claimsChartData = useMemo(() => {
    const months = [...new Set(filtered.map(m => m.month))].sort();
    let cumRefund = 0;
    return months.map(month => {
      const row: Record<string, string | number> = { month: formatMonth(month) };
      for (const cid of CARRIER_IDS) {
        const rec = filtered.find(m => m.month === month && m.carrierId === cid);
        row[cid] = rec?.claimsSubmitted ?? 0;
        if (rec) cumRefund += rec.refundAmount;
      }
      row.cumRefund = cumRefund;
      return row;
    });
  }, [filtered]);

  // Claims by type chart data
  const claimTypeData = useMemo(
    () => mockClaimTypeSummaries.map(ct => ({
      type: CLAIM_TYPE_LABELS[ct.type],
      accepted: Math.round(ct.count * ct.resolutionRate / 100),
      rejected: ct.count - Math.round(ct.count * ct.resolutionRate / 100) - Math.round(ct.count * 0.05),
      pending: Math.round(ct.count * 0.05),
    })),
    [],
  );

  // Carrier claims summary
  const carrierSummary = useMemo(() => {
    return CARRIER_IDS.map(cid => {
      const records = filtered.filter(m => m.carrierId === cid);
      const totalClaims = records.reduce((s, r) => s + r.claimsSubmitted, 0);
      const totalAccepted = records.reduce((s, r) => s + r.claimsAccepted, 0);
      const totalRefunded = records.reduce((s, r) => s + r.refundAmount, 0);
      const weightedResponse = records.reduce((s, r) => s + r.avgResponseDays * r.claimsSubmitted, 0);
      return {
        carrierId: cid,
        totalClaims,
        totalAccepted,
        totalRefunded,
        resolutionRate: totalClaims > 0 ? (totalAccepted / totalClaims) * 100 : 0,
        avgResponse: totalClaims > 0 ? weightedResponse / totalClaims : 0,
      };
    }).sort((a, b) => b.totalClaims - a.totalClaims);
  }, [filtered]);

  // Response time bar data
  const responseBarData = useMemo(
    () => carrierSummary.map(c => ({
      label: CARRIERS[c.carrierId].label,
      carrierId: c.carrierId,
      days: +c.avgResponse.toFixed(1),
    })),
    [carrierSummary],
  );

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
        {statCard('Total Claims', kpis.totalClaims.toLocaleString())}
        {statCard('Total Refunded', `€${kpis.totalRefunded.toLocaleString()}`, '#059669')}
        {statCard('Resolution Rate', `${kpis.resolutionRate.toFixed(1)}%`)}
        {statCard('Avg Response', `${kpis.avgResponse.toFixed(1)} days`, '#f59e0b')}
      </Box>

      {/* Claims over time */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
          Claims Over Time
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={claimsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value: unknown, name: string) => {
                const v = value as number;
                if (name === 'cumRefund') return [`€${v.toLocaleString()}`, 'Cumulative Refund'];
                return [v, CARRIERS[name as CarrierId]?.label ?? name];
              }}
            />
            <Legend verticalAlign="bottom" height={28} formatter={(value: string) => (
              <span style={{ fontSize: 11, color: '#6b7280' }}>
                {value === 'cumRefund' ? 'Cumulative Refund' : CARRIERS[value as CarrierId]?.label ?? value}
              </span>
            )} />
            {CARRIER_IDS.map((id, i) => (
              <Bar key={id} yAxisId="left" dataKey={id} stackId="claims" fill={CARRIER_CHART_COLORS[id]} radius={i === CARRIER_IDS.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
            ))}
            <Line yAxisId="right" type="monotone" dataKey="cumRefund" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* Claims by type + carrier resolution table */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
            Claims by Type
          </Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={claimTypeData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }} />
              <Legend verticalAlign="bottom" height={28} formatter={(value: string) => (
                <span style={{ fontSize: 11, color: '#6b7280' }}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
              )} />
              <Bar dataKey="accepted" stackId="status" fill="#10b981" barSize={16} />
              <Bar dataKey="rejected" stackId="status" fill="#dc2626" barSize={16} />
              <Bar dataKey="pending" stackId="status" fill="#f59e0b" radius={[0, 3, 3, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ flexShrink: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
            Resolution by Carrier
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Carrier', 'Claims', 'Refunded', 'Rate', 'Avg Days'].map(h => (
                    <TableCell key={h} align={h === 'Carrier' ? 'left' : 'right'} sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {carrierSummary.map(row => (
                  <TableRow key={row.carrierId}>
                    <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 0.75 }}><CarrierChip carrierId={row.carrierId} /></TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>{row.totalClaims}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', color: '#059669', py: 0.75 }}>€{row.totalRefunded.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>{row.resolutionRate.toFixed(0)}%</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', py: 0.75, color: row.avgResponse > 10 ? '#dc2626' : '#374151' }}>
                      {row.avgResponse.toFixed(1)}d
                    </TableCell>
                  </TableRow>
                ))}
                {(() => {
                  const totClaims = carrierSummary.reduce((s, r) => s + r.totalClaims, 0);
                  const totRefund = carrierSummary.reduce((s, r) => s + r.totalRefunded, 0);
                  const totAccepted = carrierSummary.reduce((s, r) => s + r.totalAccepted, 0);
                  const totRate = totClaims > 0 ? (totAccepted / totClaims) * 100 : 0;
                  const weightedResp = carrierSummary.reduce((s, r) => s + r.avgResponse * r.totalClaims, 0);
                  const avgResp = totClaims > 0 ? weightedResp / totClaims : 0;
                  return (
                    <TableRow>
                      <TableCell sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>{totClaims}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#059669', borderBottom: 0, py: 0.75 }}>€{totRefund.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>{totRate.toFixed(0)}%</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>{avgResp.toFixed(1)}d</TableCell>
                    </TableRow>
                  );
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Response time by carrier */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
          Avg Response Time by Carrier
        </Typography>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={responseBarData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}d`} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }} formatter={(v: unknown) => [`${v} days`, 'Avg Response']} />
            <ReferenceLine y={10} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'Target 10d', fontSize: 10, fill: '#dc2626', position: 'right' }} />
            <Bar dataKey="days" radius={[3, 3, 0, 0]} barSize={32}>
              {responseBarData.map((entry) => (
                <Cell key={entry.carrierId} fill={CARRIER_CHART_COLORS[entry.carrierId as CarrierId]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

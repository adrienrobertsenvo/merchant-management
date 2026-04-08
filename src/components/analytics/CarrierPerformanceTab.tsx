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
  ComposedChart, Line, Legend, CartesianGrid, ReferenceLine, LineChart, Cell,
} from 'recharts';
import CarrierChip from '../rate-cards/CarrierChip';
import { mockMonthlyTransitMetrics } from '../../data/mockTransitMetrics';
import { CARRIERS } from '../../constants/rateCardConfig';
import type { CarrierId } from '../../types/rateCard';
import type { AnalyticsFilters } from './AnalyticsDashboardPage';

const CARRIER_CHART_COLORS: Record<CarrierId, string> = {
  'dhl-de': '#FFCC00', 'dhl-nl': '#FFCC00', 'dhl-at': '#FFCC00',
  'gls-de': '#1B3D8F', 'gls-nl': '#1B3D8F',
  'fedex-de': '#4D148C', 'fedex-nl': '#4D148C', 'fedex-gb': '#4D148C',
  'dpd-de': '#DC0032', 'dpd-at': '#DC0032',
  'ups-de': '#351C15', 'ups-nl': '#351C15',
};

const CARRIER_IDS: CarrierId[] = ['dhl-de', 'dhl-nl', 'dhl-at', 'gls-de', 'gls-nl', 'fedex-de', 'fedex-nl', 'fedex-gb', 'dpd-de', 'dpd-at', 'ups-de', 'ups-nl'];

function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-');
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

interface CarrierPerformanceTabProps {
  cutoff: string | null;
  filters: AnalyticsFilters;
}

export default function CarrierPerformanceTab({ cutoff, filters }: CarrierPerformanceTabProps) {
  const filtered = useMemo(
    () => mockMonthlyTransitMetrics.filter(m =>
      (!cutoff || m.month >= cutoff) &&
      (!filters.carrierFilter || m.carrierId === filters.carrierFilter) &&
      (!filters.destinationFilter || m.destination === filters.destinationFilter) &&
      (!filters.serviceTypeFilter || m.serviceType === filters.serviceTypeFilter)
    ),
    [cutoff, filters],
  );

  // KPI aggregates
  const kpis = useMemo(() => {
    const totalShipments = filtered.reduce((s, m) => s + m.totalShipments, 0);
    const weightedTransit = filtered.reduce((s, m) => s + m.avgTransitDays * m.totalShipments, 0);
    const weightedOnTime = filtered.reduce((s, m) => s + m.onTimePct * m.totalShipments, 0);
    const weightedLate = filtered.reduce((s, m) => s + m.latePct * m.totalShipments, 0);
    const weightedLost = filtered.reduce((s, m) => s + m.lostPct * m.totalShipments, 0);
    return {
      avgTransit: totalShipments > 0 ? weightedTransit / totalShipments : 0,
      onTimeRate: totalShipments > 0 ? weightedOnTime / totalShipments : 0,
      lateRate: totalShipments > 0 ? weightedLate / totalShipments : 0,
      lostRate: totalShipments > 0 ? weightedLost / totalShipments : 0,
    };
  }, [filtered]);

  // Transit time trend chart data — one row per month, one key per carrier
  const transitChartData = useMemo(() => {
    const months = [...new Set(filtered.map(m => m.month))].sort();
    return months.map(month => {
      const row: Record<string, string | number> = { month: formatMonth(month) };
      let totalShip = 0;
      let weightedDays = 0;
      for (const cid of CARRIER_IDS) {
        const rec = filtered.find(m => m.month === month && m.carrierId === cid);
        if (rec) {
          row[cid] = rec.avgTransitDays;
          totalShip += rec.totalShipments;
          weightedDays += rec.avgTransitDays * rec.totalShipments;
        }
      }
      row.avg = totalShip > 0 ? +(weightedDays / totalShip).toFixed(2) : 0;
      return row;
    });
  }, [filtered]);

  // On-time trend chart data
  const onTimeChartData = useMemo(() => {
    const months = [...new Set(filtered.map(m => m.month))].sort();
    return months.map(month => {
      const row: Record<string, string | number> = { month: formatMonth(month) };
      for (const cid of CARRIER_IDS) {
        const rec = filtered.find(m => m.month === month && m.carrierId === cid);
        if (rec) row[cid] = rec.onTimePct;
      }
      return row;
    });
  }, [filtered]);

  // Carrier SLA summary table rows
  const slaSummary = useMemo(() => {
    return CARRIER_IDS.map(cid => {
      const records = filtered.filter(m => m.carrierId === cid);
      const total = records.reduce((s, r) => s + r.totalShipments, 0);
      const wTransit = records.reduce((s, r) => s + r.avgTransitDays * r.totalShipments, 0);
      const wOnTime = records.reduce((s, r) => s + r.onTimePct * r.totalShipments, 0);
      const wLate = records.reduce((s, r) => s + r.latePct * r.totalShipments, 0);
      const wLost = records.reduce((s, r) => s + r.lostPct * r.totalShipments, 0);
      return {
        carrierId: cid,
        slaTarget: records[0]?.slaTargetDays ?? 0,
        avgDays: total > 0 ? wTransit / total : 0,
        onTime: total > 0 ? wOnTime / total : 0,
        late: total > 0 ? wLate / total : 0,
        lost: total > 0 ? wLost / total : 0,
        totalShipments: total,
      };
    }).sort((a, b) => b.totalShipments - a.totalShipments);
  }, [filtered]);

  // On-time bar data for horizontal chart
  const onTimeBarData = useMemo(
    () => slaSummary.map(s => ({ carrierId: s.carrierId, onTime: +s.onTime.toFixed(1), label: CARRIERS[s.carrierId].label })),
    [slaSummary],
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
        {statCard('Avg Transit Days', kpis.avgTransit.toFixed(1))}
        {statCard('On-Time Rate', `${kpis.onTimeRate.toFixed(1)}%`, '#059669')}
        {statCard('Late Rate', `${kpis.lateRate.toFixed(1)}%`, '#f59e0b')}
        {statCard('Lost Rate', `${kpis.lostRate.toFixed(2)}%`, '#dc2626')}
      </Box>

      {/* Transit Time Trend */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
          Average Transit Days by Carrier
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={transitChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 'auto']} tickFormatter={(v: number) => `${v}d`} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value: number, name: string) => {
                if (name === 'avg') return [`${value.toFixed(1)}d`, 'Weighted Avg'];
                return [`${value.toFixed(1)}d`, CARRIERS[name as CarrierId]?.label ?? name];
              }}
            />
            <Legend verticalAlign="bottom" height={28} formatter={(value: string) => (
              <span style={{ fontSize: 11, color: '#6b7280' }}>{value === 'avg' ? 'Weighted Avg' : CARRIERS[value as CarrierId]?.label ?? value}</span>
            )} />
            {CARRIER_IDS.map(id => (
              <Bar key={id} dataKey={id} fill={CARRIER_CHART_COLORS[id]} barSize={10} radius={[3, 3, 0, 0]} />
            ))}
            <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: '#f59e0b' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* On-Time bar + SLA table side by side */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
            On-Time Delivery Rate by Carrier
          </Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={onTimeBarData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v: number) => `${v}%`} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }} formatter={(v: number) => [`${v}%`, 'On-Time']} />
              <ReferenceLine x={92} stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'Target 92%', fontSize: 10, fill: '#dc2626', position: 'top' }} />
              <Bar dataKey="onTime" radius={[0, 3, 3, 0]} barSize={16}>
                {onTimeBarData.map((entry) => (
                  <Cell key={entry.carrierId} fill={CARRIER_CHART_COLORS[entry.carrierId]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ flexShrink: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
            SLA Summary
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Carrier', 'SLA', 'Avg Days', 'On-Time', 'Late', 'Lost'].map(h => (
                    <TableCell key={h} align={h === 'Carrier' ? 'left' : 'right'} sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {slaSummary.map(row => (
                  <TableRow key={row.carrierId}>
                    <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 0.75 }}><CarrierChip carrierId={row.carrierId} /></TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>{row.slaTarget}d</TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500, borderBottom: '1px solid #f3f4f6', py: 0.75, color: row.avgDays <= row.slaTarget ? '#059669' : '#dc2626' }}>
                      {row.avgDays.toFixed(1)}d
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500, borderBottom: '1px solid #f3f4f6', py: 0.75, color: '#059669' }}>
                      {row.onTime.toFixed(1)}%
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', py: 0.75, color: '#f59e0b' }}>
                      {row.late.toFixed(1)}%
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', py: 0.75, color: '#dc2626' }}>
                      {row.lost.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Monthly On-Time Trend */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>
          Monthly On-Time Delivery Trend
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={onTimeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[80, 100]} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, CARRIERS[name as CarrierId]?.label ?? name]}
            />
            <Legend verticalAlign="bottom" height={28} formatter={(value: string) => (
              <span style={{ fontSize: 11, color: '#6b7280' }}>{CARRIERS[value as CarrierId]?.label ?? value}</span>
            )} />
            {CARRIER_IDS.map(id => (
              <Line key={id} type="monotone" dataKey={id} stroke={CARRIER_CHART_COLORS[id]} strokeWidth={2} dot={{ r: 3, fill: CARRIER_CHART_COLORS[id] }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

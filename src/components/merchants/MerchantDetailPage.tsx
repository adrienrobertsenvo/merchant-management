import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EditIcon from '@mui/icons-material/Edit';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Line, Legend, CartesianGrid } from 'recharts';
import MerchantAliasHistory from './MerchantAliasHistory';
import MerchantRateCardsTab from './MerchantRateCardsTab';
import MerchantRateCardsWithShipments from './MerchantRateCardsWithShipments';
import { countryFlag } from '../../utils/format';
import { CARRIERS } from '../../constants/rateCardConfig';
import CarrierChip from '../rate-cards/CarrierChip';
import { mockMonthlyShipments, mockResolutionHistory, mockCarrierShipments } from '../../data/mockMerchants';
import { mockMonthlyMargins, mockTopLanes } from '../../data/mockMerchantMargins';
import type { BillingEntity } from '../../types/merchant';
import type { CarrierId } from '../../types/rateCard';

type TimePeriod = '3m' | '6m' | '12m' | 'all';
type DetailTab = 'analytics' | 'setup';

const PERIOD_LABELS: Record<TimePeriod, string> = {
  '3m': 'Last 3 Months',
  '6m': 'Last 6 Months',
  '12m': 'Last 12 Months',
  all: 'All Time',
};

function cutoffMonth(period: TimePeriod): string | null {
  if (period === 'all') return null;
  const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const CARRIER_CHART_COLORS: Record<CarrierId, string> = {
  'dhl-de': '#FFCC00',
  'dhl-nl': '#FFCC00',
  'dhl-at': '#FFCC00',
  'gls-de': '#1B3D8F',
  'gls-nl': '#1B3D8F',
  'fedex-de': '#4D148C',
  'fedex-nl': '#4D148C',
  'fedex-gb': '#4D148C',
  'dpd-de': '#DC0032',
  'dpd-at': '#DC0032',
  'ups-de': '#351C15',
  'ups-nl': '#351C15',
};

interface MerchantDetailPageProps {
  merchantId: string;
  entities: BillingEntity[];
  onEntitiesChange: (entities: BillingEntity[] | ((prev: BillingEntity[]) => BillingEntity[])) => void;
  onBack: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-');
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

export default function MerchantDetailPage({ merchantId, entities, onEntitiesChange, onBack }: MerchantDetailPageProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('analytics');
  const [newAlias, setNewAlias] = useState('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('12m');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
    open: false, message: '', severity: 'success',
  });

  const cutoff = useMemo(() => cutoffMonth(timePeriod), [timePeriod]);
  const entity = entities.find(e => e.id === merchantId);
  const entityHistory = mockResolutionHistory.filter(e => e.entityId === merchantId);
  const carrierData = useMemo(() => mockCarrierShipments[merchantId] ?? [], [merchantId]);
  const activeCarrierIds = useMemo(() => carrierData.map(c => c.carrierId), [carrierData]);

  const chartData = useMemo(() => {
    const data = (mockMonthlyShipments[merchantId] ?? []).filter(m => !cutoff || m.month >= cutoff);
    const totalCarrierShipments = carrierData.reduce((s, c) => s + c.shipments, 0);
    const shares = carrierData.map(c => ({ id: c.carrierId, share: totalCarrierShipments > 0 ? c.shipments / totalCarrierShipments : 0 }));
    return data.map(m => {
      const row: Record<string, string | number> = { month: formatMonth(m.month) };
      let allocated = 0;
      shares.forEach((s, i) => {
        const val = i < shares.length - 1 ? Math.round(m.shipments * s.share) : m.shipments - allocated;
        row[s.id] = val;
        allocated += val;
      });
      return row;
    });
  }, [merchantId, carrierData, cutoff]);

  const totalShipments = useMemo(
    () => (mockMonthlyShipments[merchantId] ?? []).filter(m => !cutoff || m.month >= cutoff).reduce((s, m) => s + m.shipments, 0),
    [merchantId, cutoff],
  );

  const marginChartData = useMemo(() => {
    const data = (mockMonthlyMargins[merchantId] ?? []).filter(m => !cutoff || m.month >= cutoff);
    return data.map(m => {
      const netWin = m.sellingRevenue - m.buyingCost;
      return {
        month: formatMonth(m.month),
        buyingCost: m.buyingCost,
        sellingRevenue: m.sellingRevenue,
        netWin,
        marginPct: m.sellingRevenue > 0 ? +((1 - m.buyingCost / m.sellingRevenue) * 100).toFixed(1) : 0,
      };
    });
  }, [merchantId, cutoff]);

  const topLanes = useMemo(() => {
    const raw = mockTopLanes[merchantId] ?? [];
    if (!raw.length) return raw;
    const filteredMonths = (mockMonthlyMargins[merchantId] ?? []).filter(m => !cutoff || m.month >= cutoff);
    const allMonths = mockMonthlyMargins[merchantId] ?? [];
    const periodBuying = filteredMonths.reduce((s, m) => s + m.buyingCost, 0);
    const periodSelling = filteredMonths.reduce((s, m) => s + m.sellingRevenue, 0);
    const periodShipments = filteredMonths.reduce((s, m) => s + m.shipments, 0);
    const allBuying = allMonths.reduce((s, m) => s + m.buyingCost, 0);
    const allSelling = allMonths.reduce((s, m) => s + m.sellingRevenue, 0);
    const allShipments = allMonths.reduce((s, m) => s + m.shipments, 0);
    const buyRatio = allBuying > 0 ? periodBuying / allBuying : 0;
    const sellRatio = allSelling > 0 ? periodSelling / allSelling : 0;
    const shipRatio = allShipments > 0 ? periodShipments / allShipments : 0;
    return raw.map(l => ({ ...l, shipments: Math.round(l.shipments * shipRatio), buyingCost: Math.round(l.buyingCost * buyRatio), sellingRevenue: Math.round(l.sellingRevenue * sellRatio) }));
  }, [merchantId, cutoff]);

  const laneChartData = useMemo(() => topLanes.map(l => ({ route: `${countryFlag(l.origin)} → ${countryFlag(l.destination)}`, buyingCost: l.buyingCost, sellingRevenue: l.sellingRevenue, netWin: l.sellingRevenue - l.buyingCost })), [topLanes]);

  const carrierMarginRows = useMemo(() => {
    const filteredMonths = (mockMonthlyMargins[merchantId] ?? []).filter(m => !cutoff || m.month >= cutoff);
    const periodShipments = filteredMonths.reduce((s, m) => s + m.shipments, 0);
    const periodBuying = filteredMonths.reduce((s, m) => s + m.buyingCost, 0);
    const periodSelling = filteredMonths.reduce((s, m) => s + m.sellingRevenue, 0);
    const aggTotalBuying = carrierData.reduce((s, c) => s + c.shipments * c.avgBuyingPrice, 0);
    const aggTotalSelling = carrierData.reduce((s, c) => s + c.shipments * c.avgSellingPrice, 0);
    const aggTotalShipments = carrierData.reduce((s, c) => s + c.shipments, 0);
    return carrierData.map(c => {
      const shipShare = aggTotalShipments > 0 ? c.shipments / aggTotalShipments : 0;
      const buyShare = aggTotalBuying > 0 ? (c.shipments * c.avgBuyingPrice) / aggTotalBuying : 0;
      const sellShare = aggTotalSelling > 0 ? (c.shipments * c.avgSellingPrice) / aggTotalSelling : 0;
      const shipments = Math.round(periodShipments * shipShare);
      const totalBuying = Math.round(periodBuying * buyShare);
      const totalSelling = Math.round(periodSelling * sellShare);
      const netWin = totalSelling - totalBuying;
      const marginPct = totalSelling > 0 ? (1 - totalBuying / totalSelling) * 100 : 0;
      return { carrierId: c.carrierId, shipments, totalBuying, totalSelling, netWin, marginPct };
    }).sort((a, b) => b.shipments - a.shipments);
  }, [carrierData, merchantId, cutoff]);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleArchive = useCallback(() => {
    if (!entity) return;
    const updated = { ...entity, archived: !entity.archived };
    onEntitiesChange(prev => (prev as BillingEntity[]).map(e => e.id === merchantId ? updated : e));
    showSnackbar(updated.archived ? `"${entity.name}" archived` : `"${entity.name}" restored`, 'info');
  }, [entity, merchantId, onEntitiesChange, showSnackbar]);

  const handleDelete = useCallback(() => {
    if (!entity) return;
    onEntitiesChange(prev => (prev as BillingEntity[]).filter(e => e.id !== merchantId));
    showSnackbar(`"${entity.name}" deleted`, 'info');
    onBack();
  }, [entity, merchantId, onEntitiesChange, onBack, showSnackbar]);

  const handleAddAlias = useCallback(() => {
    if (!entity) return;
    const trimmed = newAlias.trim();
    if (trimmed && !entity.aliases.some(a => a.name === trimmed)) {
      const updated = { ...entity, aliases: [...entity.aliases, { name: trimmed, addedAt: new Date().toISOString().split('T')[0], source: 'manual' as const }] };
      onEntitiesChange(prev => (prev as BillingEntity[]).map(e => e.id === merchantId ? updated : e));
      setNewAlias('');
    }
  }, [entity, merchantId, newAlias, onEntitiesChange]);

  const handleRemoveAlias = useCallback((aliasName: string) => {
    if (!entity) return;
    const updated = { ...entity, aliases: entity.aliases.filter(a => a.name !== aliasName) };
    onEntitiesChange(prev => (prev as BillingEntity[]).map(e => e.id === merchantId ? updated : e));
    showSnackbar(`"${aliasName}" removed`, 'info');
  }, [entity, merchantId, onEntitiesChange, showSnackbar]);

  if (!entity) {
    return <Box sx={{ p: 3 }}><Typography>Merchant not found.</Typography></Box>;
  }

  const storeAliases = entity.aliases.filter(a => a.source === 'store');
  const manualAliases = entity.aliases.filter(a => a.source === 'manual');

  return (
    <Box sx={{ p: 3 }}>
      {/* Back navigation */}
      <Button
        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
        onClick={onBack}
        sx={{ mb: 2, color: '#6b7280', fontWeight: 500, fontSize: 13, textTransform: 'none', '&:hover': { bgcolor: '#f3f4f6' } }}
      >
        Back to Merchant Management
      </Button>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#111827', mb: 0.5 }}>{entity.name}</Typography>
          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
              <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{entity.contactEmail}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PublicIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
              <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{entity.country}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocalShippingIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
              <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{entity.shipmentCount.toLocaleString()} shipments</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
              <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Since {formatDate(entity.createdAt)}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={entity.archived ? <UnarchiveIcon sx={{ fontSize: 16 }} /> : <ArchiveIcon sx={{ fontSize: 16 }} />} onClick={handleArchive}
            sx={{ fontSize: 12, fontWeight: 500, borderColor: '#e8ebf0', color: '#6b7280', '&:hover': { borderColor: '#d97706', color: '#d97706' } }}>
            {entity.archived ? 'Restore' : 'Archive'}
          </Button>
          <Button size="small" variant="outlined" startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />} onClick={handleDelete}
            sx={{ fontSize: 12, fontWeight: 500, borderColor: '#e8ebf0', color: '#6b7280', '&:hover': { borderColor: '#dc2626', color: '#dc2626', bgcolor: '#fef2f2' } }}>
            Delete
          </Button>
        </Box>
      </Box>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: '1px solid #e8ebf0', mb: 2.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: 14 }, '& .Mui-selected': { fontWeight: 600 } }}
        >
          <Tab label="Analytics" value="analytics" />
          <Tab label="Setup" value="setup" />
        </Tabs>
      </Box>

      {/* ── Analytics Tab ──────────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <>
          {/* Time period filter */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>Period:</Typography>
            <ToggleButtonGroup value={timePeriod} exclusive onChange={(_, v) => { if (v) setTimePeriod(v as TimePeriod); }} size="small"
              sx={{ '& .MuiToggleButton-root': { fontSize: 11, fontWeight: 600, px: 1.5, py: 0.25, textTransform: 'none', border: '1px solid #e8ebf0', color: '#6b7280', '&.Mui-selected': { bgcolor: '#3b82f6', color: '#fff', borderColor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } } } }}>
              <ToggleButton value="3m">3M</ToggleButton>
              <ToggleButton value="6m">6M</ToggleButton>
              <ToggleButton value="12m">12M</ToggleButton>
              <ToggleButton value="all">All</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Shipments chart + Carrier margin table */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            {chartData.length > 0 && (
              <Box sx={{ flex: 1, minWidth: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Shipments — {PERIOD_LABELS[timePeriod]}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>{totalShipments.toLocaleString()} total</Typography>
                </Box>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }} labelStyle={{ fontWeight: 600 }}
                      formatter={(value: unknown, name: string) => [value as number, CARRIERS[name as CarrierId]?.label ?? name]} />
                    <Legend verticalAlign="bottom" height={28} formatter={(value: string) => <span style={{ fontSize: 11, color: '#6b7280' }}>{CARRIERS[value as CarrierId]?.label ?? value}</span>} />
                    {activeCarrierIds.map((id, i) => (
                      <Bar key={id} dataKey={id} stackId="shipments" fill={CARRIER_CHART_COLORS[id]} radius={i === activeCarrierIds.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {carrierMarginRows.length > 0 && (
              <Box sx={{ flexShrink: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>Margin by Carrier</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Carrier</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Shipments</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Buying</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Selling</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Net</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Margin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {carrierMarginRows.map(row => (
                        <TableRow key={row.carrierId}>
                          <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 0.75 }}><CarrierChip carrierId={row.carrierId} /></TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>{row.shipments.toLocaleString()}</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', color: '#374151', py: 0.75 }}>€{row.totalBuying.toLocaleString()}</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', color: '#374151', py: 0.75 }}>€{row.totalSelling.toLocaleString()}</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600, borderBottom: '1px solid #f3f4f6', color: row.netWin >= 0 ? '#059669' : '#dc2626', py: 0.75 }}>
                            {row.netWin >= 0 ? '+' : ''}€{row.netWin.toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600, borderBottom: '1px solid #f3f4f6', color: row.marginPct >= 0 ? '#059669' : '#dc2626', py: 0.75 }}>
                            {row.marginPct >= 0 ? '+' : ''}{row.marginPct.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      {(() => {
                        const tot = carrierMarginRows.reduce((a, r) => ({ s: a.s + r.shipments, b: a.b + r.totalBuying, se: a.se + r.totalSelling }), { s: 0, b: 0, se: 0 });
                        const totNet = tot.se - tot.b;
                        const totMargin = tot.se > 0 ? (1 - tot.b / tot.se) * 100 : 0;
                        return (
                          <TableRow>
                            <TableCell sx={{ fontSize: 12, fontWeight: 700, color: '#111827', borderBottom: 0, py: 0.75 }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, borderBottom: 0, py: 0.75 }}>{tot.s.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, borderBottom: 0, py: 0.75 }}>€{tot.b.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, borderBottom: 0, py: 0.75 }}>€{tot.se.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, borderBottom: 0, color: totNet >= 0 ? '#059669' : '#dc2626', py: 0.75 }}>{totNet >= 0 ? '+' : ''}€{totNet.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 700, borderBottom: 0, color: totMargin >= 0 ? '#059669' : '#dc2626', py: 0.75 }}>{totMargin >= 0 ? '+' : ''}{totMargin.toFixed(1)}%</TableCell>
                          </TableRow>
                        );
                      })()}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>

          {/* Monthly Margin chart */}
          {marginChartData.length > 0 && (
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5, mb: 3 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>Monthly Margin</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={marginChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} domain={[0, 30]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }} labelStyle={{ fontWeight: 600 }}
                    formatter={(value: unknown, name: string) => {
                      const v = value as number;
                      if (name === 'marginPct') return [`${v}%`, 'Margin %'];
                      if (name === 'netWin') return [`€${v.toLocaleString()}`, 'Net Win'];
                      return [`€${v.toLocaleString()}`, name === 'buyingCost' ? 'Buying Cost' : 'Selling Revenue'];
                    }} />
                  <Legend verticalAlign="bottom" height={28} formatter={(value: string) => {
                    const labels: Record<string, string> = { buyingCost: 'Buying Cost', sellingRevenue: 'Selling Revenue', netWin: 'Net Win', marginPct: 'Margin %' };
                    return <span style={{ fontSize: 11, color: '#6b7280' }}>{labels[value] ?? value}</span>;
                  }} />
                  <Bar yAxisId="left" dataKey="buyingCost" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar yAxisId="left" dataKey="sellingRevenue" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar yAxisId="left" dataKey="netWin" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={14} />
                  <Line yAxisId="right" type="monotone" dataKey="marginPct" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: '#f59e0b' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Top Lanes */}
          {topLanes.length > 0 && (
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1, minWidth: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>Top Shipping Lanes — {PERIOD_LABELS[timePeriod]}</Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={laneChartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="route" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#e8ebf0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8ebf0' }} labelStyle={{ fontWeight: 600 }}
                      formatter={(value: unknown, name: string) => { const l: Record<string, string> = { buyingCost: 'Buying Cost', sellingRevenue: 'Selling Revenue', netWin: 'Net Win' }; return [`€${(value as number).toLocaleString()}`, l[name] ?? name]; }} />
                    <Legend verticalAlign="bottom" height={28} formatter={(value: string) => { const l: Record<string, string> = { buyingCost: 'Buying Cost', sellingRevenue: 'Selling Revenue', netWin: 'Net Win' }; return <span style={{ fontSize: 11, color: '#6b7280' }}>{l[value] ?? value}</span>; }} />
                    <Bar dataKey="buyingCost" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={14} />
                    <Bar dataKey="sellingRevenue" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
                    <Bar dataKey="netWin" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ flexShrink: 0, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 2 }}>Margin by Lane</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Route</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Shipments</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Buying</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Selling</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Net</TableCell>
                        <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e8ebf0' }}>Margin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topLanes.map(lane => {
                        const netWin = lane.sellingRevenue - lane.buyingCost;
                        const marginPct = lane.sellingRevenue > 0 ? ((1 - lane.buyingCost / lane.sellingRevenue) * 100).toFixed(1) : '0.0';
                        return (
                          <TableRow key={`${lane.origin}-${lane.destination}`}>
                            <TableCell sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                <span>{countryFlag(lane.origin)}</span>
                                <Typography component="span" sx={{ fontSize: 11, color: '#9ca3af', mx: 0.25 }}>&rarr;</Typography>
                                <span>{countryFlag(lane.destination)}</span>
                                <Typography component="span" sx={{ fontSize: 11, color: '#9ca3af', ml: 0.5 }}>{lane.origin}→{lane.destination}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500, borderBottom: '1px solid #f3f4f6', py: 0.75 }}>{lane.shipments.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', color: '#374151', py: 0.75 }}>€{lane.buyingCost.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, borderBottom: '1px solid #f3f4f6', color: '#374151', py: 0.75 }}>€{lane.sellingRevenue.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600, borderBottom: '1px solid #f3f4f6', color: netWin >= 0 ? '#059669' : '#dc2626', py: 0.75 }}>
                              {netWin >= 0 ? '+' : ''}€{netWin.toLocaleString()}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600, borderBottom: '1px solid #f3f4f6', color: parseFloat(marginPct) >= 0 ? '#059669' : '#dc2626', py: 0.75 }}>
                              {parseFloat(marginPct) >= 0 ? '+' : ''}{marginPct}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}

          {/* Shipment Analytics */}
          <Box sx={{ mt: 3 }}>
            <MerchantRateCardsWithShipments merchantId={merchantId} hideRateCardsTable />
          </Box>
        </>
      )}

      {/* ── Setup Tab (Aliases + Rate Cards combined) ──────────────────────── */}
      {activeTab === 'setup' && (
        <>
          {/* Master Data (Stammdaten) */}
          {entity.masterData && (
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5, mb: 3 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827', mb: 2 }}>
                Master Data
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                {/* Company Info */}
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 1 }}>
                    Company
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                      {entity.masterData.companyName}
                      {entity.masterData.legalForm && <Box component="span" sx={{ fontWeight: 400, color: '#6b7280', ml: 0.5 }}>({entity.masterData.legalForm})</Box>}
                    </Typography>
                    {entity.masterData.vatId && <Typography sx={{ fontSize: 12, color: '#374151' }}>VAT: {entity.masterData.vatId}</Typography>}
                    {entity.masterData.commercialRegister && <Typography sx={{ fontSize: 12, color: '#374151' }}>{entity.masterData.commercialRegister}</Typography>}
                  </Box>
                </Box>

                {/* Billing Address */}
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 1 }}>
                    Billing Address
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    <Typography sx={{ fontSize: 12, color: '#374151' }}>{entity.masterData.billingAddress.street}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#374151' }}>{entity.masterData.billingAddress.postalCode} {entity.masterData.billingAddress.city}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#374151' }}>{entity.masterData.billingAddress.country}</Typography>
                  </Box>
                </Box>

                {/* Invoice & Payment */}
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 1 }}>
                    Invoicing
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {entity.masterData.invoiceEmail && <Typography sx={{ fontSize: 12, color: '#374151' }}>Invoice email: {entity.masterData.invoiceEmail}</Typography>}
                    {entity.masterData.paymentTerms && <Typography sx={{ fontSize: 12, color: '#374151' }}>Payment terms: {entity.masterData.paymentTerms}</Typography>}
                    {entity.masterData.currency && <Typography sx={{ fontSize: 12, color: '#374151' }}>Currency: {entity.masterData.currency}</Typography>}
                  </Box>
                </Box>

                {/* Contact Persons */}
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 1 }}>
                    Contacts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {entity.masterData.contacts.map((c, i) => (
                      <Box key={i} sx={{ p: 1, bgcolor: '#f8f9fb', borderRadius: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{c.name}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#6b7280' }}>{c.role}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#2563eb' }}>{c.email}</Typography>
                        {c.phone && <Typography sx={{ fontSize: 11, color: '#6b7280' }}>{c.phone}</Typography>}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {!entity.masterData && (
            <Box sx={{ bgcolor: '#fff', border: '1px dashed #d1d5db', borderRadius: 2, p: 3, mb: 3, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 13, color: '#9ca3af', mb: 1 }}>No master data configured</Typography>
              <Button size="small" variant="outlined" sx={{ textTransform: 'none', fontSize: 12 }}>
                Add Master Data
              </Button>
            </Box>
          )}

          {/* Aliases section */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ flex: 2 }}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827', mb: 1.5 }}>
                  Aliases / Account Numbers ({entity.aliases.length})
                </Typography>

                {storeAliases.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                      <StorefrontIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Store Alias / Account</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {storeAliases.map(alias => (
                        <Chip key={alias.name} label={<Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>{alias.name}<Box component="span" sx={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 400 }}>{formatDate(alias.addedAt)}</Box></Box>}
                          size="small" onDelete={() => handleRemoveAlias(alias.name)}
                          sx={{ bgcolor: '#f3f4f6', color: '#374151', fontWeight: 500, fontSize: 12, border: 'none', height: 26 }} />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                    <EditIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                    <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Manual Alias / Account</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
                    {manualAliases.map(alias => (
                      <Chip key={alias.name} label={<Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>{alias.name}<Box component="span" sx={{ fontSize: 10.5, color: '#93c5fd', fontWeight: 400 }}>{formatDate(alias.addedAt)}</Box></Box>}
                        size="small" onDelete={() => handleRemoveAlias(alias.name)}
                        sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 500, fontSize: 12, border: 'none', height: 26 }} />
                    ))}
                    {manualAliases.length === 0 && <Typography sx={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>No manual aliases yet</Typography>}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField placeholder="Add alias or account number..." size="small" value={newAlias} onChange={(e) => setNewAlias(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddAlias(); }} sx={{ flex: 1, maxWidth: 280 }} />
                    <Button size="small" variant="outlined" onClick={handleAddAlias} disabled={!newAlias.trim()} startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                      sx={{ fontWeight: 500, borderColor: '#e8ebf0', color: '#374151', '&:hover': { borderColor: '#3b82f6', color: '#3b82f6' } }}>
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
                <MerchantAliasHistory events={entityHistory} />
              </Box>
            </Box>
          </Box>

          {/* Rate Cards section */}
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827', mb: 1.5 }}>
            Carrier & Rate Card Setup
          </Typography>
          <MerchantRateCardsTab merchantId={merchantId} />
        </>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CarrierChip from './CarrierChip';
import { mockBuyingRateCards } from '../../data/mockRateCards';
import { mockRateCards } from '../../data/mockRateCards';
import { mockBillingEntities } from '../../data/mockMerchants';
import { mockCarrierShipments } from '../../data/mockMerchants';
import { CARRIER_IDS } from '../../constants/rateCardConfig';
import type { PricingZone } from '../../types/rateCard';

// ── helpers ──

function matchZones(buyZones: PricingZone[], sellZones: PricingZone[]) {
  const allZoneNames = Array.from(
    new Set([...buyZones.map(z => z.zone), ...sellZones.map(z => z.zone)]),
  );
  return allZoneNames.map(name => ({
    zone: name,
    buy: buyZones.find(z => z.zone === name),
    sell: sellZones.find(z => z.zone === name),
  }));
}

function allWeights(buyTiers?: { maxWeight: number }[], sellTiers?: { maxWeight: number }[]) {
  const set = new Set<number>();
  buyTiers?.forEach(t => set.add(t.maxWeight));
  sellTiers?.forEach(t => set.add(t.maxWeight));
  return Array.from(set).sort((a, b) => a - b);
}

function findPrice(tiers: { maxWeight: number; price: number }[] | undefined, weight: number) {
  return tiers?.find(t => t.maxWeight === weight)?.price ?? null;
}

function formatEur(v: number) {
  return `\u20AC${v.toFixed(2)}`;
}

function formatPct(v: number) {
  return `${v.toFixed(1)}%`;
}

// ── component ──

export default function RateCardSimulator() {
  const [carrierFilter, setCarrierFilter] = useState<string>('');
  const [buyId, setBuyId] = useState<string>('');
  const [sellId, setSellId] = useState<string>('');
  const [merchantId, setMerchantId] = useState<string>('');

  const buyCard = useMemo(() => mockBuyingRateCards.find(c => c.id === buyId), [buyId]);
  const sellCard = useMemo(() => mockRateCards.find(c => c.id === sellId), [sellId]);
  const merchant = useMemo(() => mockBillingEntities.find(e => e.id === merchantId), [merchantId]);
  const carrierShipments = useMemo(
    () => (merchantId ? mockCarrierShipments[merchantId] ?? [] : []),
    [merchantId],
  );

  const bothSelected = !!buyCard && !!sellCard;

  // matched zones
  const zoneRows = useMemo(() => {
    if (!bothSelected) return [];
    return matchZones(buyCard.pricing?.zones ?? [], sellCard.pricing?.zones ?? []);
  }, [bothSelected, buyCard, sellCard]);

  // surcharges comparison
  const surchargeRows = useMemo(() => {
    if (!bothSelected) return [];
    const buySurcharges = buyCard.pricing?.surcharges ?? [];
    const sellSurcharges = sellCard.pricing?.surcharges ?? [];
    const allNames = Array.from(
      new Set([...buySurcharges.map(s => s.name), ...sellSurcharges.map(s => s.name)]),
    );
    return allNames.map(name => {
      const buy = buySurcharges.find(s => s.name === name);
      const sell = sellSurcharges.find(s => s.name === name);
      let status: string;
      if (buy && sell) status = 'Matched';
      else if (buy && !sell) status = 'No sell';
      else status = 'Sell only';
      return { name, buyValue: buy?.value ?? '\u2014', sellValue: sell?.value ?? '\u2014', status };
    });
  }, [bothSelected, buyCard, sellCard]);

  // volume simulation
  const volumeSim = useMemo(() => {
    if (!bothSelected || !merchant) return null;
    const buyZones = buyCard.pricing?.zones ?? [];
    const sellZones = sellCard.pricing?.zones ?? [];
    const totalShipments = carrierShipments.reduce((s, c) => s + c.shipments, 0);
    if (totalShipments === 0) return null;

    // Compute avg buy/sell prices across all tiers/zones
    const avgBuyPrice =
      buyZones.reduce((sum, z) => {
        const avg = z.tiers.reduce((s, t) => s + t.price, 0) / (z.tiers.length || 1);
        return sum + avg;
      }, 0) / (buyZones.length || 1);

    const avgSellPrice =
      sellZones.reduce((sum, z) => {
        const avg = z.tiers.reduce((s, t) => s + t.price, 0) / (z.tiers.length || 1);
        return sum + avg;
      }, 0) / (sellZones.length || 1);

    const estBuyTotal = totalShipments * avgBuyPrice;
    const estSellTotal = totalShipments * avgSellPrice;
    const estMargin = estSellTotal - estBuyTotal;
    const estMarginPct = estBuyTotal > 0 ? (estMargin / estBuyTotal) * 100 : 0;

    // zone breakdown
    const zoneBreakdown = buyZones.map(bz => {
      const sz = sellZones.find(s => s.zone === bz.zone);
      const zoneBuyAvg = bz.tiers.reduce((s, t) => s + t.price, 0) / (bz.tiers.length || 1);
      const zoneSellAvg = sz
        ? sz.tiers.reduce((s, t) => s + t.price, 0) / (sz.tiers.length || 1)
        : 0;
      // distribute volume evenly across zones for simulation
      const zoneVolume = Math.round(totalShipments / buyZones.length);
      return {
        zone: bz.zone,
        volume: zoneVolume,
        buyAvg: zoneBuyAvg,
        sellAvg: zoneSellAvg,
        buyTotal: zoneVolume * zoneBuyAvg,
        sellTotal: zoneVolume * zoneSellAvg,
      };
    });

    return { totalShipments, avgBuyPrice, avgSellPrice, estBuyTotal, estSellTotal, estMargin, estMarginPct, zoneBreakdown };
  }, [bothSelected, buyCard, sellCard, merchant, carrierShipments]);

  // ── render ──

  const cellSx = { fontSize: 12, py: 0.75, px: 1.5 };
  const headCellSx = { ...cellSx, fontWeight: 700, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' as const, letterSpacing: 0.5 };

  return (
    <Box>
      {/* ── Selection Panel ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Simulation Setup
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Carrier */}
          <TextField
            select
            label="Carrier"
            value={carrierFilter}
            onChange={e => { setCarrierFilter(e.target.value); setBuyId(''); }}
            size="small"
            sx={{ minWidth: 150 }}
            slotProps={{ inputLabel: { sx: { fontSize: 13 } }, input: { sx: { fontSize: 13 } }, select: { displayEmpty: true } }}
          >
            <MenuItem value="" sx={{ fontSize: 12, color: '#9ca3af' }}>All Carriers</MenuItem>
            {CARRIER_IDS.filter(cId => mockBuyingRateCards.some(brc => brc.carrierId === cId)).map(cId => (
              <MenuItem key={cId} value={cId} sx={{ fontSize: 12 }}>
                <CarrierChip carrierId={cId} size="small" />
              </MenuItem>
            ))}
          </TextField>

          {/* Buy rate card */}
          <TextField
            select
            label="Buy Rate Card"
            value={buyId}
            onChange={e => {
              setBuyId(e.target.value);
              const brc = mockBuyingRateCards.find(c => c.id === e.target.value);
              if (brc && !carrierFilter) setCarrierFilter(brc.carrierId);
            }}
            size="small"
            sx={{ minWidth: 220 }}
            slotProps={{ inputLabel: { sx: { fontSize: 13 } }, input: { sx: { fontSize: 13 } }, select: { displayEmpty: true } }}
          >
            <MenuItem value="" sx={{ fontSize: 12, color: '#9ca3af' }}>Select buy rate card...</MenuItem>
            {mockBuyingRateCards
              .filter(c => !carrierFilter || c.carrierId === carrierFilter)
              .map(c => (
                <MenuItem key={c.id} value={c.id} sx={{ fontSize: 12 }}>
                  {c.name}
                </MenuItem>
              ))}
          </TextField>

          {/* Sell rate card */}
          <TextField
            select
            label="Sell Rate Card"
            value={sellId}
            onChange={e => setSellId(e.target.value)}
            size="small"
            sx={{ minWidth: 260 }}
            slotProps={{ inputLabel: { sx: { fontSize: 13 } }, input: { sx: { fontSize: 13 } } }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>
              <em>Select sell rate card...</em>
            </MenuItem>
            {mockRateCards.map(c => (
              <MenuItem key={c.id} value={c.id} sx={{ fontSize: 12 }}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

        </Box>
      </Paper>

      {/* ── Face Value Comparison ── */}
      {bothSelected && (
        <>
          {/* Zone / Tier comparison */}
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Face Value Comparison
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                Buy: <strong>{buyCard!.name}</strong>
              </Typography>
              <CarrierChip carrierId={buyCard!.carrierId} size="small" />
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                Sell: <strong>{sellCard!.name}</strong>
              </Typography>
              {sellCard!.carrierId && <CarrierChip carrierId={sellCard!.carrierId} size="small" />}
            </Box>

            {zoneRows.map(({ zone, buy, sell }) => (
              <Box key={zone} sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>
                  {zone}
                  {buy?.countries && (
                    <Typography component="span" sx={{ fontSize: 11, color: 'text.secondary', ml: 1 }}>
                      {buy.countries.join(', ')}
                    </Typography>
                  )}
                  {!buy?.countries && sell?.countries && (
                    <Typography component="span" sx={{ fontSize: 11, color: 'text.secondary', ml: 1 }}>
                      {sell.countries.join(', ')}
                    </Typography>
                  )}
                </Typography>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headCellSx}>Max Weight</TableCell>
                      <TableCell sx={headCellSx} align="right">Buy Price</TableCell>
                      <TableCell sx={headCellSx} align="right">Sell Price</TableCell>
                      <TableCell sx={headCellSx} align="right">Margin</TableCell>
                      <TableCell sx={headCellSx} align="right">Margin %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allWeights(buy?.tiers, sell?.tiers).map(w => {
                      const bp = findPrice(buy?.tiers, w);
                      const sp = findPrice(sell?.tiers, w);
                      const margin = bp != null && sp != null ? sp - bp : null;
                      const marginPct = bp != null && sp != null && bp > 0 ? ((sp - bp) / bp) * 100 : null;
                      return (
                        <TableRow key={w} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell sx={cellSx}>{w} kg</TableCell>
                          <TableCell sx={cellSx} align="right">
                            {bp != null ? formatEur(bp) : <Typography component="span" sx={{ fontSize: 11, color: 'text.disabled' }}>&mdash;</Typography>}
                          </TableCell>
                          <TableCell sx={cellSx} align="right">
                            {sp != null ? formatEur(sp) : <Typography component="span" sx={{ fontSize: 11, color: 'text.disabled' }}>&mdash;</Typography>}
                          </TableCell>
                          <TableCell
                            sx={{ ...cellSx, color: margin != null ? (margin >= 0 ? 'success.main' : 'error.main') : 'text.disabled' }}
                            align="right"
                          >
                            {margin != null ? formatEur(margin) : '\u2014'}
                          </TableCell>
                          <TableCell
                            sx={{ ...cellSx, color: marginPct != null ? (marginPct >= 0 ? 'success.main' : 'error.main') : 'text.disabled' }}
                            align="right"
                          >
                            {marginPct != null ? formatPct(marginPct) : '\u2014'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            ))}
          </Paper>

          {/* Surcharges comparison */}
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Surcharges Comparison
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headCellSx}>Surcharge</TableCell>
                  <TableCell sx={headCellSx} align="right">Buy Value</TableCell>
                  <TableCell sx={headCellSx} align="right">Sell Value</TableCell>
                  <TableCell sx={headCellSx} align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surchargeRows.map(row => (
                  <TableRow key={row.name} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={cellSx}>{row.name}</TableCell>
                    <TableCell sx={cellSx} align="right">{row.buyValue}</TableCell>
                    <TableCell sx={cellSx} align="right">{row.sellValue}</TableCell>
                    <TableCell sx={cellSx} align="center">
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontSize: 11,
                          height: 22,
                          fontWeight: 600,
                          bgcolor:
                            row.status === 'Matched'
                              ? 'success.50'
                              : row.status === 'No sell'
                                ? 'warning.50'
                                : 'info.50',
                          color:
                            row.status === 'Matched'
                              ? 'success.main'
                              : row.status === 'No sell'
                                ? 'warning.main'
                                : 'info.main',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      {/* ── Volume Simulation Setup ── */}
      {bothSelected && (
        <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Simulate with Merchant Volume
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select label="Merchant" value={merchantId}
              onChange={e => setMerchantId(e.target.value)}
              size="small" sx={{ minWidth: 220 }}
              slotProps={{ select: { displayEmpty: true } }}
            >
              <MenuItem value="" sx={{ fontSize: 12, color: '#9ca3af' }}>Select merchant...</MenuItem>
              {mockBillingEntities.map(e => (
                <MenuItem key={e.id} value={e.id} sx={{ fontSize: 12 }}>
                  {e.name} ({e.shipmentCount} shipments)
                </MenuItem>
              ))}
            </TextField>
            <TextField label="From" type="date" size="small" defaultValue="2026-01-01" sx={{ width: 150 }} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="To" type="date" size="small" defaultValue="2026-03-31" sx={{ width: 150 }} slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
        </Paper>
      )}

      {/* ── Volume-Weighted Results ── */}
      {bothSelected && merchant && volumeSim && (
        <>
          {/* KPI cards */}
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Volume-Weighted Simulation &mdash; {merchant.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 2 }}>
              Based on {volumeSim.totalShipments.toLocaleString()} shipments across {carrierShipments.length} carrier(s)
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              {/* Estimated Buy Total */}
              <Paper
                variant="outlined"
                sx={{ flex: '1 1 180px', p: 2, textAlign: 'center', bgcolor: 'grey.50' }}
              >
                <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                  Est. Buy Total
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                  {formatEur(volumeSim.estBuyTotal)}
                </Typography>
              </Paper>

              {/* Estimated Sell Total */}
              <Paper
                variant="outlined"
                sx={{ flex: '1 1 180px', p: 2, textAlign: 'center', bgcolor: 'grey.50' }}
              >
                <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                  Est. Sell Total
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
                  {formatEur(volumeSim.estSellTotal)}
                </Typography>
              </Paper>

              {/* Estimated Margin */}
              <Paper
                variant="outlined"
                sx={{
                  flex: '1 1 180px',
                  p: 2,
                  textAlign: 'center',
                  bgcolor: volumeSim.estMargin >= 0 ? 'success.50' : 'error.50',
                }}
              >
                <Typography sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                  Est. Margin
                </Typography>
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: volumeSim.estMargin >= 0 ? 'success.main' : 'error.main',
                  }}
                >
                  {formatEur(volumeSim.estMargin)}
                </Typography>
                <Typography sx={{ fontSize: 12, color: volumeSim.estMarginPct >= 0 ? 'success.main' : 'error.main' }}>
                  {formatPct(volumeSim.estMarginPct)}
                </Typography>
              </Paper>
            </Box>

            {/* Zone breakdown */}
            <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1 }}>Breakdown by Zone</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headCellSx}>Zone</TableCell>
                  <TableCell sx={headCellSx} align="right">Est. Volume</TableCell>
                  <TableCell sx={headCellSx} align="right">Avg Buy</TableCell>
                  <TableCell sx={headCellSx} align="right">Avg Sell</TableCell>
                  <TableCell sx={headCellSx} align="right">Est. Buy Total</TableCell>
                  <TableCell sx={headCellSx} align="right">Est. Sell Total</TableCell>
                  <TableCell sx={headCellSx} align="right">Est. Margin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {volumeSim.zoneBreakdown.map(zb => {
                  const margin = zb.sellTotal - zb.buyTotal;
                  return (
                    <TableRow key={zb.zone} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={cellSx}>{zb.zone}</TableCell>
                      <TableCell sx={cellSx} align="right">{zb.volume.toLocaleString()}</TableCell>
                      <TableCell sx={cellSx} align="right">{formatEur(zb.buyAvg)}</TableCell>
                      <TableCell sx={cellSx} align="right">{formatEur(zb.sellAvg)}</TableCell>
                      <TableCell sx={cellSx} align="right">{formatEur(zb.buyTotal)}</TableCell>
                      <TableCell sx={cellSx} align="right">{formatEur(zb.sellTotal)}</TableCell>
                      <TableCell
                        sx={{ ...cellSx, color: margin >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}
                        align="right"
                      >
                        {formatEur(margin)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      {/* Empty state */}
      {!bothSelected && (
        <Paper
          variant="outlined"
          sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}
        >
          <Typography sx={{ fontSize: 13 }}>
            Select both a buy rate card and a sell rate card above to see the margin comparison.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

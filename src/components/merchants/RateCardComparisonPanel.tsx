import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CarrierChip from '../rate-cards/CarrierChip';
import type { RateCard, BuyingRateCard, CarrierId, PricingZone, Surcharge } from '../../types/rateCard';

interface RateCardComparisonPanelProps {
  carrierId: CarrierId;
  buyingRateCard: BuyingRateCard;
  sellingRateCard: RateCard;
  onClose: () => void;
}

const fmtEur = (v: number) => `€${v.toFixed(2)}`;

function marginCell(buy: number, sell: number) {
  const diff = sell - buy;
  const pct = buy > 0 ? ((sell - buy) / buy) * 100 : 0;
  const positive = diff >= 0;
  return (
    <Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: positive ? '#16a34a' : '#dc2626' }}>
        {positive ? '+' : ''}{fmtEur(diff)}
      </Typography>
      <Typography sx={{ fontSize: 10, color: positive ? '#16a34a' : '#dc2626' }}>
        {positive ? '+' : ''}{pct.toFixed(1)}%
      </Typography>
    </Box>
  );
}

// Match zones by name
function matchZones(buyZones: PricingZone[], sellZones: PricingZone[]) {
  const matched: Array<{ zone: string; countries?: string[]; buyTiers: PricingZone['tiers']; sellTiers: PricingZone['tiers'] }> = [];
  const sellMap = new Map(sellZones.map(z => [z.zone, z]));
  const usedSellZones = new Set<string>();

  for (const bz of buyZones) {
    const sz = sellMap.get(bz.zone);
    matched.push({
      zone: bz.zone,
      countries: bz.countries ?? sz?.countries,
      buyTiers: bz.tiers,
      sellTiers: sz?.tiers ?? [],
    });
    if (sz) usedSellZones.add(bz.zone);
  }
  // Sell zones not in buy
  for (const sz of sellZones) {
    if (!usedSellZones.has(sz.zone)) {
      matched.push({ zone: sz.zone, countries: sz.countries, buyTiers: [], sellTiers: sz.tiers });
    }
  }
  return matched;
}

// Match surcharges by name
function matchSurcharges(buySurcharges: Surcharge[], sellSurcharges: Surcharge[]) {
  const matched: Array<{ name: string; buyValue: string | null; sellValue: string | null }> = [];
  const sellMap = new Map(sellSurcharges.map(s => [s.name, s.value]));
  const usedSell = new Set<string>();

  for (const bs of buySurcharges) {
    const sv = sellMap.get(bs.name) ?? null;
    matched.push({ name: bs.name, buyValue: bs.value, sellValue: sv });
    if (sv !== null) usedSell.add(bs.name);
  }
  for (const ss of sellSurcharges) {
    if (!usedSell.has(ss.name)) {
      matched.push({ name: ss.name, buyValue: null, sellValue: ss.value });
    }
  }
  return matched;
}

export default function RateCardComparisonPanel({ carrierId, buyingRateCard, sellingRateCard, onClose }: RateCardComparisonPanelProps) {
  const buyPricing = buyingRateCard.pricing;
  const sellPricing = sellingRateCard.pricing;

  const zones = matchZones(buyPricing?.zones ?? [], sellPricing?.zones ?? []);
  const surcharges = matchSurcharges(buyPricing?.surcharges ?? [], sellPricing?.surcharges ?? []);
  const unmatchedBuySurcharges = surcharges.filter(s => s.buyValue !== null && s.sellValue === null);

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e8ebf0', borderRadius: 2, mt: 1, mb: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, bgcolor: '#f8f9fb', borderBottom: '1px solid #e8ebf0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CarrierChip carrierId={carrierId} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={buyingRateCard.name} size="small" sx={{ fontSize: 11, fontWeight: 600, height: 24, bgcolor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }} />
            <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>vs</Typography>
            <Chip label={sellingRateCard.name} size="small" sx={{ fontSize: 11, fontWeight: 600, height: 24, bgcolor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }} />
          </Box>
          {unmatchedBuySurcharges.length > 0 && (
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
              label={`${unmatchedBuySurcharges.length} unmatched`}
              size="small"
              sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: '#fef3c7', color: '#92400e', '& .MuiChip-icon': { color: '#d97706' } }}
            />
          )}
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon sx={{ fontSize: 18, color: '#6b7280' }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 0 }}>
        {/* Zone comparison */}
        <Box sx={{ flex: 1, borderRight: '1px solid #e8ebf0' }}>
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f0f2f5' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Zone Pricing</Typography>
          </Box>
          {zones.map((zone) => (
            <Box key={zone.zone} sx={{ borderBottom: '1px solid #f0f2f5' }}>
              <Box sx={{ px: 2, py: 0.75, bgcolor: '#fafbfc' }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>
                  {zone.zone}
                  {zone.countries && <Typography component="span" sx={{ fontSize: 10, color: '#9ca3af', ml: 0.75 }}>({zone.countries.join(', ')})</Typography>}
                </Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', py: 0.25, width: '25%' }}>Weight</TableCell>
                    <TableCell align="right" sx={{ fontSize: 10, fontWeight: 600, color: '#1e40af', py: 0.25, width: '25%' }}>Buy</TableCell>
                    <TableCell align="right" sx={{ fontSize: 10, fontWeight: 600, color: '#16a34a', py: 0.25, width: '25%' }}>Sell</TableCell>
                    <TableCell align="right" sx={{ fontSize: 10, fontWeight: 600, color: '#6b7280', py: 0.25, width: '25%' }}>Margin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    // Merge tiers by weight
                    const allWeights = new Set([...zone.buyTiers.map(t => t.maxWeight), ...zone.sellTiers.map(t => t.maxWeight)]);
                    const sorted = [...allWeights].sort((a, b) => a - b);
                    const buyMap = new Map(zone.buyTiers.map(t => [t.maxWeight, t.price]));
                    const sellMap = new Map(zone.sellTiers.map(t => [t.maxWeight, t.price]));
                    return sorted.map(w => {
                      const bp = buyMap.get(w);
                      const sp = sellMap.get(w);
                      return (
                        <TableRow key={w} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell sx={{ fontSize: 11, color: '#374151', py: 0.4 }}>≤ {w} kg</TableCell>
                          <TableCell align="right" sx={{ fontSize: 11, color: bp != null ? '#1e40af' : '#d1d5db', py: 0.4 }}>
                            {bp != null ? fmtEur(bp) : '—'}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: 11, color: sp != null ? '#16a34a' : '#d1d5db', py: 0.4 }}>
                            {sp != null ? fmtEur(sp) : '—'}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 0.4 }}>
                            {bp != null && sp != null ? marginCell(bp, sp) : <Typography sx={{ fontSize: 11, color: '#d1d5db' }}>—</Typography>}
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            </Box>
          ))}
        </Box>

        {/* Surcharge comparison */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f0f2f5' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Surcharges</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', py: 0.25 }}>Charge</TableCell>
                <TableCell align="right" sx={{ fontSize: 10, fontWeight: 600, color: '#1e40af', py: 0.25 }}>Buy</TableCell>
                <TableCell align="right" sx={{ fontSize: 10, fontWeight: 600, color: '#16a34a', py: 0.25 }}>Sell</TableCell>
                <TableCell align="center" sx={{ fontSize: 10, fontWeight: 600, color: '#6b7280', py: 0.25 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surcharges.map((s) => {
                const isUnmatched = s.buyValue !== null && s.sellValue === null;
                const isSellOnly = s.buyValue === null && s.sellValue !== null;
                return (
                  <TableRow key={s.name} sx={{ bgcolor: isUnmatched ? '#fffbeb' : undefined, '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 11, fontWeight: 500, color: '#374151', py: 0.5 }}>
                      {s.name}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 11, color: s.buyValue ? '#1e40af' : '#d1d5db', py: 0.5 }}>
                      {s.buyValue ?? '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: 11, color: s.sellValue ? '#16a34a' : '#d1d5db', py: 0.5 }}>
                      {s.sellValue ?? '—'}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      {isUnmatched && (
                        <Chip icon={<WarningAmberIcon sx={{ fontSize: 12 }} />} label="No sell" size="small"
                          sx={{ fontSize: 9, fontWeight: 600, height: 18, bgcolor: '#fef3c7', color: '#92400e', '& .MuiChip-icon': { color: '#d97706' } }} />
                      )}
                      {isSellOnly && (
                        <Chip label="Sell only" size="small" sx={{ fontSize: 9, fontWeight: 500, height: 18, bgcolor: '#f0fdf4', color: '#16a34a' }} />
                      )}
                      {s.buyValue !== null && s.sellValue !== null && (
                        <Chip label="Matched" size="small" sx={{ fontSize: 9, fontWeight: 500, height: 18, bgcolor: '#f3f4f6', color: '#6b7280' }} />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Paper>
  );
}

import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CarrierChip from '../rate-cards/CarrierChip';
import RateCardDetailDrawer from './RateCardDetailDrawer';
import RateCardComparisonPanel from './RateCardComparisonPanel';
import { CARRIER_IDS } from '../../constants/rateCardConfig';
import { resolveRateCard, getCompatibleRateCards, calculatePriority } from '../../utils/rateCardResolver';
import { mockRateCards, mockMerchantGroups, mockAssignments as initialAssignments, mockBuyingRateCards, mockBuyingAssignments } from '../../data/mockRateCards';
import { mockCarrierShipments } from '../../data/mockMerchants';
import type { CarrierId, RateCard, BuyingRateCard, RateCardAssignment } from '../../types/rateCard';
import type { CarrierShipments } from '../../types/merchant';

interface MerchantRateCardsTabProps {
  merchantId: string;
}

// Confirmation dialog for rate card changes
interface PendingChange {
  type: 'buy' | 'sell';
  carrierId: CarrierId;
  rateCardName: string;
  rateCardValidFrom: string;
  rateCardValidTo: string;
  apply: () => void;
}

export default function MerchantRateCardsTab({ merchantId }: MerchantRateCardsTabProps) {
  const [assignments, setAssignments] = useState<RateCardAssignment[]>(initialAssignments);
  const [buyAssignments, setBuyAssignments] = useState(mockBuyingAssignments.filter(a => a.merchantId === merchantId));
  const [drawerRateCard, setDrawerRateCard] = useState<RateCard | BuyingRateCard | null>(null);
  const [expandedCarrier, setExpandedCarrier] = useState<CarrierId | null>(null);
  const [editingCarrier, setEditingCarrier] = useState<CarrierId | null>(null);

  // Confirmation dialog
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const [applyFrom, setApplyFrom] = useState('');
  const [applyUntil, setApplyUntil] = useState('');

  // Add carrier dialog
  const [addCarrierOpen, setAddCarrierOpen] = useState(false);
  const [newCarrierId, setNewCarrierId] = useState<CarrierId | ''>('');
  const [newBuyRateCardId, setNewBuyRateCardId] = useState('');

  const carrierShipments = mockCarrierShipments[merchantId] || [];
  const carrierShipmentMap = new Map<CarrierId, CarrierShipments>(
    carrierShipments.map(cs => [cs.carrierId, cs])
  );

  const buyingRateCardMap = new Map(mockBuyingRateCards.map(brc => [brc.id, brc]));

  const rows = useMemo(() => {
    // Get carriers that this merchant uses (from carrier shipments or buying assignments)
    const usedCarriers = new Set<CarrierId>();
    for (const cs of carrierShipments) usedCarriers.add(cs.carrierId);
    for (const ba of buyAssignments) usedCarriers.add(ba.carrierId);

    return [...usedCarriers].map(carrierId => {
      const resolved = resolveRateCard(merchantId, carrierId, assignments, mockRateCards, mockMerchantGroups);
      const cs = carrierShipmentMap.get(carrierId);
      const buyingAssignment = buyAssignments.find(a => a.carrierId === carrierId);
      const buyingRateCard = buyingAssignment ? buyingRateCardMap.get(buyingAssignment.buyingRateCardId) : null;

      const shipments = cs?.shipments ?? 0;
      const avgSelling = cs?.avgSellingPrice ?? 0;
      const avgBuying = cs?.avgBuyingPrice ?? 0;
      const margin = avgBuying > 0 ? ((avgSelling - avgBuying) / avgBuying) * 100 : null;

      const compatible = getCompatibleRateCards(carrierId, mockRateCards);

      return { carrierId, resolved, buyingRateCard, shipments, margin, compatible };
    }).filter(r => r.buyingRateCard !== null).sort((a, b) => b.shipments - a.shipments);
  }, [merchantId, assignments, carrierShipments, buyAssignments]);

  // Carriers not yet assigned AND that have buy rate cards available
  const availableCarriers = CARRIER_IDS.filter(cId =>
    !rows.some(r => r.carrierId === cId) &&
    mockBuyingRateCards.some(brc => brc.carrierId === cId)
  );

  // Buy rate cards for a given carrier
  const getBuyRateCardsForCarrier = (carrierId: CarrierId) =>
    mockBuyingRateCards.filter(brc => brc.carrierId === carrierId);

  function requestSellRateCardChange(carrierId: CarrierId, rateCardId: string) {
    const rc = mockRateCards.find(r => r.id === rateCardId);
    if (!rc) return;
    setPendingChange({
      type: 'sell',
      carrierId,
      rateCardName: rc.name,
      rateCardValidFrom: rc.validFrom,
      rateCardValidTo: rc.validTo,
      apply: () => {
        setAssignments(prev => {
          const filtered = prev.filter(a => !(
            a.scope.type === 'merchant' && a.scope.merchantId === merchantId && a.carrierId === carrierId
          ));
          const scope = { type: 'merchant' as const, merchantId };
          return [...filtered, {
            id: `asgn-dyn-${Date.now()}`,
            rateCardId,
            carrierId,
            scope,
            priority: calculatePriority(scope, carrierId),
            createdAt: new Date().toISOString().slice(0, 10),
          }];
        });
      },
    });
    setApplyFrom(rc.validFrom);
    setApplyUntil(rc.validTo);
  }

  function confirmChange() {
    if (!pendingChange || !applyFrom) return;
    pendingChange.apply();
    setPendingChange(null);
  }

  function handleAddCarrier() {
    if (!newCarrierId || !newBuyRateCardId) return;
    setBuyAssignments(prev => [...prev, {
      id: `basgn-new-${Date.now()}`,
      buyingRateCardId: newBuyRateCardId,
      carrierId: newCarrierId,
      merchantId,
      createdAt: new Date().toISOString().slice(0, 10),
    }]);
    setAddCarrierOpen(false);
    setNewCarrierId('');
    setNewBuyRateCardId('');
  }

  function handleChangeBuyRateCard(carrierId: CarrierId, newBuyRcId: string) {
    const brc = mockBuyingRateCards.find(r => r.id === newBuyRcId);
    if (!brc) return;
    setPendingChange({
      type: 'buy',
      carrierId,
      rateCardName: brc.name,
      rateCardValidFrom: brc.validFrom,
      rateCardValidTo: brc.validTo,
      apply: () => {
        setBuyAssignments(prev => prev.map(a =>
          a.carrierId === carrierId && a.merchantId === merchantId
            ? { ...a, buyingRateCardId: newBuyRcId }
            : a
        ));
      },
    });
    setApplyFrom(brc.validFrom);
    setApplyUntil(brc.validTo);
  }

  function handleRemoveCarrier(carrierId: CarrierId) {
    setBuyAssignments(prev => prev.filter(a => !(a.carrierId === carrierId && a.merchantId === merchantId)));
    setAssignments(prev => prev.filter(a => !(a.scope.type === 'merchant' && a.scope.merchantId === merchantId && a.carrierId === carrierId)));
    setEditingCarrier(null);
  }

  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, overflow: 'hidden' }}>
      {/* Add carrier button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5, borderBottom: '1px solid #f0f2f5' }}>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setAddCarrierOpen(true)}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12 }}>
          Add Carrier
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafbfc' }}>
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280' }}>Carrier</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280' }}>Buy Rate Card</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280' }}>Account Numbers</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280' }}>Sell Rate Card</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280' }}>Margin</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280' }}>Shipments</TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280', width: 90 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <React.Fragment key={row.carrierId}>
              <TableRow>
                <TableCell><CarrierChip carrierId={row.carrierId} /></TableCell>
                {/* Buy Rate Card */}
                <TableCell>
                  {row.buyingRateCard ? (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <Chip label={row.buyingRateCard.name} size="small"
                        sx={{ bgcolor: '#eff6ff', color: '#1e40af', fontWeight: 500, fontSize: 11, height: 24, border: '1px solid #bfdbfe' }} />
                      <IconButton size="small" onClick={() => setDrawerRateCard(row.buyingRateCard!)} sx={{ p: 0.25 }}>
                        <VisibilityIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Chip icon={<WarningAmberIcon sx={{ fontSize: 12 }} />} label="No buy rate" size="small"
                      sx={{ fontSize: 10, fontWeight: 600, height: 22, bgcolor: '#fee2e2', color: '#991b1b', '& .MuiChip-icon': { color: '#dc2626' } }} />
                  )}
                </TableCell>
                {/* Account Numbers */}
                <TableCell>
                  {row.buyingRateCard?.accountNumbers?.length ? (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {row.buyingRateCard.accountNumbers.map(acc => (
                        <Chip key={acc} label={acc} size="small" variant="outlined"
                          sx={{ fontSize: 10, fontWeight: 500, height: 20, color: '#374151', borderColor: '#d1d5db' }} />
                      ))}
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>
                  )}
                </TableCell>
                {/* Sell Rate Card */}
                <TableCell>
                  {row.buyingRateCard ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TextField select size="small"
                        value={row.resolved?.rateCard.id ?? ''}
                        onChange={(e) => { if (e.target.value) requestSellRateCardChange(row.carrierId, e.target.value); }}
                        sx={{
                          minWidth: 150,
                          '& .MuiOutlinedInput-root': { fontSize: 12, fontWeight: 500, color: '#166534', bgcolor: '#f0fdf4', '& fieldset': { borderColor: '#bbf7d0' } },
                          '& .MuiSelect-select': { py: 0.5, px: 1 },
                        }}
                        slotProps={{ select: { displayEmpty: true } }}
                      >
                        <MenuItem value="" sx={{ fontSize: 12, color: '#9ca3af' }}>Select sell rate...</MenuItem>
                        {row.compatible.map(rc => (
                          <MenuItem key={rc.id} value={rc.id} sx={{ fontSize: 12 }}>{rc.name}</MenuItem>
                        ))}
                      </TextField>
                      {row.resolved && (
                        <IconButton size="small" onClick={() => setDrawerRateCard(row.resolved!.rateCard)} sx={{ p: 0.25 }}>
                          <VisibilityIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                        </IconButton>
                      )}
                    </Box>
                  ) : (
                    <Tooltip title="Assign a buy rate card first">
                      <Typography sx={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>Assign buy rate first</Typography>
                    </Tooltip>
                  )}
                </TableCell>
                {/* Margin */}
                <TableCell align="right">
                  {row.margin !== null && row.shipments > 0 ? (
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: row.margin >= 0 ? '#059669' : '#dc2626' }}>
                      {row.margin >= 0 ? '+' : ''}{row.margin.toFixed(1)}%
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>&mdash;</Typography>
                  )}
                </TableCell>
                {/* Shipments */}
                <TableCell align="right">
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {row.shipments > 0 ? row.shipments.toLocaleString() : <Box component="span" sx={{ color: '#9ca3af' }}>&mdash;</Box>}
                  </Typography>
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit carrier setup">
                      <IconButton size="small" onClick={() => setEditingCarrier(editingCarrier === row.carrierId ? null : row.carrierId)}>
                        <EditIcon sx={{ fontSize: 16, color: editingCarrier === row.carrierId ? '#3b82f6' : '#6b7280' }} />
                      </IconButton>
                    </Tooltip>
                    {row.buyingRateCard && row.resolved && (
                      <Tooltip title="Compare buy vs sell">
                        <IconButton size="small" onClick={() => setExpandedCarrier(expandedCarrier === row.carrierId ? null : row.carrierId)}>
                          <CompareArrowsIcon sx={{ fontSize: 16, color: expandedCarrier === row.carrierId ? '#3b82f6' : '#6b7280' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>

              {/* Edit panel */}
              {editingCarrier === row.carrierId && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <Box sx={{ px: 2, py: 2, bgcolor: '#f8f9fb', borderBottom: '1px solid #e8ebf0' }}>
                      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                        {/* Change Buy Rate Card */}
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.75 }}>
                            Buy Rate Card
                          </Typography>
                          <TextField select size="small" fullWidth
                            value={row.buyingRateCard?.id ?? ''}
                            onChange={(e) => handleChangeBuyRateCard(row.carrierId, e.target.value)}
                            sx={{ bgcolor: '#fff', '& .MuiSelect-select': { fontSize: 12 } }}
                          >
                            {getBuyRateCardsForCarrier(row.carrierId).map(brc => (
                              <MenuItem key={brc.id} value={brc.id} sx={{ fontSize: 12 }}>
                                <Box>
                                  <Typography sx={{ fontSize: 12 }}>{brc.name}</Typography>
                                  <Typography sx={{ fontSize: 10, color: '#6b7280' }}>{brc.accountNumbers?.join(', ')}</Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>

                        {/* Account Numbers */}
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.75 }}>
                            Account Numbers
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {row.buyingRateCard?.accountNumbers?.map(acc => (
                              <Chip key={acc} label={acc} size="small" sx={{ fontSize: 11, height: 24 }} />
                            )) ?? <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>—</Typography>}
                          </Box>
                        </Box>

                        {/* Validity */}
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.75 }}>
                            Validity
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: '#374151' }}>
                            {row.buyingRateCard ? `${row.buyingRateCard.validFrom} — ${row.buyingRateCard.validTo}` : '—'}
                          </Typography>
                        </Box>

                        {/* Remove carrier */}
                        <Box>
                          <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
                            onClick={() => handleRemoveCarrier(row.carrierId)}
                            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 11, mt: 2 }}>
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {/* Comparison panel */}
              {expandedCarrier === row.carrierId && row.buyingRateCard && row.resolved && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <Box sx={{ px: 1 }}>
                      <RateCardComparisonPanel
                        carrierId={row.carrierId}
                        buyingRateCard={row.buyingRateCard}
                        sellingRateCard={row.resolved.rateCard}
                        onClose={() => setExpandedCarrier(null)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Rate Card Detail Drawer */}
      <RateCardDetailDrawer
        rateCard={drawerRateCard}
        open={drawerRateCard !== null}
        onClose={() => setDrawerRateCard(null)}
      />

      {/* Rate Card Change Confirmation Dialog */}
      <Dialog open={!!pendingChange} onClose={() => setPendingChange(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>
          Confirm Rate Card Change
        </DialogTitle>
        {pendingChange && (
          <DialogContent>
            <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 2 }}>
              Changing the {pendingChange.type === 'sell' ? 'sell' : 'buy'} rate card to <strong>{pendingChange.rateCardName}</strong> will
              impact the pricing of all shipments within the selected period.
            </Typography>

            <Box sx={{ p: 1.5, bgcolor: '#f8f9fb', borderRadius: 1, border: '1px solid #e8ebf0', mb: 2 }}>
              <Typography sx={{ fontSize: 11, color: '#6b7280', mb: 0.5 }}>
                Rate card valid: {pendingChange.rateCardValidFrom} — {pendingChange.rateCardValidTo}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Apply From *"
                type="date"
                size="small"
                value={applyFrom}
                onChange={(e) => setApplyFrom(e.target.value)}
                fullWidth
                required
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: pendingChange.rateCardValidFrom, max: pendingChange.rateCardValidTo } }}
              />
              <TextField
                label="Apply Until"
                type="date"
                size="small"
                value={applyUntil}
                onChange={(e) => setApplyUntil(e.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: applyFrom || pendingChange.rateCardValidFrom, max: pendingChange.rateCardValidTo } }}
              />
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPendingChange(null)} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button variant="contained" disabled={!applyFrom} onClick={confirmChange}>
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Carrier Dialog */}
      <Dialog open={addCarrierOpen} onClose={() => setAddCarrierOpen(false)} maxWidth="sm" fullWidth
        slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.3)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Add Carrier</DialogTitle>
        <DialogContent sx={{ overflow: 'visible' }}>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 2.5 }}>
            Select a buy rate card to add a carrier. The carrier is determined by the buy rate card.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Select by buy rate card (which determines the carrier) */}
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.75 }}>
                Buy Rate Card
              </Typography>
              <TextField
                select size="small" value={newBuyRateCardId}
                onChange={(e) => {
                  setNewBuyRateCardId(e.target.value);
                  const brc = mockBuyingRateCards.find(b => b.id === e.target.value);
                  if (brc) setNewCarrierId(brc.carrierId);
                }}
                fullWidth
                slotProps={{ select: { displayEmpty: true } }}
              >
                <MenuItem value="" sx={{ fontSize: 13, color: '#9ca3af' }}>Select buy rate card...</MenuItem>
                {mockBuyingRateCards
                  .filter(brc => !rows.some(r => r.carrierId === brc.carrierId))
                  .map(brc => (
                    <MenuItem key={brc.id} value={brc.id} sx={{ fontSize: 13, py: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CarrierChip carrierId={brc.carrierId} size="small" />
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{brc.name}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 10, color: '#6b7280', mt: 0.25 }}>
                          {brc.accountNumbers?.join(', ')} · {brc.validFrom} – {brc.validTo}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            {/* Show selected details */}
            {newBuyRateCardId && (() => {
              const brc = mockBuyingRateCards.find(b => b.id === newBuyRateCardId);
              if (!brc) return null;
              return (
                <Box sx={{ p: 1.5, bgcolor: '#f8f9fb', borderRadius: 1.5, border: '1px solid #e8ebf0' }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Carrier</Typography>
                      <Box sx={{ mt: 0.5 }}><CarrierChip carrierId={brc.carrierId} /></Box>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Account Numbers</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        {brc.accountNumbers?.map(acc => (
                          <Chip key={acc} label={acc} size="small" variant="outlined" sx={{ fontSize: 10, height: 20 }} />
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Valid</Typography>
                      <Typography sx={{ fontSize: 12, color: '#374151', mt: 0.5 }}>{brc.validFrom} – {brc.validTo}</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })()}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setAddCarrierOpen(false); setNewCarrierId(''); setNewBuyRateCardId(''); }} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button variant="contained" disabled={!newCarrierId || !newBuyRateCardId} onClick={handleAddCarrier}>
            Add Carrier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

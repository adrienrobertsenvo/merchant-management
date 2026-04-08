import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import CarrierChip from './CarrierChip';
import MenuItem from '@mui/material/MenuItem';
import { CARRIER_IDS } from '../../constants/rateCardConfig';
import type { RateCard, RateCardAssignment, PricingZone, Surcharge, CarrierId } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

interface RateCardDetailProps {
  rateCard: RateCard;
  assignments: RateCardAssignment[];
  entities: BillingEntity[];
  onBack: () => void;
  onSave: (id: string, data: Omit<RateCard, 'id' | 'createdAt'>) => void;
  onAssign: (merchantId: string, carrierId: CarrierId | '*', rateCardId: string) => void;
  onRemoveAssignment: (merchantId: string, carrierId: CarrierId | '*') => void;
}

export default function RateCardDetail({ rateCard, assignments, entities, onBack, onSave, onAssign, onRemoveAssignment }: RateCardDetailProps) {
  const [name, setName] = useState(rateCard.name);
  const [description, setDescription] = useState(rateCard.description);
  const [validFrom, setValidFrom] = useState(rateCard.validFrom);
  const [validTo, setValidTo] = useState(rateCard.validTo);
  const [zones, setZones] = useState<PricingZone[]>(rateCard.pricing?.zones ?? []);
  const [surcharges, setSurcharges] = useState<Surcharge[]>(rateCard.pricing?.surcharges ?? []);
  const [editingName, setEditingName] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Bulk adjust dialog
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [adjustPct, setAdjustPct] = useState('');

  // Merchant assignment confirmation
  const [pendingMerchant, setPendingMerchant] = useState<{ merchantId: string; merchantName: string; carrierId: CarrierId } | null>(null);
  const [assignApplyFrom, setAssignApplyFrom] = useState('');
  const [assignApplyUntil, setAssignApplyUntil] = useState('');

  // Save confirmation
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const markChanged = () => setHasChanges(true);

  const handleSave = () => {
    // If there are assigned merchants, require confirmation
    if (assignedMerchants.length > 0) {
      setSaveConfirmOpen(true);
      return;
    }
    doSave();
  };

  const doSave = () => {
    onSave(rateCard.id, {
      name: name.trim(),
      markup: rateCard.markup,
      carrierId: rateCard.carrierId,
      description,
      validFrom,
      validTo,
      pricing: { zones, surcharges },
    });
    setHasChanges(false);
    setSaveConfirmOpen(false);
  };

  // Bulk adjust — apply % increase/decrease to all zone tier prices
  const handleBulkAdjust = () => {
    const pct = parseFloat(adjustPct);
    if (isNaN(pct)) return;
    const factor = 1 + pct / 100;
    setZones(prev => prev.map(z => ({
      ...z,
      tiers: z.tiers.map(t => ({ ...t, price: Math.round(t.price * factor * 100) / 100 })),
    })));
    // Also adjust fixed-euro surcharges
    setSurcharges(prev => prev.map(s => {
      if (s.value.startsWith('€')) {
        const num = parseFloat(s.value.slice(1));
        if (!isNaN(num)) return { ...s, value: `€${(num * factor).toFixed(2)}` };
      }
      return s;
    }));
    setAdjustDialogOpen(false);
    setAdjustPct('');
    markChanged();
  };

  // Zone tier editing
  const updateTierPrice = (zoneIdx: number, tierIdx: number, price: number) => {
    setZones(prev => prev.map((z, zi) => zi === zoneIdx ? { ...z, tiers: z.tiers.map((t, ti) => ti === tierIdx ? { ...t, price } : t) } : z));
    markChanged();
  };

  const updateTierWeight = (zoneIdx: number, tierIdx: number, maxWeight: number) => {
    setZones(prev => prev.map((z, zi) => zi === zoneIdx ? { ...z, tiers: z.tiers.map((t, ti) => ti === tierIdx ? { ...t, maxWeight } : t) } : z));
    markChanged();
  };

  const addTier = (zoneIdx: number) => {
    setZones(prev => prev.map((z, zi) => zi === zoneIdx ? { ...z, tiers: [...z.tiers, { maxWeight: 31.5, price: 0 }] } : z));
    markChanged();
  };

  const removeTier = (zoneIdx: number, tierIdx: number) => {
    setZones(prev => prev.map((z, zi) => zi === zoneIdx ? { ...z, tiers: z.tiers.filter((_, ti) => ti !== tierIdx) } : z));
    markChanged();
  };

  const updateZoneName = (zoneIdx: number, zoneName: string) => {
    setZones(prev => prev.map((z, zi) => zi === zoneIdx ? { ...z, zone: zoneName } : z));
    markChanged();
  };

  const addZone = () => {
    setZones(prev => [...prev, { zone: `Zone ${prev.length + 1}`, tiers: [{ maxWeight: 3, price: 0 }, { maxWeight: 5, price: 0 }, { maxWeight: 10, price: 0 }, { maxWeight: 31.5, price: 0 }] }]);
    markChanged();
  };

  const removeZone = (zoneIdx: number) => {
    setZones(prev => prev.filter((_, i) => i !== zoneIdx));
    markChanged();
  };

  const updateSurcharge = (idx: number, field: 'name' | 'value', val: string) => {
    setSurcharges(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
    markChanged();
  };

  const addSurcharge = () => {
    setSurcharges(prev => [...prev, { name: '', value: '' }]);
    markChanged();
  };

  const removeSurcharge = (idx: number) => {
    setSurcharges(prev => prev.filter((_, i) => i !== idx));
    markChanged();
  };

  // Stats
  const totalTiers = zones.reduce((s, z) => s + z.tiers.length, 0);
  const avgPrice = totalTiers > 0
    ? zones.reduce((s, z) => s + z.tiers.reduce((ts, t) => ts + t.price, 0), 0) / totalTiers
    : 0;

  // Assigned merchants & carriers
  const rcAssignments = assignments.filter(a => a.rateCardId === rateCard.id);
  const assignedMerchantMap = new Map<string, Set<CarrierId>>();
  for (const a of rcAssignments) {
    if (a.scope.type === 'merchant') {
      if (!assignedMerchantMap.has(a.scope.merchantId)) assignedMerchantMap.set(a.scope.merchantId, new Set());
      if (a.carrierId === '*') {
        // all carriers — don't add specific
      } else {
        assignedMerchantMap.get(a.scope.merchantId)!.add(a.carrierId);
      }
    } else if (a.scope.type === 'global') {
      // global assignment — applies to all merchants
    }
  }
  const assignedMerchants = [...assignedMerchantMap.entries()].map(([mId, carriers]) => ({
    entity: entities.find(e => e.id === mId),
    carriers: [...carriers],
  })).filter(m => m.entity);
  const isGlobal = rcAssignments.some(a => a.scope.type === 'global');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Button onClick={onBack} startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          sx={{ color: '#64748b', textTransform: 'none', fontWeight: 500, fontSize: 13, px: 1.5, py: 0.5, minWidth: 'auto', '&:hover': { bgcolor: '#f1f5f9' } }}>
          Back
        </Button>

        {editingName ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField size="small" value={name} onChange={(e) => { setName(e.target.value); markChanged(); }} autoFocus
              sx={{ '& .MuiOutlinedInput-root': { fontSize: 18, fontWeight: 700 } }} />
            <IconButton size="small" onClick={() => setEditingName(false)} sx={{ color: '#16a34a' }}>
              <CheckIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: '#1e293b' }}>{name}</Typography>
            <IconButton size="small" onClick={() => setEditingName(true)}>
              <EditIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
            onClick={() => { setAdjustDialogOpen(true); setAdjustPct(''); }}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12, color: '#374151', borderColor: '#d1d5db' }}>
            Bulk Adjust Prices
          </Button>
          {hasChanges && (
            <Button variant="contained" size="small" startIcon={<SaveIcon sx={{ fontSize: 16 }} />} onClick={handleSave}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: 13 }}>
              Save Changes
            </Button>
          )}
        </Box>
      </Box>

      {/* Info bar */}
      <Paper elevation={0} sx={{ border: '1px solid #e8ebf0', borderRadius: 2, p: 2, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px auto', gap: 2, alignItems: 'end' }}>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.5 }}>Description</Typography>
            <TextField size="small" value={description} onChange={(e) => { setDescription(e.target.value); markChanged(); }}
              fullWidth placeholder="Rate card description..." sx={{ '& .MuiOutlinedInput-root': { fontSize: 12 } }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.5 }}>Apply From</Typography>
            <TextField size="small" type="date" value={validFrom} onChange={(e) => { setValidFrom(e.target.value); markChanged(); }}
              fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3, mb: 0.5 }}>Apply Until</Typography>
            <TextField size="small" type="date" value={validTo} onChange={(e) => { setValidTo(e.target.value); markChanged(); }}
              fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 11, color: '#6b7280' }}>{zones.length} zones · {totalTiers} tiers · {surcharges.length} surcharges</Typography>
            <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Avg price: €{avgPrice.toFixed(2)}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Assigned Merchants */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
            Assigned to {assignedMerchants.length} Merchant{assignedMerchants.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Existing assignments — each merchant as a row with carrier toggles */}
        {assignedMerchants.length === 0 && !isGlobal && (
          <Typography sx={{ fontSize: 13, color: '#9ca3af', mb: 1.5 }}>
            This rate card is not assigned to any merchants yet. Add one below.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {assignedMerchants.map(({ entity, carriers }) => {
            const merchantCarriers = entity!.carrierIds ?? CARRIER_IDS;
            return (
              <Paper key={entity!.id} elevation={0} sx={{ border: '1px solid #e8ebf0', borderRadius: 1.5, px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', minWidth: 140 }}>
                  {entity!.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', flex: 1 }}>
                  {merchantCarriers.map(cId => {
                    const isActive = carriers.includes(cId);
                    return (
                      <Chip
                        key={cId}
                        label={<CarrierChip carrierId={cId} size="small" />}
                        size="small"
                        onClick={() => {
                          if (isActive) {
                            onRemoveAssignment(entity!.id, cId);
                          } else {
                            onAssign(entity!.id, cId, rateCard.id);
                          }
                        }}
                        sx={{
                          height: 28,
                          bgcolor: isActive ? undefined : '#f3f4f6',
                          opacity: isActive ? 1 : 0.4,
                          cursor: 'pointer',
                          border: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                          '& .MuiChip-label': { px: 0.5 },
                          '&:hover': { opacity: 1 },
                          transition: 'all 0.15s',
                        }}
                      />
                    );
                  })}
                </Box>
                <Tooltip title={`Remove ${entity!.name}`}>
                  <IconButton size="small" onClick={() => {
                    // Remove all carrier assignments for this merchant
                    for (const c of carriers) onRemoveAssignment(entity!.id, c);
                  }}>
                    <CloseIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                  </IconButton>
                </Tooltip>
              </Paper>
            );
          })}
        </Box>

        {/* Add merchant */}
        {(() => {
          const unassignedEntities = entities.filter(e => !e.archived && !assignedMerchantMap.has(e.id));
          if (unassignedEntities.length === 0) return null;
          return (
            <TextField
              select
              size="small"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  const ent = entities.find(en => en.id === e.target.value);
                  const firstCarrier = ent?.carrierIds?.[0] ?? CARRIER_IDS[0];
                  setPendingMerchant({ merchantId: e.target.value, merchantName: ent?.name ?? '', carrierId: firstCarrier });
                  setAssignApplyFrom(rateCard.validFrom);
                  setAssignApplyUntil(rateCard.validTo);
                }
              }}
              sx={{ width: 280, '& .MuiSelect-select': { fontSize: 13 } }}
              slotProps={{ select: { displayEmpty: true } }}
            >
              <MenuItem value="" sx={{ fontSize: 13, color: '#9ca3af' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                  Add merchant...
                </Box>
              </MenuItem>
              {unassignedEntities.sort((a, b) => a.name.localeCompare(b.name)).map(ent => (
                <MenuItem key={ent.id} value={ent.id} sx={{ fontSize: 13 }}>{ent.name}</MenuItem>
              ))}
            </TextField>
          );
        })()}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Pricing Zones */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Pricing Zones</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addZone} sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12 }}>
          Add Zone
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2, mb: 3 }}>
        {zones.map((zone, zIdx) => (
          <Paper key={zIdx} elevation={0} sx={{ border: '1px solid #e8ebf0', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: '#f9fafb', px: 2, py: 1, borderBottom: '1px solid #e8ebf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField size="small" value={zone.zone} onChange={(e) => updateZoneName(zIdx, e.target.value)}
                variant="standard" slotProps={{ input: { disableUnderline: true, sx: { fontSize: 13, fontWeight: 600, color: '#111827' } } }} />
              {zone.countries && (
                <Typography sx={{ fontSize: 10, color: '#6b7280' }}>({zone.countries.join(', ')})</Typography>
              )}
              <Tooltip title="Remove zone">
                <IconButton size="small" onClick={() => removeZone(zIdx)} sx={{ ml: 1 }}>
                  <DeleteIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', py: 0.5 }}>Max Weight (kg)</TableCell>
                  <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', py: 0.5 }}>Price (€)</TableCell>
                  <TableCell sx={{ width: 36, py: 0.5 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {zone.tiers.map((tier, tIdx) => (
                  <TableRow key={tIdx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField size="small" type="number" value={tier.maxWeight}
                        onChange={(e) => updateTierWeight(zIdx, tIdx, parseFloat(e.target.value) || 0)}
                        sx={{ width: 80, '& .MuiOutlinedInput-root': { fontSize: 12 }, '& .MuiOutlinedInput-input': { py: 0.25, px: 0.75 } }} />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>
                      <TextField size="small" type="number" value={tier.price}
                        onChange={(e) => updateTierPrice(zIdx, tIdx, parseFloat(e.target.value) || 0)}
                        sx={{ width: 90, '& .MuiOutlinedInput-root': { fontSize: 12 }, '& .MuiOutlinedInput-input': { textAlign: 'right', py: 0.25, px: 0.75 } }} />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <IconButton size="small" onClick={() => removeTier(zIdx, tIdx)} sx={{ p: 0.25 }}>
                        <CloseIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ px: 2, py: 0.75, borderTop: '1px solid #f3f4f6' }}>
              <Button size="small" startIcon={<AddIcon sx={{ fontSize: 14 }} />} onClick={() => addTier(zIdx)}
                sx={{ textTransform: 'none', fontSize: 11, fontWeight: 500, color: '#6b7280', p: 0 }}>
                Add tier
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Surcharges */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Surcharges</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addSurcharge} sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12 }}>
          Add Surcharge
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e8ebf0', borderRadius: 2 }}>
        {surcharges.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>No surcharges defined. Click "Add Surcharge" to create one.</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>Name</TableCell>
                <TableCell sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', width: 180 }}>Value</TableCell>
                <TableCell sx={{ width: 40 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {surcharges.map((s, idx) => (
                <TableRow key={idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ py: 0.75 }}>
                    <TextField size="small" value={s.name} onChange={(e) => updateSurcharge(idx, 'name', e.target.value)}
                      placeholder="e.g. Fuel Surcharge" fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { fontSize: 12 }, '& .MuiOutlinedInput-input': { py: 0.5, px: 1 } }} />
                  </TableCell>
                  <TableCell sx={{ py: 0.75 }}>
                    <TextField size="small" value={s.value} onChange={(e) => updateSurcharge(idx, 'value', e.target.value)}
                      placeholder="e.g. €12.00 or 8.5%"
                      sx={{ '& .MuiOutlinedInput-root': { fontSize: 12 }, '& .MuiOutlinedInput-input': { py: 0.5, px: 1 } }} />
                  </TableCell>
                  <TableCell sx={{ py: 0.75 }}>
                    <IconButton size="small" onClick={() => removeSurcharge(idx)}>
                      <DeleteIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Bulk Adjust Dialog */}
      <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Bulk Adjust Prices</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 2 }}>
            Apply a percentage increase or decrease to all zone tier prices and fixed surcharges. Use positive values to increase, negative to decrease.
          </Typography>
          <TextField
            label="Adjustment (%)"
            type="number"
            size="small"
            value={adjustPct}
            onChange={(e) => setAdjustPct(e.target.value)}
            fullWidth
            autoFocus
            placeholder="e.g. 2 for +2%, -5 for -5%"
            helperText={adjustPct && !isNaN(parseFloat(adjustPct))
              ? `All prices will be ${parseFloat(adjustPct) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(adjustPct))}%`
              : undefined
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAdjustDialogOpen(false)} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button variant="contained" disabled={!adjustPct || isNaN(parseFloat(adjustPct))} onClick={handleBulkAdjust}>
            Apply Adjustment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Confirmation */}
      <Dialog open={saveConfirmOpen} onClose={() => setSaveConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Confirm Price Changes</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 1 }}>
            This rate card is assigned to <strong>{assignedMerchants.length} merchant{assignedMerchants.length !== 1 ? 's' : ''}</strong>.
            Saving these changes will impact the pricing of all shipments for these merchants.
          </Typography>
          <Box sx={{ p: 1.5, bgcolor: '#fef2f2', borderRadius: 1, border: '1px solid #fca5a5', mt: 1 }}>
            <Typography sx={{ fontSize: 12, color: '#991b1b', fontWeight: 500 }}>
              Affected merchants: {assignedMerchants.map(m => m.entity?.name).join(', ')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSaveConfirmOpen(false)} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button variant="contained" onClick={doSave}>
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Merchant Assignment Confirmation */}
      <Dialog open={!!pendingMerchant} onClose={() => setPendingMerchant(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Assign Rate Card</DialogTitle>
        {pendingMerchant && (
          <DialogContent>
            <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 2 }}>
              Assign <strong>{name}</strong> to <strong>{pendingMerchant.merchantName}</strong>. This will impact pricing for all shipments in the selected period.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Apply From *" type="date" size="small" value={assignApplyFrom}
                onChange={(e) => setAssignApplyFrom(e.target.value)} fullWidth required
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: rateCard.validFrom, max: rateCard.validTo } }} />
              <TextField label="Apply Until" type="date" size="small" value={assignApplyUntil}
                onChange={(e) => setAssignApplyUntil(e.target.value)} fullWidth
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: assignApplyFrom || rateCard.validFrom, max: rateCard.validTo } }} />
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPendingMerchant(null)} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button variant="contained" disabled={!assignApplyFrom} onClick={() => {
            if (pendingMerchant) {
              onAssign(pendingMerchant.merchantId, pendingMerchant.carrierId, rateCard.id);
              setPendingMerchant(null);
            }
          }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

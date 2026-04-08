import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CarrierChip from './CarrierChip';
import { calculatePriority } from '../../utils/rateCardResolver';
import type { CarrierId, RateCard, RateCardAssignment } from '../../types/rateCard';

interface BatchSelection {
  merchantId: string;
  merchantName: string;
  carrierIds: CarrierId[];
}

interface BatchAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  rateCards: RateCard[];
  selections: BatchSelection[];
  onBatchAssign: (assignments: Omit<RateCardAssignment, 'id' | 'createdAt'>[]) => void;
  // Legacy props (unused, kept for compatibility)
  entities?: unknown;
  groups?: unknown;
}

export default function BatchAssignmentDialog({
  open,
  onClose,
  rateCards,
  selections,
  onBatchAssign,
}: BatchAssignmentDialogProps) {
  const [selectedRateCardId, setSelectedRateCardId] = useState('');
  const [merchantDates, setMerchantDates] = useState<Record<string, { applyFrom: string; applyUntil: string }>>({});

  useEffect(() => {
    if (open) {
      setSelectedRateCardId('');
      const today = new Date().toISOString().slice(0, 10);
      const dates: Record<string, { applyFrom: string; applyUntil: string }> = {};
      for (const sel of selections) {
        dates[sel.merchantId] = { applyFrom: today, applyUntil: '' };
      }
      setMerchantDates(dates);
    }
  }, [open, selections]);

  const updateDate = (merchantId: string, field: 'applyFrom' | 'applyUntil', value: string) => {
    setMerchantDates(prev => ({ ...prev, [merchantId]: { ...prev[merchantId], [field]: value } }));
  };

  const allValidFromFilled = selections.every(s => merchantDates[s.merchantId]?.applyFrom);
  const totalAssignments = selections.reduce((sum, s) => sum + s.carrierIds.length, 0);
  const selectedRc = rateCards.find(r => r.id === selectedRateCardId);

  const handleConfirm = () => {
    if (!selectedRateCardId || !allValidFromFilled) return;
    const assignments: Omit<RateCardAssignment, 'id' | 'createdAt'>[] = [];
    for (const sel of selections) {
      for (const carrierId of sel.carrierIds) {
        const scope = { type: 'merchant' as const, merchantId: sel.merchantId };
        assignments.push({
          rateCardId: selectedRateCardId,
          carrierId,
          scope,
          priority: calculatePriority(scope, carrierId),
        });
      }
    }
    onBatchAssign(assignments);
    onClose();
  };

  if (selections.length === 0) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        Batch Assign Sell Rate Card
      </DialogTitle>
      <DialogContent>
        {/* Rate Card selection */}
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 1 }}>
          Sell Rate Card
        </Typography>
        <TextField
          select
          size="small"
          value={selectedRateCardId}
          onChange={(e) => setSelectedRateCardId(e.target.value)}
          fullWidth
          sx={{ mb: 3, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13, color: '#9ca3af' }}>Select a rate card…</MenuItem>
          {rateCards.map(rc => (
            <MenuItem key={rc.id} value={rc.id} sx={{ fontSize: 13 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                {rc.name}
                <Typography component="span" sx={{ ml: 'auto', fontSize: 11, color: '#6b7280' }}>{rc.pricing?.zones?.length ?? 0} zones</Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>

        {/* Merchant + carrier + dates table */}
        <Box sx={{ border: '1px solid #e8ebf0', borderRadius: 1.5, overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '160px 1fr 150px 150px', gap: 2, px: 2, py: 1, bgcolor: '#f8f9fb', borderBottom: '1px solid #e8ebf0', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Merchant</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Carriers</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Apply From *</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.3 }}>Apply Until</Typography>
          </Box>
          {/* Rows */}
          {selections.map(sel => (
            <Box
              key={sel.merchantId}
              sx={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 150px 150px',
                gap: 2,
                px: 2,
                py: 1.5,
                alignItems: 'center',
                borderBottom: '1px solid #f0f2f5',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                {sel.merchantName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {sel.carrierIds.map(cId => (
                  <CarrierChip key={cId} carrierId={cId} size="small" />
                ))}
              </Box>
              <TextField
                type="date"
                size="small"
                value={merchantDates[sel.merchantId]?.applyFrom ?? ''}
                onChange={(e) => updateDate(sel.merchantId, 'applyFrom', e.target.value)}
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="date"
                size="small"
                value={merchantDates[sel.merchantId]?.applyUntil ?? ''}
                onChange={(e) => updateDate(sel.merchantId, 'applyUntil', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          ))}
        </Box>

        {/* Summary */}
        {selectedRc && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f8f9fb', borderRadius: 1, border: '1px solid #e8ebf0' }}>
            <Typography sx={{ fontSize: 12, color: '#374151' }}>
              <strong>{selectedRc.name}</strong> → {selections.length} merchant{selections.length !== 1 ? 's' : ''}, {totalAssignments} assignment{totalAssignments !== 1 ? 's' : ''}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!selectedRateCardId || !allValidFromFilled}
          onClick={handleConfirm}
        >
          Confirm Assignment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

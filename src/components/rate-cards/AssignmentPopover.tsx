import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import UndoIcon from '@mui/icons-material/Undo';
import CarrierChip from './CarrierChip';
import RateCardPicker from './RateCardPicker';
import { formatPricingValue } from '../../utils/rateCardResolver';
import type { CarrierId, RateCard, ResolvedRateCard, CandidateAssignment } from '../../types/rateCard';

interface AssignmentPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  merchantName: string;
  carrierId: CarrierId;
  resolved: ResolvedRateCard | null;
  availableRateCards: RateCard[];
  candidates?: CandidateAssignment[];
  onAssign: (rateCardId: string) => void;
  onRemove: () => void;
}

export default function AssignmentPopover({
  anchorEl,
  onClose,
  merchantName,
  carrierId,
  resolved,
  availableRateCards,
  candidates = [],
  onAssign,
  onRemove,
}: AssignmentPopoverProps) {
  // Find the next inherited candidate (what would take over if we revert)
  const inheritedFallback = candidates.find(c => !c.isWinner && c.inherited);

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 380, p: 2, borderRadius: 2 } } }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827', mb: 0.25 }}>
          {merchantName}
        </Typography>
        <CarrierChip carrierId={carrierId} />
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Current resolution */}
      {resolved ? (
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
            Current Rate Card
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
              {resolved.rateCard.name}
            </Typography>
            <Chip
              label="Markup"
              size="small"
              sx={{
                height: 18,
                fontSize: 9,
                fontWeight: 600,
                bgcolor: '#dbeafe',
                color: '#1e40af',
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
            {formatPricingValue(resolved.rateCard)}
          </Typography>
          {resolved.inherited && (
            <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.25 }}>
              Inherited via {resolved.inheritedFrom}
            </Typography>
          )}
          {resolved.conflictCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
              <Typography sx={{ fontSize: 11, color: '#f59e0b' }}>
                {resolved.conflictCount} competing assignment{resolved.conflictCount !== 1 ? 's' : ''} at same priority
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
            Current Rate Card
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>
            No assignment
          </Typography>
        </Box>
      )}

      {/* Resolution chain */}
      {candidates.length > 1 && (
        <>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.75 }}>
              Resolution Chain
            </Typography>
            {candidates.map((c, i) => (
              <Box
                key={c.assignment.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  bgcolor: c.isWinner ? '#f0f7ff' : 'transparent',
                  mb: 0.25,
                }}
              >
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', width: 14, flexShrink: 0 }}>
                  {i + 1}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: c.isWinner ? 600 : 400, color: c.isWinner ? '#1d4ed8' : '#6b7280' }}>
                    {c.rateCard.name}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: '#9ca3af' }}>
                    {c.source === 'direct' ? 'Direct' : c.source === 'group' ? `via ${c.inheritedFrom}` : 'Global Default'}
                    {' · P'}{c.assignment.priority}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 10, color: '#6b7280', flexShrink: 0 }}>
                  {formatPricingValue(c.rateCard)}
                </Typography>
                {c.isWinner && (
                  <Chip label="Active" size="small" sx={{ height: 16, fontSize: 9, fontWeight: 700, bgcolor: '#dbeafe', color: '#1d4ed8' }} />
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      <Divider sx={{ mb: 1.5 }} />

      {/* Assign / Override */}
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.75 }}>
          {resolved && !resolved.inherited ? 'Change Assignment' : resolved?.inherited ? 'Override with Direct Assignment' : 'Assign Rate Card'}
        </Typography>
        <RateCardPicker
          rateCards={availableRateCards}
          carrierId={carrierId}
          value={resolved?.rateCard.id ?? null}
          onChange={(rateCardId) => { onAssign(rateCardId); onClose(); }}
        />
      </Box>

      {/* Revert to inherited — only if there's a direct override and an inherited fallback */}
      {resolved && !resolved.inherited && inheritedFallback && (
        <Button
          fullWidth
          size="small"
          startIcon={<UndoIcon sx={{ fontSize: 14 }} />}
          onClick={() => { onRemove(); onClose(); }}
          sx={{
            color: '#6b7280',
            fontWeight: 500,
            textTransform: 'none',
            justifyContent: 'flex-start',
            mb: 0.5,
            '&:hover': { bgcolor: '#f3f4f6' },
          }}
        >
          Revert to: {inheritedFallback.rateCard.name} (via {inheritedFallback.inheritedFrom})
        </Button>
      )}

      {/* Remove button — only if there's a direct (non-inherited) assignment */}
      {resolved && !resolved.inherited && (
        <Button
          fullWidth
          size="small"
          onClick={() => { onRemove(); onClose(); }}
          sx={{ color: '#dc2626', fontWeight: 500, textTransform: 'none', '&:hover': { bgcolor: '#fee2e2' } }}
        >
          Remove Direct Assignment
        </Button>
      )}
    </Popover>
  );
}

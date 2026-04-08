import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AssignmentPopover from './AssignmentPopover';
import type { CarrierId, RateCard, ResolvedRateCard, CandidateAssignment } from '../../types/rateCard';

interface AssignmentCellProps {
  merchantId: string;
  merchantName: string;
  carrierId: CarrierId;
  resolved: ResolvedRateCard | null;
  availableRateCards: RateCard[];
  candidates?: CandidateAssignment[];
  onAssign: (merchantId: string, carrierId: CarrierId, rateCardId: string) => void;
  onRemove: (merchantId: string, carrierId: CarrierId) => void;
}

export default function AssignmentCell({
  merchantId,
  merchantName,
  carrierId,
  resolved,
  availableRateCards,
  candidates = [],
  onAssign,
  onRemove,
}: AssignmentCellProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  // Detect if this is an override (direct assignment that overrides an inherited one)
  const isOverride = resolved && !resolved.inherited && candidates.some(c => !c.isWinner && c.inherited);

  if (!resolved) {
    return (
      <>
        <Box
          onClick={handleClick}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f3f4f6' },
            borderRadius: 1,
          }}
        >
          <Typography sx={{ fontSize: 12, color: '#d1d5db' }}>—</Typography>
        </Box>
        <AssignmentPopover
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          merchantName={merchantName}
          carrierId={carrierId}
          resolved={null}
          availableRateCards={availableRateCards}
          candidates={candidates}
          onAssign={(rateCardId) => onAssign(merchantId, carrierId, rateCardId)}
          onRemove={() => onRemove(merchantId, carrierId)}
        />
      </>
    );
  }

  const isDirect = !resolved.inherited;
  const hasConflict = resolved.conflictCount > 0;

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { bgcolor: '#f3f4f6' },
          borderRadius: 1,
          px: 0.5,
        }}
      >
        <Chip
          label={resolved.rateCard.name}
          size="small"
          variant={isDirect ? 'filled' : 'outlined'}
          sx={{
            maxWidth: '100%',
            height: 24,
            fontSize: 11,
            fontWeight: isDirect ? 600 : 400,
            bgcolor: isDirect ? (isOverride ? '#fef3c7' : '#eff6ff') : 'transparent',
            color: isDirect ? (isOverride ? '#92400e' : '#1d4ed8') : '#6b7280',
            borderColor: isDirect ? (isOverride ? '#fcd34d' : '#93c5fd') : '#d1d5db',
            borderStyle: isDirect ? 'solid' : 'dashed',
            '& .MuiChip-label': { px: 1 },
          }}
        />
        {isOverride && (
          <ArrowUpwardIcon sx={{ fontSize: 12, color: '#d97706', ml: 0.25, flexShrink: 0 }} />
        )}
        {hasConflict && (
          <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b', ml: 0.5, flexShrink: 0 }} />
        )}
      </Box>
      <AssignmentPopover
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        merchantName={merchantName}
        carrierId={carrierId}
        resolved={resolved}
        availableRateCards={availableRateCards}
        candidates={candidates}
        onAssign={(rateCardId) => onAssign(merchantId, carrierId, rateCardId)}
        onRemove={() => onRemove(merchantId, carrierId)}
      />
    </>
  );
}

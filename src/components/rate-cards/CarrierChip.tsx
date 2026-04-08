import Chip from '@mui/material/Chip';
import { CARRIERS } from '../../constants/rateCardConfig';
import type { CarrierId } from '../../types/rateCard';

interface CarrierChipProps {
  carrierId: CarrierId;
  size?: 'small' | 'medium';
}

export default function CarrierChip({ carrierId, size = 'small' }: CarrierChipProps) {
  const carrier = CARRIERS[carrierId] ?? { label: carrierId, color: '#9ca3af', textColor: '#fff' };
  return (
    <Chip
      label={carrier.label}
      size={size}
      sx={{
        bgcolor: carrier.color,
        color: carrier.textColor,
        fontWeight: 600,
        fontSize: size === 'small' ? 11 : 12,
        height: size === 'small' ? 22 : 28,
        border: 'none',
      }}
    />
  );
}

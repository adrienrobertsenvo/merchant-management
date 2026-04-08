import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import CarrierChip from './CarrierChip';
import { getCompatibleRateCards, formatPricingValue } from '../../utils/rateCardResolver';
import { CARRIER_IDS, CARRIERS } from '../../constants/rateCardConfig';
import type { CarrierId, RateCard } from '../../types/rateCard';

interface RateCardPickerProps {
  rateCards: RateCard[];
  carrierId?: CarrierId | '*';
  value: string | null;
  onChange: (rateCardId: string) => void;
}

export default function RateCardPicker({ rateCards, carrierId, value, onChange }: RateCardPickerProps) {
  const [search, setSearch] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<CarrierId | ''>('');

  const compatibleCards = useMemo(() => {
    if (carrierId && carrierId !== '*') {
      return getCompatibleRateCards(carrierId, rateCards);
    }
    return rateCards;
  }, [rateCards, carrierId]);

  const filteredCards = useMemo(() => {
    let result = compatibleCards;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(rc => rc.name.toLowerCase().includes(q));
    }
    if (carrierFilter) {
      result = result.filter(rc => !rc.carrierId || rc.carrierId === carrierFilter);
    }

    return result;
  }, [compatibleCards, search, carrierFilter]);

  return (
    <Box>
      <TextField
        placeholder="Search rate cards..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1 }}
      />

      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
        {!carrierId || carrierId === '*' ? (
          CARRIER_IDS.map(cId => (
            <Chip
              key={cId}
              label={CARRIERS[cId].label}
              size="small"
              onClick={() => setCarrierFilter(carrierFilter === cId ? '' : cId)}
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                bgcolor: carrierFilter === cId ? CARRIERS[cId].color : '#f3f4f6',
                color: carrierFilter === cId ? CARRIERS[cId].textColor : '#374151',
                '&:hover': { opacity: 0.85 },
              }}
            />
          ))
        ) : null}
      </Box>

      {/* Rate card list */}
      <List dense sx={{ maxHeight: 220, overflow: 'auto', border: '1px solid #e8ebf0', borderRadius: 1 }}>
        {filteredCards.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>No matching rate cards</Typography>
          </Box>
        ) : (
          filteredCards.map(rc => {
            const isSelected = rc.id === value;
            return (
              <ListItemButton
                key={rc.id}
                onClick={() => onChange(rc.id)}
                selected={isSelected}
                dense
                sx={{
                  py: 0.75,
                  '&.Mui-selected': { bgcolor: '#eff6ff' },
                  '&.Mui-selected:hover': { bgcolor: '#dbeafe' },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: isSelected ? 600 : 400, flex: 1 }}>
                        {rc.name}
                      </Typography>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6b7280', minWidth: 48, textAlign: 'right' }}>
                        {formatPricingValue(rc)}
                      </Typography>
                      {isSelected && <CheckIcon sx={{ fontSize: 16, color: '#3b82f6' }} />}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                      {rc.carrierId ? (
                        <CarrierChip carrierId={rc.carrierId} size="small" />
                      ) : (
                        <Typography component="span" sx={{ fontSize: 10, color: '#9ca3af' }}>Any carrier</Typography>
                      )}
                      <Typography component="span" sx={{ fontSize: 10, color: '#9ca3af' }}>
                        {rc.validFrom} – {rc.validTo}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            );
          })
        )}
      </List>
    </Box>
  );
}

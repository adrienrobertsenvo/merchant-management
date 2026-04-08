import { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CarrierChip from '../rate-cards/CarrierChip';
import { formatPricingValue } from '../../utils/rateCardResolver';
import type { RateCard, BuyingRateCard } from '../../types/rateCard';

interface RateCardDetailDrawerProps {
  rateCard: RateCard | BuyingRateCard | null;
  open: boolean;
  onClose: () => void;
  selectionMode?: boolean;
  selectedSurcharge?: string | null;
  onSelectSurcharge?: (name: string) => void;
}

function isSellingRateCard(rc: RateCard | BuyingRateCard): rc is RateCard {
  return 'markup' in rc;
}

export default function RateCardDetailDrawer({ rateCard, open, onClose, selectionMode, selectedSurcharge, onSelectSurcharge }: RateCardDetailDrawerProps) {
  const [surchargeSearch, setSurchargeSearch] = useState('');

  // Reset search when drawer opens/closes
  useEffect(() => {
    if (!open) setSurchargeSearch('');
  }, [open]);

  if (!rateCard) return null;

  const carrierId = isSellingRateCard(rateCard) ? rateCard.carrierId : rateCard.carrierId;
  const pricing = rateCard.pricing;

  const filteredSurcharges = pricing?.surcharges.filter(s =>
    !surchargeSearch || s.name.toLowerCase().includes(surchargeSearch.toLowerCase())
  ) ?? [];

  const handleSurchargeClick = (name: string) => {
    if (selectionMode && onSelectSurcharge) {
      onSelectSurcharge(name);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          p: 3,
          bgcolor: '#ffffff',
          color: '#111827',
          backgroundImage: 'none',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1, color: '#111827' }}>
            {rateCard.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            {carrierId && <CarrierChip carrierId={carrierId} />}
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
              {rateCard.validFrom} &ndash; {rateCard.validTo}
            </Typography>
          </Box>
          {isSellingRateCard(rateCard) ? (
            <Typography sx={{ fontSize: 13, color: '#374151', mt: 0.5 }}>
              Pricing: {formatPricingValue(rateCard)}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: 13, color: '#374151', mt: 0.5 }}>
              Contract: {rateCard.contractReference}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ mt: -0.5, color: '#6b7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2, borderColor: '#e5e7eb' }} />

      {!pricing ? (
        <Typography sx={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', mt: 4 }}>
          No pricing details available
        </Typography>
      ) : (
        <>
          {/* Pricing Zones */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pricing
            </Typography>
            {selectionMode && (
              <Chip
                label="Click to select"
                size="small"
                sx={{ fontSize: 10, fontWeight: 600, bgcolor: '#dbeafe', color: '#1e40af', height: 20 }}
              />
            )}
          </Box>

          {selectionMode && isSellingRateCard(rateCard) && (() => {
            const isSelected = selectedSurcharge === 'Base Product';
            return (
              <Box
                onClick={() => handleSurchargeClick('Base Product')}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.75,
                  px: 1,
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: isSelected ? '#bfdbfe' : '#eff6ff' },
                  ...(isSelected ? { bgcolor: '#dbeafe' } : {}),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {isSelected && <CheckCircleIcon sx={{ fontSize: 16, color: '#2563eb' }} />}
                  <Typography sx={{ fontSize: 13, color: '#374151', fontWeight: isSelected ? 600 : 500 }}>
                    Base Product
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>
                  {formatPricingValue(rateCard)}
                </Typography>
              </Box>
            );
          })()}

          {pricing.zones.map((zone) => (
            <Box key={zone.zone} sx={{ mb: 2, border: '1px solid #e5e7eb', borderRadius: 1, overflow: 'hidden', bgcolor: '#ffffff' }}>
              <Box sx={{ bgcolor: '#f9fafb', px: 1.5, py: 0.75, borderBottom: '1px solid #e5e7eb' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                  {zone.zone}
                  {zone.countries && (
                    <Box component="span" sx={{ fontWeight: 400, color: '#6b7280', ml: 0.5 }}>
                      ({zone.countries.join(', ')})
                    </Box>
                  )}
                </Typography>
              </Box>
              <Table size="small" sx={{ bgcolor: '#ffffff' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 11, color: '#6b7280', py: 0.5, bgcolor: '#ffffff', borderColor: '#e5e7eb' }}>Weight</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: 11, color: '#6b7280', py: 0.5, bgcolor: '#ffffff', borderColor: '#e5e7eb' }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {zone.tiers.map((tier) => (
                    <TableRow key={tier.maxWeight} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ fontSize: 13, color: '#374151', py: 0.5, bgcolor: '#ffffff', borderColor: '#e5e7eb' }}>
                        Up to {tier.maxWeight.toFixed(1)} kg
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 13, fontWeight: 500, color: '#111827', py: 0.5, bgcolor: '#ffffff', borderColor: '#e5e7eb' }}>
                        &euro;{tier.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}

          <Divider sx={{ my: 2, borderColor: '#e5e7eb' }} />

          {/* Surcharges */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Surcharges
            </Typography>
            {selectionMode && (
              <Chip
                label="Click to select"
                size="small"
                sx={{ fontSize: 10, fontWeight: 600, bgcolor: '#dbeafe', color: '#1e40af', height: 20 }}
              />
            )}
          </Box>

          {selectionMode && (
            <TextField
              placeholder="Search surcharges..."
              size="small"
              fullWidth
              value={surchargeSearch}
              onChange={(e) => setSurchargeSearch(e.target.value)}
              sx={{ mb: 1.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                  sx: { fontSize: 13 },
                },
              }}
            />
          )}

          {filteredSurcharges.map((surcharge) => {
            const isSelected = selectionMode && selectedSurcharge === surcharge.name;

            return (
              <Box
                key={surcharge.name}
                onClick={() => handleSurchargeClick(surcharge.name)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.75,
                  px: 1,
                  borderRadius: 1,
                  ...(selectionMode ? {
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#eff6ff' },
                  } : {}),
                  ...(isSelected ? {
                    bgcolor: '#dbeafe',
                    '&:hover': { bgcolor: '#bfdbfe' },
                  } : {}),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {isSelected && <CheckCircleIcon sx={{ fontSize: 16, color: '#2563eb' }} />}
                  <Typography sx={{ fontSize: 13, color: '#374151', fontWeight: isSelected ? 600 : 400 }}>
                    {surcharge.name}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{surcharge.value}</Typography>
              </Box>
            );
          })}

          {selectionMode && surchargeSearch && filteredSurcharges.length === 0 && (
            <Typography sx={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', mt: 2 }}>
              No surcharges match "{surchargeSearch}"
            </Typography>
          )}
        </>
      )}
    </Drawer>
  );
}

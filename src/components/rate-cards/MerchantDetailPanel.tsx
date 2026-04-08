import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CarrierChip from './CarrierChip';
import { CARRIER_IDS } from '../../constants/rateCardConfig';
import { resolveRateCard, formatPricingValue } from '../../utils/rateCardResolver';
import type { CarrierId, RateCard, MerchantGroup, RateCardAssignment, ResolvedRateCard } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

interface MerchantDetailPanelProps {
  entity: BillingEntity;
  rateCards: RateCard[];
  assignments: RateCardAssignment[];
  groups: MerchantGroup[];
  onClose: () => void;
}

function sourceLabel(resolved: ResolvedRateCard): string {
  if (resolved.source === 'direct') return 'Direct';
  if (resolved.source === 'group') return `via ${resolved.inheritedFrom}`;
  return 'via Global Default';
}

export default function MerchantDetailPanel({ entity, rateCards, assignments, groups, onClose }: MerchantDetailPanelProps) {
  const entityGroups = groups.filter(g => g.merchantIds.includes(entity.id));

  const rows: Array<{ carrierId: CarrierId; resolved: ResolvedRateCard | null }> =
    CARRIER_IDS.map(carrierId => ({
      carrierId,
      resolved: resolveRateCard(entity.id, carrierId, assignments, rateCards, groups),
    }));

  return (
    <Paper sx={{ mt: 2, border: '1px solid #e8ebf0', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, pb: 1.5, borderBottom: '1px solid #f0f2f5' }}>
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
            {entity.name}
          </Typography>
          {entityGroups.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
              {entityGroups.map(g => (
                <Chip
                  key={g.id}
                  label={g.name}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 600,
                    bgcolor: `${g.color}14`,
                    color: g.color,
                    border: `1px solid ${g.color}40`,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Pricing table */}
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& th': {
              fontSize: 11,
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              textAlign: 'left',
              px: 2,
              py: 1,
              borderBottom: '1px solid #e8ebf0',
            },
            '& td': {
              fontSize: 13,
              px: 2,
              py: 1.25,
              borderBottom: '1px solid #f0f2f5',
            },
            '& tr:last-child td': { borderBottom: 'none' },
          }}
        >
          <thead>
            <tr>
              <th>Carrier</th>
              <th>Rate Card</th>
              <th>Markup</th>
              <th>Sell Price</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ carrierId, resolved }) => (
              <tr key={carrierId}>
                <td><CarrierChip carrierId={carrierId} /></td>
                <td>
                  {resolved ? (
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{resolved.rateCard.name}</Typography>
                  ) : (
                    <Typography sx={{ fontSize: 13, color: '#d1d5db' }}>—</Typography>
                  )}
                </td>
                <td>
                  {resolved ? (
                    <Chip
                      label="Markup"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        fontWeight: 600,
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 13, color: '#d1d5db' }}>—</Typography>
                  )}
                </td>
                <td>
                  {resolved ? (
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      {formatPricingValue(resolved.rateCard)}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: 13, color: '#d1d5db' }}>—</Typography>
                  )}
                </td>
                <td>
                  {resolved ? (
                    <Chip
                      label={sourceLabel(resolved)}
                      size="small"
                      variant={resolved.source === 'direct' ? 'filled' : 'outlined'}
                      sx={{
                        height: 20,
                        fontSize: 10,
                        fontWeight: 500,
                        ...(resolved.source === 'direct'
                          ? { bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd' }
                          : { color: '#6b7280', borderStyle: 'dashed' }
                        ),
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 12, color: '#d1d5db' }}>No assignment</Typography>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Paper>
  );
}

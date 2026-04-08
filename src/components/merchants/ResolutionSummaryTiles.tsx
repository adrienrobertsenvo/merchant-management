import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { UnresolvedAlias, BillingEntity } from '../../types/merchant';

interface ResolutionSummaryTilesProps {
  unresolvedAliases: UnresolvedAlias[];
  billingEntities: BillingEntity[];
}

export default function ResolutionSummaryTiles({ unresolvedAliases, billingEntities }: ResolutionSummaryTilesProps) {
  const aliasCount = unresolvedAliases.length;
  const unmappedShipments = unresolvedAliases.reduce((sum, a) => sum + a.shipmentCount, 0);
  const totalMerchants = billingEntities.length;
  const totalAliases = billingEntities.reduce((sum, e) => sum + e.aliases.length, 0);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      {/* Merchants — informational */}
      <Box sx={{ flex: 1, bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>
            Merchants
          </Typography>
          <StorefrontIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
          {totalMerchants}
        </Typography>
        <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.5 }}>
          {totalAliases} known aliases / account numbers
        </Typography>
      </Box>

      {/* Unresolved aliases — action item */}
      <Box sx={{
        flex: 1, bgcolor: aliasCount > 0 ? '#fffbeb' : '#fff',
        border: aliasCount > 0 ? '1px solid #fde68a' : '1px solid #e8ebf0',
        borderRadius: 2, p: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: aliasCount > 0 ? '#92400e' : '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>
            Unresolved Aliases
          </Typography>
          {aliasCount > 0 && (
            <Box sx={{ bgcolor: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
              {aliasCount}
            </Box>
          )}
          {aliasCount === 0 && <ErrorOutlineIcon sx={{ color: '#9ca3af', fontSize: 18 }} />}
        </Box>
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: aliasCount > 0 ? '#92400e' : '#111827', lineHeight: 1.1 }}>
          {aliasCount}
        </Typography>
        <Typography sx={{ fontSize: 11, color: aliasCount > 0 ? '#b45309' : '#9ca3af', mt: 0.5 }}>
          {aliasCount > 0 ? 'Awaiting resolution' : 'All resolved'}
        </Typography>
      </Box>

      {/* Unmapped shipments — action item */}
      <Box sx={{
        flex: 1, bgcolor: unmappedShipments > 0 ? '#fef2f2' : '#fff',
        border: unmappedShipments > 0 ? '1px solid #fca5a5' : '1px solid #e8ebf0',
        borderRadius: 2, p: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: unmappedShipments > 0 ? '#991b1b' : '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>
            Unmapped Shipments
          </Typography>
          {unmappedShipments > 0 && (
            <Box sx={{ bgcolor: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
              !
            </Box>
          )}
          {unmappedShipments === 0 && <LocalShippingIcon sx={{ color: '#9ca3af', fontSize: 18 }} />}
        </Box>
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: unmappedShipments > 0 ? '#991b1b' : '#111827', lineHeight: 1.1 }}>
          {unmappedShipments}
        </Typography>
        <Typography sx={{ fontSize: 11, color: unmappedShipments > 0 ? '#b91c1c' : '#9ca3af', mt: 0.5 }}>
          {unmappedShipments > 0 ? `Across ${aliasCount} aliases / account numbers` : 'All mapped'}
        </Typography>
      </Box>
    </Box>
  );
}

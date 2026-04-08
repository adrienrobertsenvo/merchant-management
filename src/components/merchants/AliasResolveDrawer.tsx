import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SuggestedMatchList from './SuggestedMatchList';
import AffectedShipmentsPreview from './AffectedShipmentsPreview';
import type { UnresolvedAlias, BillingEntity } from '../../types/merchant';

interface AliasResolveDrawerProps {
  alias: UnresolvedAlias;
  entities: BillingEntity[];
  onBack: () => void;
  onMerge: (aliasId: string, entityId: string) => void;
  onCreateNew: (aliasId: string) => void;
  onDismiss: (aliasId: string) => void;
}

export default function AliasResolveDrawer({ alias, entities, onBack, onMerge, onCreateNew, onDismiss }: AliasResolveDrawerProps) {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
    alias.suggestedMatches.length > 0 ? alias.suggestedMatches[0].entityId : null
  );
  const suggestedIds = new Set(alias.suggestedMatches.map(m => m.entityId));
  const selectedEntity = entities.find(e => e.id === selectedEntityId) || null;
  const selectedName = selectedEntity?.name || '';

  return (
    <Box sx={{ display: 'flex', height: '100%', gap: 0 }}>
      {/* Left panel: Alias detail + affected shipments */}
      <Box sx={{ flex: 1, pr: 3, borderRight: '1px solid #e8ebf0', overflow: 'auto' }}>
        {/* Back button + header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={onBack} size="small" sx={{ color: '#6b7280' }}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
            Back to queue
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
              {alias.aliasName}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
            First seen {new Date(alias.firstSeen).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            {' · '}{alias.shipmentCount} shipment{alias.shipmentCount !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Affected shipments */}
        <AffectedShipmentsPreview shipments={alias.affectedShipments} />
      </Box>

      {/* Right panel: Match selection + actions */}
      <Box sx={{ flex: 1, pl: 3, display: 'flex', flexDirection: 'column' }}>
        {/* Suggested matches */}
        {alias.suggestedMatches.length > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <SuggestedMatchList
              matches={alias.suggestedMatches}
              selectedEntityId={selectedEntityId}
              onSelect={setSelectedEntityId}
            />
          </Box>
        )}

        {/* Pick any entity */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 1 }}>
            {alias.suggestedMatches.length > 0 ? 'Or assign to a different merchant' : 'Assign to a merchant'}
          </Typography>
          <Autocomplete
            size="small"
            options={entities}
            getOptionLabel={(opt) => opt.name}
            value={selectedEntity}
            onChange={(_e, value) => {
              if (value) setSelectedEntityId(value.id);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search all merchants..."
                variant="outlined"
              />
            )}
            renderOption={(props, option) => {
              const isSuggested = suggestedIds.has(option.id);
              return (
                <Box component="li" {...props} key={option.id}>
                  <Typography sx={{ fontSize: 13 }}>
                    {option.name}
                  </Typography>
                  {isSuggested && (
                    <Chip label="Suggested" size="small" sx={{ ml: 1, height: 18, fontSize: 10, bgcolor: '#d1fae5', color: '#059669', fontWeight: 600, border: 'none' }} />
                  )}
                </Box>
              );
            }}
            fullWidth
          />
        </Box>

        {/* Action buttons */}
        <Box sx={{ mt: 'auto', pt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!selectedEntityId}
            onClick={() => selectedEntityId && onMerge(alias.id, selectedEntityId)}
            sx={{ fontWeight: 600 }}
          >
            Merge into {selectedName || '...'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onCreateNew(alias.id)}
            sx={{ fontWeight: 500, borderColor: '#e8ebf0', color: '#374151', '&:hover': { borderColor: '#3b82f6', color: '#3b82f6' } }}
          >
            Create as New Merchant
          </Button>
          <Button
            fullWidth
            onClick={() => onDismiss(alias.id)}
            sx={{ fontWeight: 500, color: '#9ca3af', '&:hover': { color: '#dc2626', bgcolor: '#fee2e2' } }}
          >
            Dismiss
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

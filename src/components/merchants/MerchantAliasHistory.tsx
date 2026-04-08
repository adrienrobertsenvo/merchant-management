import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import type { ResolutionEvent } from '../../types/merchant';

interface MerchantAliasHistoryProps {
  events: ResolutionEvent[];
}

const actionConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  merged: { label: 'Merged', color: '#059669', bg: '#d1fae5', icon: <MergeTypeIcon sx={{ fontSize: 16 }} /> },
  created_new: { label: 'Created', color: '#2563eb', bg: '#dbeafe', icon: <AddCircleOutlineIcon sx={{ fontSize: 16 }} /> },
  dismissed: { label: 'Dismissed', color: '#6b7280', bg: '#f3f4f6', icon: <RemoveCircleOutlineIcon sx={{ fontSize: 16 }} /> },
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function MerchantAliasHistory({ events }: MerchantAliasHistoryProps) {
  const sorted = [...events].sort((a, b) => new Date(b.resolvedAt).getTime() - new Date(a.resolvedAt).getTime());

  if (sorted.length === 0) {
    return (
      <Typography sx={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>
        No resolution history yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 1.5 }}>
        Resolution History
      </Typography>
      <Box sx={{ position: 'relative', pl: 3 }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: 8,
            top: 8,
            bottom: 8,
            width: 2,
            bgcolor: '#e8ebf0',
            borderRadius: 1,
          }}
        />
        {sorted.map((event) => {
          const config = actionConfig[event.action] || actionConfig.merged;
          return (
            <Box key={event.id} sx={{ position: 'relative', mb: 2, '&:last-child': { mb: 0 } }}>
              {/* Timeline dot */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -19,
                  top: 4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor: config.bg,
                  color: config.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {config.icon}
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                    "{event.aliasName}"
                  </Typography>
                  <Chip
                    label={config.label}
                    size="small"
                    sx={{ bgcolor: config.bg, color: config.color, fontWeight: 600, fontSize: 10.5, height: 20, border: 'none' }}
                  />
                </Box>
                {event.mergedIntoName && (
                  <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
                    Merged into {event.mergedIntoName}
                  </Typography>
                )}
                <Typography sx={{ fontSize: 11.5, color: '#9ca3af', mt: 0.25 }}>
                  {formatDateTime(event.resolvedAt)} by {event.resolvedBy}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

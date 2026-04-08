import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { SuggestedMatch } from '../../types/merchant';

interface SuggestedMatchListProps {
  matches: SuggestedMatch[];
  selectedEntityId: string | null;
  onSelect: (entityId: string) => void;
}

export default function SuggestedMatchList({ matches, selectedEntityId, onSelect }: SuggestedMatchListProps) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 1.5 }}>
        Suggested Matches
      </Typography>
      <RadioGroup
        value={selectedEntityId || ''}
        onChange={(e) => onSelect(e.target.value)}
      >
        {matches.map(match => {
          const isSelected = selectedEntityId === match.entityId;
          return (
            <Box
              key={match.entityId}
              sx={{
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e8ebf0',
                borderRadius: 1.5,
                p: 1.5,
                mb: 1,
                bgcolor: isSelected ? '#eff6ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { borderColor: '#3b82f6', bgcolor: isSelected ? '#eff6ff' : '#f8faff' },
              }}
              onClick={() => onSelect(match.entityId)}
            >
              <FormControlLabel
                value={match.entityId}
                control={<Radio size="small" />}
                label=""
                sx={{ m: 0, mr: 1 }}
              />
              <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, verticalAlign: 'top' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                  {match.entityName}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.25 }}>
                  {match.matchReasons.map((reason, i) => (
                    <Typography key={i} sx={{ fontSize: 12, color: '#6b7280' }}>
                      {i > 0 && '· '}{reason}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}
      </RadioGroup>
      {matches.length === 0 && (
        <Typography sx={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>
          No suggested matches found.
        </Typography>
      )}
    </Box>
  );
}

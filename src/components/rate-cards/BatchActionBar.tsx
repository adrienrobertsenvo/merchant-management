import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

interface BatchActionBarProps {
  selectedCount: number;
  onBatchAssign: () => void;
  onClear: () => void;
}

export default function BatchActionBar({ selectedCount, onBatchAssign, onClear }: BatchActionBarProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 16,
        mt: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2.5,
        py: 1.5,
        bgcolor: '#1e293b',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        color: '#fff',
      }}
    >
      <PlaylistAddCheckIcon sx={{ fontSize: 20, color: '#93c5fd' }} />
      <Typography sx={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
        {selectedCount} merchant{selectedCount !== 1 ? 's' : ''} selected
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={onBatchAssign}
        sx={{
          bgcolor: '#3b82f6',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 13,
          '&:hover': { bgcolor: '#2563eb' },
        }}
      >
        Assign Rate Card
      </Button>
      <IconButton size="small" onClick={onClear} sx={{ color: '#94a3b8' }}>
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface MergeConfirmDialogProps {
  open: boolean;
  aliasName: string;
  targetEntityName: string;
  shipmentCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function MergeConfirmDialog({ open, aliasName, targetEntityName, shipmentCount, onClose, onConfirm }: MergeConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon sx={{ color: '#d97706', fontSize: 22 }} />
        Confirm Merge
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 14, color: '#374151', mb: 2.5 }}>
          This action is difficult to undo. Please review before confirming.
        </Typography>

        {/* Visual: alias -> entity */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f9fafb', border: '1px solid #e8ebf0', borderRadius: 2, p: 2, mb: 2.5 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, mb: 0.5 }}>Alias / Account #</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
              {aliasName}
            </Typography>
          </Box>
          <ArrowForwardIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, mb: 0.5 }}>Merchant</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
              {targetEntityName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Shipments reassigned</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{shipmentCount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Alias / account added to</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{targetEntityName}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Confirm Merge
        </Button>
      </DialogActions>
    </Dialog>
  );
}

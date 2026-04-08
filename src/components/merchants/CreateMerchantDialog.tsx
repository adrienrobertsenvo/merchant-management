import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

interface CreateMerchantDialogProps {
  open: boolean;
  aliasName: string;
  shipmentCount?: number;
  onClose: () => void;
  onConfirm: (merchantName: string, mergeShipments: boolean) => void;
}

export default function CreateMerchantDialog({ open, aliasName, shipmentCount, onClose, onConfirm }: CreateMerchantDialogProps) {
  const [name, setName] = useState(aliasName);
  const [mergeShipments, setMergeShipments] = useState(false);

  useEffect(() => {
    if (open) {
      setName(aliasName);
      setMergeShipments(false);
    }
  }, [open, aliasName]);

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim(), mergeShipments);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 17 }}>
        Create New Merchant
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: 13.5, color: '#6b7280', mb: 2 }}>
          This will create a new billing entity from the alias / account number "{aliasName}".
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Merchant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />
          {shipmentCount != null && shipmentCount > 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={mergeShipments}
                  onChange={(e) => setMergeShipments(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography sx={{ fontSize: 13, color: '#374151' }}>
                  Merge {shipmentCount} shipment{shipmentCount !== 1 ? 's' : ''} to this merchant
                </Typography>
              }
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!name.trim()}
        >
          Create Merchant
        </Button>
      </DialogActions>
    </Dialog>
  );
}

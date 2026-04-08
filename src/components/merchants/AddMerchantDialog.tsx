import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import type { BillingEntity } from '../../types/merchant';

interface AddMerchantDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (entity: BillingEntity) => void;
}

export default function AddMerchantDialog({ open, onClose, onConfirm }: AddMerchantDialogProps) {
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');
  const [country, setCountry] = useState('');

  const handleConfirm = () => {
    if (!name.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const parsedAliases = aliases
      .split(',')
      .map(a => a.trim())
      .filter(Boolean)
      .map(a => ({ name: a, addedAt: today, source: 'manual' as const }));
    onConfirm({
      id: `ent-${Date.now()}`,
      name: name.trim(),
      aliases: parsedAliases,
      contactEmail: '',
      country: country.trim(),
      shipmentCount: 0,
      createdAt: today,
      lastActivity: today,
    });
    setName('');
    setAliases('');
    setCountry('');
  };

  const handleClose = () => {
    setName('');
    setAliases('');
    setCountry('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 17 }}>
        Add Merchant
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Merchant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            autoFocus
            required
          />
          <TextField
            label="Aliases / Account Numbers"
            value={aliases}
            onChange={(e) => setAliases(e.target.value)}
            fullWidth
            size="small"
            placeholder="Comma-separated, e.g. Alias A, ACC-DE-12345"
          />
          <TextField
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={handleClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!name.trim()}
        >
          Add Merchant
        </Button>
      </DialogActions>
    </Dialog>
  );
}

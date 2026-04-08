import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { RateCard, Surcharge } from '../../types/rateCard';

interface SurchargeEditDialogProps {
  open: boolean;
  rateCard: RateCard | null;
  onClose: () => void;
  onSave: (rateCardId: string, surcharges: Surcharge[]) => void;
}

export default function SurchargeEditDialog({ open, rateCard, onClose, onSave }: SurchargeEditDialogProps) {
  const [surcharges, setSurcharges] = useState<Surcharge[]>([]);

  useEffect(() => {
    if (rateCard?.pricing?.surcharges) {
      setSurcharges(rateCard.pricing.surcharges.map(s => ({ ...s })));
    } else {
      setSurcharges([]);
    }
  }, [rateCard, open]);

  const handleNameChange = (index: number, name: string) => {
    setSurcharges(prev => prev.map((s, i) => i === index ? { ...s, name } : s));
  };

  const handleValueChange = (index: number, value: string) => {
    setSurcharges(prev => prev.map((s, i) => i === index ? { ...s, value } : s));
  };

  const handleAdd = () => {
    setSurcharges(prev => [...prev, { name: '', value: '' }]);
  };

  const handleDelete = (index: number) => {
    setSurcharges(prev => prev.filter((_, i) => i !== index));
  };

  const canSave = surcharges.every(s => s.name.trim() && s.value.trim());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        Edit Surcharges
        {rateCard && (
          <Typography sx={{ fontSize: 13, color: '#6b7280', fontWeight: 400, mt: 0.25 }}>
            {rateCard.name}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
          {surcharges.length === 0 && (
            <Typography sx={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', py: 2 }}>
              No surcharges yet. Click "Add Surcharge" to create one.
            </Typography>
          )}

          {surcharges.map((surcharge, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label="Name"
                value={surcharge.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                size="small"
                sx={{ flex: 1.5 }}
                placeholder="e.g. Non-Conveyable"
              />
              <TextField
                label="Value"
                value={surcharge.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                placeholder="e.g. €2.00"
              />
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => handleDelete(index)}
                  sx={{ color: '#9ca3af', '&:hover': { color: '#dc2626' } }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAdd}
            size="small"
            sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600, mt: 0.5 }}
          >
            Add Surcharge
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!canSave}
          onClick={() => {
            if (rateCard) {
              onSave(rateCard.id, surcharges);
              onClose();
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

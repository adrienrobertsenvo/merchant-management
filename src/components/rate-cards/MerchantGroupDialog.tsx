import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import { GROUP_COLORS } from '../../constants/rateCardConfig';
import type { MerchantGroup } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

interface MerchantGroupDialogProps {
  open: boolean;
  editingGroup: MerchantGroup | null;
  entities: BillingEntity[];
  existingGroupCount: number;
  onClose: () => void;
  onConfirm: (data: Omit<MerchantGroup, 'id' | 'createdAt'>) => void;
}

export default function MerchantGroupDialog({ open, editingGroup, entities, existingGroupCount, onClose, onConfirm }: MerchantGroupDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (editingGroup) {
      setName(editingGroup.name);
      setDescription(editingGroup.description);
      setSelectedIds([...editingGroup.merchantIds]);
    } else {
      setName('');
      setDescription('');
      setSelectedIds([]);
    }
    setSearch('');
  }, [editingGroup, open]);

  const toggleMerchant = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredEntities = entities.filter(e =>
    !e.archived && e.name.toLowerCase().includes(search.toLowerCase())
  );

  const canSubmit = name.trim() && selectedIds.length > 0;
  const color = editingGroup?.color || GROUP_COLORS[existingGroupCount % GROUP_COLORS.length];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        {editingGroup ? 'Edit Merchant Group' : 'Create Merchant Group'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Group Name"
            value={name}
            onChange={e => setName(e.target.value)}
            size="small"
            fullWidth
            placeholder="e.g. Enterprise, DACH Region"
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={2}
          />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                Merchants ({selectedIds.length} selected)
              </Typography>
            </Box>
            <TextField
              placeholder="Search merchants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 1 }}
            />
            <List dense sx={{ maxHeight: 240, overflow: 'auto', border: '1px solid #e8ebf0', borderRadius: 1 }}>
              {filteredEntities.map(entity => {
                const checked = selectedIds.includes(entity.id);
                return (
                  <ListItemButton key={entity.id} onClick={() => toggleMerchant(entity.id)} dense>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox edge="start" checked={checked} size="small" tabIndex={-1} disableRipple />
                    </ListItemIcon>
                    <ListItemText
                      primary={entity.name}
                      secondary={`${entity.country} · ${entity.shipmentCount} shipments`}
                      slotProps={{
                        primary: { sx: { fontSize: 13, fontWeight: checked ? 600 : 400 } },
                        secondary: { sx: { fontSize: 11 } },
                      }}
                    />
                    {checked && (
                      <Chip label="Selected" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#d1fae5', color: '#059669', fontWeight: 600 }} />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={() => {
            onConfirm({ name: name.trim(), description, merchantIds: selectedIds, color });
            onClose();
          }}
        >
          {editingGroup ? 'Save Changes' : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

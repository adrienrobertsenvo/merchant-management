import { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CreateIcon from '@mui/icons-material/NoteAdd';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import type { RateCard, RateCardPricing } from '../../types/rateCard';

type CreationMethod = 'scratch' | 'template' | 'upload';

interface RateCardDialogProps {
  open: boolean;
  editingCard: RateCard | null;
  onClose: () => void;
  onConfirm: (data: Omit<RateCard, 'id' | 'createdAt'>) => void;
  existingRateCards?: RateCard[];
}

export default function RateCardDialog({ open, editingCard, onClose, onConfirm, existingRateCards = [] }: RateCardDialogProps) {
  const [method, setMethod] = useState<CreationMethod | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (editingCard) {
        setMethod('scratch');
        setName(editingCard.name);
        setDescription(editingCard.description);
        setValidFrom(editingCard.validFrom);
        setValidTo(editingCard.validTo);
      } else {
        setMethod(null);
        setName('');
        setDescription('');
        setValidFrom('2026-01-01');
        setValidTo('2026-12-31');
        setTemplateId('');
        setUploadedFileName('');
      }
    }
  }, [editingCard, open]);

  const selectedTemplate = existingRateCards.find(rc => rc.id === templateId);

  const canSubmit = name.trim() && validFrom && validTo && method !== null;

  const handleCreate = () => {
    let pricing: RateCardPricing | undefined;

    if (method === 'template' && selectedTemplate?.pricing) {
      pricing = {
        zones: selectedTemplate.pricing.zones.map(z => ({ ...z, tiers: z.tiers.map(t => ({ ...t })) })),
        surcharges: selectedTemplate.pricing.surcharges.map(s => ({ ...s })),
      };
    } else if (method === 'scratch') {
      pricing = {
        zones: [
          { zone: 'National', tiers: [{ maxWeight: 3, price: 0 }, { maxWeight: 5, price: 0 }, { maxWeight: 10, price: 0 }, { maxWeight: 31.5, price: 0 }] },
        ],
        surcharges: [],
      };
    } else if (method === 'upload') {
      // In production: parse uploaded file. For now, create with empty structure
      pricing = { zones: [], surcharges: [] };
    }

    onConfirm({
      name: name.trim(),
      description,
      validFrom,
      validTo,
      pricing,
    });
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  // Method selection screen
  if (!method && !editingCard) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
          Add Rate Card
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 2.5 }}>
            How would you like to create the new rate card?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Paper
              elevation={0}
              onClick={() => setMethod('scratch')}
              sx={{
                border: '1px solid #e8ebf0', borderRadius: 2, p: 2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 2,
                '&:hover': { borderColor: '#3b82f6', bgcolor: '#f8faff' },
                transition: 'all 0.15s',
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreateIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Create from scratch</Typography>
                <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Start with an empty rate card and define zones, tiers, and surcharges</Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              onClick={() => setMethod('template')}
              sx={{
                border: '1px solid #e8ebf0', borderRadius: 2, p: 2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 2,
                '&:hover': { borderColor: '#3b82f6', bgcolor: '#f8faff' },
                transition: 'all 0.15s',
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCopyIcon sx={{ color: '#16a34a', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Use an existing rate card as template</Typography>
                <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Copy zones, tiers, and surcharges from an existing rate card</Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              onClick={() => setMethod('upload')}
              sx={{
                border: '1px solid #e8ebf0', borderRadius: 2, p: 2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 2,
                '&:hover': { borderColor: '#3b82f6', bgcolor: '#f8faff' },
                transition: 'all 0.15s',
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadFileIcon sx={{ color: '#7c3aed', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Upload a document</Typography>
                <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Import pricing from a CSV, Excel, or PDF file</Typography>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Form screen
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        {editingCard ? 'Edit Rate Card' : method === 'template' ? 'New from Template' : method === 'upload' ? 'Upload Rate Card' : 'New Rate Card'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Template picker */}
          {method === 'template' && (
            <TextField
              select
              label="Template"
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value);
                const tmpl = existingRateCards.find(rc => rc.id === e.target.value);
                if (tmpl && !name) setName(`${tmpl.name} (new)`);
              }}
              size="small"
              fullWidth
            >
              {existingRateCards.map(rc => (
                <MenuItem key={rc.id} value={rc.id} sx={{ fontSize: 13 }}>
                  {rc.name}
                  <Typography component="span" sx={{ ml: 'auto', fontSize: 11, color: '#6b7280', pl: 2 }}>
                    {rc.pricing?.zones?.length ?? 0} zones · {rc.pricing?.surcharges?.length ?? 0} surcharges
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* File upload */}
          {method === 'upload' && (
            <Box>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<UploadFileIcon />}
                fullWidth
                sx={{ textTransform: 'none', fontWeight: 500, py: 1.5, borderStyle: 'dashed', color: '#6b7280', borderColor: '#d1d5db' }}
              >
                {uploadedFileName || 'Choose file (CSV, Excel, PDF)'}
              </Button>
              {uploadedFileName && (
                <Typography sx={{ fontSize: 11, color: '#16a34a', mt: 0.5 }}>
                  File selected: {uploadedFileName}
                </Typography>
              )}
            </Box>
          )}

          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            size="small"
            fullWidth
            placeholder="e.g. Premium Fulfillment Q2 2026"
          />

          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={2}
            placeholder="What is this rate card for?"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Apply From"
              type="date"
              value={validFrom}
              onChange={e => setValidFrom(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Apply Until"
              type="date"
              value={validTo}
              onChange={e => setValidTo(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          {method === 'scratch' && !editingCard && (
            <Typography sx={{ fontSize: 12, color: '#6b7280', bgcolor: '#f8f9fb', p: 1.5, borderRadius: 1 }}>
              A blank rate card will be created with one empty "National" zone. You can add more zones, tiers, and surcharges after creation.
            </Typography>
          )}

          {method === 'template' && selectedTemplate && (
            <Typography sx={{ fontSize: 12, color: '#16a34a', bgcolor: '#f0fdf4', p: 1.5, borderRadius: 1 }}>
              Copying {selectedTemplate.pricing?.zones?.length ?? 0} zones and {selectedTemplate.pricing?.surcharges?.length ?? 0} surcharges from "{selectedTemplate.name}". You can edit everything after creation.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {!editingCard && (
          <Button onClick={() => setMethod(null)} sx={{ color: '#6b7280', mr: 'auto' }}>
            Back
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: '#6b7280' }}>Cancel</Button>
        <Button variant="contained" disabled={!canSubmit} onClick={handleCreate}>
          {editingCard ? 'Save Changes' : 'Create & Edit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

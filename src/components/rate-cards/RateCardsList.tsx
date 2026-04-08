import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import RateCardDialog from './RateCardDialog';
import RateCardDetail from './RateCardDetail';
import { countAssignmentsForRateCard } from '../../utils/rateCardResolver';
import type { RateCard, RateCardAssignment, CarrierId } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

interface RateCardsListProps {
  rateCards: RateCard[];
  assignments: RateCardAssignment[];
  entities: BillingEntity[];
  onAddRateCard: (data: Omit<RateCard, 'id' | 'createdAt'>) => void;
  onEditRateCard: (id: string, data: Omit<RateCard, 'id' | 'createdAt'>) => void;
  onDeleteRateCard: (id: string) => void;
  onAssign?: (merchantId: string, carrierId: CarrierId | '*', rateCardId: string) => void;
  onRemoveAssignment?: (merchantId: string, carrierId: CarrierId | '*') => void;
}

function formatDateShort(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isExpired(rc: RateCard): boolean {
  return new Date(rc.validTo) < new Date();
}

type StatusFilter = 'all' | 'active' | 'expired';

export default function RateCardsList({ rateCards, assignments, entities, onAddRateCard, onEditRateCard, onDeleteRateCard, onAssign, onRemoveAssignment }: RateCardsListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<RateCard | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<RateCard | null>(null);
  const [selectedRateCardId, setSelectedRateCardId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [validFromFilter, setValidFromFilter] = useState('');

  const handleDuplicate = (rc: RateCard) => {
    onAddRateCard({
      name: `${rc.name} (copy)`,
      markup: rc.markup ?? undefined,
      carrierId: rc.carrierId,
      description: rc.description,
      validFrom: rc.validFrom,
      validTo: rc.validTo,
      pricing: rc.pricing ? { zones: rc.pricing.zones.map(z => ({ ...z, tiers: z.tiers.map(t => ({ ...t })) })), surcharges: rc.pricing.surcharges.map(s => ({ ...s })) } : undefined,
    });
  };

  const filtered = useMemo(() => {
    let result = [...rateCards];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(rc => rc.name.toLowerCase().includes(q) || rc.description.toLowerCase().includes(q));
    }
    if (statusFilter === 'active') result = result.filter(rc => !isExpired(rc));
    if (statusFilter === 'expired') result = result.filter(rc => isExpired(rc));
    if (validFromFilter) result = result.filter(rc => rc.validFrom >= validFromFilter);
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [rateCards, search, statusFilter, validFromFilter]);

  const activeCount = rateCards.filter(rc => !isExpired(rc)).length;
  const expiredCount = rateCards.filter(rc => isExpired(rc)).length;

  const selectedRateCard = rateCards.find(r => r.id === selectedRateCardId);

  if (selectedRateCard) {
    return (
      <RateCardDetail
        rateCard={selectedRateCard}
        assignments={assignments}
        entities={entities}
        onBack={() => setSelectedRateCardId(null)}
        onSave={(id, data) => { onEditRateCard(id, data); }}
        onAssign={onAssign ?? (() => {})}
        onRemoveAssignment={onRemoveAssignment ?? (() => {})}
      />
    );
  }

  const assignmentCount = deleteConfirm ? countAssignmentsForRateCard(deleteConfirm.id, assignments) : 0;

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search rate cards..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 240 }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#9ca3af' }} /></InputAdornment>, sx: { fontSize: 13 } } }}
        />
        <Chip
          label={`Active (${activeCount})`}
          size="small"
          onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
          sx={{
            fontSize: 11, fontWeight: 600, height: 28, cursor: 'pointer',
            bgcolor: statusFilter === 'active' ? '#dcfce7' : '#f3f4f6',
            color: statusFilter === 'active' ? '#16a34a' : '#6b7280',
            border: statusFilter === 'active' ? '1px solid #86efac' : '1px solid transparent',
          }}
        />
        <Chip
          label={`Expired (${expiredCount})`}
          size="small"
          onClick={() => setStatusFilter(statusFilter === 'expired' ? 'all' : 'expired')}
          sx={{
            fontSize: 11, fontWeight: 600, height: 28, cursor: 'pointer',
            bgcolor: statusFilter === 'expired' ? '#fee2e2' : '#f3f4f6',
            color: statusFilter === 'expired' ? '#991b1b' : '#6b7280',
            border: statusFilter === 'expired' ? '1px solid #fca5a5' : '1px solid transparent',
          }}
        />
        <TextField
          label="Valid from"
          type="date"
          size="small"
          value={validFromFilter}
          onChange={(e) => setValidFromFilter(e.target.value)}
          sx={{ width: 150 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        {validFromFilter && (
          <Chip label="Clear date" size="small" onDelete={() => setValidFromFilter('')}
            sx={{ fontSize: 10, height: 24, color: '#6b7280' }} />
        )}
        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
          {filtered.length} rate card{filtered.length !== 1 ? 's' : ''}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => { setEditingCard(null); setDialogOpen(true); }}
          sx={{ ml: 'auto', textTransform: 'none', fontWeight: 600 }}
        >
          Add Rate Card
        </Button>
      </Box>

      {/* Card grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2 }}>
        {filtered.map(rc => {
          const count = countAssignmentsForRateCard(rc.id, assignments);
          const expired = isExpired(rc);
          return (
            <Paper
              key={rc.id}
              elevation={0}
              onClick={() => setSelectedRateCardId(rc.id)}
              sx={{
                border: expired ? '1px solid #e5e7eb' : '1px solid #e8ebf0',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                cursor: 'pointer',
                opacity: expired ? 0.6 : 1,
                '&:hover': { borderColor: '#93c5fd', boxShadow: '0 1px 6px rgba(59,130,246,0.08)', opacity: 1 },
                transition: 'all 0.15s',
              }}
            >
              {/* Row 1: Name + actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                  {rc.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.25, ml: 1, flexShrink: 0 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSelectedRateCardId(rc.id); }}>
                      <EditIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplicate">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDuplicate(rc); }}>
                      <ContentCopyIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(rc); }}>
                      <DeleteIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Row 2: Key info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>
                  {count} merchant{count !== 1 ? 's' : ''}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>·</Typography>
                <Typography sx={{ fontSize: 11, color: '#6b7280' }}>
                  {formatDateShort(rc.validFrom)} – {formatDateShort(rc.validTo)}
                </Typography>
                {expired && (
                  <Chip label="Expired" size="small" sx={{ fontSize: 9, fontWeight: 600, height: 18, bgcolor: '#fee2e2', color: '#991b1b' }} />
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontSize: 14, color: '#9ca3af' }}>
            {search ? 'No rate cards match your search' : 'No rate cards found'}
          </Typography>
        </Box>
      )}

      <RateCardDialog
        open={dialogOpen}
        editingCard={editingCard}
        existingRateCards={rateCards}
        onClose={() => { setDialogOpen(false); setEditingCard(null); }}
        onConfirm={(data) => {
          if (editingCard) {
            onEditRateCard(editingCard.id, data);
          } else {
            onAddRateCard(data);
          }
        }}
      />

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Delete Rate Card</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13 }}>
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?
          </Typography>
          {assignmentCount > 0 && (
            <Typography sx={{ fontSize: 13, color: '#dc2626', mt: 1 }}>
              This rate card has {assignmentCount} active assignment{assignmentCount !== 1 ? 's' : ''} that will be removed.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button variant="contained" color="error"
            onClick={() => { if (deleteConfirm) onDeleteRateCard(deleteConfirm.id); setDeleteConfirm(null); }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

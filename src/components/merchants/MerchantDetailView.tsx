import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MerchantAliasHistory from './MerchantAliasHistory';
import type { BillingEntity, ResolutionEvent, MonthlyShipments } from '../../types/merchant';

interface MerchantDetailViewProps {
  entity: BillingEntity;
  resolutionHistory: ResolutionEvent[];
  monthlyShipments: MonthlyShipments[];
  onBack: () => void;
  onUpdateEntity: (updated: BillingEntity) => void;
  onRemoveAlias: (entityId: string, aliasName: string) => void;
  onArchive: (entityId: string) => void;
  onDelete: (entityId: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-');
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function MerchantDetailView({ entity, resolutionHistory, monthlyShipments, onBack, onUpdateEntity, onRemoveAlias, onArchive, onDelete }: MerchantDetailViewProps) {
  const entityHistory = resolutionHistory.filter(e => e.entityId === entity.id);
  const storeAliases = entity.aliases.filter(a => a.source === 'store');
  const manualAliases = entity.aliases.filter(a => a.source === 'manual');
  const [newAlias, setNewAlias] = useState('');

  const handleRemoveAlias = (aliasName: string) => {
    onRemoveAlias(entity.id, aliasName);
  };

  const handleAddAlias = () => {
    const trimmed = newAlias.trim();
    if (trimmed && !entity.aliases.some(a => a.name === trimmed)) {
      onUpdateEntity({
        ...entity,
        aliases: [...entity.aliases, { name: trimmed, addedAt: new Date().toISOString().split('T')[0], source: 'manual' }],
      });
      setNewAlias('');
    }
  };

  const totals = monthlyShipments.reduce(
    (acc, m) => ({ shipments: acc.shipments + m.shipments, revenue: acc.revenue + m.revenue }),
    { shipments: 0, revenue: 0 }
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={onBack} size="small" sx={{ color: '#6b7280' }}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
            Back to merchants
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={entity.archived ? <UnarchiveIcon sx={{ fontSize: 16 }} /> : <ArchiveIcon sx={{ fontSize: 16 }} />}
            onClick={() => onArchive(entity.id)}
            sx={{ fontSize: 12, fontWeight: 500, borderColor: '#e8ebf0', color: '#6b7280', '&:hover': { borderColor: '#d97706', color: '#d97706' } }}
          >
            {entity.archived ? 'Restore' : 'Archive'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
            onClick={() => onDelete(entity.id)}
            sx={{ fontSize: 12, fontWeight: 500, borderColor: '#e8ebf0', color: '#6b7280', '&:hover': { borderColor: '#dc2626', color: '#dc2626', bgcolor: '#fef2f2' } }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left column */}
        <Box sx={{ flex: 2 }}>
          {/* Entity info card */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111827', mb: 0.5 }}>
              {entity.name}
            </Typography>

            {/* Metadata row */}
            <Box sx={{ display: 'flex', gap: 2.5, mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{entity.contactEmail}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PublicIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{entity.country}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalShippingIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{entity.shipmentCount.toLocaleString()} shipments</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Since {formatDate(entity.createdAt)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Aliases / Account Numbers */}
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 1.5 }}>
              Aliases / Account Numbers ({entity.aliases.length})
            </Typography>

            {/* Store aliases */}
            {storeAliases.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <StorefrontIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                  <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Store Alias / Account</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {storeAliases.map(alias => (
                    <Chip
                      key={alias.name}
                      label={
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                          {alias.name}
                          <Box component="span" sx={{ fontSize: 10.5, color: '#9ca3af', fontWeight: 400 }}>
                            {formatDate(alias.addedAt)}
                          </Box>
                        </Box>
                      }
                      size="small"
                      onDelete={() => handleRemoveAlias(alias.name)}
                      sx={{ bgcolor: '#f3f4f6', color: '#374151', fontWeight: 500, fontSize: 12, border: 'none', height: 26 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Manual aliases / account numbers */}
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                <EditIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                <Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Manual Alias / Account</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
                {manualAliases.map(alias => (
                  <Chip
                    key={alias.name}
                    label={
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                        {alias.name}
                        <Box component="span" sx={{ fontSize: 10.5, color: '#93c5fd', fontWeight: 400 }}>
                          {formatDate(alias.addedAt)}
                        </Box>
                      </Box>
                    }
                    size="small"
                    onDelete={() => handleRemoveAlias(alias.name)}
                    sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 500, fontSize: 12, border: 'none', height: 26 }}
                  />
                ))}
                {manualAliases.length === 0 && (
                  <Typography sx={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>No manual aliases / account numbers yet</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  placeholder="Add new alias or account number..."
                  size="small"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddAlias(); }}
                  sx={{ flex: 1, maxWidth: 280 }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleAddAlias}
                  disabled={!newAlias.trim()}
                  startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                  sx={{ fontWeight: 500, borderColor: '#e8ebf0', color: '#374151', '&:hover': { borderColor: '#3b82f6', color: '#3b82f6' } }}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Monthly shipments table */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 1.5 }}>
              Shipment History
            </Typography>
            <Box sx={{ border: '1px solid #e8ebf0', borderRadius: 1.5, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Shipments</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...monthlyShipments].reverse().map(m => (
                    <TableRow key={m.month} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                          {formatMonth(m.month)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                          {m.shipments.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: 13, color: '#374151' }}>
                          €{m.revenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals row */}
                  <TableRow sx={{ bgcolor: '#fafbfc' }}>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                        {totals.shipments.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                        €{totals.revenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>

        {/* Right: Resolution history */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 2.5 }}>
            <MerchantAliasHistory events={entityHistory} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

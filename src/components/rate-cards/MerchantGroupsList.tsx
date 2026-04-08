import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import MerchantGroupDialog from './MerchantGroupDialog';
import { countAssignmentsForGroup } from '../../utils/rateCardResolver';
import type { MerchantGroup, RateCardAssignment } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

interface MerchantGroupsListProps {
  groups: MerchantGroup[];
  assignments: RateCardAssignment[];
  entities: BillingEntity[];
  onAddGroup: (data: Omit<MerchantGroup, 'id' | 'createdAt'>) => void;
  onEditGroup: (id: string, data: Omit<MerchantGroup, 'id' | 'createdAt'>) => void;
  onDeleteGroup: (id: string) => void;
}

export default function MerchantGroupsList({ groups, assignments, entities, onAddGroup, onEditGroup, onDeleteGroup }: MerchantGroupsListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MerchantGroup | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MerchantGroup | null>(null);

  const entityMap = new Map(entities.map(e => [e.id, e]));

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Group',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const group = params.row as MerchantGroup;
        return (
          <Chip
            label={group.name}
            size="small"
            sx={{
              bgcolor: `${group.color}14`,
              color: group.color,
              fontWeight: 600,
              fontSize: 12,
              border: `1px solid ${group.color}40`,
            }}
          />
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: '#6b7280' }} noWrap>{params.value}</Typography>
      ),
    },
    {
      field: 'merchantIds',
      headerName: 'Merchants',
      flex: 2,
      minWidth: 240,
      renderCell: (params) => {
        const ids = params.value as string[];
        const names = ids.map(id => entityMap.get(id)?.name).filter(Boolean);
        const display = names.slice(0, 3).join(', ');
        const extra = names.length > 3 ? ` +${names.length - 3}` : '';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 13 }} noWrap>{display}</Typography>
            {extra && (
              <Typography sx={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{extra}</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'memberCount',
      headerName: 'Members',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (_value, row) => (row as MerchantGroup).merchantIds.length,
    },
    {
      field: 'rateCardCount',
      headerName: 'Rate Cards',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (_value, row) => countAssignmentsForGroup((row as MerchantGroup).id, assignments),
    },
    {
      field: 'actions',
      headerName: '',
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setEditingGroup(params.row as MerchantGroup); setDialogOpen(true); }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(params.row as MerchantGroup); }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const assignmentCount = deleteConfirm ? countAssignmentsForGroup(deleteConfirm.id, assignments) : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
          {groups.length} Merchant Group{groups.length !== 1 ? 's' : ''}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => { setEditingGroup(null); setDialogOpen(true); }}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Create Group
        </Button>
      </Box>

      <DataGrid
        rows={groups}
        columns={columns}
        density="compact"
        disableRowSelectionOnClick
        hideFooter={groups.length <= 25}
        sx={{
          border: '1px solid #e8ebf0',
          borderRadius: 2,
          '& .MuiDataGrid-cell': { fontSize: 13 },
          '& .MuiDataGrid-columnHeader': { fontSize: 12, fontWeight: 600, color: '#6b7280' },
        }}
      />

      <MerchantGroupDialog
        open={dialogOpen}
        editingGroup={editingGroup}
        entities={entities}
        existingGroupCount={groups.length}
        onClose={() => { setDialogOpen(false); setEditingGroup(null); }}
        onConfirm={(data) => {
          if (editingGroup) {
            onEditGroup(editingGroup.id, data);
          } else {
            onAddGroup(data);
          }
        }}
      />

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Delete Group</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13 }}>
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?
          </Typography>
          {assignmentCount > 0 && (
            <Typography sx={{ fontSize: 13, color: '#dc2626', mt: 1 }}>
              This group has {assignmentCount} rate card assignment{assignmentCount !== 1 ? 's' : ''} that will be removed.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => { if (deleteConfirm) onDeleteGroup(deleteConfirm.id); setDeleteConfirm(null); }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

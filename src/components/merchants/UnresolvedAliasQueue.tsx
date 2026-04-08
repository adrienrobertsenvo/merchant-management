import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import type { UnresolvedAlias, BillingEntity } from '../../types/merchant';

// Row state: null = nothing selected, { type: 'create', name } = new merchant created, { type: 'merge', entityId } = merge target picked
type RowState = null | { type: 'create'; name: string } | { type: 'merge'; entityId: string };

interface UnresolvedAliasQueueProps {
  aliases: UnresolvedAlias[];
  entities: BillingEntity[];
  onSelectAlias: (alias: UnresolvedAlias) => void;
  onMerge: (aliasId: string, entityId: string) => void;
  onCreateNew: (aliasId: string) => void;
  onDismiss: (aliasId: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const CREATE_VALUE = '__create_new__';

export default function UnresolvedAliasQueue({ aliases, entities, onSelectAlias, onMerge, onCreateNew }: UnresolvedAliasQueueProps) {
  const [search, setSearch] = useState('');
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  // Inline create mode: aliasId -> name being typed
  const [inlineCreate, setInlineCreate] = useState<Record<string, string>>({});

  const visibleAliases = useMemo(() => aliases.filter(a => !removedIds.has(a.id)), [aliases, removedIds]);

  const filtered = useMemo(() => {
    let result = visibleAliases;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.aliasName.toLowerCase().includes(q) ||
        a.suggestedMatches.some(m => m.entityName.toLowerCase().includes(q))
      );
    }
    return result;
  }, [visibleAliases, search]);

  const getRowState = (aliasId: string): RowState => rowStates[aliasId] ?? null;

  // Dropdown value: '' = nothing, '__create_new__' = create, entityId = merge
  const getDropdownValue = (aliasId: string): string => {
    const state = getRowState(aliasId);
    if (!state) return '';
    if (state.type === 'create') return CREATE_VALUE;
    return state.entityId;
  };

  const handleDropdownChange = (alias: UnresolvedAlias, value: string) => {
    if (value === CREATE_VALUE) {
      // Switch to inline create mode
      setInlineCreate(prev => ({ ...prev, [alias.id]: alias.aliasName }));
      setRowStates(prev => ({ ...prev, [alias.id]: null }));
    } else if (value === '') {
      setRowStates(prev => ({ ...prev, [alias.id]: null }));
      setInlineCreate(prev => { const next = { ...prev }; delete next[alias.id]; return next; });
    } else {
      setRowStates(prev => ({ ...prev, [alias.id]: { type: 'merge', entityId: value } }));
      setInlineCreate(prev => { const next = { ...prev }; delete next[alias.id]; return next; });
    }
  };

  const handleInlineCreateConfirm = (alias: UnresolvedAlias) => {
    const name = inlineCreate[alias.id];
    if (!name?.trim()) return;
    onCreateNew(alias.id);
    setRemovedIds(prev => new Set([...prev, alias.id]));
    setInlineCreate(prev => { const next = { ...prev }; delete next[alias.id]; return next; });
  };

  const handleRowConfirm = (alias: UnresolvedAlias) => {
    const state = getRowState(alias.id);
    if (!state) return;
    if (state.type === 'create') {
      onCreateNew(alias.id);
    } else {
      onMerge(alias.id, state.entityId);
    }
    // Remove row from view
    setRemovedIds(prev => new Set([...prev, alias.id]));
  };

  const columns: GridColDef<UnresolvedAlias>[] = [
    {
      field: 'aliasName',
      headerName: 'Alias / Account Number',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<UnresolvedAlias>) => (
        <Typography
          onClick={() => onSelectAlias(params.row)}
          sx={{ fontSize: 13.5, fontWeight: 600, color: '#2563eb', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          {params.value as string}
        </Typography>
      ),
    },
    {
      field: 'firstSeen',
      headerName: 'Created',
      width: 100,
      renderCell: (params: GridRenderCellParams<UnresolvedAlias>) => (
        <Typography sx={{ fontSize: 12.5, color: '#6b7280' }}>
          {formatDate(params.value as string)}
        </Typography>
      ),
    },
    {
      field: 'assignTo',
      headerName: 'Assign to Merchant',
      flex: 1.5,
      minWidth: 280,
      sortable: false,
      renderCell: (params: GridRenderCellParams<UnresolvedAlias>) => {
        const alias = params.row;
        const isInlineCreate = alias.id in inlineCreate;

        if (isInlineCreate) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%' }} onClick={(e) => e.stopPropagation()}>
              <TextField
                size="small"
                value={inlineCreate[alias.id] ?? ''}
                onChange={(e) => setInlineCreate(prev => ({ ...prev, [alias.id]: e.target.value }))}
                placeholder="Merchant name..."
                autoFocus
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { fontSize: 12.5 } }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleInlineCreateConfirm(alias); }}
              />
              <IconButton size="small" onClick={() => handleInlineCreateConfirm(alias)} disabled={!inlineCreate[alias.id]?.trim()}
                sx={{ color: '#fff', bgcolor: '#2563eb', width: 28, height: 28, '&:hover': { bgcolor: '#1d4ed8' }, '&.Mui-disabled': { bgcolor: '#93c5fd', color: '#fff' } }}>
                <CheckCircleIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" onClick={() => { setInlineCreate(prev => { const n = { ...prev }; delete n[alias.id]; return n; }); }}
                sx={{ color: '#6b7280', width: 28, height: 28 }}>
                <Typography sx={{ fontSize: 16, lineHeight: 1 }}>×</Typography>
              </IconButton>
            </Box>
          );
        }

        const dropdownValue = getDropdownValue(alias.id);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <TextField
              select
              size="small"
              value={dropdownValue}
              onChange={(e) => handleDropdownChange(alias, e.target.value)}
              fullWidth
              sx={{ '& .MuiSelect-select': { fontSize: 12.5 } }}
              slotProps={{ select: { displayEmpty: true } }}
            >
              <MenuItem value="" sx={{ fontSize: 12.5, color: '#9ca3af' }}>Select action…</MenuItem>
              <MenuItem value={CREATE_VALUE} sx={{ fontSize: 12.5, fontWeight: 600, color: '#2563eb' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PersonAddIcon sx={{ fontSize: 16 }} />
                  Create new merchant
                </Box>
              </MenuItem>
              {entities.length > 0 && (
                <MenuItem disabled sx={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.3, opacity: 1, pt: 1.5 }}>
                  Merge into existing
                </MenuItem>
              )}
              {entities.map(ent => {
                const isSuggested = alias.suggestedMatches.some(m => m.entityId === ent.id);
                return (
                  <MenuItem key={ent.id} value={ent.id} sx={{ fontSize: 12.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Typography sx={{ fontSize: 12.5 }}>{ent.name}</Typography>
                      {isSuggested && (
                        <Chip label="Suggested" size="small" sx={{ ml: 'auto', height: 18, fontSize: 9, bgcolor: '#d1fae5', color: '#059669', fontWeight: 600 }} />
                      )}
                    </Box>
                  </MenuItem>
                );
              })}
            </TextField>
          </Box>
        );
      },
    },
    {
      field: 'shipmentCount',
      headerName: 'Shipments',
      width: 100,
      type: 'number',
      renderCell: (params: GridRenderCellParams<UnresolvedAlias>) => (
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
          {params.value as number}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UnresolvedAlias>) => {
        const alias = params.row;
        const state = getRowState(alias.id);

        if (!state) return null;

        const label = state.type === 'create'
          ? `Confirm: Create "${state.name}" (${alias.shipmentCount} shipments)`
          : `Confirm: Merge into ${entities.find(e => e.id === state.entityId)?.name}`;

        return (
          <Box onClick={(e) => e.stopPropagation()}>
            <Tooltip title={label}>
              <IconButton
                size="small"
                onClick={() => handleRowConfirm(alias)}
                sx={{
                  color: '#fff',
                  bgcolor: '#16a34a',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: '#15803d' },
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      {/* Search */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <TextField
          placeholder="Search aliases, account numbers, or merchants..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* DataGrid */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'firstSeen', sort: 'desc' }] },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          rowHeight={52}
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': { '&:hover': { backgroundColor: '#f8faff' } },
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#fafbfc' },
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', overflow: 'visible' },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
          }}
        />
      </Box>

    </Box>
  );
}

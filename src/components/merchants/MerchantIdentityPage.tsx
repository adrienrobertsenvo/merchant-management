import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ResolutionSummaryTiles from './ResolutionSummaryTiles';
import UnresolvedAliasQueue from './UnresolvedAliasQueue';
import AliasResolveDrawer from './AliasResolveDrawer';
import MerchantsList from './MerchantsList';
import UnmappedShipmentsTab from './UnmappedShipmentsTab';
import CreateMerchantDialog from './CreateMerchantDialog';
import AddMerchantDialog from './AddMerchantDialog';
import MergeConfirmDialog from './MergeConfirmDialog';
import { mockUnresolvedAliases, mockResolutionHistory, mockUnmappedShipments } from '../../data/mockMerchants';
import type { BillingEntity, UnresolvedAlias, ResolutionEvent, UnmappedShipment } from '../../types/merchant';

type TabValue = 'queue' | 'merchants' | 'unmapped-shipments';

interface PendingMerge {
  aliasId: string;
  aliasName: string;
  entityId: string;
  entityName: string;
  shipmentCount: number;
}

interface MerchantIdentityPageProps {
  entities: BillingEntity[];
  onEntitiesChange: (entities: BillingEntity[] | ((prev: BillingEntity[]) => BillingEntity[])) => void;
  onNavigateToMerchant: (merchantId: string) => void;
}

export default function MerchantIdentityPage({ entities, onEntitiesChange: setEntities, onNavigateToMerchant }: MerchantIdentityPageProps) {
  const [tab, setTab] = useState<TabValue>('merchants');
  const [unresolvedAliases, setUnresolvedAliases] = useState<UnresolvedAlias[]>(mockUnresolvedAliases);
  const [, setResolutionHistory] = useState<ResolutionEvent[]>(mockResolutionHistory);

  // Resolution queue state
  const [selectedAlias, setSelectedAlias] = useState<UnresolvedAlias | null>(null);
  const [createDialogAlias, setCreateDialogAlias] = useState<UnresolvedAlias | null>(null);
  const [pendingMerge, setPendingMerge] = useState<PendingMerge | null>(null);
  // Archive of merged aliases so they can be restored if removed
  const [, setAliasArchive] = useState<Record<string, UnresolvedAlias>>({});

  // Unmapped shipments state
  const [unmappedShipments, setUnmappedShipments] = useState<UnmappedShipment[]>(mockUnmappedShipments);

  // Merchants list state
  const [addMerchantOpen, setAddMerchantOpen] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Request merge — opens confirmation dialog
  const handleRequestMerge = useCallback((aliasId: string, entityId: string) => {
    const alias = unresolvedAliases.find(a => a.id === aliasId);
    const entity = entities.find(e => e.id === entityId);
    if (!alias || !entity) return;
    setPendingMerge({
      aliasId,
      aliasName: alias.aliasName,
      entityId,
      entityName: entity.name,
      shipmentCount: alias.shipmentCount,
    });
  }, [unresolvedAliases, entities]);

  // Confirmed merge — actually executes
  const handleConfirmMerge = useCallback(() => {
    if (!pendingMerge) return;
    const { aliasId, aliasName, entityId, entityName, shipmentCount } = pendingMerge;

    // Archive the full unresolved alias so it can be restored later
    const originalAlias = unresolvedAliases.find(a => a.id === aliasId);
    if (originalAlias) {
      setAliasArchive(prev => ({ ...prev, [aliasName]: originalAlias }));
    }

    setEntities(prev => prev.map(e =>
      e.id === entityId
        ? {
            ...e,
            aliases: [...e.aliases, { name: aliasName, addedAt: new Date().toISOString().split('T')[0], source: 'store' }],
            shipmentCount: e.shipmentCount + shipmentCount,
          }
        : e
    ));

    setUnresolvedAliases(prev => prev.filter(a => a.id !== aliasId));

    const event: ResolutionEvent = {
      id: `rh-${Date.now()}`,
      entityId,
      aliasName,
      action: 'merged',
      resolvedBy: 'agent@acme-logistics.de',
      resolvedAt: new Date().toISOString(),
      mergedIntoName: entityName,
    };
    setResolutionHistory(prev => [event, ...prev]);

    setSelectedAlias(null);
    setPendingMerge(null);
    showSnackbar(`"${aliasName}" merged into ${entityName}`);
  }, [pendingMerge, unresolvedAliases, showSnackbar]);

  const handleCreateNew = useCallback((aliasId: string) => {
    const alias = unresolvedAliases.find(a => a.id === aliasId);
    if (alias) setCreateDialogAlias(alias);
  }, [unresolvedAliases]);

  const handleConfirmCreate = useCallback((merchantName: string, mergeShipments: boolean) => {
    if (!createDialogAlias) return;

    const today = new Date().toISOString().split('T')[0];

    const newEntity: BillingEntity = {
      id: `ent-${Date.now()}`,
      name: merchantName,
      aliases: [{ name: createDialogAlias.aliasName, addedAt: today, source: 'store' }],
      contactEmail: '',
      country: '',
      shipmentCount: mergeShipments ? createDialogAlias.shipmentCount : 0,
      createdAt: today,
      lastActivity: today,
    };

    setEntities(prev => [newEntity, ...prev]);

    if (mergeShipments) {
      // Archive the alias for potential restoration and remove from queue
      setAliasArchive(prev => ({ ...prev, [createDialogAlias.aliasName]: createDialogAlias }));
      setUnresolvedAliases(prev => prev.filter(a => a.id !== createDialogAlias.id));
    }

    const event: ResolutionEvent = {
      id: `rh-${Date.now()}`,
      entityId: newEntity.id,
      aliasName: createDialogAlias.aliasName,
      action: 'created_new',
      resolvedBy: 'agent@acme-logistics.de',
      resolvedAt: new Date().toISOString(),
    };
    setResolutionHistory(prev => [event, ...prev]);

    setSelectedAlias(null);
    setCreateDialogAlias(null);

    if (mergeShipments) {
      showSnackbar(`New merchant "${merchantName}" created with ${createDialogAlias.shipmentCount} shipment${createDialogAlias.shipmentCount !== 1 ? 's' : ''}`);
    } else {
      showSnackbar(`New merchant "${merchantName}" created`);
    }
  }, [createDialogAlias, showSnackbar]);

  const handleDismiss = useCallback((aliasId: string) => {
    const alias = unresolvedAliases.find(a => a.id === aliasId);
    if (!alias) return;

    setUnresolvedAliases(prev => prev.filter(a => a.id !== aliasId));

    const event: ResolutionEvent = {
      id: `rh-${Date.now()}`,
      entityId: '',
      aliasName: alias.aliasName,
      action: 'dismissed',
      resolvedBy: 'agent@acme-logistics.de',
      resolvedAt: new Date().toISOString(),
    };
    setResolutionHistory(prev => [event, ...prev]);

    setSelectedAlias(null);
    showSnackbar(`"${alias.aliasName}" dismissed`, 'info');
  }, [unresolvedAliases, showSnackbar]);

  const handleAssignShipments = useCallback((shipmentIds: string[], merchantId: string) => {
    const entity = entities.find(e => e.id === merchantId);
    if (!entity) return;
    setUnmappedShipments(prev => prev.filter(s => !shipmentIds.includes(s.id)));
    setEntities(prev => prev.map(e =>
      e.id === merchantId
        ? { ...e, shipmentCount: e.shipmentCount + shipmentIds.length }
        : e
    ));
    showSnackbar(`${shipmentIds.length} shipment${shipmentIds.length !== 1 ? 's' : ''} assigned to "${entity.name}"`);
  }, [entities, showSnackbar]);

  const handleAddMerchant = useCallback((newEntity: BillingEntity) => {
    setEntities(prev => [newEntity, ...prev]);
    setAddMerchantOpen(false);
    showSnackbar(`Merchant "${newEntity.name}" created`);
  }, [showSnackbar]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Page header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111827', mb: 0.25 }}>
          Merchant Management
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: '#6b7280' }}>
          Resolve merchant name variations, account numbers, and manage billing entities
        </Typography>
      </Box>

      <ResolutionSummaryTiles unresolvedAliases={unresolvedAliases} billingEntities={entities} />

      <Box sx={{ borderBottom: '1px solid #e8ebf0', mb: 2.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setSelectedAlias(null);
          }}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: 14 },
            '& .Mui-selected': { fontWeight: 600 },
          }}
        >
          <Tab label="All Merchants" value="merchants" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                Unmapped Aliases
                {unresolvedAliases.length > 0 && (
                  <Box sx={{ bgcolor: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
                    {unresolvedAliases.length}
                  </Box>
                )}
              </Box>
            }
            value="queue"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                Unmapped Shipments
                {unmappedShipments.length > 0 && (
                  <Box sx={{ bgcolor: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
                    {unmappedShipments.length}
                  </Box>
                )}
              </Box>
            }
            value="unmapped-shipments"
          />
        </Tabs>
      </Box>

      {tab === 'queue' && !selectedAlias && (
        <UnresolvedAliasQueue
          aliases={unresolvedAliases}
          entities={entities}
          onSelectAlias={setSelectedAlias}
          onMerge={handleRequestMerge}
          onCreateNew={handleCreateNew}
          onDismiss={handleDismiss}
        />
      )}

      {tab === 'queue' && selectedAlias && (
        <Box sx={{ bgcolor: '#fff', border: '1px solid #e8ebf0', borderRadius: 2, p: 3, minHeight: 400 }}>
          <AliasResolveDrawer
            alias={selectedAlias}
            entities={entities}
            onBack={() => setSelectedAlias(null)}
            onMerge={handleRequestMerge}
            onCreateNew={handleCreateNew}
            onDismiss={handleDismiss}
          />
        </Box>
      )}

      {tab === 'merchants' && (
        <MerchantsList
          entities={entities}
          onSelectEntity={(entity) => onNavigateToMerchant(entity.id)}
          onAddMerchant={() => setAddMerchantOpen(true)}
          unresolvedAliases={unresolvedAliases}
          unmappedShipments={unmappedShipments}
          onSelectUnmapped={() => setTab('queue')}
        />
      )}

      {tab === 'unmapped-shipments' && (
        <UnmappedShipmentsTab
          shipments={unmappedShipments}
          entities={entities}
          onAssign={handleAssignShipments}
        />
      )}

      {/* Merge confirmation dialog */}
      <MergeConfirmDialog
        open={!!pendingMerge}
        aliasName={pendingMerge?.aliasName || ''}
        targetEntityName={pendingMerge?.entityName || ''}
        shipmentCount={pendingMerge?.shipmentCount || 0}
        onClose={() => setPendingMerge(null)}
        onConfirm={handleConfirmMerge}
      />

      <CreateMerchantDialog
        open={!!createDialogAlias}
        aliasName={createDialogAlias?.aliasName || ''}
        shipmentCount={createDialogAlias?.shipmentCount}
        onClose={() => setCreateDialogAlias(null)}
        onConfirm={handleConfirmCreate}
      />

      <AddMerchantDialog
        open={addMerchantOpen}
        onClose={() => setAddMerchantOpen(false)}
        onConfirm={handleAddMerchant}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

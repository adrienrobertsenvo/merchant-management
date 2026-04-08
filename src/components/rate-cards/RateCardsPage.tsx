import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AssignmentMatrix from './AssignmentMatrix';
import MerchantDetailPanel from './MerchantDetailPanel';
import RateCardsList from './RateCardsList';
import UnmappedChargesTab from './UnmappedChargesTab';
import RateCardSimulator from './RateCardSimulator';
import BatchAssignmentDialog from './BatchAssignmentDialog';
import { mockRateCards, mockMerchantGroups, mockAssignments } from '../../data/mockRateCards';
import { calculatePriority } from '../../utils/rateCardResolver';
import type { CarrierId, RateCard, MerchantGroup, RateCardAssignment, Surcharge } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

type TabValue = 'assignments' | 'selling-rates' | 'unmapped' | 'simulate';

interface RateCardsPageProps {
  entities: BillingEntity[];
}

export default function RateCardsPage({ entities }: RateCardsPageProps) {
  const [tab, setTab] = useState<TabValue>('assignments');
  const [rateCards, setRateCards] = useState<RateCard[]>(mockRateCards);
  const [groups] = useState<MerchantGroup[]>(mockMerchantGroups);
  const [assignments, setAssignments] = useState<RateCardAssignment[]>(mockAssignments);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  // Batch dialog state
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchSelections, setBatchSelections] = useState<Array<{ merchantId: string; merchantName: string; carrierIds: CarrierId[] }>>([]);

  const showSnackbar = useCallback((message: string) => {
    setSnackbar({ open: true, message });
  }, []);

  // === Assignment operations ===
  const handleAssign = useCallback((merchantId: string, carrierId: CarrierId, rateCardId: string) => {
    setAssignments(prev => {
      const filtered = prev.filter(a =>
        !(a.scope.type === 'merchant' && a.scope.merchantId === merchantId && a.carrierId === carrierId)
      );
      const scope = { type: 'merchant' as const, merchantId };
      const newAssignment: RateCardAssignment = {
        id: `asgn-${Date.now()}`,
        rateCardId,
        carrierId,
        scope,
        priority: calculatePriority(scope, carrierId),
        createdAt: new Date().toISOString(),
      };
      return [...filtered, newAssignment];
    });
    const rc = rateCards.find(r => r.id === rateCardId);
    const ent = entities.find(e => e.id === merchantId);
    if (rc && ent) showSnackbar(`Assigned "${rc.name}" to ${ent.name}`);
  }, [rateCards, entities, showSnackbar]);

  const handleRemoveAssignment = useCallback((merchantId: string, carrierId: CarrierId) => {
    setAssignments(prev => prev.filter(a =>
      !(a.scope.type === 'merchant' && a.scope.merchantId === merchantId && a.carrierId === carrierId)
    ));
    showSnackbar('Direct assignment removed');
  }, [showSnackbar]);

  // === Batch assignment ===
  const handleBatchAssign = useCallback((newAssignments: Omit<RateCardAssignment, 'id' | 'createdAt'>[]) => {
    setAssignments(prev => {
      let updated = [...prev];
      for (const na of newAssignments) {
        updated = updated.filter(a => {
          if (na.scope.type === 'merchant' && a.scope.type === 'merchant') {
            return !(a.scope.merchantId === na.scope.merchantId && a.carrierId === na.carrierId);
          }
          if (na.scope.type === 'global' && a.scope.type === 'global') {
            return !(a.carrierId === na.carrierId);
          }
          return true;
        });
        updated.push({
          ...na,
          id: `asgn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
        });
      }
      return updated;
    });
    showSnackbar(`${newAssignments.length} assignment${newAssignments.length !== 1 ? 's' : ''} applied`);
  }, [showSnackbar]);

  const openBatchDialog = useCallback((selections?: Array<{ merchantId: string; merchantName: string; carrierIds: CarrierId[] }>) => {
    setBatchSelections(selections ?? []);
    setBatchDialogOpen(true);
  }, []);

  // === Rate Card CRUD ===
  const handleAddRateCard = useCallback((data: Omit<RateCard, 'id' | 'createdAt'>) => {
    const newCard: RateCard = { ...data, id: `rc-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setRateCards(prev => [...prev, newCard]);
    showSnackbar(`Rate card "${data.name}" created`);
  }, [showSnackbar]);

  const handleEditRateCard = useCallback((id: string, data: Omit<RateCard, 'id' | 'createdAt'>) => {
    setRateCards(prev => prev.map(rc => rc.id === id ? { ...rc, ...data } : rc));
    showSnackbar(`Rate card "${data.name}" updated`);
  }, [showSnackbar]);

  const handleDeleteRateCard = useCallback((id: string) => {
    const card = rateCards.find(rc => rc.id === id);
    setRateCards(prev => prev.filter(rc => rc.id !== id));
    setAssignments(prev => prev.filter(a => a.rateCardId !== id));
    if (card) showSnackbar(`Rate card "${card.name}" deleted`);
  }, [rateCards, showSnackbar]);

  // === Surcharge editing ===
  const handleEditSurcharges = useCallback((rateCardId: string, surcharges: Surcharge[]) => {
    setRateCards(prev => prev.map(rc =>
      rc.id === rateCardId ? { ...rc, pricing: { ...rc.pricing!, surcharges } } : rc
    ));
    showSnackbar('Surcharges updated');
  }, [showSnackbar]);

  const selectedEntity = entities.find(e => e.id === selectedMerchantId) ?? null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Page header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#111827', mb: 0.25 }}>
          Rate Card Management
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: '#6b7280' }}>
          Manage selling prices for merchants — define markup rates per carrier
        </Typography>
      </Box>

      <Box sx={{ borderBottom: '1px solid #e8ebf0', mb: 2.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); setSelectedMerchantId(null); }}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: 14 },
            '& .Mui-selected': { fontWeight: 600 },
          }}
        >
          <Tab label="Merchant Overview" value="assignments" />
          <Tab label="Selling Rates" value="selling-rates" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                Unmapped Charges
                <Box sx={{ bgcolor: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
                  26
                </Box>
              </Box>
            }
            value="unmapped"
          />
          <Tab label="Simulate" value="simulate" />
        </Tabs>
      </Box>

      {tab === 'assignments' && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PlaylistAddCheckIcon />}
              onClick={() => openBatchDialog()}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: 13 }}
            >
              Batch Assign
            </Button>
          </Box>

          <AssignmentMatrix
            entities={entities}
            rateCards={rateCards}
            groups={groups}
            assignments={assignments}
            onAssign={handleAssign}
            onRemove={handleRemoveAssignment}
            selectedMerchantId={selectedMerchantId}
            onSelectMerchant={setSelectedMerchantId}
            onBatchAssignOpen={(selections) => openBatchDialog(selections)}
          />

          {selectedEntity && (
            <MerchantDetailPanel
              entity={selectedEntity}
              rateCards={rateCards}
              assignments={assignments}
              groups={groups}
              onClose={() => setSelectedMerchantId(null)}
            />
          )}
        </>
      )}

      {tab === 'selling-rates' && (
        <RateCardsList
          rateCards={rateCards}
          assignments={assignments}
          entities={entities}
          onAddRateCard={handleAddRateCard}
          onEditRateCard={handleEditRateCard}
          onDeleteRateCard={handleDeleteRateCard}
          onAssign={handleAssign}
          onRemoveAssignment={handleRemoveAssignment}
        />
      )}

      {tab === 'unmapped' && (
        <UnmappedChargesTab
          rateCards={rateCards}
          onEditSurcharges={handleEditSurcharges}
        />
      )}

      {tab === 'simulate' && (
        <RateCardSimulator />
      )}

      {/* Batch Assignment Dialog */}
      <BatchAssignmentDialog
        open={batchDialogOpen}
        onClose={() => setBatchDialogOpen(false)}
        entities={entities}
        groups={groups}
        rateCards={rateCards}
        onBatchAssign={handleBatchAssign}
        selections={batchSelections}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity="success"
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

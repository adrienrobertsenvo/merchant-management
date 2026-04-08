import React, { useMemo, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CarrierChip from './CarrierChip';
import AssignmentPopover from './AssignmentPopover';
import BatchActionBar from './BatchActionBar';
import { CARRIER_IDS, CARRIERS } from '../../constants/rateCardConfig';
import { resolveRateCardWithCandidates } from '../../utils/rateCardResolver';
import type { CarrierId, RateCard, MerchantGroup, RateCardAssignment, ResolvedRateCard, CandidateAssignment } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

interface AssignmentMatrixProps {
  entities: BillingEntity[];
  rateCards: RateCard[];
  groups: MerchantGroup[];
  assignments: RateCardAssignment[];
  onAssign: (merchantId: string, carrierId: CarrierId, rateCardId: string) => void;
  onRemove: (merchantId: string, carrierId: CarrierId) => void;
  selectedMerchantId: string | null;
  onSelectMerchant: (merchantId: string | null) => void;
  onBatchAssignOpen?: (selections: Array<{ merchantId: string; merchantName: string; carrierIds: CarrierId[] }>) => void;
}

interface CarrierRow {
  carrierId: CarrierId;
  resolved: ResolvedRateCard | null;
  candidates: CandidateAssignment[];
  realizedMarkup: number; // simulated realized markup %
}

/** Simulate a realized markup % for a rate card. In production this comes from shipment data. */
function simulateMarkup(rc: RateCard, carrierId: CarrierId): number {
  const seed = (rc.id + carrierId).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  // For markup cards, use the value directly; for fixed cards, simulate a realistic margin %
  const base = rc.markup ?? 15;
  // Add ±1.5% variance per carrier for realism
  const variance = ((seed % 30) - 15) / 10;
  return Math.round((base + variance) * 10) / 10;
}

interface MerchantBlock {
  entity: BillingEntity;
  groups: MerchantGroup[];
  carrierRows: CarrierRow[];
  carrierCount: number;
  rateCardSummary: string; // e.g. "Enterprise Pricing" or "Enterprise Pricing +2"
  avgMarkup: number; // average markup % across carriers (simulated)
}

export default function AssignmentMatrix({ entities, rateCards, groups, assignments, onAssign, onRemove, selectedMerchantId, onSelectMerchant, onBatchAssignOpen }: AssignmentMatrixProps) {
  const [search, setSearch] = useState('');
  const [merchantFilters, setMerchantFilters] = useState<string[]>([]);
  const [carrierFilters, setCarrierFilters] = useState<CarrierId[]>([]);
  const [rateCardFilters, setRateCardFilters] = useState<string[]>([]);
  const [showInherited, setShowInherited] = useState(true);

  const addMerchantFilter = (id: string) => { if (id && !merchantFilters.includes(id)) setMerchantFilters(prev => [...prev, id]); };
  const removeMerchantFilter = (id: string) => setMerchantFilters(prev => prev.filter(f => f !== id));
  const addCarrierFilter = (id: CarrierId) => { if (id && !carrierFilters.includes(id)) setCarrierFilters(prev => [...prev, id]); };
  const removeCarrierFilter = (id: CarrierId) => setCarrierFilters(prev => prev.filter(f => f !== id));
  const addRateCardFilter = (id: string) => { if (id && !rateCardFilters.includes(id)) setRateCardFilters(prev => [...prev, id]); };
  const removeRateCardFilter = (id: string) => setRateCardFilters(prev => prev.filter(f => f !== id));
  const clearAllFilters = () => { setMerchantFilters([]); setCarrierFilters([]); setRateCardFilters([]); setSearch(''); };
  const [selectedMerchantIds, setSelectedMerchantIds] = useState<Set<string>>(new Set());
  const [expandedMerchants, setExpandedMerchants] = useState<Set<string>>(new Set());

  // Popover state
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverData, setPopoverData] = useState<{
    merchantId: string;
    merchantName: string;
    carrierId: CarrierId;
    resolved: ResolvedRateCard | null;
    candidates: CandidateAssignment[];
  } | null>(null);

  // Inline assign confirmation dialog
  const [assignConfirm, setAssignConfirm] = useState<{
    merchantId: string;
    merchantName: string;
    carrierId: CarrierId;
    rateCardId: string;
    rateCardName: string;
    applyFrom: string;
    applyUntil: string;
  } | null>(null);

  const openAssignConfirm = (merchantId: string, merchantName: string, carrierId: CarrierId, rateCardId: string) => {
    const rc = rateCards.find(r => r.id === rateCardId);
    setAssignConfirm({
      merchantId,
      merchantName,
      carrierId,
      rateCardId,
      rateCardName: rc?.name ?? rateCardId,
      applyFrom: new Date().toISOString().slice(0, 10),
      applyUntil: '',
    });
  };

  const confirmAssign = () => {
    if (!assignConfirm || !assignConfirm.applyFrom) return;
    onAssign(assignConfirm.merchantId, assignConfirm.carrierId, assignConfirm.rateCardId);
    setAssignConfirm(null);
  };

  const activeEntities = entities.filter(e => !e.archived);

  const filteredEntities = useMemo(() => {
    let result = activeEntities;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(q));
    }
    if (merchantFilters.length > 0) {
      result = result.filter(e => merchantFilters.includes(e.id));
    }
    return [...result].sort((a, b) => a.name.localeCompare(b.name));
  }, [activeEntities, search, merchantFilters]);

  // Build merchant blocks using per-merchant carrier lists
  const merchantBlocks = useMemo((): MerchantBlock[] => {
    return filteredEntities.map(entity => {
      const entityGroups = groups.filter(g => g.merchantIds.includes(entity.id));
      const merchantCarriers = entity.carrierIds ?? CARRIER_IDS;

      const carrierRows: CarrierRow[] = [];
      for (const cId of merchantCarriers) {
        const { winner, candidates } = resolveRateCardWithCandidates(entity.id, cId, assignments, rateCards, groups);
        if (!showInherited && winner?.inherited) continue;
        const realizedMarkup = winner ? simulateMarkup(winner.rateCard, cId) : 0;
        carrierRows.push({ carrierId: cId, resolved: winner, candidates, realizedMarkup });
      }

      // Rate card summary: "Enterprise Pricing" or "Enterprise Pricing +2"
      const rcNameCounts = new Map<string, number>();
      for (const cr of carrierRows) {
        if (cr.resolved) {
          const name = cr.resolved.rateCard.name;
          rcNameCounts.set(name, (rcNameCounts.get(name) ?? 0) + 1);
        }
      }
      const sorted = [...rcNameCounts.entries()].sort((a, b) => b[1] - a[1]);
      let rateCardSummary = '—';
      if (sorted.length === 1) {
        rateCardSummary = sorted[0][0];
      } else if (sorted.length > 1) {
        rateCardSummary = `${sorted[0][0]} +${sorted.length - 1}`;
      }

      // Avg realized markup % across carriers
      const withMarkup = carrierRows.filter(cr => cr.resolved);
      const avgMarkup = withMarkup.length > 0
        ? withMarkup.reduce((sum, cr) => sum + cr.realizedMarkup, 0) / withMarkup.length
        : 0;

      // Apply carrier/rate card filters to the rows themselves
      let filteredRows = carrierRows;
      if (carrierFilters.length > 0) filteredRows = filteredRows.filter(cr => carrierFilters.includes(cr.carrierId));
      if (rateCardFilters.length > 0) filteredRows = filteredRows.filter(cr => cr.resolved && rateCardFilters.includes(cr.resolved.rateCard.id));

      // Recompute summary from filtered rows
      const frcNameCounts = new Map<string, number>();
      for (const cr of filteredRows) {
        if (cr.resolved) {
          const name = cr.resolved.rateCard.name;
          frcNameCounts.set(name, (frcNameCounts.get(name) ?? 0) + 1);
        }
      }
      const fSorted = [...frcNameCounts.entries()].sort((a, b) => b[1] - a[1]);
      let filteredSummary = '—';
      if (fSorted.length === 1) filteredSummary = fSorted[0][0];
      else if (fSorted.length > 1) filteredSummary = `${fSorted[0][0]} +${fSorted.length - 1}`;

      const fWithMarkup = filteredRows.filter(cr => cr.resolved);
      const filteredAvgMarkup = fWithMarkup.length > 0
        ? fWithMarkup.reduce((sum, cr) => sum + cr.realizedMarkup, 0) / fWithMarkup.length
        : 0;

      return {
        entity,
        groups: entityGroups,
        carrierRows: filteredRows,
        carrierCount: filteredRows.length,
        rateCardSummary: filteredSummary,
        avgMarkup: filteredAvgMarkup,
      };
    }).filter(b => b.carrierRows.length > 0);
  }, [filteredEntities, groups, assignments, rateCards, showInherited, carrierFilters, rateCardFilters]);

  const toggleExpand = useCallback((merchantId: string) => {
    setExpandedMerchants(prev => {
      const next = new Set(prev);
      if (next.has(merchantId)) next.delete(merchantId);
      else next.add(merchantId);
      return next;
    });
  }, []);

  const toggleMerchant = useCallback((merchantId: string) => {
    setSelectedMerchantIds(prev => {
      const next = new Set(prev);
      if (next.has(merchantId)) next.delete(merchantId);
      else next.add(merchantId);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedMerchantIds(prev => {
      if (prev.size === merchantBlocks.length) return new Set();
      return new Set(merchantBlocks.map(b => b.entity.id));
    });
  }, [merchantBlocks]);

  const expandAll = useCallback(() => {
    setExpandedMerchants(new Set(merchantBlocks.map(b => b.entity.id)));
  }, [merchantBlocks]);

  const collapseAll = useCallback(() => {
    setExpandedMerchants(new Set());
  }, []);

  const allSelected = merchantBlocks.length > 0 && selectedMerchantIds.size === merchantBlocks.length;
  const someSelected = selectedMerchantIds.size > 0 && !allSelected;
  const allExpanded = expandedMerchants.size === merchantBlocks.length && merchantBlocks.length > 0;

  const openPopover = (
    e: React.MouseEvent<HTMLElement>,
    merchantId: string,
    merchantName: string,
    carrierId: CarrierId,
    resolved: ResolvedRateCard | null,
    candidates: CandidateAssignment[],
  ) => {
    e.stopPropagation();
    setPopoverAnchor(e.currentTarget);
    setPopoverData({ merchantId, merchantName, carrierId, resolved, candidates });
  };

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search merchants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ width: 200 }}
        />
        <TextField
          select
          size="small"
          value=""
          onChange={e => addMerchantFilter(e.target.value)}
          sx={{ width: 160, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13, color: '#9ca3af' }}>Merchant</MenuItem>
          {entities.filter(e => !e.archived && !merchantFilters.includes(e.id)).sort((a, b) => a.name.localeCompare(b.name)).map(e => (
            <MenuItem key={e.id} value={e.id} sx={{ fontSize: 13 }}>{e.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value=""
          onChange={e => addCarrierFilter(e.target.value as CarrierId)}
          sx={{ width: 140, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13, color: '#9ca3af' }}>Carrier</MenuItem>
          {CARRIER_IDS.filter(id => !carrierFilters.includes(id)).map(id => (
            <MenuItem key={id} value={id} sx={{ fontSize: 13 }}>{CARRIERS[id].label}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value=""
          onChange={e => addRateCardFilter(e.target.value)}
          sx={{ width: 160, '& .MuiSelect-select': { fontSize: 13 } }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="" sx={{ fontSize: 13, color: '#9ca3af' }}>Sell Rate Card</MenuItem>
          {rateCards.filter(rc => !rateCardFilters.includes(rc.id)).map(rc => (
            <MenuItem key={rc.id} value={rc.id} sx={{ fontSize: 13 }}>{rc.name}</MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={<Switch size="small" checked={showInherited} onChange={(_, v) => setShowInherited(v)} />}
          label={<Typography sx={{ fontSize: 13 }}>Show inherited</Typography>}
        />
        <Typography
          onClick={allExpanded ? collapseAll : expandAll}
          sx={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </Typography>
        <Typography sx={{ ml: 'auto', fontSize: 13, color: '#6b7280' }}>
          {merchantBlocks.length} merchant{merchantBlocks.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Active filter chips */}
      {(merchantFilters.length > 0 || carrierFilters.length > 0 || rateCardFilters.length > 0) && (
        <Box sx={{ display: 'flex', gap: 0.75, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {merchantFilters.map(id => {
            const ent = entities.find(e => e.id === id);
            return (
              <Chip
                key={`m-${id}`}
                label={ent?.name ?? id}
                size="small"
                onDelete={() => removeMerchantFilter(id)}
                sx={{ fontSize: 11, fontWeight: 500, height: 26, bgcolor: '#eff6ff', color: '#1d4ed8', '& .MuiChip-deleteIcon': { color: '#93c5fd', '&:hover': { color: '#1d4ed8' } } }}
              />
            );
          })}
          {carrierFilters.map(id => (
            <Chip
              key={`c-${id}`}
              label={CARRIERS[id]?.label ?? id}
              size="small"
              onDelete={() => removeCarrierFilter(id)}
              sx={{ fontSize: 11, fontWeight: 500, height: 26, bgcolor: CARRIERS[id]?.color ?? '#f3f4f6', color: CARRIERS[id]?.textColor ?? '#374151', '& .MuiChip-deleteIcon': { color: 'inherit', opacity: 0.7, '&:hover': { opacity: 1 } } }}
            />
          ))}
          {rateCardFilters.map(id => {
            const rc = rateCards.find(r => r.id === id);
            return (
              <Chip
                key={`r-${id}`}
                label={rc?.name ?? id}
                size="small"
                onDelete={() => removeRateCardFilter(id)}
                sx={{ fontSize: 11, fontWeight: 500, height: 26, bgcolor: '#f0fdf4', color: '#16a34a', '& .MuiChip-deleteIcon': { color: '#86efac', '&:hover': { color: '#16a34a' } } }}
              />
            );
          })}
          <Typography
            onClick={clearAllFilters}
            sx={{ fontSize: 11, color: '#6b7280', cursor: 'pointer', ml: 0.5, '&:hover': { color: '#dc2626', textDecoration: 'underline' } }}
          >
            Clear all
          </Typography>
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, borderColor: '#e8ebf0' }}>
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 42 }} />
            <col style={{ width: 40 }} />
            <col style={{ width: 240 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 300 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              <TableCell padding="checkbox" sx={{ borderBottom: '2px solid #e8ebf0' }}>
                <Checkbox size="small" checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e8ebf0' }} />
              <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#374151', borderBottom: '2px solid #e8ebf0' }}>Merchant</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#374151', borderBottom: '2px solid #e8ebf0' }}>Carriers</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#374151', borderBottom: '2px solid #e8ebf0' }}>Sell Rate Card</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#374151', borderBottom: '2px solid #e8ebf0' }}>Avg Margin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchantBlocks.map((block, blockIdx) => {
              const isExpanded = expandedMerchants.has(block.entity.id);
              const isSelected = selectedMerchantIds.has(block.entity.id);
              const isEven = blockIdx % 2 === 0;
              const bgColor = isSelected ? '#eef4ff' : isEven ? '#fff' : '#fafbfc';

              return (
                <React.Fragment key={block.entity.id}>
                  {/* Collapsed / summary row */}
                  <TableRow
                    sx={{
                      bgcolor: bgColor,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: isSelected ? '#e0ecff' : '#f0f5ff' },
                    }}
                    onClick={() => toggleExpand(block.entity.id)}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{ borderBottom: isExpanded ? 'none' : '1px solid #e8ebf0' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox size="small" checked={isSelected} onChange={() => toggleMerchant(block.entity.id)} />
                    </TableCell>

                    <TableCell sx={{ borderBottom: isExpanded ? 'none' : '1px solid #e8ebf0', px: 0.5 }}>
                      <IconButton size="small" sx={{ p: 0.25 }}>
                        {isExpanded
                          ? <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                          : <KeyboardArrowRightIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                        }
                      </IconButton>
                    </TableCell>

                    {/* Merchant */}
                    <TableCell sx={{ borderBottom: isExpanded ? 'none' : '1px solid #e8ebf0', py: 1 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                        {block.entity.name}
                      </Typography>
                    </TableCell>

                    {/* Carriers — always show count */}
                    <TableCell sx={{ borderBottom: isExpanded ? 'none' : '1px solid #e8ebf0', py: 1 }}>
                      <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
                        {block.carrierCount} carrier{block.carrierCount !== 1 ? 's' : ''}
                      </Typography>
                    </TableCell>

                    {/* Rate Card — summary: primary name + count */}
                    <TableCell sx={{ borderBottom: isExpanded ? 'none' : '1px solid #e8ebf0', py: 1 }}>
                      <Typography sx={{ fontSize: 12, color: '#374151' }}>
                        {block.rateCardSummary}
                      </Typography>
                    </TableCell>

                    {/* Markup — always a percentage */}
                    <TableCell sx={{ borderBottom: isExpanded ? 'none' : '1px solid #e8ebf0', py: 1 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                        +{block.avgMarkup.toFixed(1)}%
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* Expanded carrier rows — rendered in the same table for column alignment */}
                  {isExpanded && block.carrierRows.map((cr, crIdx) => {
                    const isDirect = cr.resolved && !cr.resolved.inherited;
                    const isOverride = isDirect && cr.candidates.some(c => !c.isWinner && c.inherited);
                    const isLastCarrier = crIdx === block.carrierRows.length - 1;

                    return (
                      <TableRow
                        key={`${block.entity.id}:${cr.carrierId}`}
                        sx={{
                          bgcolor: isSelected ? '#eef4ff' : isEven ? '#fff' : '#fafbfc',
                          '&:hover': { bgcolor: isSelected ? '#e0ecff' : '#f5f8ff' },
                        }}
                      >
                        {/* Checkbox — empty */}
                        <TableCell padding="checkbox" sx={{ borderBottom: isLastCarrier ? '1px solid #e8ebf0' : 'none' }} />

                        {/* Expand — empty */}
                        <TableCell sx={{ borderBottom: isLastCarrier ? '1px solid #e8ebf0' : 'none' }} />

                        {/* Merchant — empty */}
                        <TableCell sx={{ borderBottom: isLastCarrier ? '1px solid #e8ebf0' : 'none' }} />

                        {/* Carrier */}
                        <TableCell sx={{ py: 0.75, borderBottom: isLastCarrier ? '1px solid #e8ebf0' : 'none' }}>
                          <CarrierChip carrierId={cr.carrierId} />
                        </TableCell>

                        {/* Sell Rate Card — dropdown */}
                        <TableCell sx={{ py: 0.5, borderBottom: isLastCarrier ? '1px solid #e8ebf0' : 'none' }}>
                          <TextField
                            select
                            size="small"
                            value={cr.resolved?.rateCard.id ?? ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                openAssignConfirm(block.entity.id, block.entity.name, cr.carrierId, e.target.value);
                              } else {
                                onRemove(block.entity.id, cr.carrierId);
                              }
                            }}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': { fontSize: 12, bgcolor: '#fff' },
                              '& .MuiSelect-select': { py: 0.5, px: 1 },
                              '& fieldset': { borderColor: '#e8ebf0' },
                            }}
                            slotProps={{ select: { displayEmpty: true } }}
                          >
                            <MenuItem value="" sx={{ fontSize: 12, color: '#9ca3af' }}>— none —</MenuItem>
                            {rateCards
                              .filter(rc => !rc.carrierId || rc.carrierId === cr.carrierId)
                              .map(rc => (
                                <MenuItem key={rc.id} value={rc.id} sx={{ fontSize: 12 }}>{rc.name}</MenuItem>
                              ))}
                          </TextField>
                        </TableCell>

                        {/* Markup — always a % */}
                        <TableCell sx={{ py: 0.75, borderBottom: isLastCarrier ? '1px solid #e8ebf0' : 'none' }}>
                          {cr.resolved && (
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                              {cr.realizedMarkup > 0 ? '+' : ''}{cr.realizedMarkup.toFixed(1)}%
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {merchantBlocks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ fontSize: 14, color: '#9ca3af' }}>No merchants found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popover */}
      {popoverData && (
        <AssignmentPopover
          anchorEl={popoverAnchor}
          onClose={() => { setPopoverAnchor(null); setPopoverData(null); }}
          merchantName={popoverData.merchantName}
          carrierId={popoverData.carrierId}
          resolved={popoverData.resolved}
          availableRateCards={rateCards}
          candidates={popoverData.candidates}
          onAssign={(rateCardId) => onAssign(popoverData.merchantId, popoverData.carrierId, rateCardId)}
          onRemove={() => onRemove(popoverData.merchantId, popoverData.carrierId)}
        />
      )}

      {/* Batch action bar */}
      {selectedMerchantIds.size > 0 && onBatchAssignOpen && (
        <BatchActionBar
          selectedCount={selectedMerchantIds.size}
          onBatchAssign={() => {
            const selections = merchantBlocks
              .filter(b => selectedMerchantIds.has(b.entity.id))
              .map(b => ({
                merchantId: b.entity.id,
                merchantName: b.entity.name,
                carrierIds: b.carrierRows.map(cr => cr.carrierId),
              }));
            onBatchAssignOpen(selections);
          }}
          onClear={() => setSelectedMerchantIds(new Set())}
        />
      )}

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 3, mt: 1.5, px: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Chip label="Direct" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd' }} />
          <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Direct assignment</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Chip label="Inherited" size="small" variant="outlined" sx={{ height: 18, fontSize: 10, color: '#6b7280', borderStyle: 'dashed' }} />
          <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Default / inherited</Typography>
        </Box>
      </Box>

      {/* Inline assign confirmation dialog */}
      <Dialog open={!!assignConfirm} onClose={() => setAssignConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>
          Assign Sell Rate Card
        </DialogTitle>
        {assignConfirm && (
          <DialogContent>
            <Box sx={{ mb: 2.5, p: 1.5, bgcolor: '#f8f9fb', borderRadius: 1, border: '1px solid #e8ebf0' }}>
              <Typography sx={{ fontSize: 13, color: '#374151' }}>
                <strong>{assignConfirm.rateCardName}</strong> → {assignConfirm.merchantName}
              </Typography>
              <Box sx={{ mt: 0.75 }}>
                <CarrierChip carrierId={assignConfirm.carrierId} size="small" />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Apply From *"
                type="date"
                size="small"
                value={assignConfirm.applyFrom}
                onChange={(e) => setAssignConfirm(prev => prev ? { ...prev, applyFrom: e.target.value } : null)}
                fullWidth
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Apply Until"
                type="date"
                size="small"
                value={assignConfirm.applyUntil}
                onChange={(e) => setAssignConfirm(prev => prev ? { ...prev, applyUntil: e.target.value } : null)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssignConfirm(null)} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!assignConfirm?.applyFrom}
            onClick={confirmAssign}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

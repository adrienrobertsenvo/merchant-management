import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CarrierChip from './CarrierChip';
import AssignmentPopover from './AssignmentPopover';
import { CARRIER_IDS } from '../../constants/rateCardConfig';
import { resolveRateCardWithCandidates } from '../../utils/rateCardResolver';
import type { CarrierId, RateCard, MerchantGroup, RateCardAssignment, ResolvedRateCard, CandidateAssignment } from '../../types/rateCard';
import type { BillingEntity } from '../../types/merchant';

function simulateMarkup(rc: RateCard, carrierId: CarrierId): number {
  const seed = (rc.id + carrierId).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = rc.markup ?? 15;
  const variance = ((seed % 30) - 15) / 10;
  return Math.round((base + variance) * 10) / 10;
}

interface HierarchicalMatrixProps {
  entities: BillingEntity[];
  rateCards: RateCard[];
  groups: MerchantGroup[];
  assignments: RateCardAssignment[];
  onAssign: (merchantId: string, carrierId: CarrierId, rateCardId: string) => void;
  onRemove: (merchantId: string, carrierId: CarrierId) => void;
  onBatchAssignGroup: (groupId: string) => void;
}

interface GroupSection {
  group: MerchantGroup | null;
  merchants: BillingEntity[];
}

export default function HierarchicalMatrix({
  entities,
  rateCards,
  groups,
  assignments,
  onAssign,
  onRemove,
  onBatchAssignGroup,
}: HierarchicalMatrixProps) {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('');
  const [showInherited, setShowInherited] = useState(true);

  // Popover state
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverData, setPopoverData] = useState<{
    merchantId: string;
    merchantName: string;
    carrierId: CarrierId;
    resolved: ResolvedRateCard | null;
    candidates: CandidateAssignment[];
  } | null>(null);

  const activeEntities = entities.filter(e => !e.archived);

  const filteredEntities = useMemo(() => {
    let result = activeEntities;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(q));
    }
    return result;
  }, [activeEntities, search]);

  const sections = useMemo((): GroupSection[] => {
    const assignedMerchantIds = new Set<string>();

    const filteredGroups = groupFilter
      ? groups.filter(g => g.id === groupFilter)
      : groups;

    const result: GroupSection[] = filteredGroups.map(g => {
      const merchants = filteredEntities.filter(e => g.merchantIds.includes(e.id));
      merchants.forEach(m => assignedMerchantIds.add(m.id));
      return { group: g, merchants };
    }).filter(s => s.merchants.length > 0);

    if (!groupFilter) {
      const ungroupedMerchants = filteredEntities.filter(e => !assignedMerchantIds.has(e.id));
      if (ungroupedMerchants.length > 0) {
        result.push({ group: null, merchants: ungroupedMerchants });
      }
    }

    return result;
  }, [filteredEntities, groups, groupFilter]);

  const getOverrideCount = (group: MerchantGroup) => {
    let count = 0;
    for (const mId of group.merchantIds) {
      const entity = filteredEntities.find(e => e.id === mId);
      const mCarriers = entity?.carrierIds ?? CARRIER_IDS;
      for (const cId of mCarriers) {
        const { winner } = resolveRateCardWithCandidates(mId, cId, assignments, rateCards, groups);
        if (winner && !winner.inherited) count++;
      }
    }
    return count;
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search merchants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ width: 220 }}
        />
        <TextField
          select
          size="small"
          value={groupFilter}
          onChange={e => setGroupFilter(e.target.value)}
          sx={{ width: 180 }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="">All Groups</MenuItem>
          {groups.map(g => (
            <MenuItem key={g.id} value={g.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: g.color }} />
                <Typography sx={{ fontSize: 13 }}>{g.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value={carrierFilter}
          onChange={e => setCarrierFilter(e.target.value)}
          sx={{ width: 160 }}
          slotProps={{ select: { displayEmpty: true } }}
        >
          <MenuItem value="">All Carriers</MenuItem>
          {CARRIER_IDS.map(cId => (
            <MenuItem key={cId} value={cId}>
              <CarrierChip carrierId={cId} />
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={<Switch size="small" checked={showInherited} onChange={(_, v) => setShowInherited(v)} />}
          label={<Typography sx={{ fontSize: 13 }}>Show inherited</Typography>}
        />
      </Box>

      {/* Grouped accordions */}
      {sections.map((section, idx) => {
        const isUngrouped = !section.group;
        const overrideCount = section.group ? getOverrideCount(section.group) : 0;

        return (
          <Accordion
            key={section.group?.id ?? 'ungrouped'}
            defaultExpanded={idx < 3}
            sx={{
              border: '1px solid #e8ebf0',
              borderRadius: '8px !important',
              mb: 1.5,
              '&:before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 48,
                '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', gap: 1.5 },
              }}
            >
              {isUngrouped ? (
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#6b7280' }}>Ungrouped Merchants</Typography>
              ) : (
                <Chip
                  label={section.group!.name}
                  size="small"
                  sx={{
                    fontWeight: 700, fontSize: 12,
                    bgcolor: `${section.group!.color}18`,
                    color: section.group!.color,
                    border: `1.5px solid ${section.group!.color}50`,
                  }}
                />
              )}
              <Chip
                label={`${section.merchants.length} merchant${section.merchants.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{ height: 20, fontSize: 11, bgcolor: '#f3f4f6', color: '#6b7280' }}
              />
              {!isUngrouped && overrideCount > 0 && (
                <Chip
                  label={`${overrideCount} override${overrideCount !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{ height: 20, fontSize: 11, bgcolor: '#fef3c7', color: '#92400e', fontWeight: 600 }}
                />
              )}
              {!isUngrouped && (
                <Button
                  size="small"
                  startIcon={<PlaylistAddCheckIcon sx={{ fontSize: 16 }} />}
                  onClick={(e) => { e.stopPropagation(); onBatchAssignGroup(section.group!.id); }}
                  sx={{ ml: 'auto', mr: 1, textTransform: 'none', fontSize: 12, fontWeight: 600, color: '#3b82f6' }}
                >
                  Assign Rate Card
                </Button>
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0, pb: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280', width: 180, pl: 2.5 }}>Merchant</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280', width: 130 }}>Carrier</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280', width: 240 }}>Rate Card</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12, color: '#6b7280', width: 100 }}>Markup</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.merchants
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .flatMap((entity) => {
                      const merchantCarriers = carrierFilter
                        ? [carrierFilter as CarrierId]
                        : (entity.carrierIds ?? CARRIER_IDS);
                      return merchantCarriers.map((cId, cIdx) => {
                        const { winner, candidates } = resolveRateCardWithCandidates(entity.id, cId, assignments, rateCards, groups);

                        if (!showInherited && winner?.inherited) return null;

                        const isDirect = winner && !winner.inherited;
                        const isOverride = isDirect && candidates.some(c => !c.isWinner && c.inherited);
                        const isFirst = cIdx === 0;
                        const markup = winner ? simulateMarkup(winner.rateCard, cId) : 0;

                        return (
                          <TableRow
                            key={`${entity.id}:${cId}`}
                            hover
                            sx={{
                              '&:last-child td': { borderBottom: 0 },
                              ...(isFirst ? { borderTop: '1px solid #e8ebf0' } : {}),
                            }}
                          >
                            <TableCell sx={{ py: 0.75, pl: 2.5, borderBottom: isFirst ? undefined : 'none' }}>
                              {isFirst ? (
                                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{entity.name}</Typography>
                              ) : null}
                            </TableCell>
                            <TableCell sx={{ py: 0.75 }}>
                              <CarrierChip carrierId={cId} />
                            </TableCell>
                            <TableCell sx={{ py: 0.75 }}>
                              {winner ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                  <Chip
                                    label={winner.rateCard.name}
                                    size="small"
                                    variant={isDirect ? 'filled' : 'outlined'}
                                    onClick={(e) => openPopover(e, entity.id, entity.name, cId, winner, candidates)}
                                    sx={{
                                      height: 24, fontSize: 11, cursor: 'pointer',
                                      fontWeight: isDirect ? 600 : 400,
                                      bgcolor: isDirect ? (isOverride ? '#fef3c7' : '#eff6ff') : 'transparent',
                                      color: isDirect ? (isOverride ? '#92400e' : '#1d4ed8') : '#6b7280',
                                      borderColor: isDirect ? (isOverride ? '#fcd34d' : '#93c5fd') : '#d1d5db',
                                      borderStyle: isDirect ? 'solid' : 'dashed',
                                      '& .MuiChip-label': { px: 1 },
                                      '&:hover': { opacity: 0.8 },
                                    }}
                                  />
                                  {winner.inherited && (
                                    <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>
                                      via {winner.inheritedFrom}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Typography
                                  sx={{ fontSize: 12, color: '#d1d5db', cursor: 'pointer' }}
                                  onClick={(e) => openPopover(e, entity.id, entity.name, cId, null, candidates)}
                                >
                                  — assign
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ py: 0.75 }}>
                              {winner && (
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                                  +{markup.toFixed(1)}%
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      }).filter(Boolean);
                    })}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {sections.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6, color: '#9ca3af' }}>
          <Typography sx={{ fontSize: 14 }}>No merchants found</Typography>
        </Box>
      )}

      {/* Shared popover */}
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

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 3, mt: 2, px: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Chip label="Direct" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd' }} />
          <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Direct assignment</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Chip label="Override" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }} />
          <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Overrides group/global</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Chip label="Inherited" size="small" variant="outlined" sx={{ height: 18, fontSize: 10, color: '#6b7280', borderStyle: 'dashed' }} />
          <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Via group or global default</Typography>
        </Box>
      </Box>
    </Box>
  );
}

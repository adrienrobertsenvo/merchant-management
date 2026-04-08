import type { CarrierId, RateCard, MerchantGroup, RateCardAssignment, ResolvedRateCard, CandidateAssignment } from '../types/rateCard';

/**
 * Resolve the effective rate card for a given merchant × carrier pair.
 * Uses a specificity cascade:
 *   1 = merchant + carrier (most specific)
 *   2 = merchant + all carriers
 *   3 = group + carrier
 *   4 = group + all carriers
 *   5 = global default (least specific)
 *
 * Also checks carrier compatibility: a rate card with a carrierId set
 * is only usable for that specific carrier.
 *
 * Within the same priority, the most recently created assignment wins.
 */
export function resolveRateCard(
  merchantId: string,
  carrierId: CarrierId,
  assignments: RateCardAssignment[],
  rateCards: RateCard[],
  groups: MerchantGroup[],
): ResolvedRateCard | null {
  const rateCardMap = new Map(rateCards.map(rc => [rc.id, rc]));
  const merchantGroupIds = groups
    .filter(g => g.merchantIds.includes(merchantId))
    .map(g => g.id);
  const groupMap = new Map(groups.map(g => [g.id, g]));

  // Collect all matching assignments for this merchant × carrier
  const candidates: { assignment: RateCardAssignment; inherited: boolean; inheritedFrom?: string; source: 'direct' | 'group' | 'global' }[] = [];

  for (const a of assignments) {
    const matchesCarrier = a.carrierId === carrierId || a.carrierId === '*';
    if (!matchesCarrier) continue;

    // Check rate card carrier compatibility
    const rc = rateCardMap.get(a.rateCardId);
    if (!rc) continue;
    if (rc.carrierId && rc.carrierId !== carrierId) continue;

    if (a.scope.type === 'merchant' && a.scope.merchantId === merchantId) {
      candidates.push({ assignment: a, inherited: false, source: 'direct' });
    } else if (a.scope.type === 'group' && merchantGroupIds.includes(a.scope.groupId)) {
      const group = groupMap.get(a.scope.groupId);
      candidates.push({ assignment: a, inherited: true, inheritedFrom: group?.name || 'Group', source: 'group' });
    } else if (a.scope.type === 'global') {
      candidates.push({ assignment: a, inherited: true, inheritedFrom: 'Global Default', source: 'global' });
    }
  }

  if (candidates.length === 0) return null;

  // Sort by priority (lowest number wins), then by createdAt descending (newest wins within same priority)
  candidates.sort((a, b) => {
    if (a.assignment.priority !== b.assignment.priority) {
      return a.assignment.priority - b.assignment.priority;
    }
    return b.assignment.createdAt.localeCompare(a.assignment.createdAt);
  });

  const winner = candidates[0];
  const rateCard = rateCardMap.get(winner.assignment.rateCardId);
  if (!rateCard) return null;

  // Count conflicts at the same priority level as the winner
  const conflictCount = candidates.filter(
    c => c.assignment.priority === winner.assignment.priority && c.assignment.id !== winner.assignment.id
  ).length;

  return {
    rateCard,
    assignment: winner.assignment,
    inherited: winner.inherited,
    conflictCount,
    inheritedFrom: winner.inheritedFrom,
    source: winner.source,
  };
}

/**
 * Resolve the "default" (all-carriers) rate card for a merchant.
 * Only considers assignments with carrierId '*' and rate cards without a carrierId restriction.
 */
export function resolveDefaultRateCard(
  merchantId: string,
  assignments: RateCardAssignment[],
  rateCards: RateCard[],
  groups: MerchantGroup[],
): ResolvedRateCard | null {
  const rateCardMap = new Map(rateCards.map(rc => [rc.id, rc]));
  const merchantGroupIds = groups
    .filter(g => g.merchantIds.includes(merchantId))
    .map(g => g.id);
  const groupMap = new Map(groups.map(g => [g.id, g]));

  const candidates: { assignment: RateCardAssignment; inherited: boolean; inheritedFrom?: string; source: 'direct' | 'group' | 'global' }[] = [];

  for (const a of assignments) {
    if (a.carrierId !== '*') continue;

    const rc = rateCardMap.get(a.rateCardId);
    if (!rc) continue;
    if (rc.carrierId) continue; // skip carrier-restricted rate cards

    if (a.scope.type === 'merchant' && a.scope.merchantId === merchantId) {
      candidates.push({ assignment: a, inherited: false, source: 'direct' });
    } else if (a.scope.type === 'group' && merchantGroupIds.includes(a.scope.groupId)) {
      const group = groupMap.get(a.scope.groupId);
      candidates.push({ assignment: a, inherited: true, inheritedFrom: group?.name || 'Group', source: 'group' });
    } else if (a.scope.type === 'global') {
      candidates.push({ assignment: a, inherited: true, inheritedFrom: 'Global Default', source: 'global' });
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (a.assignment.priority !== b.assignment.priority) {
      return a.assignment.priority - b.assignment.priority;
    }
    return b.assignment.createdAt.localeCompare(a.assignment.createdAt);
  });

  const winner = candidates[0];
  const rateCard = rateCardMap.get(winner.assignment.rateCardId);
  if (!rateCard) return null;

  const conflictCount = candidates.filter(
    c => c.assignment.priority === winner.assignment.priority && c.assignment.id !== winner.assignment.id
  ).length;

  return {
    rateCard,
    assignment: winner.assignment,
    inherited: winner.inherited,
    conflictCount,
    inheritedFrom: winner.inheritedFrom,
    source: winner.source,
  };
}

/**
 * Resolve the effective rate card AND return all candidates for a merchant × carrier pair.
 * Useful for showing the full resolution chain in the UI.
 */
export function resolveRateCardWithCandidates(
  merchantId: string,
  carrierId: CarrierId,
  assignments: RateCardAssignment[],
  rateCards: RateCard[],
  groups: MerchantGroup[],
): { winner: ResolvedRateCard | null; candidates: CandidateAssignment[] } {
  const rateCardMap = new Map(rateCards.map(rc => [rc.id, rc]));
  const merchantGroupIds = groups
    .filter(g => g.merchantIds.includes(merchantId))
    .map(g => g.id);
  const groupMap = new Map(groups.map(g => [g.id, g]));

  const raw: { assignment: RateCardAssignment; inherited: boolean; inheritedFrom?: string; source: 'direct' | 'group' | 'global' }[] = [];

  for (const a of assignments) {
    const matchesCarrier = a.carrierId === carrierId || a.carrierId === '*';
    if (!matchesCarrier) continue;

    const rc = rateCardMap.get(a.rateCardId);
    if (!rc) continue;
    if (rc.carrierId && rc.carrierId !== carrierId) continue;

    if (a.scope.type === 'merchant' && a.scope.merchantId === merchantId) {
      raw.push({ assignment: a, inherited: false, source: 'direct' });
    } else if (a.scope.type === 'group' && merchantGroupIds.includes(a.scope.groupId)) {
      const group = groupMap.get(a.scope.groupId);
      raw.push({ assignment: a, inherited: true, inheritedFrom: group?.name || 'Group', source: 'group' });
    } else if (a.scope.type === 'global') {
      raw.push({ assignment: a, inherited: true, inheritedFrom: 'Global Default', source: 'global' });
    }
  }

  if (raw.length === 0) return { winner: null, candidates: [] };

  raw.sort((a, b) => {
    if (a.assignment.priority !== b.assignment.priority) {
      return a.assignment.priority - b.assignment.priority;
    }
    return b.assignment.createdAt.localeCompare(a.assignment.createdAt);
  });

  const winnerRaw = raw[0];
  const winnerRc = rateCardMap.get(winnerRaw.assignment.rateCardId);

  const candidates: CandidateAssignment[] = [];
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const rc = rateCardMap.get(c.assignment.rateCardId);
    if (!rc) continue;
    const entry: CandidateAssignment = {
      assignment: c.assignment,
      rateCard: rc,
      inherited: c.inherited,
      source: c.source,
      isWinner: i === 0,
    };
    if (c.inheritedFrom) entry.inheritedFrom = c.inheritedFrom;
    candidates.push(entry);
  }

  if (!winnerRc) return { winner: null, candidates };

  const conflictCount = raw.filter(
    c => c.assignment.priority === winnerRaw.assignment.priority && c.assignment.id !== winnerRaw.assignment.id
  ).length;

  return {
    winner: {
      rateCard: winnerRc,
      assignment: winnerRaw.assignment,
      inherited: winnerRaw.inherited,
      conflictCount,
      inheritedFrom: winnerRaw.inheritedFrom,
      source: winnerRaw.source,
    },
    candidates,
  };
}

/**
 * Build a full resolution map for all merchants × all carriers.
 */
export function buildResolutionMap(
  merchantIds: string[],
  carrierIds: CarrierId[],
  assignments: RateCardAssignment[],
  rateCards: RateCard[],
  groups: MerchantGroup[],
): Map<string, ResolvedRateCard | null> {
  const map = new Map<string, ResolvedRateCard | null>();
  for (const mId of merchantIds) {
    for (const cId of carrierIds) {
      const key = `${mId}:${cId}`;
      map.set(key, resolveRateCard(mId, cId, assignments, rateCards, groups));
    }
  }
  return map;
}

/**
 * Build a default-card resolution map for all merchants.
 */
export function buildDefaultResolutionMap(
  merchantIds: string[],
  assignments: RateCardAssignment[],
  rateCards: RateCard[],
  groups: MerchantGroup[],
): Map<string, ResolvedRateCard | null> {
  const map = new Map<string, ResolvedRateCard | null>();
  for (const mId of merchantIds) {
    map.set(mId, resolveDefaultRateCard(mId, assignments, rateCards, groups));
  }
  return map;
}

/**
 * Returns rate cards compatible with a given carrier.
 * A rate card is compatible if it has no carrierId (carrier-agnostic) or its carrierId matches.
 */
export function getCompatibleRateCards(carrierId: CarrierId, rateCards: RateCard[]): RateCard[] {
  return rateCards.filter(rc => !rc.carrierId || rc.carrierId === carrierId);
}

/**
 * Count how many assignments reference a given rate card.
 */
export function countAssignmentsForRateCard(rateCardId: string, assignments: RateCardAssignment[]): number {
  return assignments.filter(a => a.rateCardId === rateCardId).length;
}

/**
 * Count how many assignments reference a given group.
 */
export function countAssignmentsForGroup(groupId: string, assignments: RateCardAssignment[]): number {
  return assignments.filter(a => a.scope.type === 'group' && a.scope.groupId === groupId).length;
}

/**
 * Calculate priority from scope + carrierId.
 */
export function calculatePriority(scope: RateCardAssignment['scope'], carrierId: CarrierId | '*'): 1 | 2 | 3 | 4 | 5 {
  if (scope.type === 'merchant' && carrierId !== '*') return 1;
  if (scope.type === 'merchant' && carrierId === '*') return 2;
  if (scope.type === 'group' && carrierId !== '*') return 3;
  if (scope.type === 'group' && carrierId === '*') return 4;
  return 5;
}

/**
 * Format a rate card's pricing summary for display.
 * Shows the lowest base tier price from the first zone.
 */
export function formatPricingValue(rc: RateCard): string {
  if (rc.pricing?.zones?.length) {
    const firstZone = rc.pricing.zones[0];
    if (firstZone.tiers.length > 0) {
      const lowest = Math.min(...firstZone.tiers.map(t => t.price));
      return `from €${lowest.toFixed(2)}`;
    }
  }
  return '—';
}

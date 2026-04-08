import type { CarrierId } from './rateCard';

export type ServiceType = 'express' | 'standard' | 'economy';

// ── Carrier Performance ──

export interface MonthlyTransitMetrics {
  month: string;           // "YYYY-MM"
  carrierId: CarrierId;
  destination: string;     // ISO country code ("DE", "AT", "FR", ...)
  serviceType: ServiceType;
  totalShipments: number;
  avgTransitDays: number;  // average business days in transit
  onTimePct: number;       // % delivered within SLA window
  latePct: number;         // % delivered after SLA window
  lostPct: number;         // % lost or unresolved
  slaTargetDays: number;   // contracted SLA in business days
}

// ── Audit & Claims ──

export type ClaimType = 'damage' | 'loss' | 'delay' | 'overcharge' | 'misdelivery';
export type ClaimStatus = 'accepted' | 'rejected' | 'pending';

export interface MonthlyClaims {
  month: string;
  carrierId: CarrierId;
  destination: string;
  serviceType: ServiceType;
  claimsSubmitted: number;
  claimsAccepted: number;
  claimsRejected: number;
  claimsPending: number;
  refundAmount: number;       // total euros refunded
  avgResponseDays: number;    // carrier avg response time
}

export interface ClaimTypeSummary {
  type: ClaimType;
  count: number;
  totalValue: number;         // claimed amount
  refundedValue: number;      // approved refund
  resolutionRate: number;     // % accepted
  avgResolutionDays: number;
}

// ── Cost Transparency ──

export interface MonthlySurchargeBreakdown {
  month: string;
  carrierId: CarrierId;
  destination: string;
  serviceType: ServiceType;
  baseCost: number;
  fuelSurcharge: number;
  handlingFee: number;
  securityFee: number;
  otherSurcharges: number;
  totalCost: number;
}

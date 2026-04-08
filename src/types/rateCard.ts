export type CarrierId =
  | 'dhl-de' | 'dhl-nl' | 'dhl-at'
  | 'gls-de' | 'gls-nl'
  | 'fedex-de' | 'fedex-nl' | 'fedex-gb'
  | 'dpd-de' | 'dpd-at'
  | 'ups-de' | 'ups-nl';

export interface WeightTier {
  maxWeight: number;  // kg
  price: number;      // €
}

export interface PricingZone {
  zone: string;            // "National", "Zone 1", "Zone 2"
  countries?: string[];    // ["AT", "BE", "DK"] — omitted for domestic
  tiers: WeightTier[];
}

export interface Surcharge {
  name: string;
  value: string;           // "5.0%", "€19.00", "variable"
}

export interface RateCardPricing {
  zones: PricingZone[];
  surcharges: Surcharge[];
}

export interface RateCard {
  id: string;
  name: string;              // Customer-defined label: "Premium Fulfillment", "Enterprise Pricing"
  markup?: number;           // Optional — last bulk adjustment applied (informational only, not the price basis)
  carrierId?: CarrierId;     // optional — if set, only usable for this carrier
  description: string;
  validFrom: string;
  validTo: string;
  createdAt: string;
  pricing?: RateCardPricing; // The actual independent pricing structure
}

export interface MerchantGroup {
  id: string;
  name: string;
  description: string;
  merchantIds: string[];
  color: string;
  createdAt: string;
}

export type AssignmentScope =
  | { type: 'merchant'; merchantId: string }
  | { type: 'group'; groupId: string }
  | { type: 'global' };

export interface RateCardAssignment {
  id: string;
  rateCardId: string;
  carrierId: CarrierId | '*';
  scope: AssignmentScope;
  priority: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
}

export interface ResolvedRateCard {
  rateCard: RateCard;
  assignment: RateCardAssignment;
  inherited: boolean;
  conflictCount: number;
  inheritedFrom?: string; // group name or "Global Default"
  source: 'direct' | 'group' | 'global';
}

export interface CandidateAssignment {
  assignment: RateCardAssignment;
  rateCard: RateCard;
  inherited: boolean;
  inheritedFrom?: string;
  source: 'direct' | 'group' | 'global';
  isWinner: boolean;
}

export interface BuyingRateCard {
  id: string;
  name: string;              // Customer-defined label: "DHL Contract 2026"
  carrierId: CarrierId;      // Always carrier-specific
  contractReference: string; // Reference to carrier contract: "CTR-DHL-2026-001"
  accountNumbers: string[];  // Account numbers tied to this buy rate card
  validFrom: string;
  validTo: string;
  createdAt: string;
  pricing?: RateCardPricing;
}

export interface BuyingRateCardAssignment {
  id: string;
  buyingRateCardId: string;
  carrierId: CarrierId;
  merchantId: string;        // Always direct merchant assignment
  createdAt: string;
}

export interface UnmappedCharge {
  id: string;
  chargeName: string;           // "Fuel Surcharge", "Non-Conveyable", "Peak Surcharge", etc.
  carrierId: CarrierId;
  merchantId: string;
  merchantName: string;
  occurrenceCount: number;
  buyingPriceTotal: number;
  buyingRateCardId: string;     // which buying rate card this charge comes from
  buyingRateCardName: string;   // display name of the buying rate card
  sellingRateCardId?: string;   // matched selling rate card (if user has linked one)
  sellingChargeName?: string;   // matched surcharge name on the selling rate card
}

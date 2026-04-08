import type { CarrierId } from './rateCard';

export interface MerchantAlias {
  name: string;
  addedAt: string; // ISO date
  source: 'manual' | 'store';
}

export interface ContactPerson {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface MasterData {
  companyName: string;
  legalForm?: string;          // GmbH, AG, Ltd, etc.
  vatId?: string;              // DE123456789
  commercialRegister?: string; // HRB 12345
  billingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  contacts: ContactPerson[];
  paymentTerms?: string;       // "30 days net", "14 days 2% discount"
  currency?: string;           // EUR, USD
  invoiceEmail?: string;
}

export interface BillingEntity {
  id: string;
  name: string;
  aliases: MerchantAlias[];
  contactEmail: string;
  country: string;
  shipmentCount: number;
  createdAt: string;
  lastActivity: string;
  archived?: boolean;
  carrierIds?: CarrierId[];
  masterData?: MasterData;
}

export interface SuggestedMatch {
  entityId: string;
  entityName: string;
  matchReasons: string[];
}

export interface AffectedShipment {
  id: string;
  shipmentNumber: string;
  date: string;
  carrier: string;
  destination: string;
  valueEur: number;
}

export interface UnresolvedAlias {
  id: string;
  aliasName: string;
  suggestedMatches: SuggestedMatch[];
  affectedShipments: AffectedShipment[];
  firstSeen: string;
  shipmentCount: number;
}

export interface MonthlyShipments {
  month: string; // "YYYY-MM"
  shipments: number;
  revenue: number;
}

export interface CarrierShipments {
  carrierId: CarrierId;
  shipments: number;         // Last 12 months total
  avgSellingPrice: number;   // Average selling price per shipment
  avgBuyingPrice: number;    // Average buying price per shipment
  avgMarkupPerShipment: number; // Volume-weighted realized markup % per shipment (differs from simple markup due to weight/zone distribution)
}

export interface UnmappedShipment {
  id: string;
  carrier: CarrierId;
  shipmentNumber: string;
  date: string;            // ISO date
  reference: string;
  invoiceNumber: string;
  accountNumber: string;
  transitStatus: 'in_transit' | 'delivered' | 'exception' | 'returned';
  originCountry: string;   // ISO 3166-1 alpha-2: "DE", "AT", "CH"
  destinationCountry: string;
}

export interface MonthlyMargin {
  month: string;           // "YYYY-MM"
  shipments: number;
  buyingCost: number;      // Total spent on carrier buying rates
  sellingRevenue: number;  // Total billed to merchant
}

export interface CarrierMonthlyMargin {
  carrierId: CarrierId;
  months: MonthlyMargin[];
}

export interface LaneMargin {
  origin: string;          // "DE"
  destination: string;     // "AT"
  shipments: number;
  buyingCost: number;
  sellingRevenue: number;
}

export type ResolutionAction = 'merged' | 'created_new' | 'dismissed';

export interface ResolutionEvent {
  id: string;
  entityId: string;
  aliasName: string;
  action: ResolutionAction;
  resolvedBy: string;
  resolvedAt: string;
  mergedIntoName?: string;
}

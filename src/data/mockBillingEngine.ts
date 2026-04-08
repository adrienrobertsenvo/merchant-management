import type { CarrierId } from '../types/rateCard';

// ── Monthly Margin (rolling 12 months) ──────────────────────────────────────
export interface MonthlyMarginEntry {
  month: string;       // "MMM YY"
  monthKey: string;    // "YYYY-MM"
  buyingCost: number;
  sellingRevenue: number;
  netWin: number;
  marginPct: number;
}

export const mockMonthlyMargins: MonthlyMarginEntry[] = [
  { month: 'Apr 25', monthKey: '2025-04', buyingCost: 5800,  sellingRevenue: 6720,  netWin: 920,  marginPct: 15.9 },
  { month: 'May 25', monthKey: '2025-05', buyingCost: 6900,  sellingRevenue: 8060,  netWin: 1184, marginPct: 14.6 },
  { month: 'Jun 25', monthKey: '2025-06', buyingCost: 8400,  sellingRevenue: 9800,  netWin: 1476, marginPct: 15.0 },
  { month: 'Jul 25', monthKey: '2025-07', buyingCost: 9700,  sellingRevenue: 11400, netWin: 1710, marginPct: 15.0 },
  { month: 'Aug 25', monthKey: '2025-08', buyingCost: 10600, sellingRevenue: 12500, netWin: 1872, marginPct: 15.0 },
  { month: 'Sep 25', monthKey: '2025-09', buyingCost: 11200, sellingRevenue: 13200, netWin: 1980, marginPct: 15.0 },
  { month: 'Oct 25', monthKey: '2025-10', buyingCost: 12000, sellingRevenue: 14200, netWin: 2124, marginPct: 15.0 },
  { month: 'Nov 25', monthKey: '2025-11', buyingCost: 12800, sellingRevenue: 15000, netWin: 2250, marginPct: 15.0 },
  { month: 'Dec 25', monthKey: '2025-12', buyingCost: 14500, sellingRevenue: 17000, netWin: 2556, marginPct: 15.0 },
  { month: 'Jan 26', monthKey: '2026-01', buyingCost: 14100, sellingRevenue: 16600, netWin: 2484, marginPct: 15.0 },
  { month: 'Feb 26', monthKey: '2026-02', buyingCost: 12300, sellingRevenue: 14500, netWin: 2178, marginPct: 15.0 },
  { month: 'Mar 26', monthKey: '2026-03', buyingCost: 10200, sellingRevenue: 12100, netWin: 1840, marginPct: 15.2 },
];

// ── Merchant Billing Summary ────────────────────────────────────────────────
export interface MerchantBillingSummary {
  merchantId: string;
  merchantName: string;
  country: string;
  groupName: string | null;
  // By shipment date aggregation
  shipmentDateStats: {
    shipmentCount: number;
    totalBuyingCost: number;
    totalSellingCost: number;
    unmatchedItems: number;
    alreadyBilledCharges: number;
  };
  // By invoice date aggregation
  invoiceDateStats: {
    invoiceCount: number;
    totalBuyingCost: number;
    totalSellingCost: number;
    unmatchedItems: number;
    alreadyBilledCharges: number;
  };
  lastBilledDate: string | null;
}

export const mockMerchantBillingSummaries: MerchantBillingSummary[] = [
  {
    merchantId: 'ent-1',
    merchantName: 'Rheinwerk GmbH',
    country: 'Germany',
    groupName: 'Enterprise',
    shipmentDateStats: { shipmentCount: 312, totalBuyingCost: 18420.50, totalSellingCost: 21183.58, unmatchedItems: 14, alreadyBilledCharges: 6 },
    invoiceDateStats: { invoiceCount: 28, totalBuyingCost: 19100.00, totalSellingCost: 21965.00, unmatchedItems: 14, alreadyBilledCharges: 6 },
    lastBilledDate: '2026-02-28',
  },
  {
    merchantId: 'ent-2',
    merchantName: '8WEEKSOUT',
    country: 'Germany',
    groupName: 'Enterprise',
    shipmentDateStats: { shipmentCount: 219, totalBuyingCost: 11240.80, totalSellingCost: 12924.92, unmatchedItems: 9, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 22, totalBuyingCost: 11580.00, totalSellingCost: 13317.00, unmatchedItems: 9, alreadyBilledCharges: 0 },
    lastBilledDate: '2026-02-28',
  },
  {
    merchantId: 'ent-3',
    merchantName: 'Nordic Threads',
    country: 'Sweden',
    groupName: null,
    shipmentDateStats: { shipmentCount: 134, totalBuyingCost: 8920.40, totalSellingCost: 9990.85, unmatchedItems: 3, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 14, totalBuyingCost: 9150.00, totalSellingCost: 10248.00, unmatchedItems: 3, alreadyBilledCharges: 0 },
    lastBilledDate: '2026-02-28',
  },
  {
    merchantId: 'ent-4',
    merchantName: 'Alpine Gear GmbH',
    country: 'Austria',
    groupName: 'DACH Region',
    shipmentDateStats: { shipmentCount: 103, totalBuyingCost: 7560.20, totalSellingCost: 8316.22, unmatchedItems: 7, alreadyBilledCharges: 3 },
    invoiceDateStats: { invoiceCount: 11, totalBuyingCost: 7820.00, totalSellingCost: 8602.00, unmatchedItems: 7, alreadyBilledCharges: 3 },
    lastBilledDate: '2026-02-28',
  },
  {
    merchantId: 'ent-5',
    merchantName: 'BerlinBrew Co.',
    country: 'Germany',
    groupName: 'DACH Region',
    shipmentDateStats: { shipmentCount: 75, totalBuyingCost: 3890.10, totalSellingCost: 4473.62, unmatchedItems: 2, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 8, totalBuyingCost: 4020.00, totalSellingCost: 4623.00, unmatchedItems: 2, alreadyBilledCharges: 0 },
    lastBilledDate: '2026-01-31',
  },
  {
    merchantId: 'ent-6',
    merchantName: 'Maison Lumière',
    country: 'France',
    groupName: null,
    shipmentDateStats: { shipmentCount: 47, totalBuyingCost: 3420.60, totalSellingCost: 3933.69, unmatchedItems: 1, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 5, totalBuyingCost: 3580.00, totalSellingCost: 4117.00, unmatchedItems: 1, alreadyBilledCharges: 0 },
    lastBilledDate: '2026-02-28',
  },
  {
    merchantId: 'ent-7',
    merchantName: 'Porto Vita',
    country: 'Portugal',
    groupName: null,
    shipmentDateStats: { shipmentCount: 39, totalBuyingCost: 2180.30, totalSellingCost: 2507.35, unmatchedItems: 0, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 4, totalBuyingCost: 2250.00, totalSellingCost: 2587.50, unmatchedItems: 0, alreadyBilledCharges: 0 },
    lastBilledDate: '2026-02-28',
  },
  {
    merchantId: 'ent-8',
    merchantName: 'Fjord Outfitters',
    country: 'Norway',
    groupName: 'Nordics',
    shipmentDateStats: { shipmentCount: 34, totalBuyingCost: 2890.20, totalSellingCost: 3323.73, unmatchedItems: 0, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 4, totalBuyingCost: 2980.00, totalSellingCost: 3427.00, unmatchedItems: 0, alreadyBilledCharges: 0 },
    lastBilledDate: '2026-01-31',
  },
  {
    merchantId: 'ent-9',
    merchantName: 'Balkan Basics',
    country: 'Croatia',
    groupName: null,
    shipmentDateStats: { shipmentCount: 24, totalBuyingCost: 1340.60, totalSellingCost: 1608.72, unmatchedItems: 5, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 3, totalBuyingCost: 1420.00, totalSellingCost: 1704.00, unmatchedItems: 5, alreadyBilledCharges: 0 },
    lastBilledDate: null,
  },
  {
    merchantId: 'ent-10',
    merchantName: 'Helvetica Home',
    country: 'Switzerland',
    groupName: 'DACH Region',
    shipmentDateStats: { shipmentCount: 20, totalBuyingCost: 1580.40, totalSellingCost: 1864.87, unmatchedItems: 2, alreadyBilledCharges: 0 },
    invoiceDateStats: { invoiceCount: 3, totalBuyingCost: 1640.00, totalSellingCost: 1934.80, unmatchedItems: 2, alreadyBilledCharges: 0 },
    lastBilledDate: null,
  },
];

// ── Period Analytics ─────────────────────────────────────────────────────────
export interface PeriodAnalytics {
  totalBuyingCost: number;
  totalSellingCost: number;
  invoiceCount: number;
  creditNoteCount: number;
  otherDocCount: number;
  shipmentsByInvoiceDate: number;
  shipmentsByShipmentDate: number;
  missingCharges: {
    elementCount: number;
    totalAmount: number;
  };
}

export function getPeriodAnalytics(_from: string, _to: string): PeriodAnalytics {
  // In production, this filters by date range. Mock returns static data.
  return {
    totalBuyingCost: 61444.10,
    totalSellingCost: 70126.54,
    invoiceCount: 102,
    creditNoteCount: 8,
    otherDocCount: 3,
    shipmentsByInvoiceDate: 1045,
    shipmentsByShipmentDate: 1007,
    missingCharges: {
      elementCount: 43,
      totalAmount: 2847.30,
    },
  };
}

// ── Merchant Detail: Shipment-level data ─────────────────────────────────────
export interface BillingShipment {
  id: string;
  shipmentNumber: string;
  shipmentDate: string;
  invoiceDate: string;
  invoiceNumber: string;
  carrierId: CarrierId;
  origin: string;
  destination: string;
  weight: number;
  buyingCost: number;
  sellingCost: number;
  billedDate: string | null;        // null = not yet billed
  chargeCount: number;              // total charges on this shipment
  allChargesAssigned: boolean;      // whether all charges have a sell mapping
  issue: 'none' | 'price_dispute' | 'lost' | 'damaged' | 'delayed';
  expectedRefund: number;           // €0 if no issue
}

export interface BillingCharge {
  id: string;
  shipmentNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  carrierId: CarrierId;
  chargeName: string;
  chargeType: 'base' | 'surcharge' | 'discount';
  buyingAmount: number;
  sellingAmount: number | null;
  matched: boolean;
}

function generateShipments(merchantId: string, merchantName: string, count: number, carriers: CarrierId[]): BillingShipment[] {
  const shipments: BillingShipment[] = [];
  const destinations = ['DE', 'AT', 'NL', 'FR', 'BE', 'IT', 'ES', 'CH', 'PL', 'DK'];
  const origins = ['DE', 'AT', 'NL'];
  const issues: BillingShipment['issue'][] = ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'price_dispute', 'lost', 'damaged', 'delayed'];

  for (let i = 0; i < count; i++) {
    const seed = (merchantId + i).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const carrier = carriers[seed % carriers.length];
    const dayOffset = Math.floor(i * 120 / count);
    const shipDate = new Date(); // today
    shipDate.setDate(shipDate.getDate() - dayOffset);
    const invDate = new Date(shipDate);
    invDate.setDate(invDate.getDate() + (seed % 5) + 1);

    const weight = 1.5 + (seed % 28) * 0.5;
    const buying = 3.5 + (seed % 12) * 0.8;
    const selling = buying * (1.08 + (seed % 15) * 0.01);

    // ~65% billed (older shipments more likely), rest unbilled
    const isBilled = i > count * 0.35;
    const billedDate = isBilled
      ? new Date(invDate.getTime() + (5 + seed % 10) * 86400000).toISOString().slice(0, 10)
      : null;

    const chargeCount = 2 + (seed % 3); // 2-4 charges per shipment
    const allAssigned = (seed + i) % 7 !== 0; // ~85% fully assigned

    const issue = issues[(seed + i) % issues.length];
    const expectedRefund = issue === 'lost' ? Math.round(buying * 100) / 100
      : issue === 'damaged' ? Math.round(buying * 0.5 * 100) / 100
      : issue === 'price_dispute' ? Math.round(buying * 0.15 * 100) / 100
      : 0;

    shipments.push({
      id: `shp-${merchantId}-${i}`,
      shipmentNumber: `SHP-${merchantName.slice(0, 3).toUpperCase()}-${(10000 + i).toString()}`,
      shipmentDate: shipDate.toISOString().slice(0, 10),
      invoiceDate: invDate.toISOString().slice(0, 10),
      invoiceNumber: `INV-${carrier.toUpperCase()}-${(2600 + Math.floor(dayOffset / 30)).toString()}`,
      carrierId: carrier,
      origin: origins[seed % origins.length],
      destination: destinations[(seed + i) % destinations.length],
      weight: Math.round(weight * 10) / 10,
      buyingCost: Math.round(buying * 100) / 100,
      sellingCost: Math.round(selling * 100) / 100,
      billedDate,
      chargeCount,
      allChargesAssigned: allAssigned,
      issue,
      expectedRefund,
    });
  }
  return shipments;
}

function generateCharges(shipments: BillingShipment[]): BillingCharge[] {
  const charges: BillingCharge[] = [];
  const surchargeNames = ['Fuel Surcharge', 'Handling Fee', 'Security Fee', 'Peak Season', 'Remote Area', 'Weight Correction', 'Non-Conveyable'];

  for (const shp of shipments) {
    const seed = shp.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    // Base charge
    charges.push({
      id: `chg-${shp.id}-base`,
      shipmentNumber: shp.shipmentNumber,
      invoiceNumber: shp.invoiceNumber,
      invoiceDate: shp.invoiceDate,
      carrierId: shp.carrierId,
      chargeName: 'Base Product',
      chargeType: 'base',
      buyingAmount: Math.round(shp.buyingCost * 0.7 * 100) / 100,
      sellingAmount: Math.round(shp.sellingCost * 0.7 * 100) / 100,
      matched: true,
    });

    // Fuel surcharge (always present)
    const fuelBuy = Math.round(shp.buyingCost * 0.08 * 100) / 100;
    charges.push({
      id: `chg-${shp.id}-fuel`,
      shipmentNumber: shp.shipmentNumber,
      invoiceNumber: shp.invoiceNumber,
      invoiceDate: shp.invoiceDate,
      carrierId: shp.carrierId,
      chargeName: 'Fuel Surcharge',
      chargeType: 'surcharge',
      buyingAmount: fuelBuy,
      sellingAmount: Math.round(fuelBuy * 1.15 * 100) / 100,
      matched: true,
    });

    // Random additional surcharges
    const numExtra = seed % 3;
    for (let j = 0; j < numExtra; j++) {
      const surchargeName = surchargeNames[(seed + j) % surchargeNames.length];
      const buyAmt = Math.round((1.5 + (seed % 8) * 0.5) * 100) / 100;
      const isMatched = (seed + j) % 5 !== 0;
      charges.push({
        id: `chg-${shp.id}-s${j}`,
        shipmentNumber: shp.shipmentNumber,
        invoiceNumber: shp.invoiceNumber,
        invoiceDate: shp.invoiceDate,
        carrierId: shp.carrierId,
        chargeName: surchargeName,
        chargeType: 'surcharge',
        buyingAmount: buyAmt,
        sellingAmount: isMatched ? Math.round(buyAmt * 1.12 * 100) / 100 : null,
        matched: isMatched,
      });
    }
  }
  return charges;
}

// Pre-generate detail data for each merchant
interface MerchantDetailData {
  shipments: BillingShipment[];
  charges: BillingCharge[];
}

const merchantConfigs: Array<{ id: string; name: string; count: number; carriers: CarrierId[] }> = [
  { id: 'ent-1', name: 'Rheinwerk', count: 312, carriers: ['dhl-de', 'gls-de', 'fedex-de', 'dpd-de'] },
  { id: 'ent-2', name: '8WEEKSOUT', count: 219, carriers: ['dhl-de', 'gls-de', 'dpd-de'] },
  { id: 'ent-3', name: 'Nordic', count: 134, carriers: ['dhl-nl', 'gls-nl'] },
  { id: 'ent-4', name: 'Alpine', count: 103, carriers: ['dhl-at', 'fedex-de', 'dpd-at'] },
  { id: 'ent-5', name: 'BerlinBrew', count: 75, carriers: ['dhl-de', 'dpd-de'] },
  { id: 'ent-6', name: 'Maison', count: 47, carriers: ['dhl-nl', 'fedex-nl'] },
  { id: 'ent-7', name: 'Porto', count: 39, carriers: ['gls-de', 'dpd-de'] },
  { id: 'ent-8', name: 'Fjord', count: 34, carriers: ['dhl-nl', 'gls-nl', 'fedex-nl', 'ups-nl'] },
  { id: 'ent-9', name: 'Balkan', count: 24, carriers: ['dhl-de', 'dpd-de'] },
  { id: 'ent-10', name: 'Helvetica', count: 20, carriers: ['dhl-de', 'gls-de'] },
];

const detailDataMap = new Map<string, MerchantDetailData>();
for (const cfg of merchantConfigs) {
  const shipments = generateShipments(cfg.id, cfg.name, cfg.count, cfg.carriers);
  const charges = generateCharges(shipments);
  detailDataMap.set(cfg.id, { shipments, charges });
}

export function getMerchantShipments(merchantId: string): BillingShipment[] {
  return detailDataMap.get(merchantId)?.shipments ?? [];
}

export function getMerchantCharges(merchantId: string): BillingCharge[] {
  return detailDataMap.get(merchantId)?.charges ?? [];
}

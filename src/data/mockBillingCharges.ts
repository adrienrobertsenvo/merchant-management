import type { UnmappedCharge } from '../types/rateCard';

/**
 * Unmapped charges: buy surcharges that have no corresponding sell surcharge
 * for a given merchant+carrier combination.
 *
 * Buy surcharges per carrier:
 *   DHL  — Fuel Surcharge, Handling Fee, Peak Surcharge, Non-Conveyable, Security Fee
 *   GLS  — Fuel Surcharge, Handling Fee, Weight Correction, Security Fee
 *   FedEx— Fuel Surcharge, Handling Fee, Extended Area, Security Fee, Non-Conveyable
 *   DPD  — Fuel Surcharge, Handling Fee, Remote Area, Weight Correction, Security Fee, Address Correction
 *   UPS  — Fuel Surcharge, Handling Fee, Residential Delivery, Security Fee
 *
 * Common sell surcharges (auto-matched): Fuel Surcharge, Handling Fee, Security Fee
 *
 * Unmapped charge types (no exact match on resolved sell rate card):
 *   Non-Conveyable    — DHL, FedEx buy → no sell equivalent
 *   Weight Correction  — GLS, DPD buy → no sell equivalent
 *   Peak Surcharge     — DHL buy → close to "Peak Season" on rc-4 but different name
 *   Extended Area      — FedEx buy → close to "Remote Area" on rc-6 but different name
 *   Residential Delivery — DHL/UPS buy → only on rc-4 sell, not others
 *   Address Correction — DPD buy → only on rc-3/rc-6 sell, not others
 *   Remote Area        — DPD buy → only on rc-6 sell, not others
 *
 * Occurrence counts are proportional to mockCarrierShipments volumes.
 */
export const mockUnmappedCharges: UnmappedCharge[] = [
  // ── Non-Conveyable (DHL €2.50/unit, FedEx €2.80/unit — no sell equivalent) ──
  { id: 'uc-1',  chargeName: 'Non-Conveyable', carrierId: 'dhl-de',   merchantId: 'ent-1',  merchantName: 'Rheinwerk GmbH',   occurrenceCount: 27,  buyingPriceTotal: 67.50,   buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-2',  chargeName: 'Non-Conveyable', carrierId: 'fedex-de', merchantId: 'ent-1',  merchantName: 'Rheinwerk GmbH',   occurrenceCount: 6,   buyingPriceTotal: 16.80,   buyingRateCardId: 'brc-3', buyingRateCardName: 'FedEx EU Agreement' },
  { id: 'uc-3',  chargeName: 'Non-Conveyable', carrierId: 'dhl-de',   merchantId: 'ent-2',  merchantName: '8WEEKSOUT',        occurrenceCount: 25,  buyingPriceTotal: 62.50,   buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-4',  chargeName: 'Non-Conveyable', carrierId: 'dhl-de',   merchantId: 'ent-3',  merchantName: 'Nordic Threads',   occurrenceCount: 15,  buyingPriceTotal: 37.50,   buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-5',  chargeName: 'Non-Conveyable', carrierId: 'dhl-de',   merchantId: 'ent-4',  merchantName: 'Alpine Gear GmbH', occurrenceCount: 12,  buyingPriceTotal: 30.00,   buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-6',  chargeName: 'Non-Conveyable', carrierId: 'fedex-de', merchantId: 'ent-4',  merchantName: 'Alpine Gear GmbH', occurrenceCount: 7,   buyingPriceTotal: 19.60,   buyingRateCardId: 'brc-3', buyingRateCardName: 'FedEx EU Agreement' },
  { id: 'uc-7',  chargeName: 'Non-Conveyable', carrierId: 'dhl-de',   merchantId: 'ent-5',  merchantName: 'BerlinBrew Co.',   occurrenceCount: 11,  buyingPriceTotal: 27.50,   buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-8',  chargeName: 'Non-Conveyable', carrierId: 'fedex-de', merchantId: 'ent-6',  merchantName: 'Maison Lumière',   occurrenceCount: 5,   buyingPriceTotal: 14.00,   buyingRateCardId: 'brc-3', buyingRateCardName: 'FedEx EU Agreement' },
  { id: 'uc-9',  chargeName: 'Non-Conveyable', carrierId: 'dhl-de',   merchantId: 'ent-8',  merchantName: 'Fjord Outfitters',  occurrenceCount: 5,   buyingPriceTotal: 12.50,   buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-10', chargeName: 'Non-Conveyable', carrierId: 'dhl-de',   merchantId: 'ent-10', merchantName: 'Helvetica Home',   occurrenceCount: 3,   buyingPriceTotal: 7.50,    buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },

  // ── Peak Surcharge (DHL, close to "Peak Season" but different name) ──
  { id: 'uc-11', chargeName: 'Peak Surcharge', carrierId: 'dhl-de',   merchantId: 'ent-1',  merchantName: 'Rheinwerk GmbH',   occurrenceCount: 239, buyingPriceTotal: 597.50,  buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-12', chargeName: 'Peak Surcharge', carrierId: 'dhl-de',   merchantId: 'ent-2',  merchantName: '8WEEKSOUT',        occurrenceCount: 217, buyingPriceTotal: 542.50,  buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-13', chargeName: 'Peak Surcharge', carrierId: 'dhl-de',   merchantId: 'ent-6',  merchantName: 'Maison Lumière',   occurrenceCount: 67,  buyingPriceTotal: 167.50,  buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },
  { id: 'uc-14', chargeName: 'Peak Surcharge', carrierId: 'dhl-de',   merchantId: 'ent-9',  merchantName: 'Balkan Basics',    occurrenceCount: 34,  buyingPriceTotal: 85.00,   buyingRateCardId: 'brc-1', buyingRateCardName: 'DHL Contract 2026' },

  // ── Weight Correction (GLS + DPD, no sell equivalent) ──
  { id: 'uc-15', chargeName: 'Weight Correction', carrierId: 'gls-de', merchantId: 'ent-1',  merchantName: 'Rheinwerk GmbH',   occurrenceCount: 24,  buyingPriceTotal: 108.00,  buyingRateCardId: 'brc-2', buyingRateCardName: 'GLS Standard 2026' },
  { id: 'uc-16', chargeName: 'Weight Correction', carrierId: 'dpd-de', merchantId: 'ent-1',  merchantName: 'Rheinwerk GmbH',   occurrenceCount: 22,  buyingPriceTotal: 83.60,   buyingRateCardId: 'brc-4', buyingRateCardName: 'DPD Partnership' },
  { id: 'uc-17', chargeName: 'Weight Correction', carrierId: 'gls-de', merchantId: 'ent-2',  merchantName: '8WEEKSOUT',        occurrenceCount: 25,  buyingPriceTotal: 112.50,  buyingRateCardId: 'brc-2', buyingRateCardName: 'GLS Standard 2026' },
  { id: 'uc-18', chargeName: 'Weight Correction', carrierId: 'dpd-de', merchantId: 'ent-4',  merchantName: 'Alpine Gear GmbH', occurrenceCount: 14,  buyingPriceTotal: 53.20,   buyingRateCardId: 'brc-4', buyingRateCardName: 'DPD Partnership' },
  { id: 'uc-19', chargeName: 'Weight Correction', carrierId: 'gls-de', merchantId: 'ent-7',  merchantName: 'Porto Vita',       occurrenceCount: 7,   buyingPriceTotal: 31.50,   buyingRateCardId: 'brc-2', buyingRateCardName: 'GLS Standard 2026' },

  // ── Extended Area (FedEx, close to "Remote Area" but different name) ──
  { id: 'uc-20', chargeName: 'Extended Area', carrierId: 'fedex-de', merchantId: 'ent-1',  merchantName: 'Rheinwerk GmbH',   occurrenceCount: 17,  buyingPriceTotal: 238.00,  buyingRateCardId: 'brc-3', buyingRateCardName: 'FedEx EU Agreement' },
  { id: 'uc-21', chargeName: 'Extended Area', carrierId: 'fedex-de', merchantId: 'ent-4',  merchantName: 'Alpine Gear GmbH', occurrenceCount: 26,  buyingPriceTotal: 364.00,  buyingRateCardId: 'brc-3', buyingRateCardName: 'FedEx EU Agreement' },

  // ── Remote Area (DPD buy → only on rc-6 sell, not others) ──
  { id: 'uc-22', chargeName: 'Remote Area', carrierId: 'dpd-de', merchantId: 'ent-2',  merchantName: '8WEEKSOUT',        occurrenceCount: 18,  buyingPriceTotal: 153.00,  buyingRateCardId: 'brc-4', buyingRateCardName: 'DPD Partnership' },
  { id: 'uc-23', chargeName: 'Remote Area', carrierId: 'dpd-de', merchantId: 'ent-5',  merchantName: 'BerlinBrew Co.',   occurrenceCount: 8,   buyingPriceTotal: 68.00,   buyingRateCardId: 'brc-4', buyingRateCardName: 'DPD Partnership' },
  { id: 'uc-24', chargeName: 'Remote Area', carrierId: 'dpd-de', merchantId: 'ent-9',  merchantName: 'Balkan Basics',    occurrenceCount: 4,   buyingPriceTotal: 34.00,   buyingRateCardId: 'brc-4', buyingRateCardName: 'DPD Partnership' },

  // ── Address Correction (DPD buy → only on rc-3/rc-6 sell) ──
  { id: 'uc-25', chargeName: 'Address Correction', carrierId: 'dpd-de', merchantId: 'ent-1',  merchantName: 'Rheinwerk GmbH',   occurrenceCount: 9,  buyingPriceTotal: 45.00,  buyingRateCardId: 'brc-4', buyingRateCardName: 'DPD Partnership' },
  { id: 'uc-26', chargeName: 'Address Correction', carrierId: 'dpd-de', merchantId: 'ent-2',  merchantName: '8WEEKSOUT',        occurrenceCount: 9,  buyingPriceTotal: 45.00,  buyingRateCardId: 'brc-4', buyingRateCardName: 'DPD Partnership' },
];

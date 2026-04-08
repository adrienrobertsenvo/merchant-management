import type { RateCard, MerchantGroup, RateCardAssignment, BuyingRateCard, BuyingRateCardAssignment } from '../types/rateCard';

export const mockRateCards: RateCard[] = [
  {
    id: 'rc-1',
    name: 'Standard Fulfillment',
    markup: 15,
    description: 'Standard markup for all fulfillment services',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-11-15',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 4.20 }, { maxWeight: 5, price: 4.80 }, { maxWeight: 10, price: 5.90 }, { maxWeight: 31.5, price: 7.50 }] },
        { zone: 'Zone 1', countries: ['AT', 'BE', 'NL'], tiers: [{ maxWeight: 3, price: 7.50 }, { maxWeight: 5, price: 8.20 }, { maxWeight: 10, price: 9.80 }, { maxWeight: 31.5, price: 12.50 }] },
        { zone: 'Zone 2', countries: ['FR', 'ES', 'IT'], tiers: [{ maxWeight: 3, price: 9.80 }, { maxWeight: 5, price: 10.50 }, { maxWeight: 10, price: 12.30 }, { maxWeight: 31.5, price: 15.00 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '8.5%' },
        { name: 'Handling Fee', value: '€12.00' },
        { name: 'Security Fee', value: '€0.05' },
        { name: 'Island Delivery', value: '€15.00' },
      ],
    },
  },
  {
    id: 'rc-2',
    name: 'Enterprise Pricing',
    markup: 8,
    description: 'Discounted markup for enterprise-level merchants',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-11-15',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 3.60 }, { maxWeight: 5, price: 4.10 }, { maxWeight: 10, price: 5.00 }, { maxWeight: 31.5, price: 6.40 }] },
        { zone: 'Zone 1', countries: ['AT', 'BE', 'NL', 'LU'], tiers: [{ maxWeight: 3, price: 6.20 }, { maxWeight: 5, price: 6.90 }, { maxWeight: 10, price: 8.30 }, { maxWeight: 31.5, price: 10.80 }] },
        { zone: 'Zone 2', countries: ['FR', 'ES', 'IT', 'PT'], tiers: [{ maxWeight: 3, price: 8.50 }, { maxWeight: 5, price: 9.20 }, { maxWeight: 10, price: 10.80 }, { maxWeight: 31.5, price: 13.50 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '7.0%' },
        { name: 'Handling Fee', value: '€8.00' },
        { name: 'Security Fee', value: '€0.04' },
      ],
    },
  },
  {
    id: 'rc-3',
    name: 'Starter Plan',
    markup: 18,
    description: 'Standard markup for starter merchants',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-12-01',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 5.50 }, { maxWeight: 5, price: 5.50 }, { maxWeight: 10, price: 6.80 }, { maxWeight: 31.5, price: 9.20 }] },
        { zone: 'Zone 1', countries: ['AT', 'CH', 'NL'], tiers: [{ maxWeight: 3, price: 9.00 }, { maxWeight: 5, price: 9.00 }, { maxWeight: 10, price: 11.50 }, { maxWeight: 31.5, price: 14.90 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '9.0%' },
        { name: 'Handling Fee', value: '€15.00' },
        { name: 'Security Fee', value: '€0.06' },
        { name: 'Address Correction', value: '€3.50' },
      ],
    },
  },
  {
    id: 'rc-4',
    name: 'DHL Express Deal',
    markup: 12,
    carrierId: 'dhl-de',
    description: 'Special DHL Express markup rate',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-12-01',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 3.90 }, { maxWeight: 5, price: 4.50 }, { maxWeight: 10, price: 5.60 }, { maxWeight: 31.5, price: 7.10 }] },
        { zone: 'Zone 1', countries: ['AT', 'BE', 'DK', 'NL'], tiers: [{ maxWeight: 3, price: 7.00 }, { maxWeight: 5, price: 7.80 }, { maxWeight: 10, price: 9.40 }, { maxWeight: 31.5, price: 11.90 }] },
        { zone: 'Zone 2', countries: ['FR', 'ES', 'IT', 'PL'], tiers: [{ maxWeight: 3, price: 9.20 }, { maxWeight: 5, price: 10.00 }, { maxWeight: 10, price: 11.80 }, { maxWeight: 31.5, price: 14.50 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '8.0%' },
        { name: 'Handling Fee', value: '€10.00' },
        { name: 'Security Fee', value: '€0.05' },
        { name: 'Peak Season', value: '€1.50' },
        { name: 'Residential Delivery', value: '€2.00' },
      ],
    },
  },
  {
    id: 'rc-5',
    name: 'GLS Economy',
    markup: 10,
    carrierId: 'gls-de',
    description: 'Economy markup for GLS shipments',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-12-10',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 3.80 }, { maxWeight: 5, price: 4.20 }, { maxWeight: 10, price: 5.30 }, { maxWeight: 31.5, price: 6.90 }] },
        { zone: 'Zone 1', countries: ['AT', 'BE', 'NL', 'DK'], tiers: [{ maxWeight: 3, price: 6.80 }, { maxWeight: 5, price: 7.40 }, { maxWeight: 10, price: 8.90 }, { maxWeight: 31.5, price: 11.20 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '7.5%' },
        { name: 'Handling Fee', value: '€9.00' },
        { name: 'Security Fee', value: '€0.04' },
      ],
    },
  },
  {
    id: 'rc-6',
    name: 'FedEx DACH Corridor',
    markup: 10,
    carrierId: 'fedex-de',
    description: 'FedEx markup for DACH region corridor',
    validFrom: '2026-01-01',
    validTo: '2026-06-30',
    createdAt: '2026-01-05',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 4.50 }, { maxWeight: 5, price: 5.10 }, { maxWeight: 10, price: 6.30 }, { maxWeight: 31.5, price: 8.00 }] },
        { zone: 'DACH', countries: ['DE', 'AT', 'CH'], tiers: [{ maxWeight: 3, price: 5.80 }, { maxWeight: 5, price: 6.50 }, { maxWeight: 10, price: 7.90 }, { maxWeight: 31.5, price: 10.20 }] },
        { zone: 'EU West', countries: ['FR', 'BE', 'NL', 'LU'], tiers: [{ maxWeight: 3, price: 8.90 }, { maxWeight: 5, price: 9.60 }, { maxWeight: 10, price: 11.40 }, { maxWeight: 31.5, price: 14.20 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '9.5%' },
        { name: 'Handling Fee', value: '€11.00' },
        { name: 'Security Fee', value: '€0.05' },
        { name: 'Remote Area', value: '€18.00' },
        { name: 'Address Correction', value: '€4.00' },
      ],
    },
  },
  {
    id: 'rc-7',
    name: 'Basic Flat Rate',
    markup: 20,
    description: 'Basic markup for all carriers',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-12-20',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 5, price: 7.50 }, { maxWeight: 10, price: 8.90 }, { maxWeight: 31.5, price: 11.50 }] },
        { zone: 'Zone 1', countries: ['AT', 'NL', 'BE'], tiers: [{ maxWeight: 5, price: 10.00 }, { maxWeight: 10, price: 12.20 }, { maxWeight: 31.5, price: 15.80 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '8.0%' },
        { name: 'Handling Fee', value: '€14.00' },
        { name: 'Security Fee', value: '€0.06' },
        { name: 'Oversize', value: '€25.00' },
      ],
    },
  },
];

export const mockMerchantGroups: MerchantGroup[] = [
  {
    id: 'grp-1',
    name: 'Enterprise',
    description: 'High-volume merchants (>500 shipments/month)',
    merchantIds: ['ent-1', 'ent-2'],
    color: '#3b82f6',
    createdAt: '2025-10-01',
  },
  {
    id: 'grp-2',
    name: 'DACH Region',
    description: 'Merchants primarily shipping within DE/AT/CH',
    merchantIds: ['ent-4', 'ent-5', 'ent-10'],
    color: '#8b5cf6',
    createdAt: '2025-11-15',
  },
  {
    id: 'grp-3',
    name: 'Nordics',
    description: 'Scandinavian and Nordic merchants',
    merchantIds: ['ent-8'],
    color: '#10b981',
    createdAt: '2026-01-05',
  },
];

export const mockAssignments: RateCardAssignment[] = [
  // Global default: Standard Fulfillment for all carriers (priority 5)
  {
    id: 'asgn-1',
    rateCardId: 'rc-1',
    carrierId: '*',
    scope: { type: 'global' },
    priority: 5,
    createdAt: '2025-12-01',
  },

  // Enterprise group → Enterprise Pricing for all carriers (priority 4)
  {
    id: 'asgn-2',
    rateCardId: 'rc-2',
    carrierId: '*',
    scope: { type: 'group', groupId: 'grp-1' },
    priority: 4,
    createdAt: '2026-01-02',
  },

  // DACH group → FedEx DACH Corridor for FedEx (priority 3)
  {
    id: 'asgn-3',
    rateCardId: 'rc-6',
    carrierId: 'fedex-de',
    scope: { type: 'group', groupId: 'grp-2' },
    priority: 3,
    createdAt: '2026-01-08',
  },

  // Nordics group → DHL Express Deal for DHL (priority 3)
  {
    id: 'asgn-4',
    rateCardId: 'rc-4',
    carrierId: 'dhl-nl',
    scope: { type: 'group', groupId: 'grp-3' },
    priority: 3,
    createdAt: '2026-01-15',
  },

  // Direct: Rheinwerk GmbH → GLS Economy for GLS (priority 1)
  {
    id: 'asgn-5',
    rateCardId: 'rc-5',
    carrierId: 'gls-de',
    scope: { type: 'merchant', merchantId: 'ent-1' },
    priority: 1,
    createdAt: '2026-02-01',
  },

  // Direct: Nordic Threads → DHL Express Deal for DHL (priority 1)
  {
    id: 'asgn-6',
    rateCardId: 'rc-4',
    carrierId: 'dhl-nl',
    scope: { type: 'merchant', merchantId: 'ent-3' },
    priority: 1,
    createdAt: '2026-01-20',
  },

  // Direct: Alpine Gear → FedEx DACH Corridor for FedEx (priority 1)
  {
    id: 'asgn-7',
    rateCardId: 'rc-6',
    carrierId: 'fedex-de',
    scope: { type: 'merchant', merchantId: 'ent-4' },
    priority: 1,
    createdAt: '2026-02-05',
  },

  // Direct: Balkan Basics → Basic Flat Rate for all carriers (priority 2)
  {
    id: 'asgn-8',
    rateCardId: 'rc-7',
    carrierId: '*',
    scope: { type: 'merchant', merchantId: 'ent-9' },
    priority: 2,
    createdAt: '2026-02-10',
  },

  // Direct: Helvetica Home → Starter Plan for all carriers (priority 2)
  {
    id: 'asgn-9',
    rateCardId: 'rc-3',
    carrierId: '*',
    scope: { type: 'merchant', merchantId: 'ent-10' },
    priority: 2,
    createdAt: '2026-02-12',
  },
];

export const mockBuyingRateCards: BuyingRateCard[] = [
  {
    id: 'brc-1',
    name: 'DHL Contract 2026',
    carrierId: 'dhl-de',
    contractReference: 'CTR-DHL-2026-001',
    accountNumbers: ['ACC-DHL-44201', 'ACC-DHL-44202'],
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-11-20',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 3.12 }, { maxWeight: 5, price: 3.30 }, { maxWeight: 31.5, price: 4.06 }] },
        { zone: 'Zone 1', countries: ['AT', 'BE', 'DK', 'FR'], tiers: [{ maxWeight: 3, price: 6.53 }, { maxWeight: 5, price: 6.78 }, { maxWeight: 10, price: 7.14 }, { maxWeight: 31.5, price: 7.14 }] },
        { zone: 'Zone 2', countries: ['ES', 'IT', 'PT', 'PL'], tiers: [{ maxWeight: 3, price: 8.10 }, { maxWeight: 5, price: 8.45 }, { maxWeight: 10, price: 9.20 }, { maxWeight: 31.5, price: 10.50 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: 'variable' },
        { name: 'Handling Fee', value: '€19.00' },
        { name: 'Peak Surcharge', value: '€2.50' },
        { name: 'Non-Conveyable', value: '€2.50' },
        { name: 'Security Fee', value: '€0.04' },
      ],
    },
  },
  {
    id: 'brc-2',
    name: 'GLS Standard 2026',
    carrierId: 'gls-de',
    contractReference: 'CTR-GLS-2026-001',
    accountNumbers: ['ACC-GLS-78320'],
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-12-01',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 2.95 }, { maxWeight: 5, price: 3.15 }, { maxWeight: 10, price: 3.80 }, { maxWeight: 31.5, price: 5.10 }] },
        { zone: 'Zone 1', countries: ['AT', 'BE', 'NL', 'LU'], tiers: [{ maxWeight: 3, price: 5.80 }, { maxWeight: 5, price: 6.10 }, { maxWeight: 10, price: 7.20 }, { maxWeight: 31.5, price: 9.00 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '6.8%' },
        { name: 'Handling Fee', value: '€16.00' },
        { name: 'Weight Correction', value: '€4.50' },
        { name: 'Security Fee', value: '€0.03' },
      ],
    },
  },
  {
    id: 'brc-3',
    name: 'FedEx EU Agreement',
    carrierId: 'fedex-de',
    contractReference: 'CTR-FDX-2026-001',
    accountNumbers: ['ACC-FDX-55010', 'ACC-FDX-55011', 'ACC-FDX-55012'],
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2025-12-10',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 3.40 }, { maxWeight: 5, price: 3.85 }, { maxWeight: 10, price: 4.70 }, { maxWeight: 31.5, price: 6.20 }] },
        { zone: 'EU West', countries: ['FR', 'BE', 'NL', 'LU'], tiers: [{ maxWeight: 3, price: 6.90 }, { maxWeight: 5, price: 7.30 }, { maxWeight: 10, price: 8.50 }, { maxWeight: 31.5, price: 10.80 }] },
        { zone: 'EU South', countries: ['ES', 'IT', 'PT', 'GR'], tiers: [{ maxWeight: 3, price: 8.20 }, { maxWeight: 5, price: 8.70 }, { maxWeight: 10, price: 10.10 }, { maxWeight: 31.5, price: 12.90 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '7.5%' },
        { name: 'Handling Fee', value: '€21.00' },
        { name: 'Extended Area', value: '€14.00' },
        { name: 'Security Fee', value: '€0.05' },
        { name: 'Non-Conveyable', value: '€2.80' },
      ],
    },
  },
  {
    id: 'brc-4',
    name: 'DPD Partnership',
    carrierId: 'dpd-de',
    contractReference: 'CTR-DPD-2026-001',
    accountNumbers: ['ACC-DPD-33040'],
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2026-01-05',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 3.05 }, { maxWeight: 5, price: 3.25 }, { maxWeight: 31.5, price: 3.98 }] },
        { zone: 'Zone 1', countries: ['AT', 'BE', 'NL', 'DK'], tiers: [{ maxWeight: 3, price: 6.20 }, { maxWeight: 5, price: 6.55 }, { maxWeight: 10, price: 7.40 }, { maxWeight: 31.5, price: 9.30 }] },
        { zone: 'Zone 2', countries: ['FR', 'ES', 'IT'], tiers: [{ maxWeight: 3, price: 7.80 }, { maxWeight: 5, price: 8.20 }, { maxWeight: 10, price: 9.50 }, { maxWeight: 31.5, price: 11.80 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '7.2%' },
        { name: 'Handling Fee', value: '€17.50' },
        { name: 'Remote Area', value: '€8.50' },
        { name: 'Weight Correction', value: '€3.80' },
        { name: 'Security Fee', value: '€0.04' },
        { name: 'Address Correction', value: '€5.00' },
      ],
    },
  },
  {
    id: 'brc-5',
    name: 'UPS Volume Deal',
    carrierId: 'ups-de',
    contractReference: 'CTR-UPS-2026-001',
    accountNumbers: ['ACC-UPS-44020', 'ACC-UPS-44021'],
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    createdAt: '2026-01-10',
    pricing: {
      zones: [
        { zone: 'National', tiers: [{ maxWeight: 3, price: 3.50 }, { maxWeight: 5, price: 3.90 }, { maxWeight: 10, price: 4.80 }, { maxWeight: 31.5, price: 6.40 }] },
        { zone: 'Zone 1', countries: ['AT', 'NL', 'BE', 'FR'], tiers: [{ maxWeight: 3, price: 7.10 }, { maxWeight: 5, price: 7.50 }, { maxWeight: 10, price: 8.80 }, { maxWeight: 31.5, price: 11.20 }] },
      ],
      surcharges: [
        { name: 'Fuel Surcharge', value: '8.0%' },
        { name: 'Handling Fee', value: '€20.00' },
        { name: 'Residential Delivery', value: '€4.20' },
        { name: 'Security Fee', value: '€0.05' },
      ],
    },
  },
];

export const mockBuyingAssignments: BuyingRateCardAssignment[] = [
  // Rheinwerk GmbH
  { id: 'basgn-1', buyingRateCardId: 'brc-1', carrierId: 'dhl-de', merchantId: 'ent-1', createdAt: '2026-01-15' },
  { id: 'basgn-2', buyingRateCardId: 'brc-2', carrierId: 'gls-de', merchantId: 'ent-1', createdAt: '2026-01-15' },
  { id: 'basgn-3', buyingRateCardId: 'brc-3', carrierId: 'fedex-de', merchantId: 'ent-1', createdAt: '2026-01-15' },
  { id: 'basgn-4', buyingRateCardId: 'brc-4', carrierId: 'dpd-de', merchantId: 'ent-1', createdAt: '2026-01-15' },
  // 8WEEKSOUT
  { id: 'basgn-5', buyingRateCardId: 'brc-1', carrierId: 'dhl-de', merchantId: 'ent-2', createdAt: '2026-01-16' },
  { id: 'basgn-6', buyingRateCardId: 'brc-2', carrierId: 'gls-de', merchantId: 'ent-2', createdAt: '2026-01-16' },
  { id: 'basgn-7', buyingRateCardId: 'brc-4', carrierId: 'dpd-de', merchantId: 'ent-2', createdAt: '2026-01-16' },
  // Nordic Threads
  { id: 'basgn-8', buyingRateCardId: 'brc-1', carrierId: 'dhl-nl', merchantId: 'ent-3', createdAt: '2026-01-17' },
  { id: 'basgn-9', buyingRateCardId: 'brc-2', carrierId: 'gls-nl', merchantId: 'ent-3', createdAt: '2026-01-17' },
  // Alpine Gear
  { id: 'basgn-10', buyingRateCardId: 'brc-1', carrierId: 'dhl-at', merchantId: 'ent-4', createdAt: '2026-01-18' },
  { id: 'basgn-11', buyingRateCardId: 'brc-3', carrierId: 'fedex-de', merchantId: 'ent-4', createdAt: '2026-01-18' },
  { id: 'basgn-12', buyingRateCardId: 'brc-4', carrierId: 'dpd-at', merchantId: 'ent-4', createdAt: '2026-01-18' },
  // BerlinBrew
  { id: 'basgn-13', buyingRateCardId: 'brc-1', carrierId: 'dhl-de', merchantId: 'ent-5', createdAt: '2026-01-19' },
  { id: 'basgn-14', buyingRateCardId: 'brc-4', carrierId: 'dpd-de', merchantId: 'ent-5', createdAt: '2026-01-19' },
  // Maison Lumière
  { id: 'basgn-15', buyingRateCardId: 'brc-1', carrierId: 'dhl-nl', merchantId: 'ent-6', createdAt: '2026-01-20' },
  { id: 'basgn-16', buyingRateCardId: 'brc-3', carrierId: 'fedex-nl', merchantId: 'ent-6', createdAt: '2026-01-20' },
  // Porto Vita
  { id: 'basgn-17', buyingRateCardId: 'brc-2', carrierId: 'gls-de', merchantId: 'ent-7', createdAt: '2026-01-21' },
  { id: 'basgn-18', buyingRateCardId: 'brc-4', carrierId: 'dpd-de', merchantId: 'ent-7', createdAt: '2026-01-21' },
  // Fjord Outfitters
  { id: 'basgn-19', buyingRateCardId: 'brc-1', carrierId: 'dhl-nl', merchantId: 'ent-8', createdAt: '2026-01-22' },
  // Balkan Basics
  { id: 'basgn-20', buyingRateCardId: 'brc-1', carrierId: 'dhl-de', merchantId: 'ent-9', createdAt: '2026-01-23' },
  { id: 'basgn-21', buyingRateCardId: 'brc-4', carrierId: 'dpd-de', merchantId: 'ent-9', createdAt: '2026-01-23' },
  // Helvetica Home
  { id: 'basgn-22', buyingRateCardId: 'brc-1', carrierId: 'dhl-de', merchantId: 'ent-10', createdAt: '2026-01-24' },
];

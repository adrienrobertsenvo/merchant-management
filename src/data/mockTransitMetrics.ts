import type { MonthlyTransitMetrics } from '../types/analytics';

export const mockMonthlyTransitMetrics: MonthlyTransitMetrics[] = [
  // ── DHL Express — SLA 2 days ──
  // 2025-05
  { month: '2025-05', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express', totalShipments: 74, avgTransitDays: 1.3, onTimePct: 97.4, latePct: 2.3, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-05', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', totalShipments: 122, avgTransitDays: 1.7, onTimePct: 95.9, latePct: 3.8, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-05', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy', totalShipments: 49, avgTransitDays: 2.3, onTimePct: 93.2, latePct: 6.5, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-06
  { month: '2025-06', carrierId: 'dhl-de', destination: 'AT', serviceType: 'express', totalShipments: 80, avgTransitDays: 1.4, onTimePct: 96.8, latePct: 2.8, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-06', carrierId: 'dhl-de', destination: 'BE', serviceType: 'standard', totalShipments: 134, avgTransitDays: 1.8, onTimePct: 95.1, latePct: 4.5, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-06', carrierId: 'dhl-de', destination: 'SE', serviceType: 'economy', totalShipments: 54, avgTransitDays: 2.4, onTimePct: 92.4, latePct: 7.2, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-07
  { month: '2025-07', carrierId: 'dhl-de', destination: 'FR', serviceType: 'express', totalShipments: 85, avgTransitDays: 1.4, onTimePct: 96.5, latePct: 3.2, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-07', carrierId: 'dhl-de', destination: 'NL', serviceType: 'standard', totalShipments: 141, avgTransitDays: 1.8, onTimePct: 94.7, latePct: 5.0, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-07', carrierId: 'dhl-de', destination: 'DE', serviceType: 'economy', totalShipments: 56, avgTransitDays: 2.5, onTimePct: 91.9, latePct: 7.8, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-08
  { month: '2025-08', carrierId: 'dhl-de', destination: 'BE', serviceType: 'express', totalShipments: 93, avgTransitDays: 1.5, onTimePct: 96.0, latePct: 3.7, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-08', carrierId: 'dhl-de', destination: 'SE', serviceType: 'standard', totalShipments: 155, avgTransitDays: 1.9, onTimePct: 94.2, latePct: 5.5, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-08', carrierId: 'dhl-de', destination: 'AT', serviceType: 'economy', totalShipments: 62, avgTransitDays: 2.6, onTimePct: 91.5, latePct: 8.2, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-09
  { month: '2025-09', carrierId: 'dhl-de', destination: 'NL', serviceType: 'express', totalShipments: 98, avgTransitDays: 1.4, onTimePct: 97.0, latePct: 2.7, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-09', carrierId: 'dhl-de', destination: 'DE', serviceType: 'standard', totalShipments: 162, avgTransitDays: 1.8, onTimePct: 95.4, latePct: 4.3, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-09', carrierId: 'dhl-de', destination: 'FR', serviceType: 'economy', totalShipments: 65, avgTransitDays: 2.4, onTimePct: 92.7, latePct: 7.0, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-10
  { month: '2025-10', carrierId: 'dhl-de', destination: 'SE', serviceType: 'express', totalShipments: 104, avgTransitDays: 1.3, onTimePct: 97.5, latePct: 2.2, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-10', carrierId: 'dhl-de', destination: 'AT', serviceType: 'standard', totalShipments: 174, avgTransitDays: 1.7, onTimePct: 96.0, latePct: 3.7, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-10', carrierId: 'dhl-de', destination: 'BE', serviceType: 'economy', totalShipments: 70, avgTransitDays: 2.4, onTimePct: 93.3, latePct: 6.4, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-11 (holiday season — worse performance)
  { month: '2025-11', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express', totalShipments: 112, avgTransitDays: 1.6, onTimePct: 94.2, latePct: 5.4, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-11', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', totalShipments: 186, avgTransitDays: 2.0, onTimePct: 92.5, latePct: 7.1, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-11', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy', totalShipments: 74, avgTransitDays: 2.7, onTimePct: 89.8, latePct: 9.8, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-12 (holiday season — worst performance)
  { month: '2025-12', carrierId: 'dhl-de', destination: 'AT', serviceType: 'express', totalShipments: 125, avgTransitDays: 1.8, onTimePct: 91.5, latePct: 8.0, lostPct: 0.5, slaTargetDays: 2 },
  { month: '2025-12', carrierId: 'dhl-de', destination: 'BE', serviceType: 'standard', totalShipments: 209, avgTransitDays: 2.2, onTimePct: 89.7, latePct: 9.8, lostPct: 0.5, slaTargetDays: 2 },
  { month: '2025-12', carrierId: 'dhl-de', destination: 'SE', serviceType: 'economy', totalShipments: 84, avgTransitDays: 2.9, onTimePct: 86.9, latePct: 12.6, lostPct: 0.5, slaTargetDays: 2 },
  // 2026-01
  { month: '2026-01', carrierId: 'dhl-de', destination: 'FR', serviceType: 'express', totalShipments: 119, avgTransitDays: 1.4, onTimePct: 96.9, latePct: 2.8, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-01', carrierId: 'dhl-de', destination: 'NL', serviceType: 'standard', totalShipments: 197, avgTransitDays: 1.8, onTimePct: 95.2, latePct: 4.5, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-01', carrierId: 'dhl-de', destination: 'DE', serviceType: 'economy', totalShipments: 79, avgTransitDays: 2.5, onTimePct: 92.5, latePct: 7.2, lostPct: 0.3, slaTargetDays: 2 },
  // 2026-02
  { month: '2026-02', carrierId: 'dhl-de', destination: 'SE', serviceType: 'express', totalShipments: 109, avgTransitDays: 1.3, onTimePct: 97.4, latePct: 2.3, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-02', carrierId: 'dhl-de', destination: 'AT', serviceType: 'standard', totalShipments: 181, avgTransitDays: 1.7, onTimePct: 95.9, latePct: 3.8, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-02', carrierId: 'dhl-de', destination: 'BE', serviceType: 'economy', totalShipments: 72, avgTransitDays: 2.4, onTimePct: 93.2, latePct: 6.5, lostPct: 0.3, slaTargetDays: 2 },

  // ── GLS — SLA 3 days ──
  // 2025-05
  { month: '2025-05', carrierId: 'gls-de', destination: 'NL', serviceType: 'express', totalShipments: 43, avgTransitDays: 2.0, onTimePct: 93.3, latePct: 6.3, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-05', carrierId: 'gls-de', destination: 'DE', serviceType: 'standard', totalShipments: 71, avgTransitDays: 2.4, onTimePct: 91.5, latePct: 8.1, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-05', carrierId: 'gls-de', destination: 'AT', serviceType: 'economy', totalShipments: 28, avgTransitDays: 3.0, onTimePct: 88.8, latePct: 10.8, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-06
  { month: '2025-06', carrierId: 'gls-de', destination: 'SE', serviceType: 'express', totalShipments: 47, avgTransitDays: 2.1, onTimePct: 92.6, latePct: 7.0, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-06', carrierId: 'gls-de', destination: 'FR', serviceType: 'standard', totalShipments: 79, avgTransitDays: 2.5, onTimePct: 90.8, latePct: 8.8, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-06', carrierId: 'gls-de', destination: 'BE', serviceType: 'economy', totalShipments: 32, avgTransitDays: 3.1, onTimePct: 88.1, latePct: 11.5, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-07
  { month: '2025-07', carrierId: 'gls-de', destination: 'DE', serviceType: 'express', totalShipments: 50, avgTransitDays: 2.0, onTimePct: 93.0, latePct: 6.6, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-07', carrierId: 'gls-de', destination: 'AT', serviceType: 'standard', totalShipments: 84, avgTransitDays: 2.4, onTimePct: 91.1, latePct: 8.5, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-07', carrierId: 'gls-de', destination: 'NL', serviceType: 'economy', totalShipments: 34, avgTransitDays: 3.1, onTimePct: 88.4, latePct: 11.2, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-08
  { month: '2025-08', carrierId: 'gls-de', destination: 'FR', serviceType: 'express', totalShipments: 56, avgTransitDays: 2.1, onTimePct: 92.1, latePct: 7.5, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-08', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', totalShipments: 92, avgTransitDays: 2.5, onTimePct: 90.3, latePct: 9.3, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-08', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy', totalShipments: 37, avgTransitDays: 3.2, onTimePct: 87.6, latePct: 12.0, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-09
  { month: '2025-09', carrierId: 'gls-de', destination: 'AT', serviceType: 'express', totalShipments: 59, avgTransitDays: 2.0, onTimePct: 93.1, latePct: 6.5, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-09', carrierId: 'gls-de', destination: 'NL', serviceType: 'standard', totalShipments: 97, avgTransitDays: 2.4, onTimePct: 91.3, latePct: 8.3, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-09', carrierId: 'gls-de', destination: 'DE', serviceType: 'economy', totalShipments: 39, avgTransitDays: 3.1, onTimePct: 88.6, latePct: 11.0, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-10
  { month: '2025-10', carrierId: 'gls-de', destination: 'BE', serviceType: 'express', totalShipments: 63, avgTransitDays: 1.9, onTimePct: 93.8, latePct: 5.8, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-10', carrierId: 'gls-de', destination: 'SE', serviceType: 'standard', totalShipments: 105, avgTransitDays: 2.3, onTimePct: 92.0, latePct: 7.6, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-10', carrierId: 'gls-de', destination: 'FR', serviceType: 'economy', totalShipments: 42, avgTransitDays: 3.0, onTimePct: 89.3, latePct: 10.3, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-11 (holiday season)
  { month: '2025-11', carrierId: 'gls-de', destination: 'NL', serviceType: 'express', totalShipments: 68, avgTransitDays: 2.3, onTimePct: 90.4, latePct: 9.2, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-11', carrierId: 'gls-de', destination: 'DE', serviceType: 'standard', totalShipments: 114, avgTransitDays: 2.7, onTimePct: 88.6, latePct: 11.0, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-11', carrierId: 'gls-de', destination: 'AT', serviceType: 'economy', totalShipments: 46, avgTransitDays: 3.4, onTimePct: 85.9, latePct: 13.7, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-12 (holiday season)
  { month: '2025-12', carrierId: 'gls-de', destination: 'SE', serviceType: 'express', totalShipments: 78, avgTransitDays: 2.5, onTimePct: 88.3, latePct: 11.2, lostPct: 0.5, slaTargetDays: 3 },
  { month: '2025-12', carrierId: 'gls-de', destination: 'FR', serviceType: 'standard', totalShipments: 130, avgTransitDays: 2.9, onTimePct: 86.5, latePct: 13.0, lostPct: 0.5, slaTargetDays: 3 },
  { month: '2025-12', carrierId: 'gls-de', destination: 'BE', serviceType: 'economy', totalShipments: 52, avgTransitDays: 3.6, onTimePct: 83.8, latePct: 15.7, lostPct: 0.5, slaTargetDays: 3 },
  // 2026-01
  { month: '2026-01', carrierId: 'gls-de', destination: 'DE', serviceType: 'express', totalShipments: 73, avgTransitDays: 2.1, onTimePct: 92.7, latePct: 6.9, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2026-01', carrierId: 'gls-de', destination: 'AT', serviceType: 'standard', totalShipments: 121, avgTransitDays: 2.5, onTimePct: 90.9, latePct: 8.7, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2026-01', carrierId: 'gls-de', destination: 'NL', serviceType: 'economy', totalShipments: 48, avgTransitDays: 3.2, onTimePct: 88.2, latePct: 11.4, lostPct: 0.4, slaTargetDays: 3 },
  // 2026-02
  { month: '2026-02', carrierId: 'gls-de', destination: 'FR', serviceType: 'express', totalShipments: 65, avgTransitDays: 2.0, onTimePct: 93.5, latePct: 6.1, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2026-02', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', totalShipments: 109, avgTransitDays: 2.4, onTimePct: 91.7, latePct: 7.9, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2026-02', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy', totalShipments: 44, avgTransitDays: 3.1, onTimePct: 89.0, latePct: 10.6, lostPct: 0.4, slaTargetDays: 3 },

  // ── FedEx — SLA 2 days ──
  // 2025-05
  { month: '2025-05', carrierId: 'fedex-de', destination: 'AT', serviceType: 'express', totalShipments: 29, avgTransitDays: 1.4, onTimePct: 96.7, latePct: 3.0, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-05', carrierId: 'fedex-de', destination: 'BE', serviceType: 'standard', totalShipments: 49, avgTransitDays: 1.8, onTimePct: 94.9, latePct: 4.8, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-05', carrierId: 'fedex-de', destination: 'SE', serviceType: 'economy', totalShipments: 20, avgTransitDays: 2.5, onTimePct: 92.2, latePct: 7.5, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-06
  { month: '2025-06', carrierId: 'fedex-de', destination: 'DE', serviceType: 'express', totalShipments: 32, avgTransitDays: 1.5, onTimePct: 95.3, latePct: 4.4, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-06', carrierId: 'fedex-de', destination: 'NL', serviceType: 'standard', totalShipments: 54, avgTransitDays: 1.9, onTimePct: 93.5, latePct: 6.2, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-06', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy', totalShipments: 22, avgTransitDays: 2.6, onTimePct: 90.8, latePct: 8.9, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-07
  { month: '2025-07', carrierId: 'fedex-de', destination: 'SE', serviceType: 'express', totalShipments: 35, avgTransitDays: 1.5, onTimePct: 95.7, latePct: 4.0, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-07', carrierId: 'fedex-de', destination: 'AT', serviceType: 'standard', totalShipments: 57, avgTransitDays: 1.9, onTimePct: 93.9, latePct: 5.8, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-07', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy', totalShipments: 23, avgTransitDays: 2.6, onTimePct: 91.2, latePct: 8.5, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-08
  { month: '2025-08', carrierId: 'fedex-de', destination: 'NL', serviceType: 'express', totalShipments: 38, avgTransitDays: 1.6, onTimePct: 95.4, latePct: 4.2, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-08', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', totalShipments: 62, avgTransitDays: 2.0, onTimePct: 93.6, latePct: 6.0, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-08', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy', totalShipments: 25, avgTransitDays: 2.7, onTimePct: 90.9, latePct: 8.7, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-09
  { month: '2025-09', carrierId: 'fedex-de', destination: 'BE', serviceType: 'express', totalShipments: 40, avgTransitDays: 1.5, onTimePct: 96.5, latePct: 3.2, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-09', carrierId: 'fedex-de', destination: 'SE', serviceType: 'standard', totalShipments: 66, avgTransitDays: 1.9, onTimePct: 94.7, latePct: 5.0, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-09', carrierId: 'fedex-de', destination: 'AT', serviceType: 'economy', totalShipments: 26, avgTransitDays: 2.6, onTimePct: 91.9, latePct: 7.8, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-10
  { month: '2025-10', carrierId: 'fedex-de', destination: 'FR', serviceType: 'express', totalShipments: 42, avgTransitDays: 1.4, onTimePct: 96.8, latePct: 2.9, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-10', carrierId: 'fedex-de', destination: 'NL', serviceType: 'standard', totalShipments: 70, avgTransitDays: 1.8, onTimePct: 95.0, latePct: 4.7, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2025-10', carrierId: 'fedex-de', destination: 'DE', serviceType: 'economy', totalShipments: 28, avgTransitDays: 2.5, onTimePct: 92.3, latePct: 7.4, lostPct: 0.3, slaTargetDays: 2 },
  // 2025-11 (holiday season)
  { month: '2025-11', carrierId: 'fedex-de', destination: 'AT', serviceType: 'express', totalShipments: 47, avgTransitDays: 1.7, onTimePct: 93.4, latePct: 6.2, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-11', carrierId: 'fedex-de', destination: 'BE', serviceType: 'standard', totalShipments: 77, avgTransitDays: 2.1, onTimePct: 91.6, latePct: 8.0, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-11', carrierId: 'fedex-de', destination: 'SE', serviceType: 'economy', totalShipments: 31, avgTransitDays: 2.8, onTimePct: 88.9, latePct: 10.7, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-12 (holiday season)
  { month: '2025-12', carrierId: 'fedex-de', destination: 'DE', serviceType: 'express', totalShipments: 53, avgTransitDays: 1.9, onTimePct: 90.6, latePct: 8.9, lostPct: 0.5, slaTargetDays: 2 },
  { month: '2025-12', carrierId: 'fedex-de', destination: 'FR', serviceType: 'standard', totalShipments: 89, avgTransitDays: 2.3, onTimePct: 88.8, latePct: 10.7, lostPct: 0.5, slaTargetDays: 2 },
  { month: '2025-12', carrierId: 'fedex-de', destination: 'NL', serviceType: 'economy', totalShipments: 36, avgTransitDays: 3.0, onTimePct: 86.1, latePct: 13.4, lostPct: 0.5, slaTargetDays: 2 },
  // 2026-01
  { month: '2026-01', carrierId: 'fedex-de', destination: 'SE', serviceType: 'express', totalShipments: 50, avgTransitDays: 1.5, onTimePct: 96.3, latePct: 3.4, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-01', carrierId: 'fedex-de', destination: 'AT', serviceType: 'standard', totalShipments: 82, avgTransitDays: 1.9, onTimePct: 94.5, latePct: 5.2, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-01', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy', totalShipments: 33, avgTransitDays: 2.6, onTimePct: 91.8, latePct: 7.9, lostPct: 0.3, slaTargetDays: 2 },
  // 2026-02
  { month: '2026-02', carrierId: 'fedex-de', destination: 'NL', serviceType: 'express', totalShipments: 44, avgTransitDays: 1.4, onTimePct: 97.1, latePct: 2.6, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-02', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', totalShipments: 74, avgTransitDays: 1.8, onTimePct: 95.3, latePct: 4.4, lostPct: 0.3, slaTargetDays: 2 },
  { month: '2026-02', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy', totalShipments: 30, avgTransitDays: 2.5, onTimePct: 92.6, latePct: 7.1, lostPct: 0.3, slaTargetDays: 2 },

  // ── DPD — SLA 3 days ──
  // 2025-05
  { month: '2025-05', carrierId: 'dpd-de', destination: 'FR', serviceType: 'express', totalShipments: 35, avgTransitDays: 1.8, onTimePct: 95.0, latePct: 4.7, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-05', carrierId: 'dpd-de', destination: 'SE', serviceType: 'standard', totalShipments: 59, avgTransitDays: 2.2, onTimePct: 93.2, latePct: 6.5, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-05', carrierId: 'dpd-de', destination: 'DE', serviceType: 'economy', totalShipments: 24, avgTransitDays: 2.9, onTimePct: 90.5, latePct: 9.2, lostPct: 0.3, slaTargetDays: 3 },
  // 2025-06
  { month: '2025-06', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express', totalShipments: 39, avgTransitDays: 1.9, onTimePct: 94.1, latePct: 5.6, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-06', carrierId: 'dpd-de', destination: 'AT', serviceType: 'standard', totalShipments: 65, avgTransitDays: 2.3, onTimePct: 92.3, latePct: 7.4, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-06', carrierId: 'dpd-de', destination: 'FR', serviceType: 'economy', totalShipments: 26, avgTransitDays: 3.0, onTimePct: 89.6, latePct: 10.1, lostPct: 0.3, slaTargetDays: 3 },
  // 2025-07
  { month: '2025-07', carrierId: 'dpd-de', destination: 'BE', serviceType: 'express', totalShipments: 41, avgTransitDays: 1.8, onTimePct: 94.6, latePct: 5.1, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-07', carrierId: 'dpd-de', destination: 'DE', serviceType: 'standard', totalShipments: 69, avgTransitDays: 2.2, onTimePct: 92.8, latePct: 6.9, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-07', carrierId: 'dpd-de', destination: 'NL', serviceType: 'economy', totalShipments: 28, avgTransitDays: 2.9, onTimePct: 90.1, latePct: 9.6, lostPct: 0.3, slaTargetDays: 3 },
  // 2025-08
  { month: '2025-08', carrierId: 'dpd-de', destination: 'SE', serviceType: 'express', totalShipments: 46, avgTransitDays: 1.9, onTimePct: 93.9, latePct: 5.8, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-08', carrierId: 'dpd-de', destination: 'FR', serviceType: 'standard', totalShipments: 76, avgTransitDays: 2.3, onTimePct: 92.1, latePct: 7.6, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-08', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy', totalShipments: 30, avgTransitDays: 3.0, onTimePct: 89.4, latePct: 10.3, lostPct: 0.3, slaTargetDays: 3 },
  // 2025-09
  { month: '2025-09', carrierId: 'dpd-de', destination: 'DE', serviceType: 'express', totalShipments: 49, avgTransitDays: 1.8, onTimePct: 95.0, latePct: 4.7, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-09', carrierId: 'dpd-de', destination: 'BE', serviceType: 'standard', totalShipments: 81, avgTransitDays: 2.2, onTimePct: 93.2, latePct: 6.5, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-09', carrierId: 'dpd-de', destination: 'SE', serviceType: 'economy', totalShipments: 32, avgTransitDays: 2.9, onTimePct: 90.5, latePct: 9.2, lostPct: 0.3, slaTargetDays: 3 },
  // 2025-10
  { month: '2025-10', carrierId: 'dpd-de', destination: 'AT', serviceType: 'express', totalShipments: 53, avgTransitDays: 1.7, onTimePct: 95.5, latePct: 4.2, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-10', carrierId: 'dpd-de', destination: 'NL', serviceType: 'standard', totalShipments: 87, avgTransitDays: 2.1, onTimePct: 93.7, latePct: 6.0, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2025-10', carrierId: 'dpd-de', destination: 'FR', serviceType: 'economy', totalShipments: 35, avgTransitDays: 2.8, onTimePct: 91.0, latePct: 8.7, lostPct: 0.3, slaTargetDays: 3 },
  // 2025-11 (holiday season)
  { month: '2025-11', carrierId: 'dpd-de', destination: 'BE', serviceType: 'express', totalShipments: 58, avgTransitDays: 2.1, onTimePct: 91.9, latePct: 7.7, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-11', carrierId: 'dpd-de', destination: 'DE', serviceType: 'standard', totalShipments: 96, avgTransitDays: 2.5, onTimePct: 90.1, latePct: 9.5, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-11', carrierId: 'dpd-de', destination: 'SE', serviceType: 'economy', totalShipments: 38, avgTransitDays: 3.2, onTimePct: 87.4, latePct: 12.2, lostPct: 0.4, slaTargetDays: 3 },
  // 2025-12 (holiday season)
  { month: '2025-12', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express', totalShipments: 66, avgTransitDays: 2.3, onTimePct: 89.5, latePct: 10.1, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-12', carrierId: 'dpd-de', destination: 'FR', serviceType: 'standard', totalShipments: 110, avgTransitDays: 2.7, onTimePct: 87.7, latePct: 11.9, lostPct: 0.4, slaTargetDays: 3 },
  { month: '2025-12', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy', totalShipments: 44, avgTransitDays: 3.4, onTimePct: 84.9, latePct: 14.7, lostPct: 0.4, slaTargetDays: 3 },
  // 2026-01
  { month: '2026-01', carrierId: 'dpd-de', destination: 'SE', serviceType: 'express', totalShipments: 62, avgTransitDays: 1.9, onTimePct: 94.0, latePct: 5.7, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2026-01', carrierId: 'dpd-de', destination: 'BE', serviceType: 'standard', totalShipments: 102, avgTransitDays: 2.3, onTimePct: 92.2, latePct: 7.5, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2026-01', carrierId: 'dpd-de', destination: 'DE', serviceType: 'economy', totalShipments: 41, avgTransitDays: 3.0, onTimePct: 89.5, latePct: 10.2, lostPct: 0.3, slaTargetDays: 3 },
  // 2026-02
  { month: '2026-02', carrierId: 'dpd-de', destination: 'FR', serviceType: 'express', totalShipments: 56, avgTransitDays: 1.8, onTimePct: 94.8, latePct: 4.9, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2026-02', carrierId: 'dpd-de', destination: 'NL', serviceType: 'standard', totalShipments: 92, avgTransitDays: 2.2, onTimePct: 93.0, latePct: 6.7, lostPct: 0.3, slaTargetDays: 3 },
  { month: '2026-02', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy', totalShipments: 37, avgTransitDays: 2.9, onTimePct: 90.3, latePct: 9.4, lostPct: 0.3, slaTargetDays: 3 },

  // ── UPS — SLA 2 days ──
  // 2025-05
  { month: '2025-05', carrierId: 'ups-de', destination: 'SE', serviceType: 'express', totalShipments: 22, avgTransitDays: 1.5, onTimePct: 94.9, latePct: 4.7, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-05', carrierId: 'ups-de', destination: 'NL', serviceType: 'standard', totalShipments: 36, avgTransitDays: 1.9, onTimePct: 93.1, latePct: 6.5, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-05', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy', totalShipments: 14, avgTransitDays: 2.6, onTimePct: 90.4, latePct: 9.2, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-06
  { month: '2025-06', carrierId: 'ups-de', destination: 'DE', serviceType: 'express', totalShipments: 24, avgTransitDays: 1.6, onTimePct: 94.3, latePct: 5.3, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-06', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', totalShipments: 40, avgTransitDays: 2.0, onTimePct: 92.5, latePct: 7.1, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-06', carrierId: 'ups-de', destination: 'BE', serviceType: 'economy', totalShipments: 16, avgTransitDays: 2.7, onTimePct: 89.8, latePct: 9.8, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-07
  { month: '2025-07', carrierId: 'ups-de', destination: 'AT', serviceType: 'express', totalShipments: 26, avgTransitDays: 1.6, onTimePct: 94.7, latePct: 4.9, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-07', carrierId: 'ups-de', destination: 'FR', serviceType: 'standard', totalShipments: 42, avgTransitDays: 2.0, onTimePct: 92.9, latePct: 6.7, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-07', carrierId: 'ups-de', destination: 'SE', serviceType: 'economy', totalShipments: 17, avgTransitDays: 2.7, onTimePct: 90.2, latePct: 9.4, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-08
  { month: '2025-08', carrierId: 'ups-de', destination: 'BE', serviceType: 'express', totalShipments: 28, avgTransitDays: 1.6, onTimePct: 94.2, latePct: 5.4, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-08', carrierId: 'ups-de', destination: 'NL', serviceType: 'standard', totalShipments: 46, avgTransitDays: 2.0, onTimePct: 92.4, latePct: 7.2, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-08', carrierId: 'ups-de', destination: 'DE', serviceType: 'economy', totalShipments: 18, avgTransitDays: 2.7, onTimePct: 89.7, latePct: 9.9, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-09
  { month: '2025-09', carrierId: 'ups-de', destination: 'FR', serviceType: 'express', totalShipments: 29, avgTransitDays: 1.5, onTimePct: 95.7, latePct: 3.9, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-09', carrierId: 'ups-de', destination: 'SE', serviceType: 'standard', totalShipments: 49, avgTransitDays: 1.9, onTimePct: 93.9, latePct: 5.7, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-09', carrierId: 'ups-de', destination: 'AT', serviceType: 'economy', totalShipments: 20, avgTransitDays: 2.6, onTimePct: 91.2, latePct: 8.4, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-10
  { month: '2025-10', carrierId: 'ups-de', destination: 'NL', serviceType: 'express', totalShipments: 32, avgTransitDays: 1.5, onTimePct: 96.1, latePct: 3.5, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-10', carrierId: 'ups-de', destination: 'DE', serviceType: 'standard', totalShipments: 52, avgTransitDays: 1.9, onTimePct: 94.3, latePct: 5.3, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-10', carrierId: 'ups-de', destination: 'BE', serviceType: 'economy', totalShipments: 21, avgTransitDays: 2.6, onTimePct: 91.6, latePct: 8.0, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-11 (holiday season)
  { month: '2025-11', carrierId: 'ups-de', destination: 'AT', serviceType: 'express', totalShipments: 35, avgTransitDays: 1.8, onTimePct: 92.2, latePct: 7.4, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-11', carrierId: 'ups-de', destination: 'FR', serviceType: 'standard', totalShipments: 57, avgTransitDays: 2.2, onTimePct: 90.4, latePct: 9.2, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2025-11', carrierId: 'ups-de', destination: 'NL', serviceType: 'economy', totalShipments: 23, avgTransitDays: 2.9, onTimePct: 87.7, latePct: 11.9, lostPct: 0.4, slaTargetDays: 2 },
  // 2025-12 (holiday season)
  { month: '2025-12', carrierId: 'ups-de', destination: 'SE', serviceType: 'express', totalShipments: 40, avgTransitDays: 2.0, onTimePct: 89.7, latePct: 9.8, lostPct: 0.5, slaTargetDays: 2 },
  { month: '2025-12', carrierId: 'ups-de', destination: 'BE', serviceType: 'standard', totalShipments: 66, avgTransitDays: 2.4, onTimePct: 87.9, latePct: 11.6, lostPct: 0.5, slaTargetDays: 2 },
  { month: '2025-12', carrierId: 'ups-de', destination: 'DE', serviceType: 'economy', totalShipments: 26, avgTransitDays: 3.1, onTimePct: 85.2, latePct: 14.3, lostPct: 0.5, slaTargetDays: 2 },
  // 2026-01
  { month: '2026-01', carrierId: 'ups-de', destination: 'NL', serviceType: 'express', totalShipments: 37, avgTransitDays: 1.6, onTimePct: 95.2, latePct: 4.4, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2026-01', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', totalShipments: 61, avgTransitDays: 2.0, onTimePct: 93.4, latePct: 6.2, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2026-01', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy', totalShipments: 24, avgTransitDays: 2.7, onTimePct: 90.7, latePct: 8.9, lostPct: 0.4, slaTargetDays: 2 },
  // 2026-02
  { month: '2026-02', carrierId: 'ups-de', destination: 'BE', serviceType: 'express', totalShipments: 33, avgTransitDays: 1.5, onTimePct: 96.3, latePct: 3.3, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2026-02', carrierId: 'ups-de', destination: 'SE', serviceType: 'standard', totalShipments: 55, avgTransitDays: 1.9, onTimePct: 94.5, latePct: 5.1, lostPct: 0.4, slaTargetDays: 2 },
  { month: '2026-02', carrierId: 'ups-de', destination: 'DE', serviceType: 'economy', totalShipments: 22, avgTransitDays: 2.6, onTimePct: 91.8, latePct: 7.8, lostPct: 0.4, slaTargetDays: 2 },
];

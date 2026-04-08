import type { MonthlyClaims, ClaimTypeSummary } from '../types/analytics';

export const mockMonthlyClaims: MonthlyClaims[] = [
  // ── DHL ──  destinations cycle: DE, FR, NL

  // 2025-05  total: submitted=6, accepted=4, rejected=1, pending=0, refund=312, avgDays=7
  { month: '2025-05', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 94,  avgResponseDays: 6 },
  { month: '2025-05', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 3, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 156, avgResponseDays: 7 },
  { month: '2025-05', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 62,  avgResponseDays: 8 },

  // 2025-06  total: submitted=8, accepted=5, rejected=2, pending=0, refund=445, avgDays=6
  { month: '2025-06', carrierId: 'dhl-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 2, claimsRejected: 0, claimsPending: 0, refundAmount: 134, avgResponseDays: 5 },
  { month: '2025-06', carrierId: 'dhl-de', destination: 'NL', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 2, claimsPending: 0, refundAmount: 222, avgResponseDays: 6 },
  { month: '2025-06', carrierId: 'dhl-de', destination: 'DE', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 89,  avgResponseDays: 7 },

  // 2025-07  total: submitted=7, accepted=5, rejected=1, pending=0, refund=380, avgDays=8
  { month: '2025-07', carrierId: 'dhl-de', destination: 'NL', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 2, claimsRejected: 0, claimsPending: 0, refundAmount: 114, avgResponseDays: 7 },
  { month: '2025-07', carrierId: 'dhl-de', destination: 'DE', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 190, avgResponseDays: 8 },
  { month: '2025-07', carrierId: 'dhl-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 76,  avgResponseDays: 9 },

  // 2025-08  total: submitted=9, accepted=6, rejected=2, pending=0, refund=524, avgDays=7
  { month: '2025-08', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express',  claimsSubmitted: 3, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 157, avgResponseDays: 6 },
  { month: '2025-08', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 3, claimsRejected: 1, claimsPending: 0, refundAmount: 262, avgResponseDays: 7 },
  { month: '2025-08', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 105, avgResponseDays: 8 },

  // 2025-09  total: submitted=7, accepted=5, rejected=1, pending=0, refund=395, avgDays=6
  { month: '2025-09', carrierId: 'dhl-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 2, claimsRejected: 0, claimsPending: 0, refundAmount: 118, avgResponseDays: 5 },
  { month: '2025-09', carrierId: 'dhl-de', destination: 'NL', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 198, avgResponseDays: 6 },
  { month: '2025-09', carrierId: 'dhl-de', destination: 'DE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 79,  avgResponseDays: 7 },

  // 2025-10  total: submitted=8, accepted=6, rejected=1, pending=0, refund=468, avgDays=7
  { month: '2025-10', carrierId: 'dhl-de', destination: 'NL', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 2, claimsRejected: 0, claimsPending: 0, refundAmount: 140, avgResponseDays: 6 },
  { month: '2025-10', carrierId: 'dhl-de', destination: 'DE', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 3, claimsRejected: 1, claimsPending: 0, refundAmount: 234, avgResponseDays: 7 },
  { month: '2025-10', carrierId: 'dhl-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 94,  avgResponseDays: 8 },

  // 2025-11  total: submitted=12, accepted=7, rejected=3, pending=0, refund=612, avgDays=9  (holiday spike)
  { month: '2025-11', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express',  claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 184, avgResponseDays: 8 },
  { month: '2025-11', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 6, claimsAccepted: 4, claimsRejected: 1, claimsPending: 0, refundAmount: 306, avgResponseDays: 9 },
  { month: '2025-11', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 122, avgResponseDays: 10 },

  // 2025-12  total: submitted=15, accepted=9, rejected=4, pending=0, refund=845, avgDays=11  (holiday spike)
  { month: '2025-12', carrierId: 'dhl-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 4, claimsAccepted: 3, claimsRejected: 1, claimsPending: 0, refundAmount: 254, avgResponseDays: 10 },
  { month: '2025-12', carrierId: 'dhl-de', destination: 'NL', serviceType: 'standard', claimsSubmitted: 8, claimsAccepted: 4, claimsRejected: 2, claimsPending: 0, refundAmount: 422, avgResponseDays: 11 },
  { month: '2025-12', carrierId: 'dhl-de', destination: 'DE', serviceType: 'economy',  claimsSubmitted: 3, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 169, avgResponseDays: 12 },

  // 2026-01  total: submitted=10, accepted=7, rejected=2, pending=1, refund=580, avgDays=8
  { month: '2026-01', carrierId: 'dhl-de', destination: 'NL', serviceType: 'express',  claimsSubmitted: 3, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 174, avgResponseDays: 7 },
  { month: '2026-01', carrierId: 'dhl-de', destination: 'DE', serviceType: 'standard', claimsSubmitted: 5, claimsAccepted: 4, claimsRejected: 1, claimsPending: 0, refundAmount: 290, avgResponseDays: 8 },
  { month: '2026-01', carrierId: 'dhl-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 1, refundAmount: 116, avgResponseDays: 9 },

  // 2026-02  total: submitted=8, accepted=5, rejected=1, pending=2, refund=410, avgDays=7
  { month: '2026-02', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 2, claimsRejected: 0, claimsPending: 0, refundAmount: 123, avgResponseDays: 6 },
  { month: '2026-02', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 1, claimsPending: 1, refundAmount: 205, avgResponseDays: 7 },
  { month: '2026-02', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 1, refundAmount: 82,  avgResponseDays: 8 },

  // ── GLS ──  destinations cycle: AT, BE, SE

  // 2025-05  total: submitted=3, accepted=2, rejected=1, pending=0, refund=145, avgDays=10
  { month: '2025-05', carrierId: 'gls-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 44,  avgResponseDays: 9 },
  { month: '2025-05', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 72,  avgResponseDays: 10 },
  { month: '2025-05', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 29,  avgResponseDays: 11 },

  // 2025-06  total: submitted=4, accepted=2, rejected=1, pending=0, refund=178, avgDays=11
  { month: '2025-06', carrierId: 'gls-de', destination: 'BE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 53,  avgResponseDays: 10 },
  { month: '2025-06', carrierId: 'gls-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 89,  avgResponseDays: 11 },
  { month: '2025-06', carrierId: 'gls-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 36,  avgResponseDays: 12 },

  // 2025-07  total: submitted=3, accepted=2, rejected=1, pending=0, refund=132, avgDays=10
  { month: '2025-07', carrierId: 'gls-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 40,  avgResponseDays: 9 },
  { month: '2025-07', carrierId: 'gls-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 66,  avgResponseDays: 10 },
  { month: '2025-07', carrierId: 'gls-de', destination: 'BE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 26,  avgResponseDays: 11 },

  // 2025-08  total: submitted=4, accepted=3, rejected=1, pending=0, refund=210, avgDays=9
  { month: '2025-08', carrierId: 'gls-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 63,  avgResponseDays: 8 },
  { month: '2025-08', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 105, avgResponseDays: 9 },
  { month: '2025-08', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 42,  avgResponseDays: 10 },

  // 2025-09  total: submitted=4, accepted=2, rejected=1, pending=0, refund=165, avgDays=12
  { month: '2025-09', carrierId: 'gls-de', destination: 'BE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 50,  avgResponseDays: 11 },
  { month: '2025-09', carrierId: 'gls-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 82,  avgResponseDays: 12 },
  { month: '2025-09', carrierId: 'gls-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 33,  avgResponseDays: 13 },

  // 2025-10  total: submitted=5, accepted=3, rejected=1, pending=0, refund=224, avgDays=10
  { month: '2025-10', carrierId: 'gls-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 67,  avgResponseDays: 9 },
  { month: '2025-10', carrierId: 'gls-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 112, avgResponseDays: 10 },
  { month: '2025-10', carrierId: 'gls-de', destination: 'BE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 45,  avgResponseDays: 11 },

  // 2025-11  total: submitted=6, accepted=3, rejected=2, pending=0, refund=248, avgDays=13  (holiday spike)
  { month: '2025-11', carrierId: 'gls-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 74,  avgResponseDays: 12 },
  { month: '2025-11', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', claimsSubmitted: 3, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 124, avgResponseDays: 13 },
  { month: '2025-11', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 50,  avgResponseDays: 14 },

  // 2025-12  total: submitted=8, accepted=4, rejected=3, pending=0, refund=320, avgDays=14  (holiday spike)
  { month: '2025-12', carrierId: 'gls-de', destination: 'BE', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 96,  avgResponseDays: 13 },
  { month: '2025-12', carrierId: 'gls-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 160, avgResponseDays: 14 },
  { month: '2025-12', carrierId: 'gls-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 64,  avgResponseDays: 15 },

  // 2026-01  total: submitted=5, accepted=3, rejected=1, pending=1, refund=195, avgDays=11
  { month: '2026-01', carrierId: 'gls-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 58,  avgResponseDays: 10 },
  { month: '2026-01', carrierId: 'gls-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 98,  avgResponseDays: 11 },
  { month: '2026-01', carrierId: 'gls-de', destination: 'BE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 1, refundAmount: 39,  avgResponseDays: 12 },

  // 2026-02  total: submitted=4, accepted=2, rejected=1, pending=1, refund=148, avgDays=10
  { month: '2026-02', carrierId: 'gls-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 44,  avgResponseDays: 9 },
  { month: '2026-02', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 74,  avgResponseDays: 10 },
  { month: '2026-02', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 1, refundAmount: 30,  avgResponseDays: 11 },

  // ── FedEx ──  destinations cycle: FR, DE, BE

  // 2025-05  total: submitted=2, accepted=1, rejected=1, pending=0, refund=95, avgDays=8
  { month: '2025-05', carrierId: 'fedex-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 1, claimsPending: 0, refundAmount: 28,  avgResponseDays: 7 },
  { month: '2025-05', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 48,  avgResponseDays: 8 },
  { month: '2025-05', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 19,  avgResponseDays: 9 },

  // 2025-06  total: submitted=3, accepted=2, rejected=1, pending=0, refund=165, avgDays=9
  { month: '2025-06', carrierId: 'fedex-de', destination: 'DE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 50,  avgResponseDays: 8 },
  { month: '2025-06', carrierId: 'fedex-de', destination: 'BE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 82,  avgResponseDays: 9 },
  { month: '2025-06', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 33,  avgResponseDays: 10 },

  // 2025-07  total: submitted=3, accepted=2, rejected=0, pending=0, refund=180, avgDays=7
  { month: '2025-07', carrierId: 'fedex-de', destination: 'BE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 54,  avgResponseDays: 6 },
  { month: '2025-07', carrierId: 'fedex-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 90,  avgResponseDays: 7 },
  { month: '2025-07', carrierId: 'fedex-de', destination: 'DE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 36,  avgResponseDays: 8 },

  // 2025-08  total: submitted=4, accepted=3, rejected=1, pending=0, refund=245, avgDays=8
  { month: '2025-08', carrierId: 'fedex-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 74,  avgResponseDays: 7 },
  { month: '2025-08', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 122, avgResponseDays: 8 },
  { month: '2025-08', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 49,  avgResponseDays: 9 },

  // 2025-09  total: submitted=3, accepted=2, rejected=0, pending=0, refund=188, avgDays=7
  { month: '2025-09', carrierId: 'fedex-de', destination: 'DE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 56,  avgResponseDays: 6 },
  { month: '2025-09', carrierId: 'fedex-de', destination: 'BE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 94,  avgResponseDays: 7 },
  { month: '2025-09', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 38,  avgResponseDays: 8 },

  // 2025-10  total: submitted=3, accepted=2, rejected=1, pending=0, refund=172, avgDays=8
  { month: '2025-10', carrierId: 'fedex-de', destination: 'BE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 52,  avgResponseDays: 7 },
  { month: '2025-10', carrierId: 'fedex-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 86,  avgResponseDays: 8 },
  { month: '2025-10', carrierId: 'fedex-de', destination: 'DE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 34,  avgResponseDays: 9 },

  // 2025-11  total: submitted=5, accepted=3, rejected=1, pending=0, refund=310, avgDays=10  (holiday spike)
  { month: '2025-11', carrierId: 'fedex-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 93,  avgResponseDays: 9 },
  { month: '2025-11', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 155, avgResponseDays: 10 },
  { month: '2025-11', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 62,  avgResponseDays: 11 },

  // 2025-12  total: submitted=7, accepted=4, rejected=2, pending=0, refund=425, avgDays=12  (holiday spike)
  { month: '2025-12', carrierId: 'fedex-de', destination: 'DE', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 128, avgResponseDays: 11 },
  { month: '2025-12', carrierId: 'fedex-de', destination: 'BE', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 212, avgResponseDays: 12 },
  { month: '2025-12', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 85,  avgResponseDays: 13 },

  // 2026-01  total: submitted=4, accepted=3, rejected=1, pending=0, refund=235, avgDays=8
  { month: '2026-01', carrierId: 'fedex-de', destination: 'BE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 70,  avgResponseDays: 7 },
  { month: '2026-01', carrierId: 'fedex-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 118, avgResponseDays: 8 },
  { month: '2026-01', carrierId: 'fedex-de', destination: 'DE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 47,  avgResponseDays: 9 },

  // 2026-02  total: submitted=3, accepted=2, rejected=0, pending=1, refund=168, avgDays=7
  { month: '2026-02', carrierId: 'fedex-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 50,  avgResponseDays: 6 },
  { month: '2026-02', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 84,  avgResponseDays: 7 },
  { month: '2026-02', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 1, refundAmount: 34,  avgResponseDays: 8 },

  // ── DPD ──  destinations cycle: NL, SE, AT

  // 2025-05  total: submitted=3, accepted=2, rejected=1, pending=0, refund=128, avgDays=12
  { month: '2025-05', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 38,  avgResponseDays: 11 },
  { month: '2025-05', carrierId: 'dpd-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 64,  avgResponseDays: 12 },
  { month: '2025-05', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 26,  avgResponseDays: 13 },

  // 2025-06  total: submitted=4, accepted=2, rejected=1, pending=0, refund=175, avgDays=13
  { month: '2025-06', carrierId: 'dpd-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 52,  avgResponseDays: 12 },
  { month: '2025-06', carrierId: 'dpd-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 88,  avgResponseDays: 13 },
  { month: '2025-06', carrierId: 'dpd-de', destination: 'NL', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 35,  avgResponseDays: 14 },

  // 2025-07  total: submitted=3, accepted=2, rejected=1, pending=0, refund=142, avgDays=11
  { month: '2025-07', carrierId: 'dpd-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 43,  avgResponseDays: 10 },
  { month: '2025-07', carrierId: 'dpd-de', destination: 'NL', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 71,  avgResponseDays: 11 },
  { month: '2025-07', carrierId: 'dpd-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 28,  avgResponseDays: 12 },

  // 2025-08  total: submitted=5, accepted=3, rejected=1, pending=0, refund=218, avgDays=12
  { month: '2025-08', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 65,  avgResponseDays: 11 },
  { month: '2025-08', carrierId: 'dpd-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 109, avgResponseDays: 12 },
  { month: '2025-08', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 44,  avgResponseDays: 13 },

  // 2025-09  total: submitted=4, accepted=2, rejected=1, pending=0, refund=162, avgDays=11
  { month: '2025-09', carrierId: 'dpd-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 49,  avgResponseDays: 10 },
  { month: '2025-09', carrierId: 'dpd-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 81,  avgResponseDays: 11 },
  { month: '2025-09', carrierId: 'dpd-de', destination: 'NL', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 32,  avgResponseDays: 12 },

  // 2025-10  total: submitted=4, accepted=3, rejected=1, pending=0, refund=195, avgDays=12
  { month: '2025-10', carrierId: 'dpd-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 58,  avgResponseDays: 11 },
  { month: '2025-10', carrierId: 'dpd-de', destination: 'NL', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 98,  avgResponseDays: 12 },
  { month: '2025-10', carrierId: 'dpd-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 39,  avgResponseDays: 13 },

  // 2025-11  total: submitted=6, accepted=3, rejected=2, pending=0, refund=265, avgDays=14  (holiday spike)
  { month: '2025-11', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 80,  avgResponseDays: 13 },
  { month: '2025-11', carrierId: 'dpd-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 3, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 132, avgResponseDays: 14 },
  { month: '2025-11', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 53,  avgResponseDays: 15 },

  // 2025-12  total: submitted=8, accepted=4, rejected=3, pending=0, refund=342, avgDays=15  (holiday spike)
  { month: '2025-12', carrierId: 'dpd-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 103, avgResponseDays: 14 },
  { month: '2025-12', carrierId: 'dpd-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 4, claimsAccepted: 2, claimsRejected: 1, claimsPending: 0, refundAmount: 171, avgResponseDays: 15 },
  { month: '2025-12', carrierId: 'dpd-de', destination: 'NL', serviceType: 'economy',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 68,  avgResponseDays: 16 },

  // 2026-01  total: submitted=5, accepted=3, rejected=1, pending=1, refund=210, avgDays=13
  { month: '2026-01', carrierId: 'dpd-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 63,  avgResponseDays: 12 },
  { month: '2026-01', carrierId: 'dpd-de', destination: 'NL', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 105, avgResponseDays: 13 },
  { month: '2026-01', carrierId: 'dpd-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 1, refundAmount: 42,  avgResponseDays: 14 },

  // 2026-02  total: submitted=4, accepted=2, rejected=1, pending=1, refund=155, avgDays=12
  { month: '2026-02', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 46,  avgResponseDays: 11 },
  { month: '2026-02', carrierId: 'dpd-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 78,  avgResponseDays: 12 },
  { month: '2026-02', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 1, refundAmount: 31,  avgResponseDays: 13 },

  // ── UPS ──  destinations cycle: SE, AT, FR

  // 2025-05  total: submitted=2, accepted=1, rejected=0, pending=0, refund=88, avgDays=9
  { month: '2025-05', carrierId: 'ups-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 26,  avgResponseDays: 8 },
  { month: '2025-05', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 44,  avgResponseDays: 9 },
  { month: '2025-05', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 18,  avgResponseDays: 10 },

  // 2025-06  total: submitted=2, accepted=1, rejected=1, pending=0, refund=72, avgDays=10
  { month: '2025-06', carrierId: 'ups-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 1, claimsPending: 0, refundAmount: 22,  avgResponseDays: 9 },
  { month: '2025-06', carrierId: 'ups-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 36,  avgResponseDays: 10 },
  { month: '2025-06', carrierId: 'ups-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 14,  avgResponseDays: 11 },

  // 2025-07  total: submitted=3, accepted=2, rejected=0, pending=0, refund=145, avgDays=9
  { month: '2025-07', carrierId: 'ups-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 44,  avgResponseDays: 8 },
  { month: '2025-07', carrierId: 'ups-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 72,  avgResponseDays: 9 },
  { month: '2025-07', carrierId: 'ups-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 29,  avgResponseDays: 10 },

  // 2025-08  total: submitted=2, accepted=1, rejected=1, pending=0, refund=82, avgDays=8
  { month: '2025-08', carrierId: 'ups-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 1, claimsPending: 0, refundAmount: 25,  avgResponseDays: 7 },
  { month: '2025-08', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 41,  avgResponseDays: 8 },
  { month: '2025-08', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 16,  avgResponseDays: 9 },

  // 2025-09  total: submitted=3, accepted=2, rejected=0, pending=0, refund=158, avgDays=9
  { month: '2025-09', carrierId: 'ups-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 47,  avgResponseDays: 8 },
  { month: '2025-09', carrierId: 'ups-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 79,  avgResponseDays: 9 },
  { month: '2025-09', carrierId: 'ups-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 32,  avgResponseDays: 10 },

  // 2025-10  total: submitted=2, accepted=1, rejected=1, pending=0, refund=75, avgDays=10
  { month: '2025-10', carrierId: 'ups-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 1, claimsPending: 0, refundAmount: 22,  avgResponseDays: 9 },
  { month: '2025-10', carrierId: 'ups-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 38,  avgResponseDays: 10 },
  { month: '2025-10', carrierId: 'ups-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 15,  avgResponseDays: 11 },

  // 2025-11  total: submitted=4, accepted=2, rejected=1, pending=0, refund=185, avgDays=11  (holiday spike)
  { month: '2025-11', carrierId: 'ups-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 56,  avgResponseDays: 10 },
  { month: '2025-11', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 92,  avgResponseDays: 11 },
  { month: '2025-11', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 37,  avgResponseDays: 12 },

  // 2025-12  total: submitted=5, accepted=3, rejected=1, pending=0, refund=248, avgDays=13  (holiday spike)
  { month: '2025-12', carrierId: 'ups-de', destination: 'AT', serviceType: 'express',  claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 74,  avgResponseDays: 12 },
  { month: '2025-12', carrierId: 'ups-de', destination: 'FR', serviceType: 'standard', claimsSubmitted: 2, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 124, avgResponseDays: 13 },
  { month: '2025-12', carrierId: 'ups-de', destination: 'SE', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 50,  avgResponseDays: 14 },

  // 2026-01  total: submitted=3, accepted=2, rejected=1, pending=0, refund=142, avgDays=9
  { month: '2026-01', carrierId: 'ups-de', destination: 'FR', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 43,  avgResponseDays: 8 },
  { month: '2026-01', carrierId: 'ups-de', destination: 'SE', serviceType: 'standard', claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 1, claimsPending: 0, refundAmount: 71,  avgResponseDays: 9 },
  { month: '2026-01', carrierId: 'ups-de', destination: 'AT', serviceType: 'economy',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 28,  avgResponseDays: 10 },

  // 2026-02  total: submitted=2, accepted=1, rejected=0, pending=1, refund=78, avgDays=9
  { month: '2026-02', carrierId: 'ups-de', destination: 'SE', serviceType: 'express',  claimsSubmitted: 1, claimsAccepted: 0, claimsRejected: 0, claimsPending: 0, refundAmount: 23,  avgResponseDays: 8 },
  { month: '2026-02', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', claimsSubmitted: 1, claimsAccepted: 1, claimsRejected: 0, claimsPending: 0, refundAmount: 39,  avgResponseDays: 9 },
  { month: '2026-02', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy',  claimsSubmitted: 0, claimsAccepted: 0, claimsRejected: 0, claimsPending: 1, refundAmount: 16,  avgResponseDays: 10 },
];

export const mockClaimTypeSummaries: ClaimTypeSummary[] = [
  { type: 'delay',       count: 78,  totalValue: 6240,  refundedValue: 4056,  resolutionRate: 65.4, avgResolutionDays: 8 },
  { type: 'damage',      count: 55,  totalValue: 8250,  refundedValue: 5775,  resolutionRate: 72.7, avgResolutionDays: 11 },
  { type: 'overcharge',  count: 42,  totalValue: 3360,  refundedValue: 2688,  resolutionRate: 80.9, avgResolutionDays: 6 },
  { type: 'loss',        count: 28,  totalValue: 7840,  refundedValue: 5488,  resolutionRate: 78.6, avgResolutionDays: 14 },
  { type: 'misdelivery', count: 18,  totalValue: 1620,  refundedValue: 972,   resolutionRate: 66.7, avgResolutionDays: 10 },
];

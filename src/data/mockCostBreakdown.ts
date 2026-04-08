import type { MonthlySurchargeBreakdown } from '../types/analytics';

export const mockMonthlySurchargeBreakdown: MonthlySurchargeBreakdown[] = [
  // ── DHL ──
  // 2025-05 (monthly total: baseCost 2010, fuel 205, handling 105, security 26, other 204 = 2550)
  { month: '2025-05', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express',  baseCost: 704, fuelSurcharge: 72, handlingFee: 37, securityFee: 9, otherSurcharges: 71, totalCost: 893 },
  { month: '2025-05', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', baseCost: 905, fuelSurcharge: 92, handlingFee: 47, securityFee: 12, otherSurcharges: 92, totalCost: 1148 },
  { month: '2025-05', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy',  baseCost: 401, fuelSurcharge: 41, handlingFee: 21, securityFee: 5, otherSurcharges: 41, totalCost: 509 },
  // 2025-06 (monthly total: baseCost 2050, fuel 212, handling 110, security 28, other 212 = 2612)
  { month: '2025-06', carrierId: 'dhl-de', destination: 'AT', serviceType: 'express',  baseCost: 718, fuelSurcharge: 74, handlingFee: 39, securityFee: 10, otherSurcharges: 74, totalCost: 915 },
  { month: '2025-06', carrierId: 'dhl-de', destination: 'BE', serviceType: 'standard', baseCost: 923, fuelSurcharge: 95, handlingFee: 50, securityFee: 13, otherSurcharges: 95, totalCost: 1176 },
  { month: '2025-06', carrierId: 'dhl-de', destination: 'SE', serviceType: 'economy',  baseCost: 409, fuelSurcharge: 43, handlingFee: 21, securityFee: 5, otherSurcharges: 43, totalCost: 521 },
  // 2025-07 (monthly total: baseCost 2090, fuel 220, handling 118, security 30, other 222 = 2680)
  { month: '2025-07', carrierId: 'dhl-de', destination: 'FR', serviceType: 'express',  baseCost: 732, fuelSurcharge: 77, handlingFee: 41, securityFee: 11, otherSurcharges: 78, totalCost: 939 },
  { month: '2025-07', carrierId: 'dhl-de', destination: 'NL', serviceType: 'standard', baseCost: 941, fuelSurcharge: 99, handlingFee: 53, securityFee: 14, otherSurcharges: 100, totalCost: 1207 },
  { month: '2025-07', carrierId: 'dhl-de', destination: 'DE', serviceType: 'economy',  baseCost: 417, fuelSurcharge: 44, handlingFee: 24, securityFee: 5, otherSurcharges: 44, totalCost: 534 },
  // 2025-08 (monthly total: baseCost 2130, fuel 230, handling 125, security 32, other 233 = 2750)
  { month: '2025-08', carrierId: 'dhl-de', destination: 'BE', serviceType: 'express',  baseCost: 746, fuelSurcharge: 81, handlingFee: 44, securityFee: 11, otherSurcharges: 82, totalCost: 964 },
  { month: '2025-08', carrierId: 'dhl-de', destination: 'SE', serviceType: 'standard', baseCost: 959, fuelSurcharge: 104, handlingFee: 56, securityFee: 14, otherSurcharges: 105, totalCost: 1238 },
  { month: '2025-08', carrierId: 'dhl-de', destination: 'AT', serviceType: 'economy',  baseCost: 425, fuelSurcharge: 45, handlingFee: 25, securityFee: 7, otherSurcharges: 46, totalCost: 548 },
  // 2025-09 (monthly total: baseCost 2160, fuel 240, handling 132, security 34, other 244 = 2810)
  { month: '2025-09', carrierId: 'dhl-de', destination: 'NL', serviceType: 'express',  baseCost: 756, fuelSurcharge: 84, handlingFee: 46, securityFee: 12, otherSurcharges: 85, totalCost: 983 },
  { month: '2025-09', carrierId: 'dhl-de', destination: 'DE', serviceType: 'standard', baseCost: 972, fuelSurcharge: 108, handlingFee: 59, securityFee: 15, otherSurcharges: 110, totalCost: 1264 },
  { month: '2025-09', carrierId: 'dhl-de', destination: 'FR', serviceType: 'economy',  baseCost: 432, fuelSurcharge: 48, handlingFee: 27, securityFee: 7, otherSurcharges: 49, totalCost: 563 },
  // 2025-10 (monthly total: baseCost 2200, fuel 250, handling 140, security 36, other 254 = 2880)
  { month: '2025-10', carrierId: 'dhl-de', destination: 'SE', serviceType: 'express',  baseCost: 770, fuelSurcharge: 88, handlingFee: 49, securityFee: 13, otherSurcharges: 89, totalCost: 1009 },
  { month: '2025-10', carrierId: 'dhl-de', destination: 'AT', serviceType: 'standard', baseCost: 990, fuelSurcharge: 113, handlingFee: 63, securityFee: 16, otherSurcharges: 114, totalCost: 1296 },
  { month: '2025-10', carrierId: 'dhl-de', destination: 'BE', serviceType: 'economy',  baseCost: 440, fuelSurcharge: 49, handlingFee: 28, securityFee: 7, otherSurcharges: 51, totalCost: 575 },
  // 2025-11 holiday (monthly total: baseCost 2600, fuel 275, handling 155, security 38, other 282 = 3350)
  { month: '2025-11', carrierId: 'dhl-de', destination: 'DE', serviceType: 'express',  baseCost: 910, fuelSurcharge: 96, handlingFee: 54, securityFee: 13, otherSurcharges: 99, totalCost: 1172 },
  { month: '2025-11', carrierId: 'dhl-de', destination: 'FR', serviceType: 'standard', baseCost: 1170, fuelSurcharge: 124, handlingFee: 70, securityFee: 17, otherSurcharges: 127, totalCost: 1508 },
  { month: '2025-11', carrierId: 'dhl-de', destination: 'NL', serviceType: 'economy',  baseCost: 520, fuelSurcharge: 55, handlingFee: 31, securityFee: 8, otherSurcharges: 56, totalCost: 670 },
  // 2025-12 holiday (monthly total: baseCost 2800, fuel 280, handling 160, security 40, other 300 = 3580)
  { month: '2025-12', carrierId: 'dhl-de', destination: 'AT', serviceType: 'express',  baseCost: 980, fuelSurcharge: 98, handlingFee: 56, securityFee: 14, otherSurcharges: 105, totalCost: 1253 },
  { month: '2025-12', carrierId: 'dhl-de', destination: 'BE', serviceType: 'standard', baseCost: 1260, fuelSurcharge: 126, handlingFee: 72, securityFee: 18, otherSurcharges: 135, totalCost: 1611 },
  { month: '2025-12', carrierId: 'dhl-de', destination: 'SE', serviceType: 'economy',  baseCost: 560, fuelSurcharge: 56, handlingFee: 32, securityFee: 8, otherSurcharges: 60, totalCost: 716 },
  // 2026-01 (monthly total: baseCost 2200, fuel 248, handling 138, security 35, other 259 = 2880)
  { month: '2026-01', carrierId: 'dhl-de', destination: 'FR', serviceType: 'express',  baseCost: 770, fuelSurcharge: 87, handlingFee: 48, securityFee: 12, otherSurcharges: 91, totalCost: 1008 },
  { month: '2026-01', carrierId: 'dhl-de', destination: 'NL', serviceType: 'standard', baseCost: 990, fuelSurcharge: 112, handlingFee: 62, securityFee: 16, otherSurcharges: 117, totalCost: 1297 },
  { month: '2026-01', carrierId: 'dhl-de', destination: 'DE', serviceType: 'economy',  baseCost: 440, fuelSurcharge: 49, handlingFee: 28, securityFee: 7, otherSurcharges: 51, totalCost: 575 },
  // 2026-02 (monthly total: baseCost 2250, fuel 255, handling 142, security 36, other 267 = 2950)
  { month: '2026-02', carrierId: 'dhl-de', destination: 'SE', serviceType: 'express',  baseCost: 788, fuelSurcharge: 89, handlingFee: 50, securityFee: 13, otherSurcharges: 93, totalCost: 1033 },
  { month: '2026-02', carrierId: 'dhl-de', destination: 'AT', serviceType: 'standard', baseCost: 1013, fuelSurcharge: 115, handlingFee: 64, securityFee: 16, otherSurcharges: 120, totalCost: 1328 },
  { month: '2026-02', carrierId: 'dhl-de', destination: 'BE', serviceType: 'economy',  baseCost: 449, fuelSurcharge: 51, handlingFee: 28, securityFee: 7, otherSurcharges: 54, totalCost: 589 },

  // ── GLS ──
  // 2025-05 (monthly total: baseCost 1210, fuel 132, handling 72, security 16, other 120 = 1550)
  { month: '2025-05', carrierId: 'gls-de', destination: 'NL', serviceType: 'express',  baseCost: 424, fuelSurcharge: 46, handlingFee: 25, securityFee: 6, otherSurcharges: 42, totalCost: 543 },
  { month: '2025-05', carrierId: 'gls-de', destination: 'DE', serviceType: 'standard', baseCost: 545, fuelSurcharge: 59, handlingFee: 32, securityFee: 7, otherSurcharges: 54, totalCost: 697 },
  { month: '2025-05', carrierId: 'gls-de', destination: 'AT', serviceType: 'economy',  baseCost: 241, fuelSurcharge: 27, handlingFee: 15, securityFee: 3, otherSurcharges: 24, totalCost: 310 },
  // 2025-06 (monthly total: baseCost 1250, fuel 138, handling 76, security 17, other 129 = 1610)
  { month: '2025-06', carrierId: 'gls-de', destination: 'SE', serviceType: 'express',  baseCost: 438, fuelSurcharge: 48, handlingFee: 27, securityFee: 6, otherSurcharges: 45, totalCost: 564 },
  { month: '2025-06', carrierId: 'gls-de', destination: 'FR', serviceType: 'standard', baseCost: 563, fuelSurcharge: 62, handlingFee: 34, securityFee: 8, otherSurcharges: 58, totalCost: 725 },
  { month: '2025-06', carrierId: 'gls-de', destination: 'BE', serviceType: 'economy',  baseCost: 249, fuelSurcharge: 28, handlingFee: 15, securityFee: 3, otherSurcharges: 26, totalCost: 321 },
  // 2025-07 (monthly total: baseCost 1290, fuel 145, handling 80, security 18, other 137 = 1670)
  { month: '2025-07', carrierId: 'gls-de', destination: 'DE', serviceType: 'express',  baseCost: 452, fuelSurcharge: 51, handlingFee: 28, securityFee: 6, otherSurcharges: 48, totalCost: 585 },
  { month: '2025-07', carrierId: 'gls-de', destination: 'AT', serviceType: 'standard', baseCost: 581, fuelSurcharge: 65, handlingFee: 36, securityFee: 8, otherSurcharges: 62, totalCost: 752 },
  { month: '2025-07', carrierId: 'gls-de', destination: 'NL', serviceType: 'economy',  baseCost: 257, fuelSurcharge: 29, handlingFee: 16, securityFee: 4, otherSurcharges: 27, totalCost: 333 },
  // 2025-08 (monthly total: baseCost 1330, fuel 150, handling 84, security 19, other 147 = 1730)
  { month: '2025-08', carrierId: 'gls-de', destination: 'FR', serviceType: 'express',  baseCost: 466, fuelSurcharge: 53, handlingFee: 29, securityFee: 7, otherSurcharges: 51, totalCost: 606 },
  { month: '2025-08', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', baseCost: 599, fuelSurcharge: 68, handlingFee: 38, securityFee: 9, otherSurcharges: 66, totalCost: 780 },
  { month: '2025-08', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy',  baseCost: 265, fuelSurcharge: 29, handlingFee: 17, securityFee: 3, otherSurcharges: 30, totalCost: 344 },
  // 2025-09 (monthly total: baseCost 1370, fuel 155, handling 88, security 20, other 157 = 1790)
  { month: '2025-09', carrierId: 'gls-de', destination: 'AT', serviceType: 'express',  baseCost: 480, fuelSurcharge: 54, handlingFee: 31, securityFee: 7, otherSurcharges: 55, totalCost: 627 },
  { month: '2025-09', carrierId: 'gls-de', destination: 'NL', serviceType: 'standard', baseCost: 617, fuelSurcharge: 70, handlingFee: 40, securityFee: 9, otherSurcharges: 71, totalCost: 807 },
  { month: '2025-09', carrierId: 'gls-de', destination: 'DE', serviceType: 'economy',  baseCost: 273, fuelSurcharge: 31, handlingFee: 17, securityFee: 4, otherSurcharges: 31, totalCost: 356 },
  // 2025-10 (monthly total: baseCost 1420, fuel 162, handling 92, security 21, other 165 = 1860)
  { month: '2025-10', carrierId: 'gls-de', destination: 'BE', serviceType: 'express',  baseCost: 497, fuelSurcharge: 57, handlingFee: 32, securityFee: 7, otherSurcharges: 58, totalCost: 651 },
  { month: '2025-10', carrierId: 'gls-de', destination: 'SE', serviceType: 'standard', baseCost: 639, fuelSurcharge: 73, handlingFee: 41, securityFee: 9, otherSurcharges: 74, totalCost: 836 },
  { month: '2025-10', carrierId: 'gls-de', destination: 'FR', serviceType: 'economy',  baseCost: 284, fuelSurcharge: 32, handlingFee: 19, securityFee: 5, otherSurcharges: 33, totalCost: 373 },
  // 2025-11 holiday (monthly total: baseCost 1560, fuel 175, handling 105, security 24, other 186 = 2050)
  { month: '2025-11', carrierId: 'gls-de', destination: 'NL', serviceType: 'express',  baseCost: 546, fuelSurcharge: 61, handlingFee: 37, securityFee: 8, otherSurcharges: 65, totalCost: 717 },
  { month: '2025-11', carrierId: 'gls-de', destination: 'DE', serviceType: 'standard', baseCost: 702, fuelSurcharge: 79, handlingFee: 47, securityFee: 11, otherSurcharges: 84, totalCost: 923 },
  { month: '2025-11', carrierId: 'gls-de', destination: 'AT', serviceType: 'economy',  baseCost: 312, fuelSurcharge: 35, handlingFee: 21, securityFee: 5, otherSurcharges: 37, totalCost: 410 },
  // 2025-12 holiday (monthly total: baseCost 1600, fuel 180, handling 110, security 25, other 195 = 2110)
  { month: '2025-12', carrierId: 'gls-de', destination: 'SE', serviceType: 'express',  baseCost: 560, fuelSurcharge: 63, handlingFee: 39, securityFee: 9, otherSurcharges: 68, totalCost: 739 },
  { month: '2025-12', carrierId: 'gls-de', destination: 'FR', serviceType: 'standard', baseCost: 720, fuelSurcharge: 81, handlingFee: 50, securityFee: 11, otherSurcharges: 88, totalCost: 950 },
  { month: '2025-12', carrierId: 'gls-de', destination: 'BE', serviceType: 'economy',  baseCost: 320, fuelSurcharge: 36, handlingFee: 21, securityFee: 5, otherSurcharges: 39, totalCost: 421 },
  // 2026-01 (monthly total: baseCost 1440, fuel 162, handling 95, security 22, other 171 = 1890)
  { month: '2026-01', carrierId: 'gls-de', destination: 'DE', serviceType: 'express',  baseCost: 504, fuelSurcharge: 57, handlingFee: 33, securityFee: 8, otherSurcharges: 60, totalCost: 662 },
  { month: '2026-01', carrierId: 'gls-de', destination: 'AT', serviceType: 'standard', baseCost: 648, fuelSurcharge: 73, handlingFee: 43, securityFee: 10, otherSurcharges: 77, totalCost: 851 },
  { month: '2026-01', carrierId: 'gls-de', destination: 'NL', serviceType: 'economy',  baseCost: 288, fuelSurcharge: 32, handlingFee: 19, securityFee: 4, otherSurcharges: 34, totalCost: 377 },
  // 2026-02 (monthly total: baseCost 1480, fuel 168, handling 98, security 23, other 181 = 1950)
  { month: '2026-02', carrierId: 'gls-de', destination: 'FR', serviceType: 'express',  baseCost: 518, fuelSurcharge: 59, handlingFee: 34, securityFee: 8, otherSurcharges: 63, totalCost: 682 },
  { month: '2026-02', carrierId: 'gls-de', destination: 'BE', serviceType: 'standard', baseCost: 666, fuelSurcharge: 76, handlingFee: 44, securityFee: 10, otherSurcharges: 82, totalCost: 878 },
  { month: '2026-02', carrierId: 'gls-de', destination: 'SE', serviceType: 'economy',  baseCost: 296, fuelSurcharge: 33, handlingFee: 20, securityFee: 5, otherSurcharges: 36, totalCost: 390 },

  // ── FedEx ──
  // 2025-05 (monthly total: baseCost 810, fuel 96, handling 52, security 13, other 91 = 1062)
  { month: '2025-05', carrierId: 'fedex-de', destination: 'AT', serviceType: 'express',  baseCost: 284, fuelSurcharge: 34, handlingFee: 18, securityFee: 5, otherSurcharges: 32, totalCost: 373 },
  { month: '2025-05', carrierId: 'fedex-de', destination: 'BE', serviceType: 'standard', baseCost: 365, fuelSurcharge: 43, handlingFee: 23, securityFee: 6, otherSurcharges: 41, totalCost: 478 },
  { month: '2025-05', carrierId: 'fedex-de', destination: 'SE', serviceType: 'economy',  baseCost: 161, fuelSurcharge: 19, handlingFee: 11, securityFee: 2, otherSurcharges: 18, totalCost: 211 },
  // 2025-06 (monthly total: baseCost 840, fuel 100, handling 55, security 14, other 96 = 1105)
  { month: '2025-06', carrierId: 'fedex-de', destination: 'DE', serviceType: 'express',  baseCost: 294, fuelSurcharge: 35, handlingFee: 19, securityFee: 5, otherSurcharges: 34, totalCost: 387 },
  { month: '2025-06', carrierId: 'fedex-de', destination: 'NL', serviceType: 'standard', baseCost: 378, fuelSurcharge: 45, handlingFee: 25, securityFee: 6, otherSurcharges: 43, totalCost: 497 },
  { month: '2025-06', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy',  baseCost: 168, fuelSurcharge: 20, handlingFee: 11, securityFee: 3, otherSurcharges: 19, totalCost: 221 },
  // 2025-07 (monthly total: baseCost 870, fuel 105, handling 58, security 15, other 102 = 1150)
  { month: '2025-07', carrierId: 'fedex-de', destination: 'SE', serviceType: 'express',  baseCost: 305, fuelSurcharge: 37, handlingFee: 20, securityFee: 5, otherSurcharges: 36, totalCost: 403 },
  { month: '2025-07', carrierId: 'fedex-de', destination: 'AT', serviceType: 'standard', baseCost: 392, fuelSurcharge: 47, handlingFee: 26, securityFee: 7, otherSurcharges: 46, totalCost: 518 },
  { month: '2025-07', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy',  baseCost: 173, fuelSurcharge: 21, handlingFee: 12, securityFee: 3, otherSurcharges: 20, totalCost: 229 },
  // 2025-08 (monthly total: baseCost 910, fuel 112, handling 62, security 16, other 110 = 1210)
  { month: '2025-08', carrierId: 'fedex-de', destination: 'NL', serviceType: 'express',  baseCost: 319, fuelSurcharge: 39, handlingFee: 22, securityFee: 6, otherSurcharges: 39, totalCost: 425 },
  { month: '2025-08', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', baseCost: 410, fuelSurcharge: 50, handlingFee: 28, securityFee: 7, otherSurcharges: 50, totalCost: 545 },
  { month: '2025-08', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy',  baseCost: 181, fuelSurcharge: 23, handlingFee: 12, securityFee: 3, otherSurcharges: 21, totalCost: 240 },
  // 2025-09 (monthly total: baseCost 950, fuel 118, handling 66, security 17, other 119 = 1270)
  { month: '2025-09', carrierId: 'fedex-de', destination: 'BE', serviceType: 'express',  baseCost: 333, fuelSurcharge: 41, handlingFee: 23, securityFee: 6, otherSurcharges: 42, totalCost: 445 },
  { month: '2025-09', carrierId: 'fedex-de', destination: 'SE', serviceType: 'standard', baseCost: 428, fuelSurcharge: 53, handlingFee: 30, securityFee: 8, otherSurcharges: 54, totalCost: 573 },
  { month: '2025-09', carrierId: 'fedex-de', destination: 'AT', serviceType: 'economy',  baseCost: 189, fuelSurcharge: 24, handlingFee: 13, securityFee: 3, otherSurcharges: 23, totalCost: 252 },
  // 2025-10 (monthly total: baseCost 990, fuel 125, handling 70, security 18, other 127 = 1330)
  { month: '2025-10', carrierId: 'fedex-de', destination: 'FR', serviceType: 'express',  baseCost: 347, fuelSurcharge: 44, handlingFee: 25, securityFee: 6, otherSurcharges: 44, totalCost: 466 },
  { month: '2025-10', carrierId: 'fedex-de', destination: 'NL', serviceType: 'standard', baseCost: 446, fuelSurcharge: 56, handlingFee: 32, securityFee: 8, otherSurcharges: 57, totalCost: 599 },
  { month: '2025-10', carrierId: 'fedex-de', destination: 'DE', serviceType: 'economy',  baseCost: 197, fuelSurcharge: 25, handlingFee: 13, securityFee: 4, otherSurcharges: 26, totalCost: 265 },
  // 2025-11 holiday (monthly total: baseCost 1080, fuel 138, handling 78, security 20, other 144 = 1460)
  { month: '2025-11', carrierId: 'fedex-de', destination: 'AT', serviceType: 'express',  baseCost: 378, fuelSurcharge: 48, handlingFee: 27, securityFee: 7, otherSurcharges: 50, totalCost: 510 },
  { month: '2025-11', carrierId: 'fedex-de', destination: 'BE', serviceType: 'standard', baseCost: 486, fuelSurcharge: 62, handlingFee: 35, securityFee: 9, otherSurcharges: 65, totalCost: 657 },
  { month: '2025-11', carrierId: 'fedex-de', destination: 'SE', serviceType: 'economy',  baseCost: 216, fuelSurcharge: 28, handlingFee: 16, securityFee: 4, otherSurcharges: 29, totalCost: 293 },
  // 2025-12 holiday (monthly total: baseCost 1100, fuel 140, handling 80, security 20, other 150 = 1490)
  { month: '2025-12', carrierId: 'fedex-de', destination: 'DE', serviceType: 'express',  baseCost: 385, fuelSurcharge: 49, handlingFee: 28, securityFee: 7, otherSurcharges: 53, totalCost: 522 },
  { month: '2025-12', carrierId: 'fedex-de', destination: 'FR', serviceType: 'standard', baseCost: 495, fuelSurcharge: 63, handlingFee: 36, securityFee: 9, otherSurcharges: 68, totalCost: 671 },
  { month: '2025-12', carrierId: 'fedex-de', destination: 'NL', serviceType: 'economy',  baseCost: 220, fuelSurcharge: 28, handlingFee: 16, securityFee: 4, otherSurcharges: 29, totalCost: 297 },
  // 2026-01 (monthly total: baseCost 1010, fuel 128, handling 72, security 18, other 132 = 1360)
  { month: '2026-01', carrierId: 'fedex-de', destination: 'SE', serviceType: 'express',  baseCost: 354, fuelSurcharge: 45, handlingFee: 25, securityFee: 6, otherSurcharges: 46, totalCost: 476 },
  { month: '2026-01', carrierId: 'fedex-de', destination: 'AT', serviceType: 'standard', baseCost: 455, fuelSurcharge: 58, handlingFee: 32, securityFee: 8, otherSurcharges: 59, totalCost: 612 },
  { month: '2026-01', carrierId: 'fedex-de', destination: 'BE', serviceType: 'economy',  baseCost: 201, fuelSurcharge: 25, handlingFee: 15, securityFee: 4, otherSurcharges: 27, totalCost: 272 },
  // 2026-02 (monthly total: baseCost 1040, fuel 132, handling 75, security 19, other 139 = 1405)
  { month: '2026-02', carrierId: 'fedex-de', destination: 'NL', serviceType: 'express',  baseCost: 364, fuelSurcharge: 46, handlingFee: 26, securityFee: 7, otherSurcharges: 49, totalCost: 492 },
  { month: '2026-02', carrierId: 'fedex-de', destination: 'DE', serviceType: 'standard', baseCost: 468, fuelSurcharge: 59, handlingFee: 34, securityFee: 9, otherSurcharges: 63, totalCost: 633 },
  { month: '2026-02', carrierId: 'fedex-de', destination: 'FR', serviceType: 'economy',  baseCost: 208, fuelSurcharge: 27, handlingFee: 15, securityFee: 3, otherSurcharges: 27, totalCost: 280 },

  // ── DPD ──
  // 2025-05 (monthly total: baseCost 910, fuel 102, handling 56, security 15, other 97 = 1180)
  { month: '2025-05', carrierId: 'dpd-de', destination: 'FR', serviceType: 'express',  baseCost: 319, fuelSurcharge: 36, handlingFee: 20, securityFee: 5, otherSurcharges: 34, totalCost: 414 },
  { month: '2025-05', carrierId: 'dpd-de', destination: 'SE', serviceType: 'standard', baseCost: 410, fuelSurcharge: 46, handlingFee: 25, securityFee: 7, otherSurcharges: 44, totalCost: 532 },
  { month: '2025-05', carrierId: 'dpd-de', destination: 'DE', serviceType: 'economy',  baseCost: 181, fuelSurcharge: 20, handlingFee: 11, securityFee: 3, otherSurcharges: 19, totalCost: 234 },
  // 2025-06 (monthly total: baseCost 940, fuel 108, handling 60, security 16, other 106 = 1230)
  { month: '2025-06', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express',  baseCost: 329, fuelSurcharge: 38, handlingFee: 21, securityFee: 6, otherSurcharges: 37, totalCost: 431 },
  { month: '2025-06', carrierId: 'dpd-de', destination: 'AT', serviceType: 'standard', baseCost: 423, fuelSurcharge: 49, handlingFee: 27, securityFee: 7, otherSurcharges: 48, totalCost: 554 },
  { month: '2025-06', carrierId: 'dpd-de', destination: 'FR', serviceType: 'economy',  baseCost: 188, fuelSurcharge: 21, handlingFee: 12, securityFee: 3, otherSurcharges: 21, totalCost: 245 },
  // 2025-07 (monthly total: baseCost 980, fuel 115, handling 64, security 17, other 114 = 1290)
  { month: '2025-07', carrierId: 'dpd-de', destination: 'BE', serviceType: 'express',  baseCost: 343, fuelSurcharge: 40, handlingFee: 22, securityFee: 6, otherSurcharges: 40, totalCost: 451 },
  { month: '2025-07', carrierId: 'dpd-de', destination: 'DE', serviceType: 'standard', baseCost: 441, fuelSurcharge: 52, handlingFee: 29, securityFee: 8, otherSurcharges: 51, totalCost: 581 },
  { month: '2025-07', carrierId: 'dpd-de', destination: 'NL', serviceType: 'economy',  baseCost: 196, fuelSurcharge: 23, handlingFee: 13, securityFee: 3, otherSurcharges: 23, totalCost: 258 },
  // 2025-08 (monthly total: baseCost 1020, fuel 122, handling 68, security 18, other 122 = 1350)
  { month: '2025-08', carrierId: 'dpd-de', destination: 'SE', serviceType: 'express',  baseCost: 357, fuelSurcharge: 43, handlingFee: 24, securityFee: 6, otherSurcharges: 43, totalCost: 473 },
  { month: '2025-08', carrierId: 'dpd-de', destination: 'FR', serviceType: 'standard', baseCost: 459, fuelSurcharge: 55, handlingFee: 31, securityFee: 8, otherSurcharges: 55, totalCost: 608 },
  { month: '2025-08', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy',  baseCost: 204, fuelSurcharge: 24, handlingFee: 13, securityFee: 4, otherSurcharges: 24, totalCost: 269 },
  // 2025-09 (monthly total: baseCost 1060, fuel 128, handling 72, security 19, other 131 = 1410)
  { month: '2025-09', carrierId: 'dpd-de', destination: 'DE', serviceType: 'express',  baseCost: 371, fuelSurcharge: 45, handlingFee: 25, securityFee: 7, otherSurcharges: 46, totalCost: 494 },
  { month: '2025-09', carrierId: 'dpd-de', destination: 'BE', serviceType: 'standard', baseCost: 477, fuelSurcharge: 58, handlingFee: 32, securityFee: 9, otherSurcharges: 59, totalCost: 635 },
  { month: '2025-09', carrierId: 'dpd-de', destination: 'SE', serviceType: 'economy',  baseCost: 212, fuelSurcharge: 25, handlingFee: 15, securityFee: 3, otherSurcharges: 26, totalCost: 281 },
  // 2025-10 (monthly total: baseCost 1100, fuel 135, handling 76, security 20, other 139 = 1470)
  { month: '2025-10', carrierId: 'dpd-de', destination: 'AT', serviceType: 'express',  baseCost: 385, fuelSurcharge: 47, handlingFee: 27, securityFee: 7, otherSurcharges: 49, totalCost: 515 },
  { month: '2025-10', carrierId: 'dpd-de', destination: 'NL', serviceType: 'standard', baseCost: 495, fuelSurcharge: 61, handlingFee: 34, securityFee: 9, otherSurcharges: 63, totalCost: 662 },
  { month: '2025-10', carrierId: 'dpd-de', destination: 'FR', serviceType: 'economy',  baseCost: 220, fuelSurcharge: 27, handlingFee: 15, securityFee: 4, otherSurcharges: 27, totalCost: 293 },
  // 2025-11 holiday (monthly total: baseCost 1180, fuel 148, handling 84, security 22, other 156 = 1590)
  { month: '2025-11', carrierId: 'dpd-de', destination: 'BE', serviceType: 'express',  baseCost: 413, fuelSurcharge: 52, handlingFee: 29, securityFee: 8, otherSurcharges: 55, totalCost: 557 },
  { month: '2025-11', carrierId: 'dpd-de', destination: 'DE', serviceType: 'standard', baseCost: 531, fuelSurcharge: 67, handlingFee: 38, securityFee: 10, otherSurcharges: 70, totalCost: 716 },
  { month: '2025-11', carrierId: 'dpd-de', destination: 'SE', serviceType: 'economy',  baseCost: 236, fuelSurcharge: 29, handlingFee: 17, securityFee: 4, otherSurcharges: 31, totalCost: 317 },
  // 2025-12 holiday (monthly total: baseCost 1200, fuel 150, handling 85, security 22, other 163 = 1620)
  { month: '2025-12', carrierId: 'dpd-de', destination: 'NL', serviceType: 'express',  baseCost: 420, fuelSurcharge: 53, handlingFee: 30, securityFee: 8, otherSurcharges: 57, totalCost: 568 },
  { month: '2025-12', carrierId: 'dpd-de', destination: 'FR', serviceType: 'standard', baseCost: 540, fuelSurcharge: 68, handlingFee: 38, securityFee: 10, otherSurcharges: 73, totalCost: 729 },
  { month: '2025-12', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy',  baseCost: 240, fuelSurcharge: 29, handlingFee: 17, securityFee: 4, otherSurcharges: 33, totalCost: 323 },
  // 2026-01 (monthly total: baseCost 1120, fuel 138, handling 78, security 20, other 144 = 1500)
  { month: '2026-01', carrierId: 'dpd-de', destination: 'SE', serviceType: 'express',  baseCost: 392, fuelSurcharge: 48, handlingFee: 27, securityFee: 7, otherSurcharges: 50, totalCost: 524 },
  { month: '2026-01', carrierId: 'dpd-de', destination: 'BE', serviceType: 'standard', baseCost: 504, fuelSurcharge: 62, handlingFee: 35, securityFee: 9, otherSurcharges: 65, totalCost: 675 },
  { month: '2026-01', carrierId: 'dpd-de', destination: 'DE', serviceType: 'economy',  baseCost: 224, fuelSurcharge: 28, handlingFee: 16, securityFee: 4, otherSurcharges: 29, totalCost: 301 },
  // 2026-02 (monthly total: baseCost 1150, fuel 142, handling 80, security 21, other 147 = 1540)
  { month: '2026-02', carrierId: 'dpd-de', destination: 'FR', serviceType: 'express',  baseCost: 403, fuelSurcharge: 50, handlingFee: 28, securityFee: 7, otherSurcharges: 51, totalCost: 539 },
  { month: '2026-02', carrierId: 'dpd-de', destination: 'NL', serviceType: 'standard', baseCost: 518, fuelSurcharge: 64, handlingFee: 36, securityFee: 9, otherSurcharges: 66, totalCost: 693 },
  { month: '2026-02', carrierId: 'dpd-de', destination: 'AT', serviceType: 'economy',  baseCost: 229, fuelSurcharge: 28, handlingFee: 16, securityFee: 5, otherSurcharges: 30, totalCost: 308 },

  // ── UPS ──
  // 2025-05 (monthly total: baseCost 560, fuel 62, handling 36, security 9, other 58 = 725)
  { month: '2025-05', carrierId: 'ups-de', destination: 'SE', serviceType: 'express',  baseCost: 196, fuelSurcharge: 22, handlingFee: 13, securityFee: 3, otherSurcharges: 20, totalCost: 254 },
  { month: '2025-05', carrierId: 'ups-de', destination: 'NL', serviceType: 'standard', baseCost: 252, fuelSurcharge: 28, handlingFee: 16, securityFee: 4, otherSurcharges: 26, totalCost: 326 },
  { month: '2025-05', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy',  baseCost: 112, fuelSurcharge: 12, handlingFee: 7, securityFee: 2, otherSurcharges: 12, totalCost: 145 },
  // 2025-06 (monthly total: baseCost 585, fuel 66, handling 38, security 10, other 63 = 762)
  { month: '2025-06', carrierId: 'ups-de', destination: 'DE', serviceType: 'express',  baseCost: 205, fuelSurcharge: 23, handlingFee: 13, securityFee: 4, otherSurcharges: 22, totalCost: 267 },
  { month: '2025-06', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', baseCost: 263, fuelSurcharge: 30, handlingFee: 17, securityFee: 5, otherSurcharges: 28, totalCost: 343 },
  { month: '2025-06', carrierId: 'ups-de', destination: 'BE', serviceType: 'economy',  baseCost: 117, fuelSurcharge: 13, handlingFee: 8, securityFee: 1, otherSurcharges: 13, totalCost: 152 },
  // 2025-07 (monthly total: baseCost 610, fuel 70, handling 40, security 11, other 69 = 800)
  { month: '2025-07', carrierId: 'ups-de', destination: 'AT', serviceType: 'express',  baseCost: 214, fuelSurcharge: 25, handlingFee: 14, securityFee: 4, otherSurcharges: 24, totalCost: 281 },
  { month: '2025-07', carrierId: 'ups-de', destination: 'FR', serviceType: 'standard', baseCost: 275, fuelSurcharge: 32, handlingFee: 18, securityFee: 5, otherSurcharges: 31, totalCost: 361 },
  { month: '2025-07', carrierId: 'ups-de', destination: 'SE', serviceType: 'economy',  baseCost: 121, fuelSurcharge: 13, handlingFee: 8, securityFee: 2, otherSurcharges: 14, totalCost: 158 },
  // 2025-08 (monthly total: baseCost 640, fuel 75, handling 42, security 12, other 76 = 845)
  { month: '2025-08', carrierId: 'ups-de', destination: 'BE', serviceType: 'express',  baseCost: 224, fuelSurcharge: 26, handlingFee: 15, securityFee: 4, otherSurcharges: 27, totalCost: 296 },
  { month: '2025-08', carrierId: 'ups-de', destination: 'NL', serviceType: 'standard', baseCost: 288, fuelSurcharge: 34, handlingFee: 19, securityFee: 5, otherSurcharges: 34, totalCost: 380 },
  { month: '2025-08', carrierId: 'ups-de', destination: 'DE', serviceType: 'economy',  baseCost: 128, fuelSurcharge: 15, handlingFee: 8, securityFee: 3, otherSurcharges: 15, totalCost: 169 },
  // 2025-09 (monthly total: baseCost 670, fuel 80, handling 45, security 13, other 82 = 890)
  { month: '2025-09', carrierId: 'ups-de', destination: 'FR', serviceType: 'express',  baseCost: 235, fuelSurcharge: 28, handlingFee: 16, securityFee: 5, otherSurcharges: 29, totalCost: 313 },
  { month: '2025-09', carrierId: 'ups-de', destination: 'SE', serviceType: 'standard', baseCost: 302, fuelSurcharge: 36, handlingFee: 20, securityFee: 6, otherSurcharges: 37, totalCost: 401 },
  { month: '2025-09', carrierId: 'ups-de', destination: 'AT', serviceType: 'economy',  baseCost: 133, fuelSurcharge: 16, handlingFee: 9, securityFee: 2, otherSurcharges: 16, totalCost: 176 },
  // 2025-10 (monthly total: baseCost 710, fuel 85, handling 48, security 14, other 88 = 945)
  { month: '2025-10', carrierId: 'ups-de', destination: 'NL', serviceType: 'express',  baseCost: 249, fuelSurcharge: 30, handlingFee: 17, securityFee: 5, otherSurcharges: 31, totalCost: 332 },
  { month: '2025-10', carrierId: 'ups-de', destination: 'DE', serviceType: 'standard', baseCost: 320, fuelSurcharge: 38, handlingFee: 22, securityFee: 6, otherSurcharges: 40, totalCost: 426 },
  { month: '2025-10', carrierId: 'ups-de', destination: 'BE', serviceType: 'economy',  baseCost: 141, fuelSurcharge: 17, handlingFee: 9, securityFee: 3, otherSurcharges: 17, totalCost: 187 },
  // 2025-11 holiday (monthly total: baseCost 780, fuel 92, handling 52, security 15, other 101 = 1040)
  { month: '2025-11', carrierId: 'ups-de', destination: 'AT', serviceType: 'express',  baseCost: 273, fuelSurcharge: 32, handlingFee: 18, securityFee: 5, otherSurcharges: 35, totalCost: 363 },
  { month: '2025-11', carrierId: 'ups-de', destination: 'FR', serviceType: 'standard', baseCost: 351, fuelSurcharge: 41, handlingFee: 23, securityFee: 7, otherSurcharges: 45, totalCost: 467 },
  { month: '2025-11', carrierId: 'ups-de', destination: 'NL', serviceType: 'economy',  baseCost: 156, fuelSurcharge: 19, handlingFee: 11, securityFee: 3, otherSurcharges: 21, totalCost: 210 },
  // 2025-12 holiday (monthly total: baseCost 800, fuel 95, handling 54, security 15, other 106 = 1070)
  { month: '2025-12', carrierId: 'ups-de', destination: 'SE', serviceType: 'express',  baseCost: 280, fuelSurcharge: 33, handlingFee: 19, securityFee: 5, otherSurcharges: 37, totalCost: 374 },
  { month: '2025-12', carrierId: 'ups-de', destination: 'BE', serviceType: 'standard', baseCost: 360, fuelSurcharge: 43, handlingFee: 24, securityFee: 7, otherSurcharges: 48, totalCost: 482 },
  { month: '2025-12', carrierId: 'ups-de', destination: 'DE', serviceType: 'economy',  baseCost: 160, fuelSurcharge: 19, handlingFee: 11, securityFee: 3, otherSurcharges: 21, totalCost: 214 },
  // 2026-01 (monthly total: baseCost 730, fuel 88, handling 50, security 14, other 93 = 975)
  { month: '2026-01', carrierId: 'ups-de', destination: 'NL', serviceType: 'express',  baseCost: 256, fuelSurcharge: 31, handlingFee: 18, securityFee: 5, otherSurcharges: 33, totalCost: 343 },
  { month: '2026-01', carrierId: 'ups-de', destination: 'AT', serviceType: 'standard', baseCost: 329, fuelSurcharge: 40, handlingFee: 23, securityFee: 6, otherSurcharges: 42, totalCost: 440 },
  { month: '2026-01', carrierId: 'ups-de', destination: 'FR', serviceType: 'economy',  baseCost: 145, fuelSurcharge: 17, handlingFee: 9, securityFee: 3, otherSurcharges: 18, totalCost: 192 },
  // 2026-02 (monthly total: baseCost 750, fuel 90, handling 52, security 14, other 94 = 1000)
  { month: '2026-02', carrierId: 'ups-de', destination: 'BE', serviceType: 'express',  baseCost: 263, fuelSurcharge: 32, handlingFee: 18, securityFee: 5, otherSurcharges: 33, totalCost: 351 },
  { month: '2026-02', carrierId: 'ups-de', destination: 'SE', serviceType: 'standard', baseCost: 338, fuelSurcharge: 41, handlingFee: 23, securityFee: 6, otherSurcharges: 42, totalCost: 450 },
  { month: '2026-02', carrierId: 'ups-de', destination: 'DE', serviceType: 'economy',  baseCost: 149, fuelSurcharge: 17, handlingFee: 11, securityFee: 3, otherSurcharges: 19, totalCost: 199 },
];

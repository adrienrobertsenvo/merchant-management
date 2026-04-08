import type { CarrierId } from '../types/rateCard';

export const CARRIERS: Record<CarrierId, { label: string; color: string; textColor: string }> = {
  'dhl-de': { label: 'DHL DE', color: '#FFCC00', textColor: '#CC0000' },
  'dhl-nl': { label: 'DHL NL', color: '#FFCC00', textColor: '#CC0000' },
  'dhl-at': { label: 'DHL AT', color: '#FFCC00', textColor: '#CC0000' },
  'gls-de': { label: 'GLS DE', color: '#1B3D8F', textColor: '#fff' },
  'gls-nl': { label: 'GLS NL', color: '#1B3D8F', textColor: '#fff' },
  'fedex-de': { label: 'FedEx DE', color: '#4D148C', textColor: '#FF6600' },
  'fedex-nl': { label: 'FedEx NL', color: '#4D148C', textColor: '#FF6600' },
  'fedex-gb': { label: 'FedEx GB', color: '#4D148C', textColor: '#FF6600' },
  'dpd-de': { label: 'DPD DE', color: '#DC0032', textColor: '#fff' },
  'dpd-at': { label: 'DPD AT', color: '#DC0032', textColor: '#fff' },
  'ups-de': { label: 'UPS DE', color: '#351C15', textColor: '#FFB500' },
  'ups-nl': { label: 'UPS NL', color: '#351C15', textColor: '#FFB500' },
};

export const CARRIER_IDS: CarrierId[] = [
  'dhl-de', 'dhl-nl', 'dhl-at',
  'gls-de', 'gls-nl',
  'fedex-de', 'fedex-nl', 'fedex-gb',
  'dpd-de', 'dpd-at',
  'ups-de', 'ups-nl',
];

export const GROUP_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

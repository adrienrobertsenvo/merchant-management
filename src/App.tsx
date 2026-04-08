import { useState, useCallback, useMemo } from 'react';
import MainLayout from './components/layout/MainLayout';
import type { Page } from './components/layout/Sidebar';
import MerchantIdentityPage from './components/merchants/MerchantIdentityPage';
import MerchantDetailPage from './components/merchants/MerchantDetailPage';
import RateCardsPage from './components/rate-cards/RateCardsPage';
import MerchantBillingPage from './components/billing/MerchantBillingPage';
import AnalyticsDashboardPage from './components/analytics/AnalyticsDashboardPage';
import { mockBillingEntities, mockUnresolvedAliases, mockUnmappedShipments } from './data/mockMerchants';
import { mockUnmappedCharges } from './data/mockBillingCharges';
import type { BillingEntity } from './types/merchant';

export default function App() {
  const [page, setPage] = useState<Page>('merchant-rate-cards');
  const [entities, setEntities] = useState<BillingEntity[]>(mockBillingEntities);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  const handleNavigate = useCallback((p: Page) => {
    setPage(p);
    if (p !== 'merchant-detail') {
      setSelectedMerchantId(null);
    }
  }, []);

  const handleNavigateToMerchant = useCallback((merchantId: string) => {
    setSelectedMerchantId(merchantId);
    setPage('merchant-detail');
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedMerchantId(null);
    setPage('merchant-identity');
  }, []);

  const sidebarBadges = useMemo(() => ({
    merchantMgmt: mockUnresolvedAliases.length + mockUnmappedShipments.length, // 6 + 18 = 24
    rateCardMgmt: mockUnmappedCharges.length, // 26
  }), []);

  return (
    <MainLayout activePage={page} onNavigate={handleNavigate} sidebarBadges={sidebarBadges}>
      {page === 'merchant-identity' && (
        <MerchantIdentityPage
          entities={entities}
          onEntitiesChange={setEntities}
          onNavigateToMerchant={handleNavigateToMerchant}
        />
      )}
      {page === 'merchant-detail' && selectedMerchantId && (
        <MerchantDetailPage
          merchantId={selectedMerchantId}
          entities={entities}
          onEntitiesChange={setEntities}
          onBack={handleBackToList}
        />
      )}
      {page === 'merchant-rate-cards' && (
        <RateCardsPage entities={entities} />
      )}
      {page === 'merchant-billing' && (
        <MerchantBillingPage />
      )}
      {page === 'analytics' && (
        <AnalyticsDashboardPage />
      )}
    </MainLayout>
  );
}

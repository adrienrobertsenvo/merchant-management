import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import type { Page } from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  sidebarBadges?: { merchantMgmt?: number; rateCardMgmt?: number };
}

export default function MainLayout({ activePage, onNavigate, children, sidebarBadges }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={activePage} onNavigate={onNavigate} badges={sidebarBadges} />
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          backgroundColor: '#f5f6fa',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

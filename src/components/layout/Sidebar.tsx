import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InsightsIcon from '@mui/icons-material/Insights';

export type Page = 'merchant-identity' | 'merchant-rate-cards' | 'merchant-detail' | 'merchant-billing' | 'analytics';

const DRAWER_WIDTH = 240;

interface NavItem {
  key: Page;
  label: string;
  icon: React.ReactNode;
  badge?: number; // red badge count
}

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  badges?: {
    merchantMgmt?: number;   // unresolved aliases + unmapped shipments
    rateCardMgmt?: number;   // unmapped charges
  };
}

export default function Sidebar({ activePage, onNavigate, badges }: SidebarProps) {
  const navItems: NavItem[] = [
    { key: 'merchant-identity', label: 'Merchant Mgmt', icon: <StorefrontIcon />, badge: badges?.merchantMgmt },
    { key: 'merchant-rate-cards', label: 'Rate Card Mgmt', icon: <ReceiptLongIcon />, badge: badges?.rateCardMgmt },
    { key: 'merchant-billing', label: 'Billing Engine', icon: <ReceiptIcon /> },
    { key: 'analytics', label: 'Analytics', icon: <InsightsIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
          <LocalShippingIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} color="white">
            Senvo
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {navItems.map((item) => {
          const isActive = item.key === activePage || (item.key === 'merchant-identity' && activePage === 'merchant-detail');
          return (
            <ListItemButton
              key={item.key}
              selected={isActive}
              onClick={() => onNavigate(item.key)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(59,130,246,0.16)',
                  '&:hover': { backgroundColor: 'rgba(59,130,246,0.24)' },
                },
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#3b82f6' : 'rgba(255,255,255,0.6)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>
                      {item.label}
                    </Typography>
                    {item.badge && item.badge > 0 && (
                      <Box sx={{
                        bgcolor: '#dc2626',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 0.5,
                        lineHeight: 1,
                      }}>
                        {item.badge}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };

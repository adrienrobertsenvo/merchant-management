import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { DRAWER_WIDTH } from './Sidebar';

export default function TopBar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button
          endIcon={<ArrowDropDownIcon />}
          sx={{ color: '#333', textTransform: 'none', fontWeight: 600, fontSize: 15 }}
        >
          Acme Logistics GmbH
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircleIcon sx={{ color: '#999' }} />
          <Typography variant="body2" color="text.secondary">
            agent@acme-logistics.de
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

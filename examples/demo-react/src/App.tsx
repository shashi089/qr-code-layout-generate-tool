import { useState } from 'react';

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Button,
} from '@mui/material';
import { Layout as LayoutIcon, Users, Store, Cpu } from 'lucide-react';
import { LayoutModule } from './modules/LayoutModule';
import { MasterModule } from './modules/MasterModule';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern Blue
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState<'layouts' | 'employees' | 'vendors' | 'machines'>('layouts');

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#fff', color: '#1e293b', boxShadow: 'none', borderBottom: '1px solid #e2e8f0' }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 1 }}>
              <LayoutIcon size={24} /> QR Layout Studio Demo
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              size="small"
              onClick={() => localStorage.clear()}
            >
              Clear Data
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid #e2e8f0' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'layouts'}
                  onClick={() => setActiveTab('layouts')}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon><LayoutIcon size={20} /></ListItemIcon>
                  <ListItemText primary="Layouts" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'employees'}
                  onClick={() => setActiveTab('employees')}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon><Users size={20} /></ListItemIcon>
                  <ListItemText primary="Employees" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'vendors'}
                  onClick={() => setActiveTab('vendors')}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon><Store size={20} /></ListItemIcon>
                  <ListItemText primary="Vendors" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'machines'}
                  onClick={() => setActiveTab('machines')}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon><Cpu size={20} /></ListItemIcon>
                  <ListItemText primary="Machines" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {activeTab === 'layouts' && <LayoutModule />}
          {activeTab === 'employees' && <MasterModule type="employee" icon={<Users size={32} />} />}
          {activeTab === 'vendors' && <MasterModule type="vendor" icon={<Store size={32} />} />}
          {activeTab === 'machines' && <MasterModule type="machine" icon={<Cpu size={32} />} />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

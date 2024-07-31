import { ThemeProvider } from '@emotion/react';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    AppBar, Box, CssBaseline, Divider, Drawer, IconButton, Tab, Tabs, Toolbar, Typography,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { observer } from 'mobx-react';
import { useState } from 'react';
import useStores from 'Store';
import './App.css';
import SettingsCmp from './components/SettingsCmp';
import NoteBookCmp from './modules/NoteBookCmp';
import { type ModuleNames } from './settings';

const App = observer(() => {
    const stores = useStores();

    const [value, setValue] = useState<ModuleNames>('notebook');
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    const handleChange = (e: React.SyntheticEvent, newValue: ModuleNames) => {
        setValue(newValue);
    };

    const theme = createTheme({
        palette: {
            mode: stores.settingsStore.displayMode,
        },
    });
    return (
        <Box>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box height="100%" width="100%">
                    <AppBar position="static">
                        <Toolbar>
                            <Typography sx={{ flexGrow: 1 }}>WebConductor</Typography>
                            <IconButton edge="end" onClick={() => setSettingsOpen(true)}>
                                <SettingsIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Box>
                        <Drawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
                            <SettingsCmp />
                        </Drawer>
                        <Tabs value={value} onChange={handleChange} variant="fullWidth">
                            {(Object.keys(stores.settingsStore.modules) as ModuleNames[])
                                .filter((module) => stores.settingsStore.modules[module] === true)
                                .map((module) => {
                                    return <Tab key={`tab-${module}`} value={module} label={module.charAt(0).toUpperCase() + module.slice(1)} />;
                                })}
                        </Tabs>
                        <Divider sx={{ mb: '1rem' }} />
                        {value === 'notebook' && <NoteBookCmp />}
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
});

export default App;

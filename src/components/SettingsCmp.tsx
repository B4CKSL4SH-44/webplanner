import {
    Close, DarkMode, DeleteForever, LightMode,
} from '@mui/icons-material';
import {
    Box,
    IconButton,
    Paper,
    Switch,
    Toolbar,
    Typography,
    Button,
} from '@mui/material';
import { observer } from 'mobx-react';
import { type ReactElement } from 'react';
import useStores from '../Store';
import SettingStore from '../stores/SettingsStore';
import ModuleSection from './SettingsSections/ModuleSection';
import ModuleOrderSection from './SettingsSections/ModuleOrderSection';
import NotebookSection from './SettingsSections/NotebookSection';

const SettingsCmp = observer((): ReactElement => {
    const stores = useStores();

    const handleSwitch = (checked: boolean) => {
        if (checked) {
            stores.settingsStore.setDisplayMode('dark');
        } else {
            stores.settingsStore.setDisplayMode('light');
        }
    };
    return (
        <Box width={400}>
            <Box display="flex" justifyContent="space-between">
                <Toolbar sx={{ flexGrow: 1 }}>
                    <Typography sx={{ flexGrow: 1 }}>Einstellungen</Typography>
                    <Paper sx={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                        <LightMode />
                        <Switch checked={stores.settingsStore.displayMode === 'dark'} onChange={(_e, newChecked) => handleSwitch(newChecked)} />
                        <DarkMode />
                    </Paper>
                    <IconButton onClick={() => stores.settingsStore.setSettingsOpen(false)}>
                        <Close />
                    </IconButton>
                </Toolbar>
            </Box>
            <ModuleSection />
            <ModuleOrderSection />
            <NotebookSection />
            <Button variant="contained" color="error" startIcon={<DeleteForever />} onClick={() => SettingStore.reset()}>
                Zurücksetzen
            </Button>
        </Box>
    );
});
export default SettingsCmp;

import {
    Close, DarkMode, ExpandMore, LightMode,
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Switch,
    Toolbar,
    Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import { type ReactElement } from 'react';
import useStores from 'Store';
import { type ModuleNames } from '../settings';

const SettingsCmp = observer((): ReactElement => {
    const stores = useStores();

    const handleToggleModule = (module: ModuleNames) => {
        const moduleSettings = { ...stores.settingsStore.modules };
        moduleSettings[module] = !moduleSettings[module];
        stores.settingsStore.setModules(moduleSettings);
    };

    const allModules: ModuleNames[] = ['notebook', 'tasks', 'kanban', 'flow'];

    // SSC: Das kommt dann natürlich in den LanguageStore :)
    const getText = (module: ModuleNames) => {
        switch (module) {
            case 'notebook':
                return 'Notizen';
            case 'tasks':
                return 'Tasks';
            case 'kanban':
                return 'Kanban';
            case 'flow':
                return 'Flow';
        }
    };

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
            <Accordion disableGutters sx={{ margin: '4px' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>Module</AccordionSummary>
                <AccordionDetails>
                    <List>
                        {allModules.map((moduleName) => {
                            return (
                                <ListItem key={moduleName}>
                                    <ListItemButton dense onClick={() => handleToggleModule(moduleName)}>
                                        <ListItemIcon>
                                            <Checkbox checked={stores.settingsStore.modules[moduleName] === true} />
                                        </ListItemIcon>
                                        <ListItemText>{getText(moduleName)}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default SettingsCmp;

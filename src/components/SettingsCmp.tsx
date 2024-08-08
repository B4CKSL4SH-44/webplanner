import {
    Close, DarkMode, DeleteForever, ExpandMore, LightMode,
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
    Button,
    Select,
    MenuItem,
} from '@mui/material';
import { observer } from 'mobx-react';
import { type ReactElement } from 'react';
import useStores from '../Store';
import SettingStore from '../stores/SettingsStore';
import { type ModuleNames } from '../settings';

const SettingsCmp = observer((): ReactElement => {
    const stores = useStores();

    const handleToggleModule = (moduleName: ModuleNames) => {
        const newModules = stores.settingsStore.modules.map((module) => {
            if (module.name === moduleName) {
                return { ...module, active: !module.active };
            }
            return module;
        });
        stores.settingsStore.setModules(newModules);
    };

    const allModules: ModuleNames[] = ['notebook', 'tasks', 'kanban', 'flow', 'todo'];
    const activeModules = stores.settingsStore.modules.filter((module) => module.active === true);

    // SSC: Das kommt dann natürlich in den LanguageStore :)
    const getText = (module: ModuleNames): string => {
        switch (module) {
            case 'notebook':
                return 'Notizen';
            case 'tasks':
                return 'Tasks';
            case 'kanban':
                return 'Kanban';
            case 'flow':
                return 'Flow';
            case 'todo':
                return 'Todo';
            default:
                return 'Notizen';
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
                                            <Checkbox checked={stores.settingsStore.modules.find((module) => module.name === moduleName)?.active === true} />
                                        </ListItemIcon>
                                        <ListItemText>{getText(moduleName)}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters sx={{ margin: '4px' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>Modulreihenfolge</AccordionSummary>
                <AccordionDetails>
                    <List>
                        {activeModules.map((module, index) => {
                            return (
                                <Select value={stores.settingsStore.modules.find((storeModule) => storeModule.position === index)?.name}>
                                    {activeModules.map((activeModule) => {
                                        return <MenuItem>{getText(activeModule.name)}</MenuItem>;
                                    })}
                                </Select>
                            );
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
            <Button variant="contained" color="error" startIcon={<DeleteForever />} onClick={() => SettingStore.reset()}>
                Zurücksetzen
            </Button>
        </Box>
    );
});
export default SettingsCmp;

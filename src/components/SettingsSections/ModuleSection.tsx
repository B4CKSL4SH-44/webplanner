import { ExpandMore } from '@mui/icons-material';
import {
    Accordion, AccordionDetails, AccordionSummary, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import { observer } from 'mobx-react';
import type { ReactElement } from 'react';
import type { ModuleNames } from '../../settings';
import useStores from '../../Store';

const ModuleSection = observer(():ReactElement => {
    const stores = useStores();
    const allModules: ModuleNames[] = ['notebook', 'tasks', 'kanban', 'flow', 'todo'];

    const handleToggleModule = (moduleName: ModuleNames) => {
        const newModules = stores.settingsStore.modules.map((module) => {
            if (module.name === moduleName) {
                return { ...module, active: !module.active };
            }
            return module;
        });
        stores.settingsStore.setModules(newModules);
    };

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

    return (
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
    );
});

export default ModuleSection;

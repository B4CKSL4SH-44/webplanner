import { ExpandMore } from '@mui/icons-material';
import {
    Accordion, AccordionDetails, AccordionSummary, FormControl, InputLabel, List, ListItem, MenuItem, Select,
} from '@mui/material';
import { observer } from 'mobx-react';
import type { ReactElement } from 'react';
import useStores from '../../Store';
import type { ModuleNames } from '../../settings';

const ModuleOrderSection = observer(():ReactElement => {
    const stores = useStores();
    const activeModules = stores.settingsStore.modules.filter((module) => module.active === true);

    const handlePositionChange = (moduleName: ModuleNames, newPosition: number) => {
        const selectedModule = stores.settingsStore.modules.find((module) => module.name === moduleName);
        const newModules = stores.settingsStore.modules.map((module) => {
            if (module.name === moduleName) {
                return { ...module, position: newPosition };
            }
            if (module.position === newPosition && selectedModule !== undefined) {
                return { ...module, position: selectedModule.position };
            }
            return module;
        });
        stores.settingsStore.setModules(newModules);
    };
    return (
        <Accordion disableGutters sx={{ margin: '4px' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>Modulreihenfolge</AccordionSummary>
            <AccordionDetails>
                <List>
                    {activeModules.map((module) => {
                        const availablePositions: string[] = [];
                        activeModules.forEach((_, index) => { availablePositions.push((index + 1).toString()); });
                        return (
                            <ListItem key={module.name}>
                                <FormControl>
                                    <InputLabel id={module.name}>{module.name}</InputLabel>
                                    <Select onChange={(event) => handlePositionChange(module.name, Number(event.target.value))} sx={{ width: '200px' }} labelId={module.name} label={module.name} value={module.position}>
                                        {availablePositions.map((position) => {
                                            return <MenuItem key={`${module.name}-${position}`} value={Number(position) - 1}>{position}</MenuItem>;
                                        })}
                                    </Select>
                                </FormControl>
                            </ListItem>
                        );
                    })}

                </List>
            </AccordionDetails>
        </Accordion>
    );
});

export default ModuleOrderSection;

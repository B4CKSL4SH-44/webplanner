import { observer } from 'mobx-react';
import type { ReactElement } from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary, FormControlLabel, List,
    ListItem,
    ListItemText,
    Switch,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import useStores from '../../Store';

const TodoSection = observer((): ReactElement => {
    const stores = useStores();
    const { todoSettings, setTodoSettings } = stores.settingsStore;
    return (
        <Accordion disableGutters sx={{ margin: '4px' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>Todo</AccordionSummary>
            <AccordionDetails>
                <List>
                    <ListItem>
                        <ListItemText>
                            <FormControlLabel
                                sx={{ flexGrow: 1 }}
                                labelPlacement="start"
                                control={<Switch onChange={() => setTodoSettings({ ...todoSettings, color: !todoSettings.color })} checked={todoSettings.color} />}
                                label="Farben"
                            />
                        </ListItemText>
                    </ListItem>
                </List>

            </AccordionDetails>
        </Accordion>
    );
});

export default TodoSection;

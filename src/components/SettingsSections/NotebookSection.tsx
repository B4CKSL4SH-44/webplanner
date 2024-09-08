import { ExpandMore } from '@mui/icons-material';
import {
    Accordion, AccordionDetails, AccordionSummary, FormControlLabel, List,
    ListItem,
    ListItemText,
    Switch,
} from '@mui/material';
import { observer } from 'mobx-react';
import type { ReactElement } from 'react';
import useStores from '../../Store';
import type { NotebookSettings } from '../../settings';

const NotebookSection = observer((): ReactElement => {
    const stores = useStores();
    const { notebookSettings, setNotebookSettings } = stores.settingsStore;

    const handleSettingChange = (key: keyof NotebookSettings) => {
        const updatedSettings = { ...notebookSettings, [key]: !notebookSettings[key] };
        setNotebookSettings(updatedSettings);
    };
    return (
        <Accordion disableGutters sx={{ margin: '4px' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>Notebook</AccordionSummary>
            <AccordionDetails>
                <List>
                    {(Object.keys(notebookSettings) as (keyof NotebookSettings)[]).map((key) => {
                        return (
                            <ListItem key={key} dense>
                                <ListItemText>
                                    <FormControlLabel sx={{ flexGrow: 1 }} labelPlacement="start" control={<Switch onChange={() => handleSettingChange(key)} checked={notebookSettings[key]} />} label={key.toUpperCase()} />
                                </ListItemText>
                            </ListItem>
                        );
                    })}

                </List>

            </AccordionDetails>
        </Accordion>
    );
});

export default NotebookSection;

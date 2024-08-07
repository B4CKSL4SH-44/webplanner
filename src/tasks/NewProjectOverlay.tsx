import { DragHandle } from '@mui/icons-material';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, TextField,
} from '@mui/material';
import useStores from 'Store';
import { observer } from 'mobx-react';
import { useRef, useState, type ReactElement } from 'react';
import Draggable from 'react-draggable';
import { defaultProject, type Project } from 'tasks';

const NewProjectOverlayCmp = observer((): ReactElement => {
    const stores = useStores();

    const [project, setProject] = useState<Project>(defaultProject);
    const [titleError, setTitleError] = useState<boolean>(false);

    const nodeRef = useRef(null);

    const handleUpdateProjectAlias = (value: string) => {
        if (titleError) {
            setTitleError(false);
        }
        const updatedProject: Project = { ...project, alias: value };
        setProject(updatedProject);
    };

    const handleClose = (event: any, reason: string) => {
        if (reason && reason === 'backdropClick') return;
        stores.tasksStore.setNewProjectOverlayActive(false);
    };

    const handleSave = () => {
        if (project.alias.replaceAll(' ', '').length === 0) {
            setTitleError(true);
            return;
        }
        let newId;
        if (Object.keys(stores.tasksStore.projects).length === 1) {
            newId = 1;
        } else {
            const sorted = Object.keys(stores.tasksStore.projects).sort((a, b) => Number(b) - Number(a));
            newId = Number(sorted[0]) + 1;
        }
        stores.tasksStore.addProject({
            ...project,
            id: newId,
        });
        stores.tasksStore.setNewProjectOverlayActive(false);
    };

    return (
        <Draggable nodeRef={nodeRef} handle="#draggable-dialog-button" cancel={'[class*="MuiDialogContent-root"]'}>
            <Dialog
                ref={nodeRef}
                sx={{ pointerEvents: 'none' }}
                disablePortal
                disableEnforceFocus
                open={stores.tasksStore.newProjectOverlayActive}
                onClose={handleClose}
                hideBackdrop
                PaperProps={{ sx: { maxWidth: '300px' } }}
            >
                <DialogTitle sx={{ pointerEvents: 'auto' }} display="flex" justifyContent="space-between" alignItems="center">
                    New Project
                    <IconButton sx={{ cursor: 'move' }} id="draggable-dialog-button">
                        <DragHandle />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pointerEvents: 'auto' }}>
                    <FormControl sx={{ p: '1rem' }}>
                        <TextField
                            required
                            helperText={titleError ? 'Bitte geben Sie einen Titel ein' : undefined}
                            error={titleError}
                            sx={{ mb: '1rem' }}
                            value={project.alias}
                            onChange={(e) => handleUpdateProjectAlias(e.target.value)}
                            label="Titel (Pflichtfeld)"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ pointerEvents: 'auto' }}>
                    <Button onClick={() => stores.tasksStore.setNewProjectOverlayActive(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Speichern</Button>
                </DialogActions>
            </Dialog>
        </Draggable>
    );
});

export default NewProjectOverlayCmp;

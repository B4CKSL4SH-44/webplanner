import { DragHandle } from '@mui/icons-material';
import {
    Alert,
    AlertTitle,
    Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, TextField,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useRef, useState, type ReactElement } from 'react';
import Draggable from 'react-draggable';
import { defaultProject, type Project } from '../tasks';
import useStores from '../Store';
import type { ModuleNames } from '../settings';

const NewProjectOverlayCmp = observer((props: { activeModule: ModuleNames | null }): ReactElement => {
    const { activeModule } = props;
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
        stores.projectsStore.setNewProjectOverlayActive(false);
    };

    const handleSave = async (e: React.KeyboardEvent | React.MouseEvent) => {
        e.preventDefault();
        if (project.alias.replaceAll(' ', '').length === 0) {
            setTitleError(true);
            return;
        }
        let newId;
        if (Object.keys(stores.projectsStore.projects).length === 1) {
            newId = 1;
        } else {
            const sorted = Object.keys(stores.projectsStore.projects).sort((a, b) => Number(b) - Number(a));
            newId = Number(sorted[0]) + 1;
        }
        const response = await stores.projectsStore.addProject({
            ...project,
            id: newId,
        });

        if (response.success === false) {
            stores.projectsStore.setAddProjectError(response.status);
            return;
        }
        stores.projectsStore.setNewProjectOverlayActive(false);
        // Adds new project to the active module's selection
        switch (activeModule) {
            case 'tasks':
                stores.settingsStore.setActiveProjects([...stores.settingsStore.activeProjects, newId]);
                break;
            case 'todo':
                stores.settingsStore.setTodoProject(newId);
                break;
            case 'kanban':
                stores.settingsStore.setKanbanProject(newId);
                break;
            default: break;
        }
    };

    return (
        <Draggable nodeRef={nodeRef} handle="#draggable-dialog-button" cancel={'[class*="MuiDialogContent-root"]'}>
            <Dialog
                ref={nodeRef}
                sx={{ pointerEvents: 'none' }}
                disablePortal
                disableEnforceFocus
                open={stores.projectsStore.newProjectOverlayActive}
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
                    {stores.projectsStore.addProjectError !== undefined && <Alert severity="error"><AlertTitle>{stores.projectsStore.addProjectError}</AlertTitle></Alert>}
                    <FormControlLabel control={<Checkbox />} label="Lokal" />
                    <FormControl sx={{ p: '1rem' }}>
                        <TextField
                            autoFocus
                            required
                            helperText={titleError ? 'Bitte geben Sie einen Titel ein' : undefined}
                            error={titleError}
                            sx={{ mb: '1rem' }}
                            value={project.alias}
                            onChange={(e) => handleUpdateProjectAlias(e.target.value)}
                            onKeyDown={(event) => { if (event.key === 'Enter') { handleSave(event); } }}
                            label="Titel (Pflichtfeld)"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ pointerEvents: 'auto' }}>
                    <Button onClick={() => stores.projectsStore.setNewProjectOverlayActive(false)}>Cancel</Button>
                    <Button onClick={(e) => handleSave(e)}>Speichern</Button>
                </DialogActions>
            </Dialog>
        </Draggable>
    );
});

export default NewProjectOverlayCmp;

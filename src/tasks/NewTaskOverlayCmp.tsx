import { ColorLens, DragHandle } from '@mui/icons-material';
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    IconButton,
    InputLabel,
    List,
    ListItemButton,
    ListItemText,
    MenuItem,
    Popover,
    RadioGroup,
    Select,
    TextField,
    Tooltip,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useRef, useState, type ReactElement } from 'react';
import Draggable from 'react-draggable';
import { SketchPicker } from 'react-color';
import { defaultTask, type Relations, type Task } from '../tasks';
import useStores from '../Store';

const NewTaskOverlayCmp = observer((): ReactElement => {
    const stores = useStores();

    const isUpdate = typeof stores.projectsStore.taskOverlayState !== 'boolean';

    const [task, setTask] = useState<Task>(isUpdate ? (stores.projectsStore.taskOverlayState as Task) : defaultTask);
    const [project, setProject] = useState<number>(0);
    const [titleError, setTitleError] = useState<boolean>(false);
    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

    const nodeRef = useRef(null);
    const colorPickerRef = useRef(null);

    const handleUpdateTask = (key: keyof Task, value: string) => {
        if (titleError) {
            setTitleError(false);
        }
        const updatedTask = { ...task, [key]: value };
        setTask(updatedTask);
    };

    const handleClose = (event: any, reason: string) => {
        if (reason && reason === 'backdropClick') return;
        stores.projectsStore.setTaskOverlayState(false);
    };

    const handleSave = () => {
    // Titel muss gesetzt sein
        if (task.title.replaceAll(' ', '').length === 0) {
            setTitleError(true);
            return;
        }
        // Bei Neu:
        if (!isUpdate) {
            let newId;
            if (stores.projectsStore.projects[project].tasks.length === 0) {
                newId = 1;
            } else {
                const sorted = stores.projectsStore.projects[project].tasks.sort((a, b) => b.id - a.id);
                newId = sorted[0].id + 1;
            }
            stores.projectsStore.addTask({
                ...task,
                id: newId,
                project,
                description: task.description.replaceAll(' ', '').length === 0 ? '' : task.description,
            });
        } else {
            // Bei Update
            stores.projectsStore.updateTask(task);
        }
        stores.projectsStore.setTaskOverlayState(false);
    };

    const handleRelationToggle = (key: keyof Relations) => {
        let updatedTask: Task;
        if (task.relations[key] === false) {
            updatedTask = { ...task, relations: { ...task.relations, [key]: [] } };
        } else {
            updatedTask = { ...task, relations: { ...task.relations, [key]: false } };
        }
        setTask(updatedTask);
    };

    const handleRelationAdd = (key: keyof Relations, idList: number[] | string) => {
        if (task.relations[key] === false) return;
        if (typeof idList === 'string') return;
        const updatedTask: Task = {
            ...task,
            relations: { ...task.relations, [key]: [...idList] },
        };
        setTask(updatedTask);
    };

    return (
        <Draggable nodeRef={nodeRef} handle="#draggable-dialog-button" cancel={'[class*="MuiDialogContent-root"]'}>
            <Dialog
                ref={nodeRef}
                sx={{ pointerEvents: 'none' }}
                disablePortal
                disableEnforceFocus
                open={stores.projectsStore.taskOverlayState !== false}
                onClose={handleClose}
                hideBackdrop
                PaperProps={{ sx: { maxWidth: '300px' } }}
            >
                <DialogTitle sx={{ pointerEvents: 'auto', backgroundColor: task.color ?? undefined }} display="flex" justifyContent="space-between" alignItems="center">
                    New Task
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
                            value={task.title}
                            onChange={(e) => handleUpdateTask('title', e.target.value)}
                            label="Titel (Pflichtfeld)"
                        />
                        <TextField
                            sx={{ mb: '1rem' }}
                            value={task.description}
                            onChange={(e) => handleUpdateTask('description', e.target.value)}
                            label="Beschreibung"
                            multiline
                        />
                        <FormLabel id="input-label-priority">Priority</FormLabel>
                        <RadioGroup sx={{ mb: '1rem' }} aria-labelledby="input-label-priority">
                            <ButtonGroup>
                                <Button
                                    onClick={() => handleUpdateTask('priority', 'high')}
                                    variant={task.priority === 'high' ? 'contained' : 'outlined'}
                                    size="small"
                                    color="error"
                                >
                                    high
                                </Button>
                                <Button
                                    onClick={() => handleUpdateTask('priority', 'medium')}
                                    size="small"
                                    variant={task.priority === 'medium' ? 'contained' : 'outlined'}
                                    color="primary"
                                >
                                    medium
                                </Button>
                                <Button
                                    onClick={() => handleUpdateTask('priority', 'low')}
                                    variant={task.priority === 'low' ? 'contained' : 'outlined'}
                                    size="small"
                                    color="success"
                                >
                                    low
                                </Button>
                            </ButtonGroup>
                        </RadioGroup>
                        <List>
                            <ListItemButton onClick={() => handleRelationToggle('blocks')}>
                                <Checkbox checked={task.relations.blocks !== false} />
                                <ListItemText>blockiert</ListItemText>
                            </ListItemButton>
                            {task.relations.blocks !== false && (
                                <Select
                                    size="small"
                                    fullWidth
                                    sx={{ flexGrow: 1 }}
                                    onChange={(e) => handleRelationAdd('blocks', e.target.value)}
                                    renderValue={(selected) => {
                                        return (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 0.5,
                                                    maxWidth: '300px',
                                                }}
                                            >
                                                {stores.projectsStore.projects[0].tasks
                                                    .filter((storeTask) => selected.includes(storeTask.id))
                                                    .map((storeTask) => (
                                                        <Tooltip title={storeTask.title}>
                                                            <Chip sx={{ maxWidth: '100px' }} key={storeTask.id} label={`#${storeTask.id}: ${storeTask.title}`} />
                                                        </Tooltip>
                                                    ))}
                                            </Box>
                                        );
                                    }}
                                    multiple
                                    value={task.relations.blocks}
                                >
                                    {stores.projectsStore.projects[0].tasks.map((storeTask) => {
                                        return (
                                            <MenuItem sx={{ maxWidth: '320px' }} key={storeTask.id} value={storeTask.id}>
                                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{storeTask.title}</Box>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            )}
                        </List>
                        <FormControl>
                            <InputLabel id="select-label">Projekt auswählen</InputLabel>
                            <Select
                                disabled={isUpdate}
                                labelId="select-label-board"
                                value={project}
                                label="Projekt auswählen"
                                onChange={(e) => setProject(Number(e.target.value))}
                            >
                                {Object.keys(stores.projectsStore.projects).map((projectStringId) => {
                                    const projectId = Number(projectStringId);
                                    return (
                                        <MenuItem key={projectId} value={projectId}>
                                            {stores.projectsStore.projects[projectId].alias}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="select-label-board">Board auswählen</InputLabel>
                            <Select
                                labelId="select-label"
                                value={task.board}
                                label="Board auswählen"
                                onChange={(e) => setTask({ ...task, board: Number(e.target.value) })}
                            >
                                {Object.keys(stores.projectsStore.projects[0].boards).map((boardStringId) => {
                                    const boardId = Number(boardStringId);
                                    return (
                                        <MenuItem key={boardId} value={boardId}>
                                            {stores.projectsStore.projects[project].boards[boardId]}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </FormControl>
                    <IconButton ref={colorPickerRef} onClick={() => setColorPickerOpen(true)}>
                        <ColorLens />
                    </IconButton>
                    <Popover open={colorPickerOpen} onClose={() => setColorPickerOpen(false)} anchorEl={colorPickerRef.current} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                        <SketchPicker color={task.color} onChange={(color) => setTask({ ...task, color: color.hex })} />
                    </Popover>
                </DialogContent>
                <DialogActions sx={{ pointerEvents: 'auto' }}>
                    <Button onClick={() => stores.projectsStore.setTaskOverlayState(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Speichern</Button>
                </DialogActions>
            </Dialog>
        </Draggable>
    );
});

export default NewTaskOverlayCmp;

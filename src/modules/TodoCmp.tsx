import {
    Add, Check, Close, Edit,
} from '@mui/icons-material';
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import useStores from 'Store';
import { observer } from 'mobx-react';
import { useState, type ReactElement } from 'react';
import { defaultTask, type Task } from 'tasks';

const TodoCmp = observer((): ReactElement => {
    const stores = useStores();

    const [addModeActive, setAddModeActive] = useState<boolean>(false);
    const [newTodoTitle, setNewTodoTitle] = useState<string>('');

    const handleToggle = (id: number) => {
        const taskToUpdate = stores.tasksStore.projects[stores.settingsStore.todoProject].tasks.find((task) => task.id === id);
        if (taskToUpdate !== undefined) {
            taskToUpdate.state = taskToUpdate.state === 'closed' ? 'open' : 'closed';
            stores.tasksStore.updateTask(taskToUpdate);
        }
    };

    const handleNewTodo = () => {
        if (newTodoTitle.replaceAll(' ', '').length === 0) return;
        let newId;
        if (stores.tasksStore.projects[stores.settingsStore.todoProject].tasks.length === 0) {
            newId = 1;
        } else {
            const sorted = stores.tasksStore.projects[stores.settingsStore.todoProject].tasks.sort((a, b) => b.id - a.id);
            newId = sorted[0].id + 1;
        }
        const newTask: Task = defaultTask;
        newTask.id = newId;
        newTask.title = newTodoTitle;
        newTask.project = stores.settingsStore.todoProject;
        stores.tasksStore.addTask(newTask);
        setNewTodoTitle('');
        setAddModeActive(false);
    };

    return (
        <Box
            sx={{
                padding: '1rem',
            }}
            flexGrow={1}
            minHeight={0}
            display="flex"
            flexDirection="column"
        >
            <Toolbar>
                <FormControl>
                    <InputLabel id="select-project-label">Projekt auswählen</InputLabel>
                    <Select
                        sx={{ mr: '1rem', width: '400px' }}
                        labelId="select-project-label"
                        value={stores.settingsStore.todoProject}
                        label="Projekt auswählen"
                        onChange={(e) => stores.settingsStore.setTodoProject(Number(e.target.value))}
                    >
                        {Object.keys(stores.tasksStore.projects).map((projectStringId) => {
                            const project = {
                                ...stores.tasksStore.projects[Number(projectStringId)],
                            };
                            return (
                                <MenuItem key={projectStringId} value={project.id}>
                                    <ListItemText>{project.alias}</ListItemText>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <Button onClick={() => stores.tasksStore.setNewProjectOverlayActive(true)} variant="contained" color="success" startIcon={<Add />}>
                    Projekt hinzufügen
                </Button>
            </Toolbar>
            <Box flexGrow={1} minHeight={0} overflow="auto" sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', padding: '4px' }}>
                <List>
                    {stores.tasksStore.projects[stores.settingsStore.todoProject].tasks.length === 0 && (
                        <Typography fontStyle="italic">Keine offenen Todos</Typography>
                    )}
                    <Divider />
                    {stores.tasksStore.projects[stores.settingsStore.todoProject].tasks.map((task) => {
                        return (
                            <>
                                <ListItem>
                                    <ListItemButton onClick={() => handleToggle(task.id)} dense>
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={task.state === 'closed'} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={task.title} />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                            </>
                        );
                    })}
                    {!addModeActive ? (
                        <ListItem>
                            <ListItemButton onClick={() => setAddModeActive(true)} dense>
                                <ListItemIcon>
                                    <Edit />
                                </ListItemIcon>
                                <ListItemText primary="Todo hinzufügen" />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        <ListItem>
                            <ListItemIcon>
                                <Edit />
                            </ListItemIcon>
                            <TextField
                                onChange={(e) => setNewTodoTitle(e.target.value)}
                                autoFocus
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <ButtonGroup>
                                            <IconButton disabled={newTodoTitle === ''} onClick={() => handleNewTodo()}>
                                                <Check />
                                            </IconButton>
                                            <IconButton onClick={() => setAddModeActive(false)}>
                                                <Close />
                                            </IconButton>
                                        </ButtonGroup>
                                    ),
                                }}
                            />
                        </ListItem>
                    )}
                </List>
            </Box>
        </Box>
    );
});

export default TodoCmp;

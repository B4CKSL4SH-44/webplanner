import {
    Edit, OpenInNew, PlaylistAdd, Timer,
    VisibilityOff,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    useTheme,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useState, type ReactElement } from 'react';
import type { Project, Task } from '../tasks';
import useStores from '../Store';
import TaskDialog from '../components/TaskDialog';

const TasksBoardCmp = observer((): ReactElement => {
    const stores = useStores();
    const theme = useTheme();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderBy, setOrderBy] = useState<keyof Task>('id');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const [taskDialogOpen, setTaskDialogOpen] = useState<null | Task>(null);

    const handleOpenTask = (newTask: Task) => {
        if (stores.tasksStore.openTasks.some((task) => task.id === newTask.id)) return;
        stores.tasksStore.setOpenTasks([...stores.tasksStore.openTasks, newTask]);
    };

    const hideProject = (projectToHide: Project) => {
        const allProjects = [...stores.settingsStore.activeProjects];
        const updatedProjects = allProjects.filter((projectId) => projectId !== projectToHide.id);
        stores.settingsStore.setActiveProjects(updatedProjects);
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
                <FormControl sx={{ maxWidth: '50%' }}>
                    <InputLabel id="select-project-label">Projekte auswählen</InputLabel>
                    <Select
                        sx={{
                            mr: '1rem',
                            maxWidth: '300px',
                        }}
                        labelId="select-project-label"
                        value={stores.settingsStore.activeProjects}
                        label="Projekte auswählen"
                        multiple
                        size="small"
                        autoWidth
                        renderValue={(selected) => {
                            return selected.map((select) => <Chip key={`chip-${stores.tasksStore.projects[select].alias}`} sx={{ mx: '2px' }} label={stores.tasksStore.projects[select].alias} />);
                        }}
                        onChange={(e) => stores.settingsStore.setActiveProjects(e.target.value as number[])}
                    >
                        {Object.keys(stores.tasksStore.projects).map((projectStringId) => {
                            const project = {
                                ...stores.tasksStore.projects[Number(projectStringId)],
                            };
                            return (
                                <MenuItem key={projectStringId} defaultChecked={project.id === 0} value={project.id}>
                                    <Checkbox checked={stores.settingsStore.activeProjects.includes(project.id)} />
                                    <ListItemText>{project.alias}</ListItemText>
                                    <Chip label={project.tasks.length} />
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <Button
                    sx={{
                        display: {
                            xs: 'none', sm: 'inline-flex', md: 'inline-flex', lg: 'inline-flex',
                        },
                    }}
                    onClick={() => stores.tasksStore.setNewProjectOverlayActive(true)}
                    variant="contained"
                    color="success"
                    startIcon={<PlaylistAdd />}
                >
                    Projekt hinzufügen
                </Button>
                <Button
                    sx={{
                        display: {
                            xs: 'inline-flex', sm: 'none', md: 'none', lg: 'none',
                        },
                    }}
                    variant="contained"
                    onClick={() => stores.tasksStore.setNewProjectOverlayActive(true)}
                    color="success"
                >
                    <PlaylistAdd />
                </Button>
            </Toolbar>
            <Divider sx={{ m: '1rem 0' }} />
            <Box flexGrow={1} minHeight={0} overflow="auto" sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', padding: '4px' }}>
                {stores.settingsStore.activeProjects.length === 0 ? (
                    <Box>Keine Projekte ausgewählt</Box>
                ) : (
                    stores.settingsStore.activeProjects.map((id) => {
                        const project = stores.tasksStore.projects[id];
                        return (
                            <Table
                                key={`table-${id}`}
                                size="small"
                                sx={{
                                    border: '1px solid rgba(0, 0, 0, 0.12)',
                                    mb: '1rem',
                                }}

                            >
                                <TableHead
                                    sx={{
                                        '& .MuiTableRow-head': {
                                            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.action.hover : theme.palette.primary.light,
                                        },
                                    }}
                                >
                                    <TableRow
                                        sx={{
                                            '& .MuiTableCell-root': {
                                                fontWeight: theme.typography.fontWeightBold,
                                            },
                                        }}
                                    >
                                        <TableCell colSpan={3}>{project.alias}</TableCell>
                                        <TableCell colSpan={1}>
                                            <Tooltip title="ausblenden">
                                                <Button color="success" size="small" variant="contained" onClick={() => hideProject(project)}>
                                                    <VisibilityOff />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                            '& .MuiTableCell-root': {
                                                fontWeight: theme.typography.fontWeightBold,
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ width: '150px' }}>ID</TableCell>
                                        <TableCell>Titel</TableCell>
                                        <TableCell>Beschreibung</TableCell>
                                        <TableCell sortDirection="asc">
                                            <TableSortLabel active={orderBy === 'priority'}>Priorität</TableSortLabel>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {project.tasks.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ fontStyle: 'italic' }}>
                                                Keine Tasks
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {project.tasks.map((task) => {
                                        return (
                                            <TableRow hover role="button" key={`tableRow-${task.id}`} onClick={() => { setTaskDialogOpen(task); }}>
                                                <TableCell sx={{ width: '150px' }}>
                                                    {task.id}
                                                    <IconButton
                                                        size="small"
                                                        disabled={stores.tasksStore.openTasks.some((openTask) => openTask.id === task.id)}
                                                        onClick={() => handleOpenTask(task)}
                                                    >
                                                        <OpenInNew />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => stores.tasksStore.setTaskOverlayState(task)}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton size="small" disabled={stores.tasksStore.taskTimer !== null} onClick={() => stores.tasksStore.setTaskTimer(task)}>
                                                        <Timer />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{ whiteSpace: 'wrap', overflowWrap: 'anywhere' }}>{task.title}</TableCell>
                                                <TableCell
                                                    sx={{
                                                        fontStyle: task.description.length === 0 ? 'italic' : 'inherit',
                                                    }}
                                                >
                                                    {task.description.length === 0 ? '(keine)' : task.description}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        sx={{ maxWidth: 'fit-content' }}
                                                        color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'primary' : 'success'}
                                                        label={task.priority}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        );
                    })
                )}
                {taskDialogOpen !== null && (
                    <TaskDialog task={taskDialogOpen} onClose={() => setTaskDialogOpen(null)} />
                )}
            </Box>
        </Box>
    );
});
export default TasksBoardCmp;

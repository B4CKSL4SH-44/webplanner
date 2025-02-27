import AddBoxIcon from '@mui/icons-material/AddBox';
import {
    Box,
    Divider,
    IconButton,
    List, ListItem,
    ListItemText,
    Paper,
    TextField,
    useTheme,
} from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import useStores from '../../Store';
import type { Task } from '../../tasks';
import { useFlowStore } from './FlowStore';

const TaskSearch = observer(() => {
    const { settingsStore, tasksStore } = useStores();
    const theme = useTheme();
    const flowStore = useFlowStore();
    const [search, setSearch] = useState('');
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    useEffect(() => {
        const newTasks: Task[] = [];
        settingsStore.activeProjects.forEach((id) => {
            tasksStore.projects[id].tasks.forEach((task) => {
                newTasks.push(task);
            });
        });
        setFilteredTasks(Array.from(
            new Map([...filteredTasks, ...newTasks].map(
                (item) => [item.id, item],
            )).values(),
        ).filter(
            (task: Task) => flowStore?.nodes.every((node) => (node.data.task as Task).id !== task.id),
        ));
    }, []);

    // Handle input change
    const handleSearch = (event: any) => {
        const { value } = event.target;
        setSearch(value.label);
        const filtered = Object.values(filteredTasks).filter((task) => task.title.toLowerCase().includes(value.toLowerCase()));
        setFilteredTasks(filtered);
    };

    // Handle selection
    const handleAdd = (task: Task) => {
        flowStore.addTaskToFlow(task);
    };

    return (
        <Box sx={{
            maxWidth: '320px', width: '100%', backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', borderRight: `1px solid ${theme.palette.divider}`,
        }}
        >
            <TextField
                fullWidth
                value={search}
                onChange={handleSearch}
                placeholder="Suche Task..."
                size="small"
                sx={{
                    p: 1,
                    backgroundColor: 'background.default',
                }}
                InputProps={{ style: { backgroundColor: 'background.default' } }}
            />
            <Divider />
            <Paper
                style={{
                    overflowY: 'scroll',
                    flexGrow: 1,
                    height: 0,
                }}
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '10px',
                        transition: 'background 0.3s',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(0, 0, 0, 0.4)',
                    },
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)',
                }}
            >
                <List>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <React.Fragment key={task.id}>
                                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ListItemText id={task.title} primary={task.title} sx={{ flex: 1 }} />
                                    <IconButton
                                        onClick={() => handleAdd(task)}
                                        sx={{ p: 0 }}
                                        color="primary"
                                    >
                                        <AddBoxIcon />
                                    </IconButton>
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    ) : (
                        <ListItem>No results</ListItem>
                    )}
                </List>
            </Paper>
        </Box>
    );
});

export default TaskSearch;

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
    const flowStore = useFlowStore();
    const theme = useTheme();
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
    const handleSelect = (task: Task) => {
        flowStore.addTaskToFlow(task);
    };

    return (
        <Box sx={{
            position: 'relative', maxWidth: '320px', width: '100%', borderRight: `1px solid ${theme.palette.divider}`,
        }}
        >
            <TextField
                fullWidth
                value={search}
                onChange={handleSearch}
                placeholder="Suche Task..."
                size="small"
            />
            <Paper
                style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'scroll',
                }}
            >
                <List>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <React.Fragment key={task.id}>
                                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ListItemText id={task.title} primary={task.title} sx={{ flex: 1 }} />
                                    <IconButton
                                        onClick={() => handleSelect(task)}
                                        sx={{ p: 0 }} // Removes extra padding
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

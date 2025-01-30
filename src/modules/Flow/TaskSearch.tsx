import AddBoxIcon from '@mui/icons-material/AddBox';
import {
    Box,
    Divider,
    List, ListItem,
    ListItemText,
    Paper,
    TextField
} from '@mui/material';
import React, { useState } from 'react';

interface TaskSearchProps {
    tasks: { label: string; year: number }[];
    onSelect: (task: string) => void;
}

const TaskSearch = (props: TaskSearchProps) => {
    const { tasks, onSelect } = props;
    const [search, setSearch] = useState('');
    const [filteredTasks, setFilteredTasks] = useState(tasks);

    // Handle input change
    const handleSearch = (event: any) => {
        const { value } = event.target;
        setSearch(value.label);
        setFilteredTasks(tasks.filter((task) => task.label.toLowerCase().includes(value.toLowerCase())));
    };

    // Handle selection
    const handleSelect = (task: any) => {
        setSearch(task.label); // Update input with selected task
        onSelect(task); // Pass selected task to parent
    };

    return (
        <Box sx={{
            position: 'relative', width: '320px', height: '100%',
        }}
        >
            <TextField
                fullWidth
                value={search}
                onChange={handleSearch}
                placeholder="Search tasks..."
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
                            <React.Fragment key={task.label + task.year}>
                                <ListItem sx={{
                                    py: 0, pr: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}
                                >
                                    {/* Task Label (Prevent it from growing too much) */}
                                    <ListItemText id={task.label} primary={task.label} sx={{ flexGrow: 1 }} />

                                    {/* Button on Right */}
                                    <AddBoxIcon
                                        onClick={() => handleSelect(task)}
                                        sx={{ p: 0, minWidth: 'unset', ml: 'auto' }}
                                        color="primary"
                                    />
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
};

export default TaskSearch;

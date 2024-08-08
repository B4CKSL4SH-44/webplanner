import './App.css';
import {
    Box, Drawer, Tab, Tabs, CssBaseline, Divider, createTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { ThemeProvider } from '@emotion/react';
import useStores from './Store';
import HeaderCmp from './components/HeaderCmp';
import TaskOverlayCmp from './tasks/NewTaskOverlayCmp';
import TasksBoardCmp from './modules/TasksBoardCmp';
import OpenTasksOverlayCmp from './tasks/OpenTasksOverlayCmp';
import NewProjectOverlayCmp from './tasks/NewProjectOverlay';
import TaskTimerCmp from './components/TimerCmp';
import KanbanCmp from './modules/Kanban/KanbanCmp';
import TodoCmp from './modules/TodoCmp';
import SettingsCmp from './components/SettingsCmp';
import { type ModuleNames } from './settings';
import NoteBookCmp from './modules/NoteBookCmp';

const App = observer(() => {
    const stores = useStores();

    const [activeModule, setActiveValue] = useState<ModuleNames | null>(
        stores.settingsStore.modules.find((module) => module.active === true)?.name ?? null,
    );

    useEffect(() => {
        if (activeModule !== null && stores.settingsStore.modules.find((module) => module.name === activeModule)!.active === false) {
            setActiveValue(stores.settingsStore.modules.find((module) => module.active === true)?.name ?? null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stores.settingsStore.modules]);

    const handleChange = (e: React.SyntheticEvent, newValue: ModuleNames) => {
        setActiveValue(newValue);
    };

    const theme = createTheme({
        palette: {
            mode: stores.settingsStore.displayMode,
        },
    });
    return (
        <Box flexGrow={1} minHeight={0} display="flex" flexDirection="column">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box flexGrow={1} minHeight={0} width="100%" display="flex" flexDirection="column">
                    <HeaderCmp />
                    <Box flexGrow={1} minHeight={0} display="flex" flexDirection="column">
                        {stores.tasksStore.taskOverlayState && <TaskOverlayCmp />}
                        {stores.tasksStore.newProjectOverlayActive && <NewProjectOverlayCmp />}
                        {stores.tasksStore.openTasks.map((openTask) => (
                            <OpenTasksOverlayCmp key={openTask.id} task={openTask} />
                        ))}
                        {stores.tasksStore.taskTimer !== null && <TaskTimerCmp />}
                        <Drawer anchor="right" open={stores.settingsStore.settingsOpen} onClose={() => stores.settingsStore.setSettingsOpen(false)}>
                            <SettingsCmp />
                        </Drawer>
                        <Tabs value={activeModule} onChange={handleChange} variant="fullWidth">
                            {stores.settingsStore.modules
                                .filter((module) => module.active === true)
                                .map((module) => {
                                    return <Tab key={`tab-${module.name}`} value={module.name} label={module.name.charAt(0).toUpperCase() + module.name.slice(1)} />;
                                })}
                        </Tabs>
                        <Divider />
                        {activeModule === 'notebook' && <NoteBookCmp />}
                        {activeModule === 'tasks' && <TasksBoardCmp />}
                        {activeModule === 'kanban' && <KanbanCmp />}
                        {activeModule === 'todo' && <TodoCmp />}
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
});

export default App;

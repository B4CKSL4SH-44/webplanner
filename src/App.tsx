import "./App.css";
import { Box, Drawer, Tab, Tabs, CssBaseline, Divider, createTheme } from "@mui/material";
import NoteBookCmp from "./modules/NoteBookCmp";
import { useEffect, useState } from "react";
import { type ModuleNames } from "./settings";
import SettingsCmp from "./components/SettingsCmp";
import { observer } from "mobx-react";
import { ThemeProvider } from "@emotion/react";
import useStores from "Store";
import HeaderCmp from "components/HeaderCmp";
import TaskOverlayCmp from "tasks/NewTaskOverlayCmp";
import TasksBoardCmp from "modules/TasksBoardCmp";
import OpenTasksOverlayCmp from "tasks/OpenTasksOverlayCmp";
import NewProjectOverlayCmp from "tasks/NewProjectOverlay";
import TaskTimerCmp from "components/TimerCmp";

const App = observer(() => {
  const stores = useStores();

  const [value, setValue] = useState<ModuleNames | null>(
    (Object.keys(stores.settingsStore.modules) as ModuleNames[]).find((key) => stores.settingsStore.modules[key] === true) ?? null
  );

  useEffect(() => {
    if (value !== null && stores.settingsStore.modules[value] === false) {
      setValue((Object.keys(stores.settingsStore.modules) as ModuleNames[]).find((key) => stores.settingsStore.modules[key] === true) ?? null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores.settingsStore.modules]);

  const handleChange = (e: React.SyntheticEvent, newValue: ModuleNames) => {
    setValue(newValue);
  };

  const theme = createTheme({
    palette: {
      mode: stores.settingsStore.displayMode,
    },
  });
  return (
    <Box flexGrow={1} minHeight={0} display={"flex"} flexDirection={"column"}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box flexGrow={1} minHeight={0} width={"100%"} display={"flex"} flexDirection={"column"}>
          <HeaderCmp />
          <Box flexGrow={1} minHeight={0} display={"flex"} flexDirection={"column"}>
            {stores.tasksStore.taskOverlayState && <TaskOverlayCmp />}
            {stores.tasksStore.newProjectOverlayActive && <NewProjectOverlayCmp />}
            {stores.tasksStore.openTasks.map((openTask) => (
              <OpenTasksOverlayCmp key={openTask.id} task={openTask} />
            ))}
            {stores.tasksStore.taskTimer !== null && <TaskTimerCmp />}
            <Drawer anchor="right" open={stores.settingsStore.settingsOpen} onClose={() => stores.settingsStore.setSettingsOpen(false)}>
              <SettingsCmp />
            </Drawer>
            <Tabs value={value} onChange={handleChange} variant="fullWidth">
              {(Object.keys(stores.settingsStore.modules) as ModuleNames[])
                .filter((module) => stores.settingsStore.modules[module] === true)
                .map((module) => {
                  return <Tab key={`tab-${module}`} value={module} label={module.charAt(0).toUpperCase() + module.slice(1)} />;
                })}
            </Tabs>
            <Divider />
            {value === "notebook" && <NoteBookCmp />}
            {value === "tasks" && <TasksBoardCmp />}
          </Box>
        </Box>
      </ThemeProvider>
    </Box>
  );
});

export default App;

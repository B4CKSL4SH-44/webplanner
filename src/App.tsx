import "./App.css";
import {
  Box,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  Typography,
  CssBaseline,
} from "@mui/material";
import NoteBookCmp from "./modules/NoteBookCmp";
import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import defaultSettings from "./settings";
import { type ModuleNames, type Settings } from "./settings";
import SettingsCmp from "./components/Settings";
import Store from "Store";
import { observer } from "mobx-react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

const App = observer(() => {
  const stores = Store.getInstance();

  const [value, setValue] = useState<ModuleNames>("notebook");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleChange = (e: React.SyntheticEvent, newValue: ModuleNames) => {
    setValue(newValue);
  };

  useEffect(() => {
    const lsSettings = localStorage.getItem("webPlannerSettings");
    if (lsSettings !== null) {
      setSettings(JSON.parse(lsSettings));
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: stores.settingsStore.displayMode,
    },
  });
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box height={"100%"} width={"100%"}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography>WebPlanner</Typography>
            <IconButton onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Box>
          <Box>
            <Drawer
              anchor="right"
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            >
              <SettingsCmp
                settings={settings}
                handleSettingsChange={handleSettingsChange}
              />
            </Drawer>
            <Tabs value={value} onChange={handleChange} variant="fullWidth">
              {Object.keys(settings.modules)
                .filter(
                  //@ts-ignore
                  (module: ModuleNames) => settings.modules[module] === true
                )
                .map((module) => {
                  return (
                    <Tab
                      key={`tab-${module}`}
                      value={module}
                      label={module.charAt(0).toUpperCase() + module.slice(1)}
                    />
                  );
                })}
            </Tabs>
            {value === "notebook" && <NoteBookCmp />}
          </Box>
        </Box>
      </ThemeProvider>
    </Box>
  );
});

export default App;

import "./App.css";
import { Box, Drawer, IconButton, Tab, Tabs, Typography } from "@mui/material";
import NoteBookCmp from "./components/NoteBookCmp";
import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import defaultSettings from "./settings";
import { Modules, Settings } from "./settings";

const App = () => {
  const [value, setValue] = useState<Modules>("notebook");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const handleChange = (e: React.SyntheticEvent, newValue: Modules) => {
    setValue(newValue);
  };
  useEffect(() => {
    const lsSettings = localStorage.getItem("webPlannerSettings");
    if (lsSettings !== null) {
      setSettings(JSON.parse(lsSettings));
    }
  }, []);
  return (
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
          <Typography>Einstellungen</Typography>
        </Drawer>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          {settings.modules.map((module) => {
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
  );
};

export default App;

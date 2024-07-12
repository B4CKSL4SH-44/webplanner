import "./App.css";
import { Box, Drawer, IconButton, Tab, Tabs, Typography, CssBaseline, AppBar, Toolbar, Divider } from "@mui/material";
import NoteBookCmp from "./modules/NoteBookCmp";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { type ModuleNames } from "./settings";
import SettingsCmp from "./components/SettingsCmp";
import { observer } from "mobx-react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import useStores from "Store";

const App = observer(() => {
  const stores = useStores();

  const [value, setValue] = useState<ModuleNames>("notebook");
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const handleChange = (e: React.SyntheticEvent, newValue: ModuleNames) => {
    setValue(newValue);
  };

  const theme = createTheme({
    palette: {
      mode: stores.settingsStore.displayMode,
    },
  });
  return (
    <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box flexGrow={1} width={"100%"} display={"flex"} flexDirection={"column"}>
          <AppBar position="static">
            <Toolbar>
              <Typography sx={{ flexGrow: 1 }}>WebConductor</Typography>
              <IconButton edge={"end"} onClick={() => setSettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
            <Drawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
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
          </Box>
        </Box>
      </ThemeProvider>
    </Box>
  );
});

export default App;

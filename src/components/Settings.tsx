import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Typography,
  Switch,
} from "@mui/material";
import { type ReactElement, useEffect } from "react";
import { type ModuleNames, type Settings } from "../settings";
import Store from "Store";
import { observer } from "mobx-react";

const SettingsCmp = observer(
  ({
    settings,
    handleSettingsChange,
  }: {
    settings: Settings;
    handleSettingsChange: (newSettings: Settings) => void;
  }): ReactElement => {
    const stores = Store.getInstance();

    useEffect(() => {
      const lsSettings = localStorage.getItem("webPlannerSettings");
      if (lsSettings !== null) {
        handleSettingsChange(JSON.parse(lsSettings));
      }
    }, [handleSettingsChange]);

    const handleToggle = (module: ModuleNames) => {
      let moduleSettings = settings.modules;
      moduleSettings[module] = !moduleSettings[module];
      const newSettings = settings;
      newSettings.modules = moduleSettings;
      localStorage.setItem("webPlannerSettings", JSON.stringify(newSettings));
      handleSettingsChange({ ...newSettings });
    };

    const allModules: ModuleNames[] = ["notebook", "tasks", "kanban", "flow"];

    // SSC: Das kommt dann natürlich in den LanguageStore :)
    const getText = (module: ModuleNames) => {
      switch (module) {
        case "notebook":
          return "Notizen";
        case "tasks":
          return "Tasks";
        case "kanban":
          return "Kanban";
        case "flow":
          return "Flow";
      }
    };

    const handleSwitch = (checked: boolean) => {
      if (checked) {
        stores.settingsStore.setDisplayMode("dark");
      } else {
        stores.settingsStore.setDisplayMode("light");
      }
    };
    return (
      <Box width={400}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography>Einstellungen</Typography>
          <Box display={"flex"}>
            <Typography>LightMode</Typography>
            <Switch
              checked={stores.settingsStore.displayMode === "dark"}
              onChange={(_e, newChecked) => handleSwitch(newChecked)}
            />
            <Typography>DarkMode</Typography>
          </Box>
        </Box>
        <Accordion sx={{ margin: "4px" }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            Module
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {allModules.map((moduleName) => {
                return (
                  <ListItem>
                    <ListItemButton
                      dense
                      onClick={() => handleToggle(moduleName)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={settings.modules[moduleName] === true}
                        />
                      </ListItemIcon>
                      <ListItemText>{getText(moduleName)}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }
);
export default SettingsCmp;

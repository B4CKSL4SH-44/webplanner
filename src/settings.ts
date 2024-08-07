import type { PaletteMode } from "@mui/material";

export type ModuleNames = "notebook" | "tasks" | "kanban" | "flow";

export interface Modules {
  notebook: boolean;
  tasks: boolean;
  kanban: boolean;
  flow: boolean;
}
export interface Settings {
  displayMode: PaletteMode;
  modules: Modules;
}

const defaultSettings: Settings = {
  displayMode: "light",
  modules: {
    notebook: true,
    tasks: true,
    kanban: true,
    flow: true,
  },
};

export default defaultSettings;

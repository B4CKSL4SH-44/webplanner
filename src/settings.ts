import type { PaletteMode } from "@mui/material";

export type ModuleNames = 'notebook' | 'tasks' | 'kanban' | 'flow' | "todo";

export interface Module {
  name: ModuleNames;
  active: boolean;
  position: number;
}
export interface Settings {
    displayMode: PaletteMode;
  modules: Module[];
  activeProjects: number[];
  kanbanProject: number;
  todoProject: number;
}

const defaultSettings: Settings = {
    displayMode: 'light',
    modules: [
        { name: "notebook", active: true, position: 0 },
        { name: "tasks", active: true, position: 1 },
        { name: "kanban", active: true, position: 2 },
        { name: "flow", active: true, position: 3 },
      { name: "todo", active: true, position: 4 },
    ],
  activeProjects: [0],
    kanbanProject: 0,
  todoProject: 0,
};

export default defaultSettings;

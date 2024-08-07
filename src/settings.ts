import type { PaletteMode } from "@mui/material";

export type ModuleNames = 'notebook' | 'tasks' | 'kanban' | 'flow';

export interface Modules {
    notebook: boolean;
    tasks: boolean;
    kanban: boolean;
    flow: boolean;
}
export interface Settings {
    displayMode: PaletteMode;
  modules: Modules;
  activeProjects: number[];
  kanbanProject: number;
}

const defaultSettings: Settings = {
    displayMode: 'light',
    modules: {
        notebook: true,
        tasks: true,
        kanban: true,
        flow: true,
    },
    activeProjects: [0],
    kanbanProject: 0,
};

export default defaultSettings;

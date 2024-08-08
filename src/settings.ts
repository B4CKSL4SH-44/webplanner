<<<<<<< HEAD
export type ModuleNames = 'notebook' | 'tasks' | 'kanban' | 'flow';

export interface Modules {
    notebook: boolean;
    tasks: boolean;
    kanban: boolean;
    flow: boolean;
}
export interface Settings {
    modules: Modules;
}

const defaultSettings = {
    modules: {
        notebook: true,
        tasks: true,
        kanban: true,
        flow: true,
    },
=======
import type { PaletteMode } from '@mui/material';

export type ModuleNames = 'notebook' | 'tasks' | 'kanban' | 'flow' | 'todo';

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
        { name: 'notebook', active: true, position: 0 },
        { name: 'tasks', active: true, position: 1 },
        { name: 'kanban', active: true, position: 2 },
        { name: 'flow', active: true, position: 3 },
        { name: 'todo', active: true, position: 4 },
    ],
    activeProjects: [0],
    kanbanProject: 0,
    todoProject: 0,
>>>>>>> origin/develop
};

export default defaultSettings;

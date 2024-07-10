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
};

export default defaultSettings;

export type ModuleNames = "notebook" | "tasks" | "kanban" | "flow";

export interface Modules {
  notebook: boolean;
  tasks: boolean;
  kanban: boolean;
  flow: boolean;
}
export interface Settings {
  displayMode: "light" | "dark";
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

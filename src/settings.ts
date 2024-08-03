export type ModuleNames = "notebook" | "tasks" | "kanban" | "flow" | "todo";

export interface Modules {
  notebook: boolean;
  tasks: boolean;
  kanban: boolean;
  flow: boolean;
  todo: boolean;
}
export interface Settings {
  displayMode: "light" | "dark";
  modules: Modules;
  activeProjects: number[];
  kanbanProject: number;
  todoProject: number;
}

const defaultSettings: Settings = {
  displayMode: "light",
  modules: {
    notebook: true,
    tasks: true,
    kanban: true,
    flow: true,
    todo: true,
  },
  activeProjects: [0],
  kanbanProject: 0,
  todoProject: 0,
};

export default defaultSettings;

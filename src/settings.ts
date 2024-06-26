export type Modules = "notebook" | "tasks" | "kanban" | "flow";

export interface Settings {
  modules: Modules[];
}

const defaultSettings = {
  modules: ["notebook", "tasks", "kanban", "flow"] as Modules[],
};
export default defaultSettings;

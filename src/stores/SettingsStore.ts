import { action, makeObservable, observable } from "mobx";
import type { Modules, Settings } from "settings";
import defaultSettings from "settings";

export default class SettingStore {
  private static instance: SettingStore | undefined;

  public settingsOpen: boolean = false;
  public setSettingsOpen = (newOpen: boolean) => {
    this.settingsOpen = newOpen;
  };

  public modules: Modules;
  public setModules = (newModules: Modules) => {
    this.modules = { ...newModules };
    const parsedSettings = this.getLsSettings();
    parsedSettings.modules = this.modules;
    this.writeLsSettings(parsedSettings);
  };

  public displayMode: "light" | "dark";
  public setDisplayMode = (newMode: "light" | "dark") => {
    this.displayMode = newMode;
    const parsedSettings = this.getLsSettings();
    parsedSettings.displayMode = this.displayMode;
    this.writeLsSettings(parsedSettings);
  };

  public activeProjects: number[];
  public setActiveProjects = (newIds: number[]) => {
    this.activeProjects = [...newIds];
    const lsSettings = this.getLsSettings();
    lsSettings.activeProjects = this.activeProjects;
    this.writeLsSettings(lsSettings);
  };

  public kanbanProject: number;
  public setKanbanProject = (newId: number) => {
    this.kanbanProject = newId;
    const lsSettings = this.getLsSettings();
    lsSettings.kanbanProject = this.kanbanProject;
    this.writeLsSettings(lsSettings);
  };

  public todoProject: number;
  public setTodoProject = (id: number) => {
    this.todoProject = id;
    const lsSettings = this.getLsSettings();
    lsSettings.todoProject = this.todoProject;
    this.writeLsSettings(lsSettings);
  };

  public static getInstance = () => {
    if (SettingStore.instance === undefined) {
      SettingStore.instance = new SettingStore();
    }
    return SettingStore.instance;
  };

  public constructor() {
    this.modules = defaultSettings.modules;
    this.displayMode = defaultSettings.displayMode;
    this.activeProjects = defaultSettings.activeProjects;
    this.kanbanProject = defaultSettings.kanbanProject;
    this.todoProject = defaultSettings.todoProject;
    const lsSettings = localStorage.getItem("webPlannerSettings");
    if (lsSettings !== null) {
      const parsedSettings: Settings = JSON.parse(lsSettings);
      this.modules = parsedSettings.modules;
      this.displayMode = parsedSettings.displayMode;
      this.activeProjects = parsedSettings.activeProjects;
      this.kanbanProject = parsedSettings.kanbanProject;
      this.todoProject = parsedSettings.todoProject ?? 0;
    } else {
      localStorage.setItem(
        "webPlannerSettings",
        JSON.stringify(defaultSettings)
      );
    }
    makeObservable(this, {
      settingsOpen: observable,
      setSettingsOpen: action,
      modules: observable,
      setModules: action,
      displayMode: observable,
      setDisplayMode: action,
      activeProjects: observable,
      setActiveProjects: action,
      kanbanProject: observable,
      setKanbanProject: action,
    });
  }

  private getLsSettings = (): Settings => {
    const lsSettings = localStorage.getItem("webPlannerSettings") as string;
    return JSON.parse(lsSettings);
  };

  private writeLsSettings = (newSettings: Settings) => {
    localStorage.setItem("webPlannerSettings", JSON.stringify(newSettings));
  };
}

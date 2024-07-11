import { action, makeObservable, observable } from "mobx";
import type { Modules, Settings } from "settings";
import defaultSettings from "settings";

export default class SettingStore {
  private static instance: SettingStore | undefined;

  public modules: Modules;
  public setModules = (newModules: Modules) => {
    this.modules = newModules;
    const lsSettings = localStorage.getItem("webPlannerSettings");
    if (lsSettings !== null) {
      const parsedSettings: Settings = JSON.parse(lsSettings);
      parsedSettings.modules = this.modules;
      localStorage.setItem(
        "webPlannerSettings",
        JSON.stringify(parsedSettings)
      );
    }
  };

  public displayMode: "light" | "dark";
  public setDisplayMode = (newMode: "light" | "dark") => {
    this.displayMode = newMode;
    const lsSettings = localStorage.getItem("webPlannerSettings");
    if (lsSettings !== null) {
      const parsedSettings: Settings = JSON.parse(lsSettings);
      parsedSettings.displayMode = this.displayMode;
      localStorage.setItem(
        "webPlannerSettings",
        JSON.stringify(parsedSettings)
      );
    }
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
    const lsSettings = localStorage.getItem("webPlannerSettings");
    if (lsSettings !== null) {
      const parsedSettings: Settings = JSON.parse(lsSettings);
      this.modules = parsedSettings.modules;
      this.displayMode = parsedSettings.displayMode;
    }
    makeObservable(this, {
      modules: observable,
      setModules: action,
      displayMode: observable,
      setDisplayMode: action,
    });
  }
}

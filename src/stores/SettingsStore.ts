import type { PaletteMode } from "@mui/material";
import { action, makeObservable, observable } from "mobx";
import type { Modules, Settings } from "settings";
import defaultSettings from "settings";

export default class SettingStore {
  private static instance: SettingStore | undefined;

  private getLsSettings = (): Settings => {
    const lsSettings = localStorage.getItem("webPlannerSettings") as string;
    return JSON.parse(lsSettings);
  };

  private writeLsSettings = (newSettings: Settings) => {
    localStorage.setItem("webPlannerSettings", JSON.stringify(newSettings));
  };

  public modules: Modules;
  public setModules = (newModules: Modules) => {
    this.modules = newModules;
    const parsedSettings = this.getLsSettings();
    parsedSettings.modules = this.modules;
    this.writeLsSettings(parsedSettings);
  };

  public displayMode: PaletteMode;
  public setDisplayMode = (newMode: PaletteMode) => {
    this.displayMode = newMode;
    const parsedSettings = this.getLsSettings();
    parsedSettings.displayMode = this.displayMode;
    this.writeLsSettings(parsedSettings);
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
    } else {
      localStorage.setItem("webPlannerSettings", JSON.stringify(defaultSettings));
    }
    makeObservable(this, {
      modules: observable,
      setModules: action,
      displayMode: observable,
      setDisplayMode: action,
    });
  }
}

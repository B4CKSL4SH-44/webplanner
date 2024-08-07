import type { PaletteMode } from "@mui/material";
import { action, makeObservable, observable } from 'mobx';
import type { Modules, Settings } from 'settings';
import defaultSettings from 'settings';

export default class SettingStore {
    private static instance: SettingStore | undefined;

    public settingsOpen: boolean = false;
    public setSettingsOpen = (newOpen: boolean) => {
        this.settingsOpen = newOpen;
    };

    public modules: Modules;
    public setModules = (newModules: Modules) => {
        this.modules = { ...newModules };
        const parsedSettings = SettingStore.getLsSettings();
        parsedSettings.modules = this.modules;
        SettingStore.writeLsSettings(parsedSettings);
    };

    public displayMode: PaletteMode;
  public setDisplayMode = (newMode: PaletteMode) => {
    this.displayMode = newMode;
    const parsedSettings = SettingStore.getLsSettings();
        parsedSettings.displayMode = this.displayMode;
        SettingStore.writeLsSettings(parsedSettings);
  };

    public activeProjects: number[];
    public setActiveProjects = (newIds: number[]) => {
        this.activeProjects = [...newIds];
        const lsSettings = SettingStore.getLsSettings();
        lsSettings.activeProjects = this.activeProjects;
        SettingStore.writeLsSettings(lsSettings);
    };

    public kanbanProject: number;
    public setKanbanProject = (newId: number) => {
        this.kanbanProject = newId;
        const lsSettings = SettingStore.getLsSettings();
        lsSettings.kanbanProject = this.kanbanProject;
        SettingStore.writeLsSettings(lsSettings);
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
        const lsSettings = localStorage.getItem('webPlannerSettings');
        if (lsSettings !== null) {
            const parsedSettings: Settings = JSON.parse(lsSettings);
            this.modules = parsedSettings.modules;
            this.displayMode = parsedSettings.displayMode;
            this.activeProjects = parsedSettings.activeProjects;
            this.kanbanProject = parsedSettings.kanbanProject;
        } else {
            localStorage.setItem('webPlannerSettings', JSON.stringify(defaultSettings));
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

    private static getLsSettings = (): Settings => {
        const lsSettings = localStorage.getItem('webPlannerSettings') as string;
        return JSON.parse(lsSettings);
    };

    private static writeLsSettings = (newSettings: Settings) => {
        localStorage.setItem('webPlannerSettings', JSON.stringify(newSettings));
    };
}

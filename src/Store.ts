import { createContext, useContext } from 'react';
import type FlowStore from './modules/Flow/FlowStore';
import NoteBookStore from './modules/NoteBookStore';
import SettingStore from './stores/SettingsStore';
import TasksStore from './tasks/TasksStore';

export class Store {
    public settingsStore = SettingStore.getInstance();

    public noteBookStore = NoteBookStore.getInstance();

    public tasksStore = TasksStore.getInstance();

    public flowStore?: FlowStore = undefined;
}

const StoreContext = createContext(new Store());
const useStores = (): Store => useContext(StoreContext);

export default useStores;

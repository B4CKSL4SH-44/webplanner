import { createContext } from "react";
import SettingStore from "stores/SettingsStore";

export default class Store {
  private static instance: Store | undefined;

  public settingsStore = SettingStore.getInstance();

  public static getInstance = () => {
    if (Store.instance === undefined) {
      Store.instance = new Store();
    }
    return Store.instance;
  };
}

// const store = Store.getInstance;
// const useStores = createContext(Store.getInstance);

// export default useStores;

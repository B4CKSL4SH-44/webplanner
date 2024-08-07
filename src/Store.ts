import { createContext, useContext } from "react";
import SettingStore from "stores/SettingsStore";

class Store {
  public settingsStore = SettingStore.getInstance();
}

const StoreContext = createContext(new Store());
const useStores = (): Store => useContext(StoreContext);

export default useStores;

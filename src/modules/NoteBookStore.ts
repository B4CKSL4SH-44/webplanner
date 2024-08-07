import { action, makeObservable, observable } from "mobx";

export default class NoteBookStore {
  private static instance: NoteBookStore;

  public content: string = "";
  public setContent = (newContent: string) => {
    this.content = newContent;
    this.writeLsContent(this.content);
  };

  private constructor() {
    const lsContent = localStorage.getItem("webPlannerContent");
    if (lsContent !== null) {
      this.content = lsContent;
    } else {
      localStorage.setItem("webPlannerContent", "");
    }
    makeObservable(this, {
      content: observable,
      setContent: action,
    });
  }

  public static getInstance = () => {
    if (NoteBookStore.instance === undefined) {
      NoteBookStore.instance = new NoteBookStore();
    }
    return NoteBookStore.instance;
  };

  private getLsContent = (): string => {
    const lsContent = localStorage.getItem("webPlannerContent") as string;
    return lsContent;
  };

  private writeLsContent = (newContent: string): void => {
    localStorage.setItem("webPlannerContent", newContent);
  };
}

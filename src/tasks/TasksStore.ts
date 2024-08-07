import { action, makeObservable, observable } from "mobx";
import type { Task } from "tasks";

export default class TasksStore {
  private static instance: TasksStore;

  public tasks: Task[] = [];
  public setTasks = (newTasks: Task[]) => {
    this.tasks = newTasks;
    this.writeLsTasks(this.tasks);
  };
  public addTask = (newTask: Task) => {
    const lsTasks = this.getLsTasks();
    lsTasks.push(newTask);
    this.tasks = lsTasks;
    this.writeLsTasks(lsTasks);
  };

  public isTaskOverlayActive: boolean = false;
  public setTaskOverlayActive = (newBool: boolean) => {
    this.isTaskOverlayActive = newBool;
  };

  private constructor() {
    const lsTasks = localStorage.getItem("webPlannerTasks");
    if (lsTasks !== null) {
      this.tasks = JSON.parse(lsTasks);
    } else {
      localStorage.setItem("webPlannerTasks", "[]");
    }
    makeObservable(this, {
      tasks: observable,
      setTasks: action,
      addTask: action,
      isTaskOverlayActive: observable,
      setTaskOverlayActive: action,
    });
  }

  public static getInstance = () => {
    if (TasksStore.instance === undefined) {
      TasksStore.instance = new TasksStore();
    }
    return TasksStore.instance;
  };

  private getLsTasks = (): Task[] => {
    const lsTasks = localStorage.getItem("webPlannerTasks") as string;
    return JSON.parse(lsTasks) as Task[];
  };

  private writeLsTasks = (newTasks: Task[]): void => {
    localStorage.setItem("webPlannerTasks", JSON.stringify(newTasks));
  };
}

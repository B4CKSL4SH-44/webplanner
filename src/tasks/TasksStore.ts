import { action, makeObservable, observable } from "mobx";
import type { Projects, Task } from "tasks";

export default class TasksStore {
  private static instance: TasksStore;

  public projects: Projects = { personal: [] };

  public setProjects = (newProjects: Projects) => {
    this.projects = newProjects;
    this.writeLsProjects(this.projects);
  };
  public addProject = (newProject: string) => {
    const lsProjects = this.getLsProjects();
    lsProjects[newProject] = [];
    this.projects = lsProjects;
    this.writeLsProjects(lsProjects);
  };

  public addTask = (newTask: Task, project: string) => {
    const lsProjects = this.getLsProjects();
    lsProjects[project].push(newTask);
    this.projects = lsProjects;
    this.writeLsProjects(lsProjects);
  };
  public deleteTask = (task: Task) => {
    const lsProjects = this.getLsProjects();
    lsProjects[task.project] = lsProjects[task.project].filter((oldTask) => oldTask.id !== task.id);
    this.projects = lsProjects;
    this.writeLsProjects(lsProjects);
  };

  public isTaskOverlayActive: boolean = false;
  public setTaskOverlayActive = (newBool: boolean) => {
    this.isTaskOverlayActive = newBool;
  };

  public openTasks: Task[] = [];
  public setOpenTasks = (newTasks: Task[]) => {
    this.openTasks = newTasks;
  };
  public addOpenTask = (task: Task) => {
    if (!this.openTasks.some((openTask) => openTask.id === task.id)) {
      this.setOpenTasks([...this.openTasks, task]);
    }
  };
  public closeTask = (task: Task) => {
    const updatedTasks = this.openTasks.filter((openTask) => openTask.id !== task.id);
    this.setOpenTasks(updatedTasks);
  };

  private constructor() {
    const lsProjects = localStorage.getItem("webPlannerProjects");
    if (lsProjects !== null) {
      this.projects = JSON.parse(lsProjects);
    } else {
      localStorage.setItem("webPlannerProjects", '{"personal":[]}');
    }
    makeObservable(this, {
      projects: observable,
      setProjects: action,
      addProject: action,
      addTask: action,
      deleteTask: action,
      isTaskOverlayActive: observable,
      setTaskOverlayActive: action,
      openTasks: observable,
      setOpenTasks: action,
    });
  }

  public static getInstance = () => {
    if (TasksStore.instance === undefined) {
      TasksStore.instance = new TasksStore();
    }
    return TasksStore.instance;
  };

  private getLsProjects = (): Projects => {
    const lsProjects = localStorage.getItem("webPlannerProjects") as string;
    return JSON.parse(lsProjects) as Projects;
  };

  private writeLsProjects = (newProjects: Projects): void => {
    localStorage.setItem("webPlannerProjects", JSON.stringify(newProjects));
  };
}

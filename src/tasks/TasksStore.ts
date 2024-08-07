import { action, makeObservable, observable } from 'mobx';
import {
    defaultProjects, type Project, type Projects, type Task,
} from 'tasks';

export default class TasksStore {
    private static instance: TasksStore;

    public projects: Projects = defaultProjects;
    public setProjects = (newProjects: Projects) => {
        this.projects = newProjects;
        TasksStore.writeLsProjects(this.projects);
    };
    public addProject = (newProject: Project) => {
        const lsProjects = TasksStore.getLsProjects();
        lsProjects[newProject.id] = newProject;
        this.projects = lsProjects;
        TasksStore.writeLsProjects(lsProjects);
    };
    public addBoard = (project: Project, board: string) => {
        const sorted = Object.keys(this.projects[project.id].boards).sort((a, b) => Number(b) - Number(a));
        const newId = Number(sorted[0]) + 1;
        this.projects[project.id].boards[newId] = board;
        this.setProjects(this.projects);
    };

    public newProjectOverlayActive: boolean = false;
    public setNewProjectOverlayActive = (bool: boolean) => {
        this.newProjectOverlayActive = bool;
    };

    public addTask = (newTask: Task) => {
        const lsProjects = TasksStore.getLsProjects();
        lsProjects[newTask.project].tasks.push(newTask);
        this.projects = lsProjects;
        TasksStore.writeLsProjects(lsProjects);
    };
    public deleteTask = (task: Task) => {
        const lsProjects = TasksStore.getLsProjects();
        lsProjects[task.project].tasks = lsProjects[task.project].tasks.filter((oldTask) => oldTask.id !== task.id);
        this.projects = lsProjects;
        TasksStore.writeLsProjects(lsProjects);
    };
    public updateTask = (taskToUpdate: Task) => {
        const updatedTasks = this.projects[taskToUpdate.project].tasks.map((task) => {
            if (task.id === taskToUpdate.id) {
                return taskToUpdate;
            }
            return task;
        });
        this.setProjects({
            ...this.projects,
            [taskToUpdate.project]: {
                ...this.projects[taskToUpdate.project],
                tasks: updatedTasks,
            },
        });
    };

    public taskOverlayState: boolean | Task = false;
    public setTaskOverlayState = (newValue: boolean | Task) => {
        this.taskOverlayState = newValue;
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

    public taskTimer: Task | null = null;
    public setTaskTimer = (newValue: Task | null) => {
        this.taskTimer = newValue;
    };

    private constructor() {
        const lsProjects = localStorage.getItem('webPlannerProjects');
        if (lsProjects !== null) {
            this.projects = JSON.parse(lsProjects);
            // Fixing breaking changes:
            Object.keys(this.projects).forEach((key: string) => {
                if (this.projects[Number(key)].boards === undefined) {
                    this.projects[Number(key)].boards = { 0: 'NONE' };
                }
                this.projects[Number(key)].tasks.forEach((task, index) => {
                    if (task.board === undefined) {
                        this.projects[Number(key)].tasks[index].board = 0;
                    }
                  if (task.state === undefined) {
            this.projects[Number(key)].tasks[index].state = "open";
          }
        });
            });
            TasksStore.writeLsProjects(this.projects);
        } else {
            localStorage.setItem('webPlannerProjects', JSON.stringify(defaultProjects));
        }
        makeObservable(this, {
            projects: observable,
            setProjects: action,
            addProject: action,
            newProjectOverlayActive: observable,
            setNewProjectOverlayActive: action,
            addTask: action,
            deleteTask: action,
            taskOverlayState: observable,
            setTaskOverlayState: action,
            openTasks: observable,
            setOpenTasks: action,
            taskTimer: observable,
            setTaskTimer: action,
        });
    }

    public static getInstance = () => {
        if (TasksStore.instance === undefined) {
            TasksStore.instance = new TasksStore();
        }
        return TasksStore.instance;
    };

    private static getLsProjects = (): Projects => {
        const lsProjects = localStorage.getItem('webPlannerProjects') as string;
        return JSON.parse(lsProjects) as Projects;
    };

    private static writeLsProjects = (newProjects: Projects): void => {
        localStorage.setItem('webPlannerProjects', JSON.stringify(newProjects));
    };
}

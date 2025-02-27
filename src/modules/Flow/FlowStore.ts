import {
    type Edge,
    type Node,
} from '@xyflow/react';
import {
    makeAutoObservable,
} from 'mobx';
import useStores, { type Store } from '../../Store';
import type { Task } from '../../tasks';

export default class FlowStore {
    private stores: Store;

    public edgeType = 'blockiert';

    public setEdgeType = (newType: string) => {
        this.edgeType = newType;
    };

    public activeProject: number = 1;

    public setActiveProject = (project: number) => {
        this.activeProject = project;
    };

    /** ALL TASKS */
    /**
     * A list of all tasks in the currently active project.
     */
    public allTasks: Task[] = [];

    /**
     * Adds a new task to the list of all tasks.
     *
     * @param {Task} newTask - The task to be added.
     */
    public addTask = (newTask: Task) => {
        this.allTasks.push(newTask);
    };

    /** TASKS IN FLOW */
    /**
     * An array of task Ids that are currently in the flow.
     */
    public taskIdsInFlow: number[] = [];

    /**
     * Adds a task to the flow.
     *
     * @param {number} Id - The Id of the task to be added.
     */
    public addTaskToFlow = (Id: number) => {
        this.taskIdsInFlow.push(Id);
    };

    public getTaskById = (id: number) => this.allTasks.find((task) => task.id === id);

    /** TASKS IN SEARCH */
    public taskIdsInSearch: number[] = this.allTasks.filter((task) => this.taskIdsInFlow.includes(task.id)).map((task) => task.id);

    /** FLOW NODES */
    public nodes: Node[] = [];

    public setNodes = (newNodes: Node[]) => {
        this.nodes = newNodes;
    };

    // Flow Edges
    public edges: Edge[] = [];

    public setEdges = (newEdges: Edge[]) => {
        this.edges = newEdges;
    };

    private createNodesFromTasks = () => {
        const taskNodes: Node[] = [];
        this.taskIdsInFlow.forEach((taskId, index) => {
            const task = this.getTaskById(taskId);
            if (task === undefined) return;
            taskNodes.push({
                id: task.id.toString(), position: { x: 250 * index + 50, y: 50 }, data: { task }, type: 'custom',
            } as Node);
        });
        this.setNodes(taskNodes);
    };

    private createEdgesFromTasks = () => {
        const taskEdges: Edge[] = [];
        this.stores.settingsStore.activeProjects.forEach((id) => {
            const project = this.stores.tasksStore.projects[id];
            project.tasks.forEach((task, index) => {
                taskEdges.push({
                    id: index.toString(), source: task.id.toString(), target: task.relations.blocks.toString(), type: 'custom', data: { label: 'blockiert' },
                } as Edge);
            });
        });
        this.setEdges(taskEdges);
    };

    private initStore = () => {
        const { settingsStore, tasksStore } = this.stores;
        // for now, we only use the first active project
        const activeProject = settingsStore.activeProjects[0];

        tasksStore.projects[activeProject].tasks.forEach((task) => {
            this.addTask(task);
        });

        // sort tasks, to show them in task search or in flow
        this.allTasks.forEach((task) => {
            if (this.nodes.some((node) => node.id === task.id.toString())) {
                this.addTaskToFlow(task.id);
            }
        });
    };

    public constructor(props: { stores: Store }) {
        const { stores } = props;

        this.stores = stores;

        this.nodes = [];
        this.edges = [];

        this.initStore();

        this.createNodesFromTasks();
        this.createEdgesFromTasks();

        makeAutoObservable(this);
    }
}

export const useFlowStore = (): FlowStore => {
    const store = useStores();
    return store.flowStore!;
};

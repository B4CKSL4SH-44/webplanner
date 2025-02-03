import {
    type Edge,
    type Node,
} from '@xyflow/react';
import { action, makeObservable, observable } from 'mobx';
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

    // const lsNodes = localStorage.getItem('nodes');

    // all tasks
    public tasks: Task[] = [];

    public addTask = (newTask: Task) => {
        this.tasks.push(newTask);
    };

    // tasks in flow
    public tasksInFlow: Task[] = [];

    public addTaskInFlow = (newTask: Task) => {
        this.tasksInFlow.push(newTask);
    };

    // tasks in search
    public tasksInSearch: Task[] = [];

    public addTaskInSearch = (newTask: Task) => {
        this.tasksInSearch.push(newTask);
    };

    // Flow Nodes
    public nodes: Node[];

    public setNodes = (newNodes: Node[]) => {
        this.nodes = newNodes;
    };

    // Flow Edges
    public edges: Edge[];

    public setEdges = (newEdges: Edge[]) => {
        this.edges = newEdges;
    };

    public addTaskToFlow = (task: Task) => {
        this.addTaskInFlow(task);
        this.tasksInSearch.filter((t) => t.id !== task.id);

        this.createNodesFromTasks();
        this.createEdgesFromTasks();
    };

    private createNodesFromTasks = () => {
        const taskNodes: Node[] = [];
        console.log('tasksInFlow', ...this.tasksInFlow);
        this.tasksInFlow.forEach((task, index) => {
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
        this.tasks.forEach((task) => {
            if (this.nodes.some((node) => node.id === task.id.toString())) {
                this.addTaskInFlow(task);
            } else {
                this.addTaskInSearch(task);
            }
        });
    };

    public constructor(props: { stores: Store }) {
        this.stores = props.stores;

        this.nodes = [];
        this.edges = [];

        this.initStore();

        this.createNodesFromTasks();
        this.createEdgesFromTasks();

        makeObservable(this, {
            nodes: observable,
            tasks: observable,
            tasksInFlow: observable,
            tasksInSearch: observable,
            addTask: action,
            addTaskInFlow: action,
            addTaskInSearch: action,
            addTaskToFlow: action,
            setNodes: action,
        });
    }
}

export const useFlowStore = (): FlowStore => {
    const store = useStores();
    return store.flowStore!;
};

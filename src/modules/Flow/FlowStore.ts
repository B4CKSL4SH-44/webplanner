import {
    applyEdgeChanges,
    applyNodeChanges,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
} from '@xyflow/react';
import {
    action,
    makeObservable,
    observable,
} from 'mobx';
import useStores, { type Store } from '../../Store';
import type { Task } from '../../tasks';

export default class FlowStore {
    stores: Store;

    public tasks: Task[] = observable.array([]);

    public nodes: Node[] = observable.array([]);

    public edges: Edge[] = observable.array([]);

    setNodes = (newNodes: Node[]) => {
        this.nodes = [...newNodes];
    };

    setEdges = (newEdges: Edge[]) => {
        this.edges = newEdges;
    };

    syncTasksWithNodes = () => {
        this.tasks.forEach((task) => {
            task.flow = this.nodes.find((node) => node.id === task.id.toString());
        });
    };

    setLocalStorage = () => {
        localStorage.setItem('webPlannerFlow', JSON.stringify(this.nodes));
    };

    onEdgesChange = action((changes: EdgeChange[]) => {
        this.setEdges(applyEdgeChanges(changes, this.edges));
    });

    onNodesChange = action((changes: NodeChange[]) => {
        this.setNodes(applyNodeChanges(changes, this.nodes));
    });

    addTask = (newTask: Task) => {
        if (newTask.flow === undefined) return;
        this.nodes.push(newTask.flow);
    };

    constructor(stores: Store) {
        this.stores = stores;
        const lsFlow = localStorage.getItem('webPlannerFlow');
        if (lsFlow) {
            this.nodes = JSON.parse(lsFlow);
        } else {
            this.nodes = [];
        }

        // get tasks of first active project
        const { tasks } = stores.tasksStore.projects[stores.settingsStore.activeProjects[0]];
        this.tasks = tasks;

        this.syncTasksWithNodes();

        makeObservable(this, {
            nodes: observable,
            edges: observable,
            setNodes: action,
            setEdges: action,
            addTask: action,
            onNodesChange: action,
            onEdgesChange: action,
        });
    }
}

export const useFlowStore = (): FlowStore => {
    const store = useStores();
    return store.flowStore!;
};

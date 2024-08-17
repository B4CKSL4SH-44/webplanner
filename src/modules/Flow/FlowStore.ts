import {
    type Edge,
    type Node,
} from '@xyflow/react';
import { action, makeObservable, observable } from 'mobx';
import useStores, { type Store } from '../../Store';

export default class FlowStore {
    private stores: Store;

    public nodes: Node[];

    public setNodes = (newNodes: Node[]) => {
        this.nodes = newNodes;
    };

    public edges: Edge[];

    public setEdges = (newEdges: Edge[]) => {
        this.edges = newEdges;
    };

    private createNodesFromTasks = () => {
        const taskNodes: Node[] = [];
        this.stores.settingsStore.activeProjects.forEach((id) => {
            const project = this.stores.tasksStore.projects[id];
            project.tasks.forEach((task, index) => {
                taskNodes.push({
                    id: task.id.toString(), position: { x: 250 * index + 50, y: 50 }, data: { task }, type: 'custom',
                } as Node);
            });
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

    public constructor(props: { stores: Store }) {
        this.stores = props.stores;

        this.nodes = [];
        this.edges = [];

        this.createNodesFromTasks();
        this.createEdgesFromTasks();

        makeObservable(this, {
            nodes: observable,
            setNodes: action,
        });
    }
}

export const useFlowStore = (): FlowStore => {
    const store = useStores();
    return store.flowStore!;
};

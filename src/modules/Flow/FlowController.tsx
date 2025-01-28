import {
    addEdge,
    reconnectEdge,
    useEdgesState,
    useNodesState,
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
} from '@xyflow/react';
import { observer } from 'mobx-react';
import { useCallback, useRef, useState } from 'react';
import useStores from '../../Store';
import FlowCmp from './FlowCmp';
import { useFlowStore } from './FlowStore';

/**
 * FlowController component that manages the flow of nodes and edges.
 * It observes changes and updates the state for nodes and edges.
 *
 * @returns {JSX.Element} The Flow component.
 */
const FlowController = observer(() => {
    const flowStore = useFlowStore();
    const { settingsStore, tasksStore } = useStores();

    const [edgeType, setEdgeType] = useState('blockiert');
    const [activeProject, setActiveProject] = useState<number>(0);

    const lsNodes = localStorage.getItem('nodes');

    const flowRef = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(flowStore.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flowStore.edges);

    const createNodes = () => {
        const taskNodes: Node[] = [];
        settingsStore.activeProjects.forEach((id) => {
            const project = tasksStore.projects[activeProject];
            project.tasks.forEach((task, index) => {
                taskNodes.push({
                    id: task.id.toString(), position: { x: 250 * index + 50, y: 50 }, data: { task }, type: 'custom',
                } as Node);
            });
        });
        setNodes(taskNodes);
    };

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const edgeReconnectSuccessful = useRef(true);

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_: MouseEvent | TouchEvent, edge: Edge) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeReconnectSuccessful.current = true;
    }, []);

    const [menu, setMenu] = useState<{ id: string,
        top: number | false,
        left: number | false,
        right: number | false,
        bottom: number | false, } | null>(null);
    // Close the context menu if it's open whenever the window is clicked.
    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    const onEdgeContextMenu = useCallback(
        (event: React.MouseEvent, edge: Edge) => {
        // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = (flowRef.current! as HTMLDivElement).getBoundingClientRect();
            const yDiff = window.innerHeight - pane.height;
            const xDiff = window.innerWidth - pane.width;
            const newMenu = ({
                id: edge.id,
                top: event.clientY - yDiff + 10,
                left: event.clientX - xDiff + 10,
                right: false,
                bottom: false,
            });
            setMenu(newMenu as { id: string, top: number | false, left: number | false, right: number | false, bottom: number | false, });
        },
        [setMenu],
    );

    const onNodesChangeHandler = (changes: NodeChange<Node>[]) => {
        onNodesChange(changes);
    };

    const onEdgesChangeHandler = (changes: EdgeChange<Edge>[]) => {
        onEdgesChange(changes);
    };

    const flowCmpProps = {
        activeProject,
        setActiveProject,
        edgeType,
        setEdgeType,
        flowRef,
        nodes,
        edges,
        onNodesChangeHandler,
        onEdgesChangeHandler,
        onConnect,
        onReconnect,
        onReconnectStart,
        onReconnectEnd,
        onEdgeContextMenu,
        onPaneClick,
        menu,
    };

    return (
        <FlowCmp {...flowCmpProps} />
    );
});

export default FlowController;

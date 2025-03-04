import {
    Box,
    Stack,
    useTheme,
} from '@mui/material';
import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { observer } from 'mobx-react';
import {
    useCallback, useMemo, useRef, useState,
} from 'react';
import ContextMenu from './ContextMenu';
import EdgeSettings from './EdgeSettings';
import CustomEdge from './FlowItems/CustomEdge';
import CustomNode from './FlowItems/CustomNode';
import { useFlowStore } from './FlowStore';
import TaskSearch from './TaskSearch';

interface FlowCmpProps {
    flowRef: React.RefObject<HTMLDivElement>;
    nodes: Node[];
    edges: Edge[];
    onNodesChangeHandler: (nodes: NodeChange<Node>[]) => void;
    onEdgesChangeHandler: (edges: EdgeChange<Edge>[]) => void;
    onConnect: (params: any) => void;
    onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
    onReconnectStart: () => void;
    onReconnectEnd: (event: MouseEvent | TouchEvent, edge: Edge) => void;
    onEdgeContextMenu: (event: React.MouseEvent, edge: Edge) => void;
    onPaneClick: () => void;
    menu: { id: string, top: number | false, left: number | false, right: number | false, bottom: number | false, } | null;
}

/**
 * A component that renders a ReactFlow graph with nodes and edges.
 * Additionally, it renders a toolbar with a dropdown menu for selecting the edge type
 * and a dropdown menu for selecting the project.
 * It also renders a context menu when the user right-clicks on an edge.
 *
 * @param {FlowCmpProps} props - The props for the component.
 * @param {React.RefObject<HTMLDivElement>} props.flowRef - A ref to the ReactFlow component.
 * @param {Node[]} props.nodes - The nodes in the graph.
 * @param {Edge[]} props.edges - The edges in the graph.
 * @param {(nodes: NodeChange<Node>[]) => void} props.onNodesChangeHandler - A function to handle changes to the nodes.
 * @param {(edges: EdgeChange<Edge>[]) => void} props.onEdgesChangeHandler - A function to handle changes to the edges.
 * @param {(params: any) => void} props.onConnect - A function to handle creating a new edge.
 * @param {(oldEdge: Edge, newConnection: Connection) => void} props.onReconnect - A function to handle reconnecting an edge.
 * @param {() => void} props.onReconnectStart - A function to handle starting a reconnect operation.
 * @param {(event: MouseEvent | TouchEvent, edge: Edge) => void} props.onReconnectEnd - A function to handle ending a reconnect operation.
 * @param {(event: React.MouseEvent, edge: Edge) => void} props.onEdgeContextMenu - A function to handle showing the context menu for an edge.
 * @param {() => void} props.onPaneClick - A function to handle clicking on the pane.
 * @param {{ id: string, top: number | false, left: number | false, right: number | false, bottom: number | false, } | null} props.menu - The context menu to show.
 */
const FlowCmp = observer((): JSX.Element => {
    const flowStore = useFlowStore();
    const {
        nodes, edges, setNodes, addTask, syncTasksWithNodes, onNodesChange, onEdgesChange,
    } = flowStore;

    const flowRef = useRef<HTMLDivElement | null>(null);
    const theme = useTheme();

    // Handlers
    const handleNodesChange = useCallback((changes: NodeChange[]) => onNodesChange(changes), [onNodesChange]);

    const handleEdgesChange = useCallback((changes: EdgeChange[]) => onEdgesChange(changes), [onEdgesChange]);

    const handleNodeDragStop = useCallback(() => syncTasksWithNodes(), [syncTasksWithNodes]);

    const [menu, setMenu] = useState<{ id: string, top: number | false, left: number | false, right: number | false, bottom: number | false } | null>(null);

    const onPaneClick = useCallback(() => setMenu(null), []);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
    const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

    /* const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();
        const pane = flowRef.current!.getBoundingClientRect();
        const newMenu = {
            id: edge.id,
            top: event.clientY - (window.innerHeight - pane.height) + 10,
            left: event.clientX - (window.innerWidth - pane.width) + 10,
            right: false,
            bottom: false,
        };
        setMenu(newMenu);
    }, []); */
    return (
        <Stack direction="row" flex={1} display="flex">
            <TaskSearch />
            <Box sx={{ flex: 1, borderTopLeftRadius: 1 }}>
                <EdgeSettings />
                <ReactFlow
                    ref={flowRef}
                    nodes={[...flowStore.nodes]}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    // onNodeDragStop={handleNodeDragStop}
                    colorMode={theme.palette.mode}
                    // onEdgeContextMenu={onEdgeContextMenu}
                    style={{ height: '100%', width: '100%' }}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                    {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
                </ReactFlow>
            </Box>
        </Stack>
    );
});

export default FlowCmp;

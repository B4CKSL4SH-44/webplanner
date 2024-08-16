import { useTheme } from '@mui/material';
import {
    addEdge, Background, Controls, MiniMap,
    ReactFlow, reconnectEdge, useEdgesState,
    useNodesState,
    type Connection,
    type Edge,
    type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useRef } from 'react';
import CustomNode from './CustomNode';
import { useFlowStore } from './FlowStore';

const initialNodes: Node[] = [
    {
        id: 'activeGroup',
        position: { x: 400, y: 0 },
        data: { label: 'aktiv' },
        type: 'group',
        style: { width: 300, height: '100%' },
    },
    {
        id: 'noRelationGroup',
        position: { x: 0, y: 0 },
        data: { label: null },
        type: 'group',
        style: { width: 300, height: 200 },
    },
    {
        id: '2', position: { x: 10, y: 10 }, data: { }, type: 'custom', parentId: 'activeGroup', extent: 'parent',
    },
    {
        id: '3', position: { x: 0, y: 200 }, data: { }, type: 'custom',
    },
    {
        id: '4', position: { x: 0, y: 300 }, data: { }, type: 'custom',
    },
    {
        id: '5', position: { x: 200, y: 200 }, data: { initialCount: 1 }, type: 'custom', dragHandle: '.drag',
    },
];

const initialEdges: Edge[] = [];

const FlowCmp = () => {
    const flowStore = useFlowStore();
    const theme = useTheme();

    const edgeReconnectSuccessful = useRef(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(flowStore.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flowStore.edges);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={{ custom: CustomNode }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            colorMode={theme.palette.mode}
            style={{ height: '100%', width: '100%' }}
        >
            <MiniMap />
            <Controls />
            <Background />
        </ReactFlow>
    );
};
export default FlowCmp;

import {
    MenuItem,
    Select,
    useTheme,
} from '@mui/material';
import {
    addEdge, Background, Controls, MiniMap,
    ReactFlow, reconnectEdge, useEdgesState,
    useNodesState,
    type Connection,
    type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useRef, useState } from 'react';
import ContextMenu from './ContextMenu';
import CustomEdge from './CustomEdge';
import CustomNode from './CustomNode';
import { useFlowStore } from './FlowStore';

const FlowCmp = () => {
    const flowStore = useFlowStore();
    const theme = useTheme();

    const [value, setValue] = useState('blockiert');

    const [menu, setMenu] = useState<{ id: string,
        top: number | false,
        left: number | false,
        right: number | false,
        bottom: number | false, } | null>(null);
    const edgeReconnectSuccessful = useRef(true);
    const [nodes, setNodes, onNodesChange] = useNodesState(flowStore.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flowStore.edges);
    const ref = useRef(null);

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

    // Close the context menu if it's open whenever the window is clicked.
    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    const onEdgeContextMenu = useCallback(
        (event: React.MouseEvent, edge: Edge) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = (ref.current! as HTMLDivElement).getBoundingClientRect();
            setMenu({
                id: edge.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );

    return (
        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            nodeTypes={{ custom: CustomNode }}
            edgeTypes={{ custom: CustomEdge }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            colorMode={theme.palette.mode}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneClick={onPaneClick}
            style={{ height: '100%', width: '100%' }}
        >
            <MiniMap />
            <Controls />
            <Background />
            {menu && <ContextMenu onClick={onPaneClick} bottom={menu.bottom} left={menu.left} right={menu.right} top={menu.top} id={menu.id} />}
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label="Age"
                onChange={(e) => setValue(e.target.value)}
                sx={{
                    position: 'absolute', top: 0, right: 0, zIndex: 99, m: 1,
                }}
            >
                <MenuItem value="blockiert">blockiert</MenuItem>
                <MenuItem value="Beziehung mit">Beziehung mit</MenuItem>
                <MenuItem value="Vorgänger von">Vorgänger von</MenuItem>
                <MenuItem value="Nachfolger von">Nachfolger von</MenuItem>
            </Select>
        </ReactFlow>
    );
};
export default FlowCmp;

import {
    Box,
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    useTheme,
} from '@mui/material';
import {
    addEdge,
    Background, Controls, MiniMap,
    ReactFlow,
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
import ContextMenu from './ContextMenu';
import CustomEdge from './CustomEdge';
import CustomNode from './CustomNode';
import { useFlowStore } from './FlowStore';

const FlowController = observer(() => {
    const theme = useTheme();
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
            const newMenu = ({
                id: edge.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
            setMenu(newMenu);
        },
        [setMenu],
    );

    const onNodesChangeHandler = (changes: NodeChange<Node>[]) => {
        onNodesChange(changes);
    };

    const onEdgesChangeHandler = (changes: EdgeChange<Edge>[]) => {
        onEdgesChange(changes);
    };

    return (
        <>
            <Stack direction="row" m={2} spacing={1} sx={{ backgroundColor: theme.palette.background.default, width: 'fit-content' }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="label">Beziehung</InputLabel>
                    <Select
                        label="Beziehung"
                        labelId="label"
                        value={edgeType}
                        onChange={(e) => setEdgeType(e.target.value)}
                        autoWidth
                    >
                        <MenuItem value="blockiert">blockiert</MenuItem>
                        <MenuItem value="Beziehung mit">Beziehung mit</MenuItem>
                        <MenuItem value="Vorgänger von">Vorgänger von</MenuItem>
                        <MenuItem value="Nachfolger von">Nachfolger von</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="select-project-label">Projekte auswählen</InputLabel>
                    <Select
                        sx={{ p: 0 }}
                        labelId="select-project-label"
                        value={activeProject}
                        label="Projekte auswählen"
                        autoWidth
                        onChange={(e) => setActiveProject(Number(e.target.value))}
                    >
                        {Object.keys(tasksStore.projects).map((projectStringId) => {
                            const project = {
                                ...tasksStore.projects[Number(projectStringId)],
                            };
                            return (
                                <MenuItem key={projectStringId} value={project.id}>
                                    {project.alias}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Stack>
            <ReactFlow
                ref={flowRef}
                nodes={nodes}
                edges={edges}
                nodeTypes={{ custom: CustomNode }}
                edgeTypes={{ custom: CustomEdge }}
                onNodesChange={onNodesChangeHandler}
                onEdgesChange={onEdgesChangeHandler}
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
            </ReactFlow>
        </>
    );
});

export default FlowController;

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    useTheme,
} from '@mui/material';
import {
    Background, Controls, MiniMap,
    ReactFlow,
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useStores from '../../Store';
import ContextMenu from './ContextMenu';
import CustomEdge from './FlowItems/CustomEdge';
import CustomNode from './FlowItems/CustomNode';

interface FlowCmpProps {
    activeProject: number;
    setActiveProject: (project: number) => void;
    edgeType: string;
    setEdgeType: (type: string) => void;
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
 * @param {number} props.activeProject - The currently selected project.
 * @param {(project: number) => void} props.setActiveProject - A function to set the active project.
 * @param {string} props.edgeType - The currently selected edge type.
 * @param {(type: string) => void} props.setEdgeType - A function to set the edge type.
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
const FlowCmp = (props: FlowCmpProps): JSX.Element => {
    const {
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
    } = props;

    const theme = useTheme();
    const { settingsStore, tasksStore } = useStores();

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
};
export default FlowCmp;

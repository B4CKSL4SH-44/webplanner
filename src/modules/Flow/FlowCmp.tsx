import {
    Box,
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
import { observer } from 'mobx-react';
import useStores from '../../Store';
import ContextMenu from './ContextMenu';
import EdgeSettings from './EdgeSettings';
import CustomEdge from './FlowItems/CustomEdge';
import CustomNode from './FlowItems/CustomNode';
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
const FlowCmp = observer((props: FlowCmpProps): JSX.Element => {
    const {
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
    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
            label: 'The Lord of the Rings: The Return of the King',
            year: 2003,
        },
        { label: 'The Good, the Bad and the Ugly', year: 1966 },
        { label: 'Fight Club', year: 1999 },
        {
            label: 'The Lord of the Rings: The Fellowship of the Ring',
            year: 2001,
        },
        {
            label: 'Star Wars: Episode V - The Empire Strikes Back',
            year: 1980,
        },
        { label: 'Forrest Gump', year: 1994 },
        { label: 'Inception', year: 2010 },
        {
            label: 'The Lord of the Rings: The Two Towers',
            year: 2002,
        },
        { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { label: 'Goodfellas', year: 1990 },
        { label: 'The Matrix', year: 1999 },
        { label: 'Seven Samurai', year: 1954 },
        {
            label: 'Star Wars: Episode IV - A New Hope',
            year: 1977,
        },
        { label: 'City of God', year: 2002 },
        { label: 'Se7en', year: 1995 },
        { label: 'The Silence of the Lambs', year: 1991 },
        { label: "It's a Wonderful Life", year: 1946 },
        { label: 'Life Is Beautiful', year: 1997 },
        { label: 'The Usual Suspects', year: 1995 },
        { label: 'Léon: The Professional', year: 1994 },
        { label: 'Spirited Away', year: 2001 },
        { label: 'Saving Private Ryan', year: 1998 },
        { label: 'Once Upon a Time in the West', year: 1968 },
        { label: 'American History X', year: 1998 },
        { label: 'Interstellar', year: 2014 },
        { label: 'Casablanca', year: 1942 },
        { label: 'City Lights', year: 1931 },
        { label: 'Psycho', year: 1960 },
        { label: 'The Green Mile', year: 1999 },
        { label: 'The Intouchables', year: 2011 },
        { label: 'Modern Times', year: 1936 },
        { label: 'Raiders of the Lost Ark', year: 1981 },
        { label: 'Rear Window', year: 1954 },
        { label: 'The Pianist', year: 2002 },
        { label: 'The Departed', year: 2006 },
        { label: 'Terminator 2: Judgment Day', year: 1991 },
        { label: 'Back to the Future', year: 1985 },
        { label: 'Whiplash', year: 2014 },
        { label: 'Gladiator', year: 2000 },
        { label: 'Memento', year: 2000 },
        { label: 'The Prestige', year: 2006 },
        { label: 'The Lion King', year: 1994 },
        { label: 'Apocalypse Now', year: 1979 },
        { label: 'Alien', year: 1979 },
        { label: 'Sunset Boulevard', year: 1950 },
        {
            label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
            year: 1964,
        },
        { label: 'The Great Dictator', year: 1940 },
        { label: 'Cinema Paradiso', year: 1988 },
        { label: 'The Lives of Others', year: 2006 },
        { label: 'Grave of the Fireflies', year: 1988 },
        { label: 'Paths of Glory', year: 1957 },
        { label: 'Django Unchained', year: 2012 },
        { label: 'The Shining', year: 1980 },
        { label: 'WALL·E', year: 2008 },
        { label: 'American Beauty', year: 1999 },
        { label: 'The Dark Knight Rises', year: 2012 },
        { label: 'Princess Mononoke', year: 1997 },
        { label: 'Aliens', year: 1986 },
        { label: 'Oldboy', year: 2003 },
        { label: 'Once Upon a Time in America', year: 1984 },
        { label: 'Witness for the Prosecution', year: 1957 },
        { label: 'Das Boot', year: 1981 },
        { label: 'Citizen Kane', year: 1941 },
        { label: 'North by Northwest', year: 1959 },
        { label: 'Vertigo', year: 1958 },
        {
            label: 'Star Wars: Episode VI - Return of the Jedi',
            year: 1983,
        },
        { label: 'Reservoir Dogs', year: 1992 },
        { label: 'Braveheart', year: 1995 },
        { label: 'M', year: 1931 },
        { label: 'Requiem for a Dream', year: 2000 },
        { label: 'Amélie', year: 2001 },
        { label: 'A Clockwork Orange', year: 1971 },
        { label: 'Like Stars on Earth', year: 2007 },
        { label: 'Taxi Driver', year: 1976 },
        { label: 'Lawrence of Arabia', year: 1962 },
        { label: 'Double Indemnity', year: 1944 },
        {
            label: 'Eternal Sunshine of the Spotless Mind',
            year: 2004,
        },
        { label: 'Amadeus', year: 1984 },
        { label: 'To Kill a Mockingbird', year: 1962 },
        { label: 'Toy Story 3', year: 2010 },
        { label: 'Logan', year: 2017 },
        { label: 'Full Metal Jacket', year: 1987 },
        { label: 'Dangal', year: 2016 },
        { label: 'The Sting', year: 1973 },
        { label: '2001: A Space Odyssey', year: 1968 },
        { label: "Singin' in the Rain", year: 1952 },
        { label: 'Toy Story', year: 1995 },
        { label: 'Bicycle Thieves', year: 1948 },
        { label: 'The Kid', year: 1921 },
        { label: 'Inglourious Basterds', year: 2009 },
        { label: 'Snatch', year: 2000 },
        { label: '3 Idiots', year: 2009 },
        { label: 'Monty Python and the Holy Grail', year: 1975 },
    ];

    return (
        <Stack direction="row" height="100%" display="flex">
            <TaskSearch />
            <Box sx={{ flex: 1 }}>
                <EdgeSettings />
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
            </Box>
        </Stack>
    );
});

export default FlowCmp;

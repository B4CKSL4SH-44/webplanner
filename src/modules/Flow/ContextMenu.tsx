import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

const ContextMenu = (props: {
    id: string,
    top: number | false,
    left: number | false,
    right: number | false,
    bottom: number | false,
    onClick?: () => void,
}) => {
    const {
        id, top, left, right, bottom, onClick,
    } = props;
    const {
        getNode, setNodes, addNodes, setEdges,
    } = useReactFlow();
    const duplicateNode = useCallback(() => {
        const node = getNode(id);
        const position = {
            x: node!.position.x + 50,
            y: node!.position.y + 50,
        };

        addNodes({
            ...node!,
            selected: false,
            dragging: false,
            id: `${node!.id}-copy`,
            position,
        });
    }, [id, getNode, addNodes]);

    const deleteNode = useCallback(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setNodes, setEdges]);

    return (
        <div
            style={{
                top: top as number, left: left as number, right: right as number, bottom: bottom as number,
            }}
            aria-hidden
            className="context-menu"
            onClick={onClick}
        >
            <p style={{ margin: '0.5em' }}>
                <small>
                    node:
                    {id}
                </small>
            </p>
            <button type="button" onClick={duplicateNode}>duplicate</button>
            <button type="button" onClick={deleteNode}>delete</button>
        </div>
    );
};

export default ContextMenu;

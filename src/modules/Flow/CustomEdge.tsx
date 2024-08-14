import { useTheme } from '@mui/material';
import {
    BaseEdge,
    type Edge,
    EdgeLabelRenderer,
    type EdgeProps,
    getSmoothStepPath,
} from '@xyflow/react';

const CustomEdge = (props: EdgeProps<Edge<{ label: string }>>) => {
    const theme = useTheme();

    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        data,
    } = props;

    const label = data?.label ?? '';

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const font = theme.typography.caption;

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: theme.palette.error.main,
                        padding: 10,
                        borderRadius: 5,
                        ...font,
                    }}
                    className="nodrag nopan"
                >
                    {label}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default CustomEdge;

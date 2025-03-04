import {
    Card,
    Stack, Typography,
    useTheme,
} from '@mui/material';
import {
    Handle, Position, type Node, type NodeProps,
} from '@xyflow/react';
import useStores from '../../../Store';
import { useFlowStore } from '../FlowStore';

export type TCustomNode = Node<
{
    id: number;
},
'custom'
>;

const CustomNode = (props: NodeProps<TCustomNode>) => {
    const { data } = props;
    const { id } = data;
    const theme = useTheme();
    const stores = useStores();
    const flowStore = useFlowStore();

    const {
        project, title, description, priority,
    } = flowStore.tasks.find((task) => task.id === id)!;

    const projectName = stores.tasksStore.projects[project].alias;

    const backgroundColor = priority === 'high' ? theme.palette.error.light
        : priority === 'medium' ? theme.palette.primary.light
            : theme.palette.success.light;

    return (
        <Card sx={{ p: 2, display: 'flex', backgroundColor }}>
            <Handle type="target" position={Position.Left} />
            <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                    {projectName}
                </Typography>
                <Typography variant="h6" sx={{ mt: '0 !important' }}>
                    {title}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </Stack>
            <Handle type="source" position={Position.Right} />
        </Card>
    );
};

export default CustomNode;

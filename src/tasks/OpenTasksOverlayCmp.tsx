import { DeleteForever, DragHandle } from '@mui/icons-material';
import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useRef, type ReactElement } from 'react';
import Draggable from 'react-draggable';
import useStores from '../Store';
import { type Task } from '../tasks';

const OpenTasksOverlayCmp = observer((props: { task: Task }): ReactElement => {
    const { task } = props;
    const stores = useStores();

    const nodeRef = useRef(null);

    return (
        <Draggable nodeRef={nodeRef} handle="#draggable-dialog-button" cancel={'[class*="MuiDialogContent-root"]'}>
            <Dialog
                ref={nodeRef}
                sx={{ pointerEvents: 'none' }}
                disablePortal
                disableEnforceFocus
                open
                hideBackdrop
                PaperProps={{ sx: { width: '300px' } }}
            >
                <DialogTitle sx={{ pointerEvents: 'auto' }} display="flex" justifyContent="space-between" alignItems="center">
                    <Box maxWidth="100%" overflow="hidden" sx={{ overflowWrap: 'anywhere' }} textOverflow="ellipsis">
                        {task.title}
                    </Box>
                    <IconButton sx={{ cursor: 'move' }} id="draggable-dialog-button">
                        <DragHandle />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {task.description}
                    <Chip
                        sx={{ maxWidth: 'fit-content' }}
                        color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'primary' : 'success'}
                        label={task.priority}
                    />
                </DialogContent>
                <DialogActions sx={{ pointerEvents: 'auto', justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => {
                            stores.tasksStore.deleteTask(task);
                            stores.tasksStore.closeTask(task);
                        }}
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForever />}
                    >
                        löschen
                    </Button>

                    <Button onClick={() => stores.tasksStore.closeTask(task)}>Schließen</Button>
                </DialogActions>
            </Dialog>
        </Draggable>
    );
});

export default OpenTasksOverlayCmp;

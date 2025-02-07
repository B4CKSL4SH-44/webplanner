import { DeleteForever } from '@mui/icons-material';
import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    Typography,
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
                <DialogTitle id="draggable-dialog-button" sx={{ cursor: 'move', pointerEvents: 'auto', backgroundColor: task.color ?? undefined }} display="flex" justifyContent="space-between" alignItems="center">
                    <Box maxWidth="100%" overflow="hidden" sx={{ overflowWrap: 'anywhere' }} textOverflow="ellipsis">
                        {task.title}
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {task.description.trim() === ''
                        ? <Typography fontStyle="italic">keine Beschreibung</Typography>
                        : <Typography>{task.description}</Typography>}
                    <Chip
                        sx={{ maxWidth: 'fit-content' }}
                        color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'primary' : 'success'}
                        label={task.priority}
                    />
                </DialogContent>
                <DialogActions sx={{ pointerEvents: 'auto', justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => {
                            stores.projectsStore.deleteTask(task);
                            stores.projectsStore.closeTask(task);
                        }}
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForever />}
                    >
                        löschen
                    </Button>

                    <Button onClick={() => stores.projectsStore.closeTask(task)}>Schließen</Button>
                </DialogActions>
            </Dialog>
        </Draggable>
    );
});

export default OpenTasksOverlayCmp;

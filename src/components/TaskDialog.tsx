import { observer } from 'mobx-react';
import type { ReactElement } from 'react';
import { Typography } from '@mui/material';
import CustomDialog from './CustomDialog';
import type { Task } from '../tasks';

const TaskDialog = observer((props: { task: Task, onClose: ()=>void }): ReactElement => {
    const { task, onClose } = props;
    return (
        <CustomDialog
            actionCancel={onClose}
            actionCancelColor="success"
            actionCancelText="test"
            actionConfirm={() => {}}
            actionConfirmColor="error"
            actionConfirmText="abbrechen"
            content={(
                <>
                    {task.description !== '' ? <Typography variant="body1">{task.description}</Typography> : <Typography variant="body1" fontStyle="italic">keine Beschreibung</Typography>}
                    <Typography>test</Typography>
                </>
            )}
            title={task.title}
        />
    );
});

export default TaskDialog;

import { observer } from 'mobx-react';
import { useState, type ReactElement } from 'react';
import { Typography } from '@mui/material';
import CustomDialog from './CustomDialog';
import type { Task } from '../tasks';
import CustomTextField from './CustomTextField';
import useStores from '../Store';

const TaskDialog = observer((props: { task: Task, onClose: ()=>void }): ReactElement => {
    const stores = useStores();
    const { task, onClose } = props;
    const [editTitle, setEditTitle] = useState<boolean>(false);
    const [editDescription, setEditDescription] = useState<boolean>(false);

    const handleSave = (updatedTask: Task) => {
        setEditTitle(false);
        setEditDescription(false);
        stores.tasksStore.updateTask(updatedTask);
    };
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
                    {!editDescription
                        ? <Typography onClick={() => setEditDescription(true)} fontStyle={task.description === '' ? 'italic' : 'inherit'}>{task.description === '' ? 'keine Beschreibung' : task.description}</Typography>
                        : <CustomTextField value={task.description} onCancel={() => setEditDescription(false)} onSave={(v) => handleSave({ ...task, description: v })} />}
                    <Typography>test</Typography>
                </>
            )}
            title={
                !editTitle
                    ? <Typography onClick={() => setEditTitle(true)}>{task.title}</Typography>
                    : <CustomTextField value={task.title} onCancel={() => setEditTitle(false)} onSave={(v) => handleSave({ ...task, title: v })} />
            }

        />
    );
});

export default TaskDialog;

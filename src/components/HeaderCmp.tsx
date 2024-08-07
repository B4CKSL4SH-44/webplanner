import {
    AppBar, Button, IconButton, Toolbar, Typography,
} from '@mui/material';
import { Send, Settings as SettingsIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import type { ReactElement } from 'react';
import useStores from 'Store';

const HeaderCmp = observer((): ReactElement => {
    const stores = useStores();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography sx={{ flexGrow: 1 }}>WebConductor</Typography>
                <Button
                    sx={{ mr: '1rem' }}
                    color="info"
                    size="small"
                    onClick={() => stores.tasksStore.setTaskOverlayState(true)}
                    variant="contained"
                    startIcon={<Send />}
                >
                    Taskify!
                </Button>
                <IconButton
                    edge="end"
                    onClick={() => stores.settingsStore.setSettingsOpen(true)}
                >
                    <SettingsIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
});

export default HeaderCmp;

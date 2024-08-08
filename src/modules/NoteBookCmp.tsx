import {
    Box, Button, Card, IconButton, Tab, Tabs, TextField, Typography, useTheme,
} from '@mui/material';
import { useState, type ReactElement } from 'react';
import {
    Add, Close, NavigateBefore, NavigateNext,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import useStores from '../Store';
import EditorCmp from './EditorCmp';
import type { Notebook } from './NoteBookStore';

const NoteBookCmp = observer((): ReactElement => {
    const stores = useStores();
    const theme = useTheme();

    const [activeNotebook, setActiveNotebook] = useState<string>(stores.noteBookStore.notebooks.find((notebook) => notebook.position === 0)!.id);
    const [newNotebookTitle, setNewNotebookTitle] = useState<string>('');

    const handleAddNotebook = () => {
        stores.noteBookStore.addNotebook(newNotebookTitle);
        setNewNotebookTitle('');
        setActiveNotebook(stores.noteBookStore.notebooks.find((notebook) => notebook.position === stores.noteBookStore.notebooks.length - 1)!.id);
    };

    const moveLeft = (notebookToMoveLeft: Notebook) => {
        const newNotebooks = stores.noteBookStore.notebooks.map((notebook) => {
            if (notebook.position === notebookToMoveLeft.position - 1) {
                return { ...notebook, position: notebookToMoveLeft.position };
            }
            if (notebook.position === notebookToMoveLeft.position) {
                return { ...notebook, position: notebookToMoveLeft.position - 1 };
            }
            return notebook;
        });
        stores.noteBookStore.setNotebooks(newNotebooks);
    };

    const moveRight = (notebookToMoveLeft: Notebook) => {
        const newNotebooks = stores.noteBookStore.notebooks.map((notebook) => {
            if (notebook.position === notebookToMoveLeft.position + 1) {
                return { ...notebook, position: notebookToMoveLeft.position };
            }
            if (notebook.position === notebookToMoveLeft.position) {
                return { ...notebook, position: notebookToMoveLeft.position + 1 };
            }
            return notebook;
        });
        stores.noteBookStore.setNotebooks(newNotebooks);
    };

    return (
        <Box
            sx={{
                padding: '1rem',
                '& .MuiTiptap-FieldContainer-root': {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiTiptap-RichTextContent-root': {
                        flexGrow: 1,
                        '& .ProseMirror': {
                            height: '100%',
                        },
                    },
                },
            }}
            flexGrow={1}
            display="flex"
            flexDirection="column"
        >
            <Box display="flex" height="48px">
                <Tabs value={activeNotebook} onChange={(e, newValue) => setActiveNotebook(newValue)} TabIndicatorProps={{ sx: { display: 'none' } }}>
                    {stores.noteBookStore.notebooks
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((notebook) => {
                            return (
                                <Tab
                                    sx={
                                        activeNotebook === notebook.id
                                            ? {
                                                border: theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : `1px solid ${theme.palette.action.disabled}`,
                                                borderRadius: '12px 12px 0 0',
                                                flexDirection: 'row',
                                            }
                                            : {
                                                backgroundColor: theme.palette.action.disabled,
                                                borderRadius: '12px 12px 0 0',
                                                border: theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : `1px solid ${theme.palette.action.disabled}`,
                                            }
                                    }
                                    label={
                                        activeNotebook === notebook.id ? (
                                            <>
                                                {notebook.position !== 0 && <NavigateBefore onClick={() => moveLeft(notebook)} />}
                                                {notebook.title}
                                                {notebook.position !== stores.noteBookStore.notebooks.length - 1 && <NavigateNext onClick={() => moveRight(notebook)} />}
                                            </>
                                        ) : (
                                            notebook.title
                                        )
                                    }
                                    value={notebook.id}
                                />
                            );
                        })}

                    <Tab sx={{ minHeight: '' }} value="NEWNOTEBOOK" iconPosition="start" icon={<Add />} label="Neues Notebook" />
                </Tabs>
            </Box>
            {stores.noteBookStore.notebooks.map((notebook) => {
                return activeNotebook === notebook.id ? <EditorCmp notebook={notebook} /> : null;
            })}
            {activeNotebook === 'NEWNOTEBOOK' && (
                <Card sx={{
                    p: '1rem', m: '1rem auto', display: 'flex', flexDirection: 'column',
                }}
                >
                    <Typography variant="h4">Neues Notebook</Typography>
                    <TextField
                        value={newNotebookTitle}
                        sx={{ m: '1rem auto' }}
                        autoFocus
                        inputRef={(input) => input?.focus()}
                        onChange={(e) => setNewNotebookTitle(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => setNewNotebookTitle('')}>
                                    <Close />
                                </IconButton>
                            ),
                        }}
                    />
                    <Button disabled={newNotebookTitle.replaceAll(' ', '') === ''} onClick={() => handleAddNotebook()} color="success" variant="contained">
                        Speichern
                    </Button>
                </Card>
            )}
        </Box>
    );
});

export default NoteBookCmp;

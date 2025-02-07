import { type Extension, useEditor } from '@tiptap/react';
import { useState, type ReactElement } from 'react';
import {
    Box, Button, Tooltip, useTheme,
} from '@mui/material';
import {
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonHighlightColor,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonStrikethrough,
    MenuButtonTextColor,
    MenuButtonUnderline,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditorProvider,
    RichTextField,
} from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { DeleteForever, Send } from '@mui/icons-material';
import { observer } from 'mobx-react';
import useStores from '../Store';
import type { Notebook } from './NoteBookStore';
import CustomDialog from '../components/CustomDialog';

interface EditorProps {
    notebook: Notebook;
}

const EditorCmp = observer((props: EditorProps): ReactElement => {
    const { notebook } = props;

    const stores = useStores();
    const theme = useTheme();

    const { notebookSettings } = stores.settingsStore;

    const [deleteNoteBookActive, setDeleteNotebookActive] = useState<boolean>(false);

    const editor = useEditor({
        extensions: [StarterKit as Extension, Color, Underline, TextStyle, Highlight],
        content: notebook.content,
        onUpdate: () => stores.noteBookStore.updateNotebookContent({ ...notebook, content: editor?.getHTML() as string }),
    });
    return (
        <>
            <RichTextEditorProvider editor={editor}>
                <RichTextField
                    controls={(
                        <MenuControlsContainer>
                            {notebookSettings.fontSize && (
                                <>
                                    <MenuSelectHeading />
                                    <MenuDivider />
                                </>
                            )}
                            {notebookSettings.bold && <MenuButtonBold />}
                            {notebookSettings.italic && <MenuButtonItalic />}
                            {notebookSettings.underline && <MenuButtonUnderline />}
                            {notebookSettings.strikeThrough && <MenuButtonStrikethrough />}
                            {(notebookSettings.bold || notebookSettings.italic || notebookSettings.underline || notebookSettings.strikeThrough) && <MenuDivider />}
                            {notebookSettings.textColor && <MenuButtonTextColor defaultTextColor={theme.palette.text.primary} />}
                            {notebookSettings.highlight && <MenuButtonHighlightColor />}
                            {(notebookSettings.textColor || notebookSettings.highlight) && <MenuDivider />}
                            {notebookSettings.sortedList && <MenuButtonOrderedList />}
                            {notebookSettings.unSortedList && <MenuButtonBulletedList />}
                            <Box flexGrow={1} display="flex" justifyContent="flex-end">
                                <Button
                                    onClick={() => stores.projectsStore.setTaskOverlayState(true)}
                                    sx={{ alignSelf: 'flex-end' }}
                                    variant="contained"
                                    startIcon={<Send />}
                                >
                                    Taskify!
                                </Button>
                                {notebookSettings.tabs && (
                                    <Tooltip title="Notebook löschen">
                                        <Button sx={{ ml: '1rem' }} variant="contained" color="error" onClick={() => setDeleteNotebookActive(true)}>
                                            <DeleteForever />
                                        </Button>
                                    </Tooltip>
                                )}
                            </Box>
                        </MenuControlsContainer>
                    )}
                />
            </RichTextEditorProvider>
            {deleteNoteBookActive && (
                <CustomDialog
                    actionCancel={() => setDeleteNotebookActive(false)}
                    actionCancelColor="success"
                    actionCancelText="Abbrechen"
                    actionConfirm={() => stores.noteBookStore.deleteNotebook(notebook)}
                    actionConfirmColor="error"
                    actionConfirmText="Löschen"
                    content="Wollen Sie das Notebook wirklich löschen? Das kann nicht rückgängig gemacht werden."
                    title="Notebook löschen"
                />
            )}
        </>
    );
});
export default EditorCmp;

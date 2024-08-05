import { Send } from '@mui/icons-material';
import { Box, Button, useTheme } from '@mui/material';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
import type { ReactElement } from 'react';
import useStores from 'Store';

const NoteBookCmp = (): ReactElement => {
    const stores = useStores();
    const theme = useTheme();

    const editor = useEditor({
        extensions: [StarterKit, Color, Underline, TextStyle, Highlight],
        content: stores.noteBookStore.content,
        onUpdate: () => stores.noteBookStore.setContent(editor?.getHTML() as string),
    });

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
            <RichTextEditorProvider editor={editor}>
                <RichTextField
                    controls={(
                        <MenuControlsContainer>
                            <MenuSelectHeading />
                            <MenuDivider />
                            <MenuButtonBold />
                            <MenuButtonItalic />
                            <MenuButtonUnderline />
                            <MenuButtonStrikethrough />
                            <MenuDivider />
                            <MenuButtonTextColor
                                defaultTextColor={theme.palette.text.primary}
                            />
                            <MenuButtonHighlightColor />
                            <MenuDivider />
                            <MenuButtonOrderedList />
                            <MenuButtonBulletedList />
                            <Box flexGrow={1} display="flex" justifyContent="flex-end">
                                <Button
                                    onClick={() => stores.tasksStore.setTaskOverlayState(true)}
                                    sx={{ alignSelf: 'flex-end' }}
                                    variant="contained"
                                    startIcon={<Send />}
                                >
                                    Taskify!
                                </Button>
                            </Box>
                        </MenuControlsContainer>
                    )}
                />
            </RichTextEditorProvider>
        </Box>
    );
};

export default NoteBookCmp;

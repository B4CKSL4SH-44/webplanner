import { useEditor } from "@tiptap/react";
import { useState, type ReactElement } from "react";
import { Box, Button, IconButton, Tabs, Tooltip, useTheme } from "@mui/material";
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
} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import useStores from "Store";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { DeleteForever, Send } from "@mui/icons-material";
import type { Notebook } from "./NoteBookStore";
import CustomDialog from "components/CustomDialog";

interface EditorProps {
  notebook: Notebook;
}

const EditorCmp = (props: EditorProps): ReactElement => {
  const stores = useStores();
  const theme = useTheme();

  const [deleteNoteBookActive, setDeleteNotebookActive] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [StarterKit, Color, Underline, TextStyle, Highlight],
    content: props.notebook.content,
    onUpdate: () => stores.noteBookStore.updateNotebookContent({ ...props.notebook, content: editor?.getHTML() as string }),
  });
  return (
    <>
      <RichTextEditorProvider editor={editor}>
        <RichTextField
          controls={
            <MenuControlsContainer>
              <MenuSelectHeading />
              <MenuDivider />
              <MenuButtonBold />
              <MenuButtonItalic />
              <MenuButtonUnderline />
              <MenuButtonStrikethrough />
              <MenuDivider />
              <MenuButtonTextColor defaultTextColor={theme.palette.text.primary} />
              <MenuButtonHighlightColor />
              <MenuDivider />
              <MenuButtonOrderedList />
              <MenuButtonBulletedList />
              <Box flexGrow={1} display={"flex"} justifyContent={"flex-end"}>
                <Button
                  onClick={() => stores.tasksStore.setTaskOverlayState(true)}
                  sx={{ alignSelf: "flex-end" }}
                  variant="contained"
                  startIcon={<Send />}
                >
                  Taskify!
                </Button>
                <Tooltip title="Notebook löschen">
                  <Button sx={{ ml: "1rem" }} variant="contained" color="error" onClick={() => setDeleteNotebookActive(true)}>
                    <DeleteForever />
                  </Button>
                </Tooltip>
              </Box>
            </MenuControlsContainer>
          }
        />
      </RichTextEditorProvider>
      {deleteNoteBookActive && (
        <CustomDialog
          actionCancel={() => setDeleteNotebookActive(false)}
          actionCancelColor="success"
          actionCancelText="Abbrechen"
          actionConfirm={() => stores.noteBookStore.deleteNotebook(props.notebook)}
          actionConfirmColor="error"
          actionConfirmText="Löschen"
          content="Wollen Sie das Notebook wirklich löschen? Das kann nicht rückgängig gemacht werden."
          title="Notebook löschen"
        />
      )}
    </>
  );
};
export default EditorCmp;

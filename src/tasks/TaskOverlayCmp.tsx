import { DragHandle } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputBase,
  InputLabel,
  OutlinedInput,
  Paper,
  RadioGroup,
  TextField,
  type PaperProps,
} from "@mui/material";
import useStores from "Store";
import { observer } from "mobx-react";
import { useState, type ReactElement } from "react";
import Draggable from "react-draggable";

const TaskOverlayCmp = observer((): ReactElement => {
  const stores = useStores();

  const handleClose = (event: any, reason: string) => {
    if (reason && reason === "backdropClick") return;
    stores.tasksStore.setTaskOverlayActive(false);
  };
  function PaperComponent(props: PaperProps) {
    return (
      <Draggable
        handle="#draggable-dialog-button"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper sx={{ pointerEvents: "auto" }} {...props} />
      </Draggable>
    );
  }
  return (
    <Dialog
      sx={{ pointerEvents: "none" }}
      disablePortal
      open={stores.tasksStore.isTaskOverlayActive}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      hideBackdrop
    >
      <DialogTitle
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        New Task
        <IconButton sx={{ cursor: "move" }} id="draggable-dialog-button">
          <DragHandle />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl sx={{ pt: "1rem" }}>
          <TextField label="Titel" />
          <TextField label="Beschreibung" />
          <FormLabel id="input-label-priority">Priority</FormLabel>
          <RadioGroup aria-labelledby="input-label-priority">
            <ButtonGroup>
              <Button size="small" color="error">
                high
              </Button>
              <Button size="small" variant="contained" color="primary">
                medium
              </Button>
              <Button size="small" color="success">
                low
              </Button>
            </ButtonGroup>
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => stores.tasksStore.setTaskOverlayActive(false)}
        >
          Cancel
        </Button>
        <Button
        //onClick={handleClose}
        >
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default TaskOverlayCmp;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  type PaperProps,
} from "@mui/material";
import useStores from "Store";
import { observer } from "mobx-react";
import type { ReactElement } from "react";
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
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }
  return (
    <Dialog
      disablePortal
      open={stores.tasksStore.isTaskOverlayActive}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      hideBackdrop
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        New Task
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
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

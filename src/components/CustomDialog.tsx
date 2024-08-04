import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { ReactElement } from "react";

type ButtonColor = "primary" | "secondary" | "success" | "error" | "info" | "warning";

interface CustomDialogProps {
  title: string;
  content: string;
  actionCancel: () => void;
  actionCancelText: string;
  actionCancelColor: ButtonColor;
  actionConfirm: () => void;
  actionConfirmText: string;
  actionConfirmColor: ButtonColor;
}

const CustomDialog = (props: CustomDialogProps): ReactElement => {
  const { title, content, actionCancel, actionCancelText, actionCancelColor, actionConfirm, actionConfirmColor, actionConfirmText } = props;
  return (
    <Dialog open onClose={actionCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button color={actionCancelColor} onClick={actionCancel}>
          {actionCancelText}
        </Button>
        <Button color={actionConfirmColor} onClick={actionConfirm}>
          {actionConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;

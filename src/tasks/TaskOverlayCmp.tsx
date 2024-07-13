import { DragHandle } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import useStores from "Store";
import { observer } from "mobx-react";
import { useState, type ReactElement } from "react";
import Draggable from "react-draggable";
import { defaultTask, type Relations, type Task } from "tasks";

const TaskOverlayCmp = observer((): ReactElement => {
  const stores = useStores();

  const [task, setTask] = useState<Task>(defaultTask);

  const handleUpdateTask = (key: keyof Task, value: string) => {
    const updatedTask = { ...task, [key]: value };
    setTask(updatedTask);
  };

  const handleClose = (event: any, reason: string) => {
    if (reason && reason === "backdropClick") return;
    stores.tasksStore.setTaskOverlayActive(false);
  };

  const handleSave = () => {
    let newId;
    if (stores.tasksStore.tasks.length === 0) {
      newId = 1;
    } else {
      const sorted = stores.tasksStore.tasks.sort((a, b) => b.id - a.id);
      console.log(sorted);
      newId = sorted[0].id + 1;
    }
    stores.tasksStore.addTask({ ...task, id: newId });
    stores.tasksStore.setTaskOverlayActive(false);
  };

  const handleRelationToggle = (key: keyof Relations) => {
    let updatedTask: Task;
    if (task.relations[key] === false) {
      updatedTask = { ...task, relations: { ...task.relations, [key]: [] } };
    } else {
      updatedTask = { ...task, relations: { ...task.relations, [key]: false } };
    }
    setTask(updatedTask);
  };

  const handleRelationAdd = (key: keyof Relations, idList: number[] | string) => {
    if (task.relations[key] === false) return;
    if (typeof idList === "string") return;
    const updatedTask: Task = { ...task, relations: { ...task.relations, [key]: [...idList] } };
    setTask(updatedTask);
  };

  return (
    <Draggable handle="#draggable-dialog-button" cancel={'[class*="MuiDialogContent-root"]'}>
      <Dialog
        sx={{ pointerEvents: "none" }}
        disablePortal
        disableEnforceFocus
        open={stores.tasksStore.isTaskOverlayActive}
        onClose={handleClose}
        hideBackdrop
        PaperProps={{ sx: { maxWidth: "300px" } }}
      >
        <DialogTitle sx={{ pointerEvents: "auto" }} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          New Task
          <IconButton sx={{ cursor: "move" }} id="draggable-dialog-button">
            <DragHandle />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pointerEvents: "auto" }}>
          <FormControl sx={{ p: "1rem" }}>
            <TextField
              required
              sx={{ mb: "1rem" }}
              value={task.title}
              onChange={(e) => handleUpdateTask("title", e.target.value)}
              label="Titel (Pflichtfeld)"
            />
            <TextField
              sx={{ mb: "1rem" }}
              value={task.description}
              onChange={(e) => handleUpdateTask("description", e.target.value)}
              label="Beschreibung"
              multiline
            />
            <FormLabel id="input-label-priority">Priority</FormLabel>
            <RadioGroup sx={{ mb: "1rem" }} aria-labelledby="input-label-priority">
              <ButtonGroup>
                <Button
                  onClick={() => handleUpdateTask("priority", "high")}
                  variant={task.priority === "high" ? "contained" : "outlined"}
                  size="small"
                  color="error"
                >
                  high
                </Button>
                <Button
                  onClick={() => handleUpdateTask("priority", "medium")}
                  size="small"
                  variant={task.priority === "medium" ? "contained" : "outlined"}
                  color="primary"
                >
                  medium
                </Button>
                <Button
                  onClick={() => handleUpdateTask("priority", "low")}
                  variant={task.priority === "low" ? "contained" : "outlined"}
                  size="small"
                  color="success"
                >
                  low
                </Button>
              </ButtonGroup>
            </RadioGroup>
            <List>
              <ListItemButton onClick={() => handleRelationToggle("blocks")}>
                <Checkbox checked={task.relations.blocks !== false} />
                <ListItemText>blockiert</ListItemText>
              </ListItemButton>
              {task.relations.blocks !== false && (
                <Select
                  size="small"
                  fullWidth
                  sx={{ flexGrow: 1 }}
                  onChange={(e) => handleRelationAdd("blocks", e.target.value)}
                  renderValue={(selected) => {
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "300px" }}>
                        {stores.tasksStore.tasks
                          .filter((storeTask) => selected.includes(storeTask.id))
                          .map((storeTask) => (
                            <Tooltip title={storeTask.title}>
                              <Chip sx={{ maxWidth: "100px" }} key={storeTask.id} label={`#${storeTask.id}: ${storeTask.title}`} />
                            </Tooltip>
                          ))}
                      </Box>
                    );
                  }}
                  multiple
                  value={task.relations.blocks}
                >
                  {stores.tasksStore.tasks.map((storeTask) => {
                    return (
                      <MenuItem sx={{ maxWidth: "320px" }} key={storeTask.id} value={storeTask.id}>
                        <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{storeTask.title}</Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </List>
            {/* <Accordion square disableGutters>
              <AccordionSummary expandIcon={<ExpandMore />}>Relationen</AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  <ListItem>
                    <ListItemButton sx={{ flexGrow: 0 }} dense disableGutters onClick={() => handleRelationToggle("blocks")}>
                      <ListItemIcon>
                        <Checkbox checked={task.relations.blocks !== false} />
                      </ListItemIcon>
                    </ListItemButton>

                    {task.relations.blocks === false ? (
                      <ListItemText>blockiert</ListItemText>
                    ) : (
                      <>
                        <Select
                          size="small"
                          label="blockiert"
                          fullWidth
                          sx={{ flexGrow: 1 }}
                          onChange={(e) => handleRelationAdd("blocks", Number(e.target.value))}
                          renderValue={(selected) => {
                            return (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {stores.tasksStore.tasks
                                  .filter((storeTask) => selected.includes(storeTask.id))
                                  .map((storeTask) => (
                                    <Chip key={storeTask.id} label={storeTask.id} />
                                  ))}
                              </Box>
                            );
                          }}
                          multiple
                          value={task.relations.blocks}
                        >
                          {stores.tasksStore.tasks.map((storeTask) => {
                            return (
                              <MenuItem key={storeTask.id} value={storeTask.id}>
                                {storeTask.title}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </>
                    )}
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion> */}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pointerEvents: "auto" }}>
          <Button onClick={() => stores.tasksStore.setTaskOverlayActive(false)}>Cancel</Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogActions>
      </Dialog>
    </Draggable>
  );
});

export default TaskOverlayCmp;

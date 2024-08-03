import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import useStores from "Store";
import { observer } from "mobx-react";
import type { ReactElement } from "react";

const TodoCmp = observer((): ReactElement => {
  const stores = useStores();

  const handleToggle = (id: number) => {
    const taskToUpdate = stores.tasksStore.projects[
      stores.settingsStore.todoProject
    ].tasks.find((task) => task.id === id);
    if (taskToUpdate !== undefined) {
      taskToUpdate.state = taskToUpdate.state === "closed" ? "open" : "closed";
      stores.tasksStore.updateTask(taskToUpdate);
    }
  };

  return (
    <Box
      sx={{
        padding: "1rem",
      }}
      flexGrow={1}
      minHeight={0}
      display={"flex"}
      flexDirection={"column"}
    >
      <Toolbar>
        <FormControl>
          <InputLabel id="select-project-label">Projekt auswählen</InputLabel>
          <Select
            sx={{ mr: "1rem", width: "400px" }}
            labelId="select-project-label"
            value={stores.settingsStore.todoProject}
            label="Projekt auswählen"
            onChange={(e) =>
              stores.settingsStore.setTodoProject(Number(e.target.value))
            }
          >
            {Object.keys(stores.tasksStore.projects).map((projectStringId) => {
              const project = {
                ...stores.tasksStore.projects[Number(projectStringId)],
              };
              return (
                <MenuItem key={projectStringId} value={project.id}>
                  <ListItemText>{project.alias}</ListItemText>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          onClick={() => stores.tasksStore.setNewProjectOverlayActive(true)}
          variant="contained"
          color="success"
          startIcon={<Add />}
        >
          Projekt hinzufügen
        </Button>
      </Toolbar>
      <Divider sx={{ m: "1rem 0" }} />
      <Box
        flexGrow={1}
        minHeight={0}
        overflow={"auto"}
        sx={{ border: "1px solid rgba(0, 0, 0, 0.12)", padding: "4px" }}
      >
        <List>
          {stores.tasksStore.projects[stores.settingsStore.todoProject].tasks
            .length === 0 && (
            <Typography fontStyle={"italic"}>Keine offenen Todos</Typography>
          )}
          {stores.tasksStore.projects[
            stores.settingsStore.todoProject
          ].tasks.map((task) => {
            return (
              <ListItem sx={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <ListItemButton onClick={() => handleToggle(task.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={task.state === "closed"}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={task.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
});

export default TodoCmp;

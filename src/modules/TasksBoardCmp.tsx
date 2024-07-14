import { Add, OpenInNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  useTheme,
} from "@mui/material";
import { observer } from "mobx-react";
import { useState, type ReactElement } from "react";
import useStores from "Store";
import type { Task } from "tasks";

const TasksBoardCmp = observer((): ReactElement => {
  const stores = useStores();
  const theme = useTheme();

  const [activeProjects, setActiveProjects] = useState<string[]>(["personal"]);
  const [orderBy, setOrderBy] = useState<keyof Task>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleOpenTask = (newTask: Task) => {
    if (stores.tasksStore.openTasks.some((task) => task.id === newTask.id)) return;
    stores.tasksStore.setOpenTasks([...stores.tasksStore.openTasks, newTask]);
  };

  return (
    <Box
      sx={{
        padding: "1rem",
      }}
      flexGrow={1}
      display={"flex"}
      flexDirection={"column"}
    >
      <Toolbar>
        <FormControl>
          <InputLabel id="select-project-label">Projekte auswählen</InputLabel>
          <Select
            sx={{ width: "300px", mr: "1rem" }}
            labelId="select-project-label"
            value={activeProjects}
            label="Projekte auswählen"
            multiple
            onChange={(e) => console.log(e.target.value)}
          >
            {Object.keys(stores.tasksStore.projects).map((projectName) => {
              return (
                <MenuItem key={projectName} defaultChecked={projectName === "personal"} value={projectName}>
                  {projectName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button variant="contained" color="success" startIcon={<Add />}>
          Projekt hinzufügen
        </Button>
      </Toolbar>
      <Divider sx={{ m: "1rem 0" }} />
      {stores.tasksStore.projects.personal.length === 0 ? (
        <Box>Keine Tasks</Box>
      ) : (
        <Table
          sx={{
            border: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <TableHead
            sx={{
              "& .MuiTableRow-head": { backgroundColor: theme.palette.primary.light },
            }}
          >
            <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: theme.typography.fontWeightBold } }}>
              <TableCell colSpan={4}>Eigene Tasks</TableCell>
            </TableRow>
            <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: theme.typography.fontWeightBold } }}>
              <TableCell>ID</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Beschreibung</TableCell>
              <TableCell sortDirection={"asc"}>
                <TableSortLabel active={orderBy === "priority"}>Priorität</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.tasksStore.projects.personal.map((task) => {
              return (
                <TableRow hover role="button" key={`tableRow-${task.id}`}>
                  <TableCell>
                    {task.id}
                    <IconButton
                      disabled={stores.tasksStore.openTasks.some((openTask) => openTask.id === task.id)}
                      onClick={() => handleOpenTask(task)}
                    >
                      <OpenInNew />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "wrap", overflowWrap: "anywhere" }}>{task.title}</TableCell>
                  <TableCell sx={{ fontStyle: task.description.length === 0 ? "italic" : "inherit" }}>
                    {task.description.length === 0 ? "(keine)" : task.description}
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{ maxWidth: "fit-content" }}
                      color={task.priority === "high" ? "error" : task.priority === "medium" ? "primary" : "success"}
                      label={task.priority}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Box>
  );
});
export default TasksBoardCmp;

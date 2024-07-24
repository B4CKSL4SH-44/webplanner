import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Add, Check, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState, type ReactElement } from "react";
import useStores from "Store";

const KanbanCmp = observer((): ReactElement => {
  const stores = useStores();

  const [isAddBoardActive, setIsAddBoardActive] = useState<boolean>(false);
  const [newBoardTitle, setNewBoardTitle] = useState<string>("");

  const [orders, setOrders] = useState<{ [boardId: number]: number[] }>({});
  const [isDragging, setIsDragging] = useState<number | undefined>(undefined);

  const handleDrop = (e: DropResult) => {
    console.log(e);
    setIsDragging(undefined);
    const taskId = Number(e.draggableId);
    const boardId = Number(e.destination?.droppableId);
    const originalTask = project.tasks.find((task) => task.id === taskId);
    if (originalTask !== undefined) {
      originalTask.board = boardId;
      stores.tasksStore.updateTask(originalTask);
    }
  };

  const handleNewBoard = () => {
    setIsAddBoardActive(false);
    stores.tasksStore.addBoard(stores.tasksStore.projects[stores.settingsStore.kanbanProject], newBoardTitle);
  };

  const project = stores.tasksStore.projects[stores.settingsStore.kanbanProject];
  useEffect(() => {
    Object.keys(project.boards).forEach((key) => {
      const board = project.boards[Number(key)];
      if (orders[Number(key)] === undefined) {
        setOrders({ ...orders, [Number(key)]: project.tasks.filter((task) => task.board === Number(key)).map((task, index) => index) });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores.tasksStore.projects]);

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
            value={stores.settingsStore.kanbanProject}
            label="Projekte auswählen"
            onChange={(e) => stores.settingsStore.setKanbanProject(Number(e.target.value))}
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
        <Button onClick={() => stores.tasksStore.setNewProjectOverlayActive(true)} variant="contained" color="success" startIcon={<Add />}>
          Projekt hinzufügen
        </Button>
        {isAddBoardActive ? (
          <Box sx={{ ml: "1rem" }}>
            <TextField
              autoFocus
              onChange={(e) => setNewBoardTitle(e.target.value)}
              InputProps={{
                endAdornment: (
                  <ButtonGroup>
                    <IconButton disabled={newBoardTitle === ""} onClick={() => handleNewBoard()}>
                      <Check />
                    </IconButton>
                    <IconButton onClick={() => setIsAddBoardActive(false)}>
                      <Close />
                    </IconButton>
                  </ButtonGroup>
                ),
              }}
            />
          </Box>
        ) : (
          <Button onClick={() => setIsAddBoardActive(true)} sx={{ ml: "1rem" }} startIcon={<Add />} variant="contained" color="info">
            Board hinzufügen
          </Button>
        )}
      </Toolbar>
      <Divider sx={{ m: "1rem 0" }} />
      <Box sx={{ border: "1px solid rgba(0, 0, 0, 0.12)", padding: "4px", display: "flex", flexGrow: 1 }}>
        <DragDropContext onDragEnd={(e) => handleDrop(e)}>
          {Object.keys(project.boards).map((key) => {
            const board = project.boards[Number(key)];
            return (
              <Droppable key={key + board} droppableId={key}>
                {(droppableProvided) => (
                  <Paper
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                    sx={{ height: "100%", width: "200px", mx: "0.5rem", p: "0.5rem" }}
                  >
                    <Typography>{board}</Typography>
                    <Divider />
                    {project.tasks
                      .filter((task) => task.board === Number(key))
                      .map((task, index) => {
                        return (
                          <Draggable index={index} key={task.id + task.title} draggableId={task.id.toString()}>
                            {(draggableProvided) => (
                              <Card
                                elevation={2}
                                {...draggableProvided.dragHandleProps}
                                {...draggableProvided.draggableProps}
                                ref={draggableProvided.innerRef}
                                sx={{ my: "1rem", p: "0.5rem" }}
                              >
                                <Typography variant="h6">{task.title}</Typography>
                                <Typography variant="body1">{task.description !== "" ? task.description : "Keine Beschreibung"}</Typography>
                                <Chip
                                  sx={{ maxWidth: "fit-content" }}
                                  color={task.priority === "high" ? "error" : task.priority === "medium" ? "primary" : "success"}
                                  label={task.priority}
                                />
                              </Card>
                            )}
                          </Draggable>
                        );
                      })}
                    {droppableProvided.placeholder}
                  </Paper>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </Box>
    </Box>
  );
});

export default KanbanCmp;

import "./App.css";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import NoteBookCmp from "./components/NoteBookCmp";
import { useState } from "react";

type Modules = "notebook" | "tasks" | "kanban" | "flow";

function App() {
  const [value, setValue] = useState<Modules>("notebook");
  const handleChange = (e: React.SyntheticEvent, newValue: Modules) => {
    setValue(newValue);
  };
  return (
    <Box height={"100%"} width={"100%"}>
      <Box display={"flex"}>
        <Typography>WebPlanner</Typography>
      </Box>
      <Box>
        <Tabs onChange={handleChange} variant="fullWidth">
          <Tab value={"notebook"} label="Notebook" />
          <Tab value={"tasks"} label="Tasks" />
          <Tab value={"kanban"} label="Kanban" />
          <Tab value={"flow"} label="Flow" />
        </Tabs>
        {value === "notebook" && <NoteBookCmp />}
      </Box>
    </Box>
  );
}

export default App;

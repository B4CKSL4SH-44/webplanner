import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import { Alert, Box, IconButton, Snackbar, Typography } from "@mui/material";
import useStores from "Store";
import { observer } from "mobx-react";
import { useEffect, useState, type ReactElement } from "react";

const TaskTimerCmp = observer((): ReactElement => {
  const stores = useStores();

  const [time, setTime] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    if (pause) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pause]);

  const getTimeString = (): string => {
    const hours = Math.floor((time / (60 * 60)) % 24);
    const minutes = Math.floor((time / 60) % 60);
    const seconds = Math.floor(time % 60);
    const hoursValue = hours < 10 ? "0" + hours : hours;
    const minutesValue = minutes < 10 ? "0" + minutes : minutes;
    const secondsValue = seconds < 10 ? "0" + seconds : seconds;
    return `${hoursValue}:${minutesValue}:${secondsValue}`;
  };

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ "& .MuiPaper-root": { alignItems: "center" } }}
    >
      <Alert
        severity="info"
        sx={{ "& .MuiAlert-message": { display: "flex" } }}
      >
        <Box>
          <Typography>Timer: {stores.tasksStore.taskTimer?.title}</Typography>
          <Typography>{getTimeString()}</Typography>
        </Box>
        {pause ? (
          <IconButton onClick={() => setPause(false)}>
            <PlayArrow />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              setPause(true);
            }}
          >
            <Pause />
          </IconButton>
        )}
        <IconButton onClick={() => stores.tasksStore.setTaskTimer(null)}>
          <Stop />
        </IconButton>
      </Alert>
    </Snackbar>
  );
});
export default TaskTimerCmp;

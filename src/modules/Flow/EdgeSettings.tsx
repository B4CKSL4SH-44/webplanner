const EdgeSettings = () => {
    return (
        <div style={{
            position: 'absolute',
        }}
        >
            TODO
        </div>
    );
    /* const theme = useTheme();
    const { tasksStore } = useStores();
    const {
        activeProject,
        setActiveProject,
        edgeType,
        setEdgeType,
    } = useFlowStore();

    return (
        <Stack
            direction="row"
            m={1}
            spacing={1}
            sx={{
                position: 'absolute',
                zIndex: theme.zIndex.fab,
            }}
        >
            <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="label">Beziehung</InputLabel>
                <Select
                    label="Beziehung"
                    labelId="label"
                    value={edgeType}
                    onChange={(e) => setEdgeType(e.target.value)}
                    autoWidth
                    sx={{ backgroundColor: theme.palette.background.paper }}
                >
                    <MenuItem value="blockiert">blockiert</MenuItem>
                    <MenuItem value="Beziehung mit">Beziehung mit</MenuItem>
                    <MenuItem value="Vorgänger von">Vorgänger von</MenuItem>
                    <MenuItem value="Nachfolger von">Nachfolger von</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="select-project-label">Projekte auswählen</InputLabel>
                <Select
                    labelId="select-project-label"
                    value={activeProject}
                    label="Projekte auswählen"
                    autoWidth
                    onChange={(e) => setActiveProject(Number(e.target.value))}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                >
                    {Object.keys(tasksStore.projects).map((projectStringId) => {
                        const project = {
                            ...tasksStore.projects[Number(projectStringId)],
                        };
                        return (
                            <MenuItem key={projectStringId} value={project.id}>
                                {project.alias}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Stack>
    ); */
};

export default EdgeSettings;

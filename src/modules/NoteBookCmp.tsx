import { Box, TextField, Typography } from '@mui/material';

const NoteBookCmp = () => {
    return (
        <Box height="100%">
            <Typography>Notebook</Typography>
            <TextField sx={{ height: '100%', width: '100%' }} />
        </Box>
    );
};

export default NoteBookCmp;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
<<<<<<< HEAD
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const theme = createTheme({
    palette: {
        mode: 'light',
    },
});

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
);
=======
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
>>>>>>> origin/develop

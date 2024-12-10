import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Signup from './components/Singnup';
import SignIn from './components/Signin';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface AuthAppProps {
 initialEntries?: string[];
 setLoginState?: (isSignedIn: boolean, isAdmin: boolean) => void;
}

const AuthApp = ({ setLoginState, initialEntries = ['/auth/signin'] }: AuthAppProps) => {
  console.log('AuthApp Props:', { setLoginState }); // Debugging log
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/auth/signin" element={<SignIn setLoginState={setLoginState}/>} />
        <Route path="/auth/signup" element={<Signup setLoginState={setLoginState}/>} />
        <Route path="/" element={<Navigate to="/auth/signin" replace />} />
        {/* Catch-all for undefined routes */}
        {/* <Route path="*" element={<Navigate to="/auth/signin" replace />} /> */}
      </Routes>
    </ThemeProvider>
  );
};

export default AuthApp;

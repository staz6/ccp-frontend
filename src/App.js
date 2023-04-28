import { useEffect } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SnackbarProvider } from 'notistack';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';
import CustomLoadingAnimation from './components/CustomLoadingAnimation';

// ----------------------------------------------------------------------

export default function App() {
  const { currentUser,getCurrentUser,loading } = useAuth();
  const isAuth = currentUser
  useEffect(() => {
    getCurrentUser()
  },[])
  return (
    <HelmetProvider>
      <BrowserRouter>
        <SnackbarProvider autoHideDuration={1000} variant='success'>
        <ThemeProvider>
          <ScrollToTop />
          <CustomLoadingAnimation isLoading={loading}/>
          <StyledChart />
          {
            currentUser === null ? <Loader/> : <Router isAuth={isAuth}/> 
          }
        </ThemeProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

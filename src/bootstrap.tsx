import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, BrowserRouter, useLocation } from 'react-router-dom';
import AuthApp from './AuthApp'

interface MountOptions {
    onNavigate?: (location: { pathname: string }) => void;
    defaultHistory?: 'browser' | 'memory';
    initialPath?: string;
    setLoginState?: (isSignedIn: boolean, isAdmin: boolean) => void;
  }

  const MountComponent: React.FC<{
    setLoginState?: (isSignedIn: boolean, isAdmin: boolean) => void;
    onNavigate?: (location: { pathname: string }) => void;
  }> = ({ setLoginState, onNavigate }) => {
    const location = useLocation();
  
    React.useEffect(() => {
      if (onNavigate) {
        onNavigate({ pathname: location.pathname });
      }
    }, [location, onNavigate]);
  
    return <AuthApp setLoginState={setLoginState} />;
  };

const mount = (
  el: HTMLElement,
  { setLoginState, onNavigate, defaultHistory = 'memory', initialPath = '/auth/signin' }: MountOptions
) => {
  const RouterComponent =
    defaultHistory === 'browser' ? (
      <BrowserRouter>
        <MountComponent setLoginState={setLoginState} onNavigate={onNavigate} />
      </BrowserRouter>
    ) : (
      <MemoryRouter initialEntries={[initialPath]}>
        <MountComponent setLoginState={setLoginState} onNavigate={onNavigate} />
      </MemoryRouter>
    );

    
    const root = ReactDOM.createRoot(el)

    root.render(
    <React.StrictMode>
       {RouterComponent}
    </React.StrictMode>
    );

    return {
        onParentNavigate({ pathname: nextPathname }: { pathname: string }) {
          if (onNavigate && nextPathname) {
            onNavigate({ pathname: nextPathname });
          }
        },
    };
}

if (process.env.NODE_ENV === 'development'){
    const devRoot = document.getElementById('root');

    if (devRoot){
        mount(devRoot, {defaultHistory: 'browser'});
    }
}

export default mount;

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import {RouterProvider} from '@tanstack/react-router';
import {router} from './router.ts';
import {DataProvider} from './contexts/DataContext.tsx';
import {ToastProvider} from './lib/toast.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <DataProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </DataProvider>
    </HelmetProvider>
  </StrictMode>,
);

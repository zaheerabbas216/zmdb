import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ShelvesProvider } from './context/ShelvesContext';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <ToastProvider>
      <ShelvesProvider>
        <RouterProvider router={router} />
      </ShelvesProvider>
    </ToastProvider>
  );
}

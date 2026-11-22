import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { PlannerPage } from './pages/PlannerPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'biblioteca', element: <LibraryPage /> },
    ],
  },
  // Planner is full-screen (no bottom nav), like in the designs.
  { path: 'dias/:serviceId', element: <PlannerPage /> },
]);

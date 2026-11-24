import React, { lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { SkeletonGrid } from './components/Skeleton';

// Code-split routes with React.lazy
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Search = lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })));
const Shelves = lazy(() => import('./pages/Shelves').then((m) => ({ default: m.Shelves })));
const ShelfDetail = lazy(() => import('./pages/ShelfDetail').then((m) => ({ default: m.ShelfDetail })));
const TitleDetails = lazy(() => import('./pages/TitleDetails').then((m) => ({ default: m.TitleDetails })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="section">
      <div className="container">
        <SkeletonGrid count={8} />
      </div>
    </div>
  );
}

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Search />
          </Suspense>
        ),
      },
      {
        path: 'shelves',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Shelves />
          </Suspense>
        ),
      },
      {
        path: 'shelves/:shelfId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ShelfDetail />
          </Suspense>
        ),
      },
      {
        path: 'title/:imdbID',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TitleDetails />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
];

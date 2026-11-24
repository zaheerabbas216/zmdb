import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="site-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

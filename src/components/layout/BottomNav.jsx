import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Bookmark } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
        end
      >
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Search size={22} />
        <span>Search</span>
      </NavLink>

      <NavLink
        to="/shelves"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Bookmark size={22} />
        <span>Shelves</span>
      </NavLink>
    </nav>
  );
}

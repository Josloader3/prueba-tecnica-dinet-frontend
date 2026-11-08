import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Layers, TableProperties } from 'lucide-react';

export default function AppNavbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-zinc-900">
                Solicitudes
              </span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                location.pathname === '/' || location.pathname === '/solicitudes'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <TableProperties className="h-3.5 w-3.5" />
              Lista de Solicitudes
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/solicitudes/nueva"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva Solicitud
          </Link>
        </div>
      </div>
    </header>
  );
}
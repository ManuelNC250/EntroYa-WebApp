import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  const links = isAdmin ? [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/usuarios', label: 'Usuarios' },
    { path: '/admin/justificantes', label: 'Justificantes' },
    { path: '/admin/horarios', label: 'Horarios' },
    { path: '/admin/nominas', label: 'Nominas' },
  ] : [
    { path: '/worker/dashboard', label: 'Mi Panel' },
    { path: '/worker/historial', label: 'Historial' },
    { path: '/worker/justificantes', label: 'Justificantes' },
    { path: '/worker/horarios', label: 'Horarios' },
    { path: '/worker/nominas', label: 'Nominas' },
  ];

  return (
      <nav style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #1d4ed8 100%)',
        boxShadow: '0 4px 20px rgba(30,64,175,0.3)',
        minHeight: '64px', display: 'flex', alignItems: 'center',
        position: 'relative', zIndex: 100,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

          <Link
              to={isAdmin ? '/admin/dashboard' : '/worker/dashboard'}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', fontWeight: '700', fontSize: '1.3rem', flexShrink: 0 }}
          >
            🏢 EntroYa
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {links.map(link => (
                <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.8)',
                      textDecoration: 'none', fontWeight: isActive(link.path) ? '600' : '500',
                      fontSize: '0.875rem', padding: '7px 13px', borderRadius: '8px',
                      background: isActive(link.path) ? 'rgba(255,255,255,0.18)' : 'transparent',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={e => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                      }
                    }}
                >
                  {link.label}
                </Link>
            ))}
          </div>

          {/* User menu con ref para detectar clicks fuera */}
          <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: open ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px',
                  padding: '6px 12px 6px 8px', cursor: 'pointer', color: '#fff',
                  transition: 'background 150ms',
                }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: '700',
              }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {user?.nombre?.split(' ')[0]}
            </span>
              <span style={{
                fontSize: '0.65rem', fontWeight: '600', padding: '2px 7px',
                borderRadius: '999px', background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
              {user?.rol}
            </span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{open ? '▴' : '▾'}</span>
            </button>

            {open && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff', borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 40px rgba(15,23,42,0.18)',
                  minWidth: '210px', zIndex: 9999, overflow: 'hidden',
                }}>
                  <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{user?.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{user?.email}</div>
                  </div>
                  <div style={{ padding: '6px' }}>
                    <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpen(false);
                          logout();
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 12px',
                          background: 'transparent', border: 'none', borderRadius: '7px',
                          cursor: 'pointer', fontSize: '0.875rem', color: '#ef4444',
                          fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px',
                          fontFamily: 'inherit', transition: 'background 150ms',
                        }}
                    >
                      🚪 Cerrar sesion
                    </button>
                  </div>
                </div>
            )}
          </div>

        </div>
      </nav>
  );
};

export default Navbar;
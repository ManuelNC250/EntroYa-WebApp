import React from 'react';
import toast from 'react-hot-toast';

const baseStyle = {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.875rem',
    borderRadius: '10px',
    background: '#fff',
    color: '#1e293b',
    boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
    border: '1px solid #e2e8f0',
    padding: '12px 16px',
};

export const notify = {
    success: (msg) => toast.success(msg, {
        style: { ...baseStyle, borderLeft: '3px solid #10b981' },
        iconTheme: { primary: '#10b981', secondary: '#fff' },
        duration: 3000,
    }),

    error: (msg) => toast.error(msg, {
        style: { ...baseStyle, borderLeft: '3px solid #ef4444' },
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
        duration: 4000,
    }),

    loading: (msg) => toast.loading(msg, {
        style: { ...baseStyle, borderLeft: '3px solid #2563eb' },
        iconTheme: { primary: '#2563eb', secondary: '#fff' },
    }),

    info: (msg) => toast(msg, {
        icon: 'ℹ️',
        style: { ...baseStyle, borderLeft: '3px solid #06b6d4' },
        duration: 3000,
    }),

    dismiss: (id) => toast.dismiss(id),
    dismissAll: () => toast.dismiss(),
};

export const confirmToast = (message, onConfirm) => {
    toast(
        (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b', lineHeight: 1.4 }}>
          {message}
        </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => { toast.dismiss(t.id); onConfirm(); }}
                        style={{
                            flex: 1, padding: '7px 14px', background: '#ef4444', color: '#fff',
                            border: 'none', borderRadius: '7px', fontSize: '0.8125rem',
                            fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{
                            flex: 1, padding: '7px 14px', background: '#f1f5f9', color: '#475569',
                            border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '0.8125rem',
                            fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ),
        {
            duration: Infinity,
            style: { ...baseStyle, padding: '16px' },
        }
    );
};

export const promptToast = (message, onSubmit) => {
    let value = '';
    toast(
        (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '260px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>
          {message}
        </span>
                <input
                    autoFocus
                    onChange={(e) => { value = e.target.value; }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && value.trim()) {
                            toast.dismiss(t.id);
                            onSubmit(value.trim());
                        }
                    }}
                    style={{
                        padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '7px',
                        fontSize: '0.875rem', outline: 'none', width: '100%',
                        fontFamily: 'DM Sans, sans-serif', color: '#1e293b',
                    }}
                    placeholder="Escribe aqui..."
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => {
                            if (value.trim()) { toast.dismiss(t.id); onSubmit(value.trim()); }
                        }}
                        style={{
                            flex: 1, padding: '7px 14px', background: '#2563eb', color: '#fff',
                            border: 'none', borderRadius: '7px', fontSize: '0.8125rem',
                            fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        Enviar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{
                            padding: '7px 14px', background: '#f1f5f9', color: '#475569',
                            border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '0.8125rem',
                            fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ),
        {
            duration: Infinity,
            style: { ...baseStyle, padding: '16px' },
        }
    );
};
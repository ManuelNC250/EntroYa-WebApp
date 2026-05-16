import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ show, onClose, title, children, footer }) => {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9000,
                background: 'rgba(15,23,42,0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div style={{
                background: '#fff', borderRadius: '16px',
                boxShadow: '0 25px 60px rgba(15,23,42,0.3)',
                width: '100%', maxWidth: '520px',
                maxHeight: '90vh', overflowY: 'auto',
                border: '1px solid #e2e8f0',
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc', borderRadius: '16px 16px 0 0',
                }}>
                    <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#1e293b' }}>
                        {title}
                    </h5>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', fontSize: '1.1rem',
                            cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: '2px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#475569'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    {children}
                </div>

                {footer && (
                    <div style={{
                        padding: '16px 24px', borderTop: '1px solid #f1f5f9',
                        background: '#f8fafc', borderRadius: '0 0 16px 16px',
                        display: 'flex', justifyContent: 'flex-end', gap: '10px',
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
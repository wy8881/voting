import React from 'react';
import '../styles/ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default' }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                {title && <h3 className="confirm-dialog-title">{title}</h3>}
                <p className="confirm-dialog-message">{message}</p>
                <div className="confirm-dialog-buttons">
                    <button
                        className={`button confirm-dialog-button confirm-dialog-cancel`}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`button confirm-dialog-button confirm-dialog-confirm confirm-dialog-${variant}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;


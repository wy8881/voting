import { createRoot } from 'react-dom/client';
import ConfirmDialog from '../components/ConfirmDialog';

let root = null;
let container = null;

const createContainer = () => {
    if (!container) {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    }
    return { container, root };
};

const removeContainer = () => {
    if (container && root) {
        root.unmount();
        document.body.removeChild(container);
        container = null;
        root = null;
    }
};

export const confirm = (options = {}) => {
    return new Promise((resolve) => {
        const { root } = createContainer();
        
        const handleConfirm = () => {
            removeContainer();
            resolve(true);
        };
        
        const handleCancel = () => {
            removeContainer();
            resolve(false);
        };
        
        root.render(
            <ConfirmDialog
                isOpen={true}
                title={options.title || 'Confirm'}
                message={options.message || 'Are you sure?'}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                confirmText={options.confirmText || 'Confirm'}
                cancelText={options.cancelText || 'Cancel'}
                variant={options.variant || 'default'}
            />
        );
    });
};


import React from 'react';
import styles from './MessagePreview.module.css';

interface MessagePreviewProps {
    message: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ message }) => {
    return (
        <div className={styles.previewContainer}>
            <h3>Vista Previa del Mensaje</h3>
            <p className={styles.previewMessage}>
                {message || 'Selecciona una plantilla para ver la vista previa.'}
            </p>
        </div>
    );
};

export default MessagePreview;

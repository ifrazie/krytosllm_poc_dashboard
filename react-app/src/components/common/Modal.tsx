import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  ariaDescribedBy?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '800px',
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  ariaDescribedBy
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal when it opens
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Handle click outside to close
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className={`${styles.modal} ${styles.active}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={ariaDescribedBy}
    >
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${className}`}
        style={{ maxWidth }}
        tabIndex={-1}
      >
        {title && (
          <div className={styles.modalHeader}>
            <h2 id="modal-title" className={styles.modalTitle}>
              {title}
            </h2>
            <button
              className={styles.modalClose}
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        )}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal in a portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};

export default Modal;
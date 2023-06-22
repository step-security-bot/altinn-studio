import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import classes from './Modal.module.css';
interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  shouldCloseOnOverlay?: boolean;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  shouldCloseOnOverlay,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
    },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      console.log(!modalRef.current.contains(event.target as Node));
      if (
        shouldCloseOnOverlay &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose && onClose();
      }
    },
    [shouldCloseOnOverlay, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleEscapeKey, handleClickOutside]);

  if (!isOpen) {
    return null;
  }

  return (
    <div id='modal' className={classes.modal}>
      <div className={classes.modalContent} ref={modalRef}>
        {children}
      </div>
    </div>
  );
};

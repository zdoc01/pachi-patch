import { useRef, MouseEvent, useEffect, PropsWithChildren } from 'react';

import styles from '../styles/Modal.module.css';

interface ModalProps extends PropsWithChildren {
  onClose: () => void;
  title: string;
}

export const Modal = ({ children, onClose, title }: ModalProps) => {
  const modalRef = useRef(null);

  const handleModalClick = (event: MouseEvent) => {
    if (event.target === modalRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' ||
        e.key === 'Esc' // IE/Edge
      ) {
        if (modalRef?.current) {
          e.preventDefault();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div onClick={handleModalClick} ref={modalRef} className={styles.modal}>
      <div className={styles.content}>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
};

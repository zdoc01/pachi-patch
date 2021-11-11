import { useRef, MouseEvent } from 'react';

interface ModalProps {
    children: JSX.Element | JSX.Element[];
    onClose: () => void;
    title: string;
}

const Modal = ({ children, onClose, title }: ModalProps) => {
    const modalRef = useRef(null);

    const handleModalClick = (event: MouseEvent) => {
        if (event.target === modalRef.current) {
            onClose();
        }
    };

    return (
        <div onClick={handleModalClick} ref={modalRef} style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(0,0,0,.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '7px' }}>
                <h1>{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default Modal;
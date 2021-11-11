import styles from '../styles/Button.module.css'

interface ButtonProps {
    classes?: string[];
    color: 'primary' | 'secondary';
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset' | undefined;
}
  
const Button = ({ classes = [], color, label, onClick, type }: ButtonProps) => (
    <button className={`${classes.join(' ')} ${styles.button} ${styles[`btn-${color}`]}`} onClick={onClick} type={type}>
        {label}
    </button>
);

export default Button;
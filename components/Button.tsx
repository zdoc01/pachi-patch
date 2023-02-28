import { IconCog } from '../src/icons/IconCog';
import styles from '../styles/Button.module.css';

interface ButtonProps {
  classes?: string[];
  color: 'primary' | 'secondary';
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button = ({
  classes = [],
  color,
  disabled = false,
  label,
  loading = false,
  onClick,
  type,
}: ButtonProps) => (
  <button
    className={`${classes.join(' ')} ${styles.button} ${
      styles[`btn-${color}`]
    }`}
    disabled={disabled}
    onClick={onClick}
    type={type}
  >
    {loading ? (
      <IconCog classes={['spin']} height="25px" width="25px" />
    ) : (
      label
    )}
  </button>
);

export default Button;

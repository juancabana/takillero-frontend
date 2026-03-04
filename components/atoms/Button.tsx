import Link from 'next/link';
import { btn as btnTokens, btnSize } from '@/config/theme';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  as?: 'button';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  as: 'link';
  href: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: btnTokens.primaryPill,
  outline: btnTokens.outlineWhite,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: btnSize.sm,
  md: btnSize.md,
  lg: btnSize.lg,
};

const baseClasses = `${btnTokens.base} rounded-full focus:ring-2 focus:ring-orange-400 focus:ring-offset-2`;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', children, className = '' } = props;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ');

  if (props.as === 'link') {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      className={classes}
    >
      {children}
    </button>
  );
}

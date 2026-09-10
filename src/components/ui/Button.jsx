import React from 'react';
import { cn } from '../../lib/utils';

export default function Button({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  onClick,
  type = 'button',
  disabled = false,
  asChild = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none";

  const variants = {
    default: "bg-primary text-primary-foreground shadow-sm hover:opacity-95 hover:shadow-md",
    accent: "bg-accent text-white shadow-sm hover:opacity-95 hover:shadow-md",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-card text-foreground hover:bg-muted hover:border-accent/60",
    ghost: "text-foreground hover:bg-muted/70",
    link: "text-primary underline-offset-4 hover:underline p-0 h-auto"
  };

  const sizes = {
    default: "h-10 px-5 py-2 text-sm rounded-xl",
    sm: "h-8 px-3 text-xs rounded-lg",
    lg: "h-12 px-7 text-base rounded-xl font-semibold",
    icon: "h-9 w-9 p-0 rounded-full"
  };

  const combinedClassName = cn(baseStyles, variants[variant] || variants.default, sizes[size] || sizes.default, className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(combinedClassName, children.props.className),
      ...props
    });
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}

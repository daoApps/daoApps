import type { BaseButtonProps } from '../../types/component'

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  block?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}

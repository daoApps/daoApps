import type { Size, Variant, Shape } from './common'

export interface BaseComponentProps {
  id?: string
  class?: string
  style?: Record<string, any>
  disabled?: boolean
}

export interface BaseButtonProps extends BaseComponentProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  block?: boolean
}

export interface BaseInputProps extends BaseComponentProps {
  variant?: Variant
  size?: Size
  placeholder?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
}

export interface BaseCardProps extends BaseComponentProps {
  variant?: Variant
  shadow?: boolean
  bordered?: boolean
}

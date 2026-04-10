export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost'

export type Shape = 'square' | 'rounded' | 'pill' | 'circle'

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

export type Alignment = 'left' | 'center' | 'right'

export type Direction = 'horizontal' | 'vertical'

export type Nullable<T> = T | null

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

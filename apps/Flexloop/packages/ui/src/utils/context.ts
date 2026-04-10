import { provide, inject, reactive, type InjectionKey, type UnwrapRef } from 'vue'

export interface CreateContextOptions {
  name: string
  defaultValue?: any
  strict?: boolean
}

export function createContext<T>(options: CreateContextOptions) {
  const { name, defaultValue, strict = true } = options
  const key: InjectionKey<T> = Symbol(name)

  function provideContext(value: T) {
    provide(key, reactive(value) as UnwrapRef<T>)
  }

  function useContext() {
    const value = inject(key, defaultValue)
    if (strict && value === undefined) {
      throw new Error(`${name} must be used within a ${name}Provider`)
    }
    return value
  }

  return {
    provideContext,
    useContext
  }
}

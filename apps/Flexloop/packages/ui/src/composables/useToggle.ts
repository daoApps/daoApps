import { ref } from 'vue'

export function useToggle(initialValue: boolean = false) {
  const value = ref(initialValue)

  const toggle = (newValue?: boolean) => {
    value.value = newValue !== undefined ? newValue : !value.value
  }

  const setTrue = () => {
    value.value = true
  }

  const setFalse = () => {
    value.value = false
  }

  return {
    value,
    toggle,
    setTrue,
    setFalse
  }
}

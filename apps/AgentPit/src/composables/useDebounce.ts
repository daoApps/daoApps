import { ref, watch, type Ref } from 'vue';

export function useDebounce<T>(value: Ref<T> | (() => T), delay = 300): Ref<T> {
  const debouncedValue = ref(value instanceof Function ? value() : value.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(
    () => (value instanceof Function ? value() : value.value),
    (newValue) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        debouncedValue.value = newValue as T;
      }, delay);
    }
  );

  return debouncedValue;
}

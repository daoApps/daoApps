import { ref, onUnmounted } from 'vue';

export function useTypewriter() {
  const displayedText = ref('');
  const isTyping = ref(false);
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let currentIndex = 0;

  const startTyping = (fullText: string, speed = 30) => {
    stopTyping();
    displayedText.value = '';
    isTyping.value = true;
    currentIndex = 0;

    if (!fullText) {
      isTyping.value = false;
      return;
    }

    intervalId = setInterval(() => {
      if (currentIndex < fullText.length) {
        const charsToAdd = Math.min(
          Math.floor(Math.random() * 3) + 1,
          fullText.length - currentIndex
        );
        displayedText.value += fullText.slice(currentIndex, currentIndex + charsToAdd);
        currentIndex += charsToAdd;
      } else {
        stopTyping();
      }
    }, speed);
  };

  const stopTyping = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isTyping.value = false;
  };

  onUnmounted(() => {
    stopTyping();
  });

  return {
    displayedText,
    isTyping,
    startTyping,
    stopTyping
  };
}

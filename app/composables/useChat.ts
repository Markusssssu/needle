// composables/useChat.ts
export const useChat = () => {
  const messages = ref([
    {
      role: "assistant",
      content: "Привет! Я Джестер. Чем могу помочь?",
      time: "12:00",
    },
  ]);
  const isLoading = ref(false);
  const inputMessage = ref("");
  const scrollContainer = ref<HTMLElement | null>(null);

  const scrollToBottom = () => {
    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      }
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.value.trim() || isLoading.value) return;

    const userText = inputMessage.value;
    messages.value.push({
      role: "user",
      content: userText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    inputMessage.value = "";
    isLoading.value = true;
    scrollToBottom();

    try {
      // Имитация вызова MCP / API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      messages.value.push({
        role: "assistant",
        content: "Это ответ от MCP сервера (заглушка)",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (e) {
      console.error("MCP Error:", e);
    } finally {
      isLoading.value = false;
      scrollToBottom();
    }
  };

  const clearChat = () => {
    messages.value = [];
  };

  return {
    messages,
    isLoading,
    inputMessage,
    scrollContainer,
    sendMessage,
    clearChat,
  };
};

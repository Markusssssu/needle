<template>
  <UDashboardPanel id="AI-Джестер">
    <template #header>
      <UDashboardNavbar title="ИИ Джестер">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-trash"
            label="Очистить"
            @click="clearChat"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        class="flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-zinc-950"
      >
        <ChatMessagesList
          ref="messagesList"
          :messages="messages"
          :is-loading="isLoading"
        />

        <ChatInput
          v-model="inputMessage"
          :loading="isLoading"
          @send="sendMessage"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const {
  messages,
  isLoading,
  inputMessage,
  sendMessage,
  clearChat,
  scrollContainer,
} = useChat();

const messagesList = ref(null);
onMounted(() => {
  scrollContainer.value = messagesList.value?.container;
});
</script>

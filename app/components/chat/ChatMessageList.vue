<template>
  <div class="flex-1 overflow-y-auto p-4 sm:p-6" ref="container">
    <div class="max-w-4xl mx-auto">
      <ChatBubble
        v-for="(msg, index) in messages"
        :key="index"
        :is-ai="msg.role === 'assistant'"
        :time="msg.time"
      >
        {{ msg.content }}
      </ChatBubble>

      <ChatBubble v-if="isLoading" is-ai time="Сейчас">
        <div class="flex gap-1 py-1">
          <span class="animate-bounce">.</span>
          <span class="animate-bounce [animation-delay:0.2s]">.</span>
          <span class="animate-bounce [animation-delay:0.4s]">.</span>
        </div>
      </ChatBubble>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  messages: any[];
  isLoading: boolean;
}>();

const container = ref(null);
defineExpose({ container }); // Экспонируем для Composable
</script>

<!-- components/TalkJsChat.vue -->
<script setup lang="ts">
const props = defineProps<{
  session: any;
  conversation: any;
}>();

const chatContainer = ref(null);

onMounted(() => {
  const chatbox = props.session.createChatbox();
  chatbox.select(props.conversation);
  chatbox.mount(chatContainer.value);
});
</script>

<template>
  <div ref="chatContainer" class="h-full w-full"></div>
</template>

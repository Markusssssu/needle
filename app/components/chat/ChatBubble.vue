<template>
  <div :class="['flex mb-4 gap-3', isAi ? 'flex-row' : 'flex-row-reverse']">
    <UAvatar
      :src="isAi ? '/ai-avatar.png' : '/user-avatar.png'"
      :alt="isAi ? 'AI' : 'Me'"
      size="sm"
      class="mt-1"
    />
    <div :class="['flex flex-col max-w-[80%]', !isAi && 'items-end']">
      <div
        :class="[
          'px-4 py-2 rounded-2xl text-sm leading-relaxed',
          isAi
            ? 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
            : 'bg-primary-500 text-white',
        ]"
      >
        <slot />
      </div>
      <span class="text-[10px] mt-1 text-zinc-400 uppercase font-medium">
        {{ time }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isAi: Boolean,
  time: String,
});
</script>

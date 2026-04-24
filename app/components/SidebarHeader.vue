<script setup lang="ts">
defineProps<{ collapsed: boolean }>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex items-center transition-all duration-200"
      :class="[collapsed ? 'justify-center p-2' : 'gap-3 px-4 py-3']"
    >
      <UIcon
        name="i-lucide-lab-reel-thread"
        class="size-6 shrink-0 text-primary"
      />

      <span
        v-if="!collapsed"
        class="font-bold text-xl tracking-tight text-gray-900 dark:text-white truncate"
      >
        Needle
      </span>

      <UColorModeButton />
    </div>
  </div>
</template>

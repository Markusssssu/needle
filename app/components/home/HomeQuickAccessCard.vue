<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  to: string
}>()
</script>

<template>
  <ULink
    :to="to"
    class="relative group overflow-hidden rounded-2xl border border-default bg-elevated/50 p-4 min-h-[150px] sm:min-h-[190px] flex flex-col justify-between transition-all hover:bg-elevated hover:border-primary-500/50 shadow-sm"
  >
    <div class="absolute right-[-10%] top-[-5%] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
      <UIcon
        :name="icon"
        class="size-24 sm:size-32 text-neutral-400/10 group-hover:text-primary/20"
      />
    </div>

    <div class="flex-grow flex items-center justify-start">
      <div class="relative">
        <div class="absolute inset-0 bg-primary/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

        <UIcon
          :name="icon"
          class="size-14 sm:size-20 text-muted group-hover:text-primary transition-all duration-500 z-10"
        />
      </div>
    </div>

    <div class="relative z-10 w-full flex items-center justify-between mt-2">
      <h3 class="text-sm sm:text-base font-bold text-highlighted truncate">
        {{ title }}
      </h3>

      <div class="size-6 sm:size-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary transition-colors">
        <UIcon
          name="i-lucide-arrow-right"
          class="size-3 sm:size-4 text-muted group-hover:text-white"
        />
      </div>
    </div>
  </ULink>
</template>


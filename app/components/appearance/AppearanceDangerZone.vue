<script setup lang="ts">
const theme = useTheme();
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-gray-200 dark:border-gray-800 text-left items-center">
    <div class="space-y-1">
      <h2 class="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
        Сброс настроек
      </h2>
      <p class="text-sm text-gray-400">
        Верните внешний вид приложения к заводским настройкам в один клик.
      </p>
    </div>

    <div class="md:col-span-2 flex justify-start md:justify-end">
      <UButton
        color="red"
        variant="ghost"
        icon="i-heroicons-trash"
        label="Сбросить оформление"
        class="transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-950/30"
        loading-auto
        @click="theme.resetColor()"
      />
    </div>
  </section>
</template>


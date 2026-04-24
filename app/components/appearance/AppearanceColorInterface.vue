<script setup lang="ts">
const theme = useTheme()

const colorPreviewMap: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  teal: '#14b8a6',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  pink: '#ec4899',
  rose: '#f43f5e'
}

const getPreviewColor = (name: string) => colorPreviewMap[name] ?? '#a3a3a3'
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-gray-200 dark:border-gray-800 text-left items-center">
    <div class="space-y-1">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-500">Оформление</h2>
      <p class="text-sm text-gray-400">Выберите основной цвет интерфейса.</p>
    </div>

    <div class="md:col-span-2 flex justify-start md:justify-end">
      <div class="grid grid-cols-8 gap-2">
        <button
          v-for="color in theme.colors"
          :key="color.id"
          type="button"
          :style="{ backgroundColor: getPreviewColor(color.name) }"
          class="w-6 h-6 rounded-full p-0 flex items-center justify-center border border-gray-200 dark:border-gray-700 ring-offset-2 transition-transform active:scale-90 focus:outline-none"
          :class="[theme.primary === color.name ? 'ring-2 ring-gray-400' : '']"
          @click="theme.setPrimary(color.name)"
        >
          <UIcon
            v-if="theme.primary === color.name"
            name="i-heroicons-check"
            class="w-4 h-4 text-white"
          />
        </button>
      </div>
    </div>
  </section>
</template>




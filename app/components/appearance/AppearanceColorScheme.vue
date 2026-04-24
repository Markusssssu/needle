<script setup lang="ts">
const theme = useTheme()

const neutralPreviewMap: Record<string, string> = {
  slate: '#64748b',
  gray: '#6b7280',
  zinc: '#71717a',
  neutral: '#737373',
  stone: '#78716c'
}

const getPreviewColor = (name: string) => neutralPreviewMap[name] ?? '#a3a3a3'
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-gray-200 dark:border-gray-800 text-left items-center">
    <div class="space-y-1">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-500">Нейтральные тона</h2>
      <p class="text-sm text-gray-400">Выберите оттенок для фонов и панелей.</p>
    </div>

    <div class="md:col-span-2 flex justify-start md:justify-end">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="n in theme.neutrals"
          :key="n.id"
          type="button"
          :style="{ backgroundColor: getPreviewColor(n.name) }"
          class="w-6 h-6 rounded-full p-0 flex items-center justify-center border border-gray-200 dark:border-gray-700 ring-offset-2 transition-transform active:scale-90 focus:outline-none"
          :class="[theme.neutral === n.name ? 'ring-2 ring-gray-400' : '']"
          @click="theme.setNeutral(n.name)"
        >
          <UIcon
            v-if="theme.neutral === n.name"
            name="i-heroicons-check"
            class="w-4 h-4 text-white"
          />
        </button>
      </div>
    </div>
  </section>
</template>


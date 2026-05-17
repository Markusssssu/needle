<template>
  <UDashboardLayout>
    <UDashboardPanel id="analytics" grow>
      <UDashboardNavbar title="Аналитика">
        <template #right>
          <USelectMenu
            v-model="selectedPeriod"
            :items="periods"
            icon="i-heroicons-calendar-days"
            class="w-40"
          />
          <UserButton after-sign-out-url="/sign-in" />
        </template>
      </UDashboardNavbar>

      <!-- Основной контейнер скролла, адаптированный под v4 -->
      <div
        class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900"
      >
        <!-- Состояние загрузки -->
        <div v-if="pending" class="flex h-64 items-center justify-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="h-8 w-8 animate-spin text-gray-400"
          />
        </div>

        <!-- Состояние ошибки -->
        <div v-else-if="error" class="p-4">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="red"
            variant="soft"
            title="Ошибка фронтенда"
            :description="error.message || 'Не удалось обработать JSON'"
          />
        </div>

        <!-- Контент аналитики -->
        <div v-else-if="analytics" class="space-y-6">
          <!-- Сетка 1: Карточки KPI -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <!-- В v4 UDashboardCard заменен на универсальный UCard с кастомными стилями -->
            <UCard
              v-for="kpi in analytics.kpis"
              :key="kpi.title"
              class="overflow-hidden"
            >
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ kpi.title }}
              </div>
              <div class="flex items-baseline justify-between mt-2">
                <span
                  class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white"
                >
                  {{ kpi.value }}
                </span>
                <span
                  :class="[
                    kpi.isPositive
                      ? 'text-green-600 bg-green-50 dark:bg-green-950/30'
                      : 'text-red-600 bg-red-50 dark:bg-red-950/30',
                    'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium',
                  ]"
                >
                  <UIcon
                    :name="
                      kpi.isPositive
                        ? 'i-heroicons-arrow-trending-up'
                        : 'i-heroicons-arrow-trending-down'
                    "
                    class="h-3 w-3"
                  />
                  {{ kpi.change }}
                </span>
              </div>
              <div class="text-xs text-gray-400 mt-1">
                {{ kpi.description }}
              </div>
            </UCard>
          </div>

          <!-- Сетка 2: Графики и Источники -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <UCard class="lg:col-span-2">
              <template #header>
                <h3 class="text-base font-semibold">Динамика продаж</h3>
              </template>
              <div
                class="h-64 flex items-end justify-between gap-2 pt-6 border-b border-gray-200 dark:border-gray-800"
              >
                <div
                  v-for="item in analytics.chartData"
                  :key="item.label"
                  class="flex flex-col items-center flex-1 group"
                >
                  <div class="w-full flex gap-1 items-end h-40 justify-center">
                    <div
                      :style="{ height: item.views + '%' }"
                      class="w-full bg-primary-500/20 rounded-t"
                    />
                    <div
                      :style="{ height: item.sales + '%' }"
                      class="w-full bg-primary-500 rounded-t"
                    />
                  </div>
                  <span class="text-[10px] text-gray-400 mt-2">{{
                    item.label
                  }}</span>
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <h3 class="text-base font-semibold">Источники перехода</h3>
              </template>
              <div class="space-y-4">
                <div
                  v-for="source in analytics.sources"
                  :key="source.name"
                  class="space-y-1"
                >
                  <div class="flex justify-between text-sm">
                    <span class="font-medium">{{ source.name }}</span>
                    <span class="text-gray-500">{{ source.value }}%</span>
                  </div>
                  <UProgress :value="source.value" size="sm" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Сетка 3: Воронка и Таблица -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <UCard>
              <template #header>
                <h3 class="text-base font-semibold">Конверсия воронки</h3>
              </template>
              <div class="space-y-3">
                <div
                  v-for="(funnel, index) in analytics.funnelSteps"
                  :key="funnel.step"
                  class="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex justify-between items-center"
                >
                  <span class="text-sm font-medium">{{ funnel.step }}</span>
                  <span class="text-sm font-semibold text-primary-500">{{
                    funnel.count
                  }}</span>
                </div>
              </div>
            </UCard>

            <UCard class="lg:col-span-2" :ui="{ body: 'p-0 overflow-hidden' }">
              <template #header>
                <h3 class="text-base font-semibold px-4 py-1">
                  Последняя активность
                </h3>
              </template>
              <!-- В Nuxt UI v4 маппинг колонок и строк в UTable остался прежним -->
              <UTable
                :data="analytics.recentActivities || []"
                :columns="columns"
              />
            </UCard>
          </div>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardLayout>
</template>

<script setup>
import { ref } from "vue";

const periods = ["За 7 дней", "За 30 дней", "За квартал", "За год"];
const selectedPeriod = ref("За 30 дней");

// useFetch с явным приведением типов для Nuxt 4 Nitro
const {
  data: analytics,
  pending,
  error,
} = await useFetch("/api/analytics", {
  query: { period: selectedPeriod },
  watch: [selectedPeriod],
});

// Колонки таблицы
const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "user", header: "Пользователь" },
  { accessorKey: "action", header: "Действие" },
  { accessorKey: "amount", header: "Сумма" },
  { accessorKey: "status", header: "Статус" },
];
</script>

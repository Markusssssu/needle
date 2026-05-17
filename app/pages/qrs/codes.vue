<template>
  <div class="p-6 space-y-6">
    <!-- Заголовок страницы (Nuxt UI) -->
    <div
      class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4"
    >
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        QR-Коды: {{ currentPeriodLabel }}
      </h1>
    </div>

    <!-- Сетка карточек на Nuxt UI -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="card in currentCardsData"
        :key="card.id"
        class="cursor-pointer hover:shadow-md transition-shadow border-gray-200 dark:border-gray-800"
        @click="toggleCard(card.id)"
      >
        <!-- Основной контейнер: разделяет QR-код и текстовое описание -->
        <div class="flex items-center gap-4">
          <!-- Левый блок: Контейнер для QR-кода -->
          <div
            class="flex-shrink-0 p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center w-[100px] h-[100px]"
          >
            <ClientOnly>
              <!-- Автоимпортируемый компонент вашего модуля -->
              <Qrcode :value="card.qrUrl" :width="84" :height="84" />
              <!-- Заглушка на время инициализации страницы в браузере -->
              <template #fallback>
                <div class="text-[10px] text-gray-400 animate-pulse">
                  Загрузка...
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Правый блок: Описание QR-кода -->
          <div class="flex-1 min-w-0 space-y-1">
            <span class="text-xs text-primary-500 font-medium">{{
              card.periodLabel
            }}</span>
            <h3
              class="text-sm font-bold text-gray-900 dark:text-white truncate"
            >
              {{ card.label }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Сканирований:
              <span class="font-semibold text-gray-900 dark:text-white">{{
                card.scans
              }}</span>
            </p>
          </div>
        </div>

        <div
          v-if="expandedCardId === card.id"
          class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs space-y-2 text-gray-600 dark:text-gray-400"
          @click.stop
        >
          <div>
            <span class="text-gray-400 block mb-0.5">Ссылка внутри QR:</span>
            <span class="font-mono text-primary-500 break-all select-all">{{
              card.qrUrl
            }}</span>
          </div>
          <div
            class="flex justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded text-[11px]"
          >
            <span>Создано: {{ card.details.createdAt }}</span>
            <span>Тип: {{ card.details.contentType }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
// Никаких импортов нет. ref, computed, useRoute и ваш Qrcode подтягиваются Nuxt автоматически.

const route = useRoute();
const expandedCardId = ref(null);

// Переключение раскрытия деталей карточки
const toggleCard = (id) => {
  expandedCardId.value = expandedCardId.value === id ? null : id;
};

// Тестовые данные для проверки фильтрации и структуры
const mockDatabase = [
  {
    id: 1,
    label: "Скидка на 30%",
    scans: 142,
    qrUrl: "https://example.com",
    type: "week",
    periodLabel: "Неделя",
    details: { createdAt: "12.05.2026", contentType: "Сайт" },
  },
  {
    id: 2,
    label: "Скидка на 100%",
    scans: 89,
    qrUrl: "https://example.com",
    type: "week",
    periodLabel: "Неделя",
    details: { createdAt: "10.05.2026", contentType: "Купон" },
  },
  {
    id: 3,
    label: "Скидка на 100%",
    scans: 89,
    qrUrl: "https://example.com",
    type: "week",
    periodLabel: "Неделя",
    details: { createdAt: "10.05.2026", contentType: "Купон" },
  },
  {
    id: 4,
    label: "Скидка на 20%",
    scans: 512,
    qrUrl: "https://example.com",
    type: "month",
    periodLabel: "Месяц",
    details: { createdAt: "01.05.2026", contentType: "Форма" },
  },
  {
    id: 4,
    label: "Скидка на 20%",
    scans: 512,
    qrUrl: "https://example.com",
    type: "month",
    periodLabel: "Месяц",
    details: { createdAt: "01.05.2026", contentType: "Форма" },
  },
  {
    id: 5,
    label: "Скидка на 20%",
    scans: 512,
    qrUrl: "https://example.com",
    type: "month",
    periodLabel: "Месяц",
    details: { createdAt: "01.05.2026", contentType: "Форма" },
  },
  {
    id: 6,
    label: "Скидка на 20%",
    scans: 512,
    qrUrl: "https://example.com",
    type: "month",
    periodLabel: "Месяц",
    details: { createdAt: "01.05.2026", contentType: "Форма" },
  },
];

const currentCardsData = computed(() => {
  const currentPeriod = route.query.period || "week";
  expandedCardId.value = null; // Сворачиваем детали при смене таба
  return mockDatabase.filter((item) => item.type === currentPeriod);
});

const currentPeriodLabel = computed(() => {
  const labels = { week: "Неделя", month: "Месяц", "half-year": "Пол-года" };
  return labels[route.query.period || "week"] || "Неделя";
});
</script>

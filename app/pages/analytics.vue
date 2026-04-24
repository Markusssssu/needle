


<template #body>
  <div class="p-4 sm:p-6 space-y-8">
    <!-- 1. Верхние карточки статистики -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center gap-4">
          <UIcon name="i-lucide-calendar-days" class="size-8 text-blue-500" />
          <div>
            <p class="text-xs text-zinc-500 uppercase font-bold">Дата регистрации</p>
            <p class="text-lg font-semibold tabular-nums">
              {{ user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <UIcon name="i-lucide-log-in" class="size-8 text-green-500" />
          <div>
            <p class="text-xs text-zinc-500 uppercase font-bold">Последний вход</p>
            <p class="text-lg font-semibold tabular-nums">
              {{ user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleTimeString() : '—' }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <UIcon name="i-lucide-shield-check" class="size-8 text-purple-500" />
          <div>
            <p class="text-xs text-zinc-500 uppercase font-bold">Статус аккаунта</p>
            <UBadge color="success" variant="subtle" size="sm">
              {{ user?.twoFactorEnabled ? '2FA Active' : 'Verified' }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <UCard title="Активность профиля" description="Статистика взаимодействий за последние 14 дней">
      <div class="h-64 w-full">
        <LineChart
          :data="{
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
              label: 'Сессии',
              data: [2, 5, 3, 8, 4, 1, 6],
              borderColor: '#3b82f6',
              tension: 0.4,
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
          }"
          :options="{ maintainAspectRatio: false, plugins: { legend: { display: false } } }"
        />
      </div>
    </UCard>

    <div>
      <h3 class="text-sm font-medium mb-4 text-zinc-500 uppercase tracking-widest">Инструменты</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <HomeQuickAccessCard
          v-for="item in quickAccessItems"
          :key="item.to"
          :title="item.title"
          :icon="item.icon"
          :to="item.to"
        />
      </div>
    </div>
  </div>
</template>


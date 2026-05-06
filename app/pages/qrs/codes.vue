<script setup lang="ts">
const { data, columns, pending } = useQRCode();
const toast = useToast();

const copyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.add({
      title: "Успешно",
      description: "Ссылка скопирована",
      color: "green",
      icon: "i-heroicons-check-circle",
    });
  } catch (err) {
    toast.add({ title: "Ошибка копирования", color: "red" });
  }
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    valid: "green",
    expired: "orange",
    exhausted: "red",
    inactive: "gray",
  };
  return map[status] || "gray";
};
</script>

<template>
  <UDashboardPanel id="qr-codes">
    <template #header>
      <UDashboardNavbar title="Управление QR-кодами" />
    </template>

    <template #body>
      <UCard :ui="{ body: { padding: 'p-0' } }" class="overflow-hidden">
        <UTable :rows="data" :columns="columns" :loading="pending">
          <template #code-data="{ row }">
            <div class="flex items-center gap-4 py-3 px-2">
              <div
                class="bg-white p-1 border border-gray-200 rounded flex-shrink-0 w-[58px] h-[58px] flex items-center justify-center"
              >
                <ClientOnly>
                  <NuxtQrCode :value="row.shareUrl" :width="50" :margin="0" />
                  <template #fallback>
                    <div class="w-full h-full bg-gray-100 animate-pulse" />
                  </template>
                </ClientOnly>
              </div>
              <div class="flex flex-col min-w-0">
                <span
                  class="text-sm font-semibold text-gray-900 dark:text-white"
                  >{{ row.code }}</span
                >
                <span
                  class="text-xs text-gray-400 truncate max-w-[150px] font-mono"
                  >{{ row.shareUrl }}</span
                >
              </div>
            </div>
          </template>

          <template #status-data="{ row }">
            <UBadge
              :color="getStatusColor(row.status)"
              variant="subtle"
              class="rounded-full px-2.5"
            >
              {{ row.statusLabel }}
            </UBadge>
          </template>

          <template #usedCount-data="{ row }">
            <div class="text-sm">
              <span class="font-medium">{{ row.usedCount }}</span>
              <span class="text-gray-400"> / {{ row.usageLimit ?? "∞" }}</span>
            </div>
          </template>

          <template #actions-data="{ row }">
            <div class="flex justify-end pr-2">
              <UButton
                icon="i-heroicons-clipboard-document"
                color="gray"
                variant="ghost"
                @click="copyLink(row.shareUrl)"
              />
            </div>
          </template>
        </UTable>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

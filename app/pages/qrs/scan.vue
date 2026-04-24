<script setup lang="ts">
import { getDefaultRouteForRole } from "~/utils/access";

type ScanStatus = "valid" | "inactive" | "expired" | "exhausted" | "not_found";

type ScanResult = {
  id?: string;
  scannedValue: string;
  code: string;
  exists: boolean;
  valid: boolean;
  status: ScanStatus;
  statusLabel: string;
  message: string;
  discountLabel: string | null;
  usageLimit?: number | null;
  usedCount?: number;
  expiresAt?: string | null;
  shareUrl: string | null;
};

const results = ref<ScanResult[]>([]);
const toast = useToast();
const state = reactive({ error: false, errorMsg: "", checking: false });
const router = useRouter();
const { currentRole } = useAppRole();

async function onDetect(detectedCodes: { rawValue?: string }[]) {
  const scannedValue = detectedCodes[0]?.rawValue?.trim();

  if (!scannedValue || state.checking) {
    return;
  }

  const alreadyScanned = results.value.some(
    result => result.scannedValue === scannedValue
  );

  if (alreadyScanned) {
    return;
  }

  state.checking = true;

  try {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    const response = await $fetch<{ result: ScanResult }>("/api/qr/validate", {
      method: "POST",
      body: {
        value: scannedValue
      }
    });

    results.value.unshift(response.result);
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Не удалось проверить QR-код",
      color: "error"
    });
  } finally {
    state.checking = false;
  }
}

function clearHistory() {
  results.value = [];
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  toast.add({ title: "Скопировано", icon: "i-heroicons-check-circle" });
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  navigateTo(getDefaultRouteForRole(currentRole.value));
}
</script>

<template>
  <div class="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden text-slate-100">
    <UContainer
      class="absolute top-0 left-0 right-0 z-30 py-8 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent"
    >
      <UButton
        icon="i-heroicons-chevron-left-20-solid"
        color="white"
        variant="soft"
        size="xl"
        class="rounded-2xl"
        @click="goBack"
      />
      <div class="text-center">
        <div class="text-white font-bold tracking-tight">QR Сканер</div>
        <UBadge color="emerald" variant="flat" size="xs" class="animate-pulse">
          Live
        </UBadge>
      </div>
      <div class="w-12" />
    </UContainer>

    <div class="relative flex-1 bg-black">
      <QrcodeStream
        class="h-full w-full object-cover"
        @detect="onDetect"
        @error="
          event => {
            state.error = true;
            state.errorMsg = event.name;
          }
        "
      />
      <ScannerOverlay />
    </div>

    <div
      class="relative z-20 bg-zinc-900 border-t border-white/5 rounded-t-[2.5rem] transition-all duration-500"
      :class="results.length > 0 ? 'h-[50vh]' : 'h-28'"
    >
      <div class="w-10 h-1 bg-zinc-700 rounded-full mx-auto mt-4 mb-4" />

      <div class="px-6 pb-10 h-full overflow-y-auto">
        <div class="flex items-center justify-between mb-6 sticky top-0 bg-zinc-900/90 py-2">
          <h2 class="text-xl font-bold">Проверка купонов</h2>
          <UButton
            v-if="results.length"
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            @click="clearHistory"
          />
        </div>

        <div v-if="results.length" class="space-y-3">
          <ScannerResultItem
            v-for="result in results"
            :key="`${result.scannedValue}-${result.status}`"
            :result="result"
            @copy="copyToClipboard"
          />
        </div>

        <div v-else class="text-center py-6 text-zinc-500 text-sm">
          Наведите камеру на QR-код купона, чтобы проверить его в базе данных.
        </div>
      </div>
    </div>
  </div>
</template>

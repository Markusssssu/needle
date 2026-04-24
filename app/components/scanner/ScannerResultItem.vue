<script setup lang="ts">
type ScanStatus = "valid" | "inactive" | "expired" | "exhausted" | "not_found";

type ScanResult = {
  scannedValue: string;
  code: string;
  valid: boolean;
  status: ScanStatus;
  statusLabel: string;
  message: string;
  discountLabel: string | null;
  shareUrl: string | null;
};

const props = defineProps<{
  result: ScanResult;
}>();

const emit = defineEmits<{
  copy: [text: string];
}>();

const badgeColorMap: Record<ScanStatus, "success" | "warning" | "error" | "neutral"> = {
  valid: "success",
  inactive: "neutral",
  expired: "warning",
  exhausted: "error",
  not_found: "error"
};
</script>

<template>
  <div class="p-4 bg-white/5 border border-white/10 rounded-2xl">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 mb-2">
          <UBadge :color="badgeColorMap[props.result.status]" variant="soft" class="rounded-full">
            {{ props.result.statusLabel }}
          </UBadge>
          <span v-if="props.result.discountLabel" class="text-xs text-emerald-400 font-medium">
            Скидка {{ props.result.discountLabel }}
          </span>
        </div>

        <p class="text-sm font-semibold text-white truncate">
          {{ props.result.code || props.result.scannedValue }}
        </p>
        <p class="mt-1 text-xs text-zinc-400">
          {{ props.result.message }}
        </p>
      </div>

      <div class="flex gap-2 shrink-0">
        <UButton
          v-if="props.result.code"
          icon="i-heroicons-clipboard-document"
          color="white"
          variant="soft"
          size="xs"
          @click="emit('copy', props.result.code)"
        >
          Код
        </UButton>
        <UButton
          v-if="props.result.shareUrl"
          icon="i-lucide-link"
          color="primary"
          variant="soft"
          size="xs"
          @click="emit('copy', props.result.shareUrl)"
        >
          Ссылка
        </UButton>
      </div>
    </div>
  </div>
</template>

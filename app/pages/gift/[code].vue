<script setup lang="ts">
const route = useRoute();

const { data, error } = await useFetch(`/api/coupons/${route.params.code}`);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white">
    <UContainer class="py-10">
      <div class="max-w-xl mx-auto">
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-2xl">
          <div v-if="data?.coupon" class="space-y-6">
            <div class="text-center space-y-2">
              <UBadge :color="data.coupon.valid ? 'success' : 'warning'" variant="soft" class="rounded-full">
                {{ data.coupon.statusLabel }}
              </UBadge>
              <h1 class="text-3xl font-bold">Подарочный QR-купон</h1>
              <p class="text-zinc-300">
                Покажите этот экран продавцу. Он отсканирует QR-код и проверит купон в базе.
              </p>
            </div>

            <div class="flex justify-center">
              <div class="rounded-3xl bg-white p-5 shadow-xl">
                <Qrcode :value="data.coupon.shareUrl" :size="280" variant="pixelated" :radius="0" />
              </div>
            </div>

            <div class="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">
              <div class="flex items-center justify-between gap-4">
                <span class="text-zinc-400">Код</span>
                <span class="font-mono text-sm">{{ data.coupon.code }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-zinc-400">Скидка</span>
                <span class="font-semibold text-emerald-400">{{ data.coupon.discountLabel || "—" }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-zinc-400">Сообщение</span>
                <span class="text-right text-sm">{{ data.coupon.message }}</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center space-y-3">
            <h1 class="text-2xl font-bold">Купон недоступен</h1>
            <p class="text-zinc-400">
              {{ error?.statusMessage || "Не удалось загрузить QR-купон." }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

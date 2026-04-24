<script setup lang="ts">
const { currentRole } = useAppRole();
const isAdmin = computed(() => currentRole.value === "admin");
</script>

<template>
  <UDashboardPanel id="appearance">
    <template #header>
      <div>
        Внешний вид
      </div>
    </template>
    <template #body>
      <div class="max-w-4xl mx-auto py-2">
        <AppearanceColorInterface />
        <AppearanceColorScheme />
        <AppearanceDangerZone v-if="isAdmin" />
      </div>
    </template>
  </UDashboardPanel>
</template>

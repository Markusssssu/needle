<script setup lang="ts">
const { data, columns } = useQRCode();
</script>

<template>
  <UDashboardPanel id="qr-codes">
    <template #header>
      <UDashboardNavbar title="QR-коды" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UCard :ui="{ body: { padding: 'p-0' } }" class="overflow-hidden">
        <UTable :data="data" :columns="columns" class="w-full" />
      </UCard>
    </template>
  </UDashboardPanel>
</template>

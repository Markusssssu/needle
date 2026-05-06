<script setup lang="ts">
const { data, columns } = useOrders();
</script>

<template>
  <UDashboardPanel id="orders">
    <template #header>
      <UDashboardNavbar title="Заказы" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UserButton after-sign-out-url="/sign-in" />
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

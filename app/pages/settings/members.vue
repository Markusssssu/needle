<script setup lang="ts">
const { organizations, memberships} = useOrganization();
</script>


<template>
  <UDashboardPanel id="members">
    <template #header>
      <div>

      <UCard :ui="{ body: { padding: 'p-0' } }" class="overflow-hidden">
        <UTable :data="data" :columns="columns" class="w-full" />
      </UCard>

      </div>
    </template>
    <template #body>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const { links, searchGroups, open } = useNavigation();
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar v-model:open="open" collapsible resizable>
      <template #header="{ collapsed }">
        <SidebarHeader :collapsed="collapsed" />
      </template>

      <UDashboardSearchButton label="Поиск..." />

      <UNavigationMenu :items="links[0]" orientation="vertical" />

      <div class="flex-1" />
      <UNavigationMenu :items="links[1]" orientation="vertical" />

      <template #footer="{ collapsed }">
        <SidebarFooter :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />

    <UDashboardSearch :groups="searchGroups" />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import { useOrganization } from "@clerk/vue";
import BlockerBanner from "@/components/BlockerBanner.vue";

const { items: quickAccessItems } = useQuickAccess();
const { organization } = useOrganization();
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="organization">
        <div class="p-4 sm:p-6 space-y-8">
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 max-w-4xl"
          >
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
      <div v-else>
        <BlockerBanner />
      </div>
    </template>
  </UDashboardPanel>
</template>

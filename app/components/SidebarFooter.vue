<script setup lang="ts">
const { isLoaded, isSignedIn } = useAuth();

defineProps<{ collapsed: boolean }>();
</script>

<template>
  <div
    class="min-h-[40px] flex flex-col gap-2 transition-all duration-200"
    :class="collapsed ? 'p-2 items-center' : 'p-2'"
  >
    <div
      v-if="!isLoaded"
      class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"
    />

    <div
      v-else-if="isSignedIn"
      class="w-full flex items-center"
      :class="collapsed ? 'justify-center' : 'gap-3'"
    >
      <OrganizationSwitcher v-if="!collapsed" />

      <div
        :class="
          !collapsed &&
          'ml-2 border-l border-gray-200 dark:border-gray-800 pl-3'
        "
      >
        <UserButton after-sign-out-url="/sign-in" />
      </div>
    </div>

    <UTooltip v-else text="Войти" :popper="{ placement: 'right' }">
      <UButton
        to="/sign-in"
        icon="i-heroicons-user-circle"
        size="xl"
        color="gray"
        variant="ghost"
        class="rounded-full"
      />
    </UTooltip>
  </div>
</template>

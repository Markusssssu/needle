<template>
  <UContainer class="py-8">
    <UCard>
      <div class="p-4 sm:p-6 space-y-6 flex flex-col items-center">
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full">
          <UIcon name="lucide:lock" class="w-12 h-12 text-gray-500" />
        </div>

        <div class="max-w-2xl text-center">
          <h1
            class="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed"
          >
            Извините, но в данный момент вы не имеете прав администратора, чтобы
            пользоваться услугами сервиса Needle
            <UIcon
              name="lucide:frown"
              class="inline-block w-6 h-6 ml-1 align-text-bottom text-gray-500"
            />
          </h1>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<template>
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-4">
    <div class="relative w-72 h-72">
      <div class="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full"></div>
      <div v-for="edge in ['top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl', 'top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl', 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl']"
           :class="['absolute w-10 h-10 border-primary-500', edge]"></div>
      <div class="absolute inset-x-4 h-0.5 bg-primary-400 shadow-[0_0_15px_rgba(var(--color-primary-400),0.8)] top-1/2 -translate-y-1/2 animate-[bounce_3s_infinite]"></div>
    </div>
  </div>
</template>


<template>
  <div
    class="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
  >
    <div class="max-w-4xl mx-auto flex items-end gap-2">
      <UTextarea
        v-model="modelValue"
        placeholder="Спросите Джестера о чем угодно..."
        :rows="1"
        autoresize
        class="flex-1"
        @keydown.enter.prevent="$emit('send')"
      />
      <UButton
        icon="i-heroicons-paper-airplane"
        color="primary"
        square
        :loading="loading"
        @click="$emit('send')"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["modelValue", "loading"]);
const emit = defineEmits(["update:modelValue", "send"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Talk from "talkjs";

// Nuxt автоматически импортирует useUser из установленного модуля Clerk
const { user } = useUser();
const runtimeConfig = useRuntimeConfig();

// Ссылки на DOM-элемент и состояние загрузки
const talkContainer = ref(null);
const isLoading = ref(true);

// Переменные для хранения инстансов TalkJS
let talkSession = null;
let chatbox = null;

// Функция инициализации TalkJS
const initTalkJS = async () => {
  if (!user.value || !talkContainer.value) return;

  try {
    await Talk.ready;

    // 1. Создаем текущего пользователя на основе данных из Clerk
    const me = new Talk.User({
      id: user.value.id,
      name: user.value.fullName || user.value.username || "Пользователь",
      email: user.value.primaryEmailAddress?.emailAddress,
      // Получаем роль из метаданных Clerk (по умолчанию 'worker')
      role: user.value.publicMetadata?.role || "worker",
    });

    // 2. Инициализируем сессию TalkJS с вашим App ID
    talkSession = new Talk.Session({
      appId: runtimeConfig.public.talkjsAppId,
      me: me,
    });

    // 3. Логика определения собеседника
    const isWorker = user.value.publicMetadata?.role === "worker";

    // ВНИМАНИЕ: Замените эти строки на реальные ID пользователей из вашей панели Clerk для теста
    const otherUserId = isWorker
      ? "ID_АДМИНА_ИЗ_CLERK"
      : "ID_РАБОТНИКА_ИЗ_CLERK";

    const otherUser = new Talk.User({
      id: otherUserId,
      name: isWorker ? "Администратор" : "Работник",
    });

    // 4. Создаем уникальный ID комнаты, объединяя и сортируя ID участников
    const sortedIds = [user.value.id, otherUserId].sort();
    const conversationId = `room_${sortedIds[0]}_${sortedIds[1]}`;

    const conversation = talkSession.getOrCreateConversation(conversationId);
    conversation.setParticipant(me);
    conversation.setParticipant(otherUser);

    // 5. Создаем виджет чата и монтируем его в контейнер
    chatbox = talkSession.createChatbox();
    chatbox.select(conversation);

    // Скрываем индикатор загрузки прямо перед выводом интерфейса чата
    isLoading.value = false;

    chatbox.mount(talkContainer.value);
  } catch (error) {
    console.error("Ошибка при запуске TalkJS:", error);
    isLoading.value = false;
  }
};

// Запуск при монтировании страницы (если данные Clerk уже доступны)
onMounted(() => {
  if (user.value) {
    initTalkJS();
  }
});

// Ожидание загрузки данных пользователя, если Clerk инициализируется дольше страницы
watch(user, (newUser) => {
  if (newUser && !talkSession) {
    initTalkJS();
  }
});

// Корректное уничтожение виджетов при переходе на другую страницу
onBeforeUnmount(() => {
  if (chatbox) chatbox.destroy();
  if (talkSession) talkSession.destroy();
});
</script>

<template>
  <UDashboardPanel flex-1>
    <UDashboardNavbar title="Сообщения" />

    <!-- Окно чата занимает всю доступную высоту экрана за вычетом навбара -->
    <div ref="talkContainer" class="relative h-[calc(100vh-64px)] w-full">
      <!-- Лоадер Nuxt UI, который перекрывает контейнер до момента готовности TalkJS -->
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="animate-spin size-8 text-primary"
        />
      </div>
    </div>
  </UDashboardPanel>
</template>

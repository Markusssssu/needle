import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  // Получаем параметры из URL (например: ?period=За+30+дней)
  const query = getQuery(event);
  const period = query.period || "За 30 дней";

  // Здесь должна быть логика запроса к вашей базе данных.
  // Ниже представлена генерация ваших данных в зависимости от периода.

  if (period === "За 7 дней") {
    return {
      kpis: [
        {
          title: "Выручка",
          value: "105,400 ₽",
          description: "Всего за 7 дней",
          change: "+3.1%",
          isPositive: true,
        },
        {
          title: "Новые пользователи",
          value: "582",
          description: "Прямые регистрации",
          change: "+1.2%",
          isPositive: true,
        },
        {
          title: "Конверсия",
          value: "2.8%",
          description: "Из сессии в покупку",
          change: "-0.1%",
          isPositive: false,
        },
        {
          title: "Средний чек",
          value: "2,900 ₽",
          description: "По всем заказам",
          change: "+0.5%",
          isPositive: true,
        },
      ],
      chartData: [
        { label: "Пн", views: 30, sales: 15 },
        { label: "Вт", views: 45, sales: 25 },
        { label: "Ср", views: 50, sales: 30 },
        { label: "Чт", views: 40, sales: 22 },
        { label: "Пт", views: 65, sales: 45 },
        { label: "Сб", views: 55, sales: 35 },
        { label: "Вс", views: 60, sales: 40 },
      ],
      sources: [
        { name: "Поисковые системы", value: 40 },
        { name: "Прямые переходы", value: 30 },
        { name: "Социальные сети", value: 20 },
        { name: "Реферальные ссылки", value: 10 },
      ],
      funnelSteps: [
        { step: "Посещение сайта", count: "3,500", percentage: 100 },
        { step: "Просмотр карточки", count: "1,900", percentage: 54.2 },
        { step: "Добавление в корзину", count: "720", percentage: 20.5 },
        { step: "Успешная оплата", count: "98", percentage: 2.8 },
      ],
      recentActivities: [
        {
          id: "#1094",
          user: "Александр В.",
          action: "Покупка тарифа 'Pro'",
          amount: "4,900 ₽",
          status: "Completed",
        },
        {
          id: "#1093",
          user: "Мария К.",
          action: "Пополнение баланса",
          amount: "1,500 ₽",
          status: "Pending",
        },
      ],
    };
  }

  // Дефолтный ответ (За 30 дней и остальные периоды)
  return {
    kpis: [
      {
        title: "Выручка",
        value: "450,200 ₽",
        description: "Всего за период",
        change: "+12.3%",
        isPositive: true,
      },
      {
        title: "Новые пользователи",
        value: "2,481",
        description: "Прямые регистрации",
        change: "+8.4%",
        isPositive: true,
      },
      {
        title: "Конверсия",
        value: "3.2%",
        description: "Из сессии в покупку",
        change: "-0.5%",
        isPositive: false,
      },
      {
        title: "Средний чек",
        value: "3,150 ₽",
        description: "По всем заказам",
        change: "+4.1%",
        isPositive: true,
      },
    ],
    chartData: [
      { label: "Пн", views: 40, sales: 20 },
      { label: "Вт", views: 60, sales: 35 },
      { label: "Ср", views: 80, sales: 50 },
      { label: "Чт", views: 50, sales: 30 },
      { label: "Пт", views: 90, sales: 75 },
      { label: "Сб", views: 70, sales: 40 },
      { label: "Вс", views: 85, sales: 65 },
    ],
    sources: [
      { name: "Поисковые системы", value: 45 },
      { name: "Прямые переходы", value: 25 },
      { name: "Социальные сети", value: 18 },
      { name: "Реферальные ссылки", value: 12 },
    ],
    funnelSteps: [
      { step: "Посещение сайта", count: "15,000", percentage: 100 },
      { step: "Просмотр карточки", count: "8,200", percentage: 54.6 },
      { step: "Добавление в корзину", count: "3,100", percentage: 20.6 },
      { step: "Успешная оплата", count: "480", percentage: 3.2 },
    ],
    recentActivities: [
      {
        id: "#1094",
        user: "Александр В.",
        action: "Покупка тарифа 'Pro'",
        amount: "4,900 ₽",
        status: "Completed",
      },
      {
        id: "#1093",
        user: "Мария К.",
        action: "Пополнение баланса",
        amount: "1,500 ₽",
        status: "Pending",
      },
      {
        id: "#1092",
        user: "Иван П.",
        action: "Покупка тарифа 'Base'",
        amount: "1,900 ₽",
        status: "Completed",
      },
      {
        id: "#1091",
        user: "Дмитрий С.",
        action: "Вывод средств",
        amount: "12,000 ₽",
        status: "Failed",
      },
    ],
  };
});

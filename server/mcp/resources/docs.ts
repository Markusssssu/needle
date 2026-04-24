export default defineMcpResource({
  uri: "/",
  name: "Главная документация",
  read() {
    return {
      contents: [
        {
          uri: "/",
          text: "Это текст документации из вашего приложения.",
        },
      ],
    };
  },
});

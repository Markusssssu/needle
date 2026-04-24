export default defineMcpTool({
  name: "say_hello",
  description: "Поприветствовать пользователя по имени",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Имя пользователя",
      },
    },
    required: ["name"],
  },
  execute({ name }) {
    return {
      content: [
        { type: "text", text: `Привет, ${name}! Рад тебя видеть в Nuxt.` },
      ],
    };
  },
});

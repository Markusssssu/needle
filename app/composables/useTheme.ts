import { defineStore } from "pinia";

export const useTheme = defineStore("theme", () => {
  const definePrimary = "red";
  const defineNeutral = "stone";

  persist: true;

  const appConfig = useAppConfig();
  const colorMode = useColorMode();

  const cookiePrimary = useCookie("themePrimary", { default: () => "purple" });
  const cookieNeutral = useCookie("themeNeutral", { default: () => "zinc" });

  const primary = ref(cookiePrimary.value);
  const neutral = ref(cookieNeutral.value);

  appConfig.ui.colors.primary = cookiePrimary.value;
  appConfig.ui.colors.neutral = cookieNeutral.value;

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "sky",
    "blue",
    "indigo",
    "violet",
    "pink",
    "rose",
  ].map((name, index) => ({
    id: index + 1,
    name: name,
  }));

  const neutrals = ["slate", "gray", "zinc", "neutral", "stone"].map(
    (name, index) => ({
      id: index + 1,
      name: name,
    }),
  );

  function setPrimary(color: string) {
    primary.value = color;
    cookiePrimary.value = color;
    appConfig.ui.colors.primary = color;
  }

  function setNeutral(color: string) {
    neutral.value = color;
    cookieNeutral.value = color;
    appConfig.ui.colors.neutral = color;
  }

  function resetColor(
    color: string = definePrimary,
    neutral: string = defineNeutral,
  ) {
    cookiePrimary.value = color;
    cookieNeutral.value = neutral;
    appConfig.ui.colors.primary = color;
    appConfig.ui.colors.neutral = neutral;
  }

  return {
    primary,
    neutral,
    colors,
    neutrals,
    setPrimary,
    setNeutral,
    resetColor,
  };
});

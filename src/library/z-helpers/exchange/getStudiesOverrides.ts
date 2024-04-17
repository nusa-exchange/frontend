import colors from "@/colors";

export const getStudiesOverrides = (theme: ZTypes.Theme): ZTypes.StudiesOverrides => {
  const themes = {
    light: {
      c0: colors["color-down"],
      c1: colors["color-up"],
      t: 70
    },
    night: {
      c0: colors["color-down"],
      c1: colors["color-up"],
      t: 70
    }
  };
  const t = themes[theme];
  return {
    "volume.volume.color.0": t.c0,
    "volume.volume.color.1": t.c1,
    "volume.volume.transparency": t.t
  };
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@hooks": "./src/hooks",
            "@store": "./src/store",
            "@styles": "./src/styles",
            "@ptypes": "./src/types",
            "@animations": "./src/animations",
            "@utils": "./src/utils",
            "@constants": "./src/constants",
            "@assets": "./src/assets",
            // Adicione este alias para facilitar imports futuros
            "@mascot": "./src/components/mascot",
          },
          // Estas extensões ajudam o resolver a encontrar arquivos
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts', '.native.js'],
        },
      ],
      // Reanimated precisa ser o último plugin da lista - isso está correto!
      "react-native-reanimated/plugin",
    ],
  };
};
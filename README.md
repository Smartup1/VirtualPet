# CapyPet 🦫

Pet virtual estilo Tamagotchi feito com Expo + React Native + Reanimated.

## Setup

```bash
npm install
npx expo start
```

Para rodar no Android:

```bash
npx expo start --android
```

> Se você usar EAS Build para gerar o `.apk`/`.aab`, rode `npx eas build:configure` antes.

## Estrutura

- `app/` — rotas do Expo Router (`index.tsx` é a tela inicial)
- `src/components/` — peças visuais reutilizáveis
- `src/screens/` — telas completas (HomeScreen compõe os componentes)
- `src/store/` — estado global (Zustand + persistência em AsyncStorage)
- `src/hooks/` — `usePet` conecta a tela ao store e roda o decaimento de stats
- `src/animations/` — hooks de animação com Reanimated (idle, blink, eat, sleep)
- `src/styles/` — cores e tema centralizados
- `src/constants/` — valores de balanceamento do jogo (fácil de ajustar)

## O que já funciona

- Fome, felicidade, sono e higiene com decaimento automático por tempo (inclusive offline)
- Ações (comer, brincar, dormir, banho) que recuperam stats e dão XP
- Sistema de nível/XP básico
- Moedas e gemas (sem gasto real ainda — loja é o próximo passo)
- Persistência local automática via AsyncStorage
- Menu lateral animado (ainda sem telas de destino)
- Animações: respiração, piscar, pulo ao comer, "zzz" ao dormir

## Próximos passos sugeridos (nessa ordem)

1. **Loja** — tela para gastar moedas/gemas em itens cosméticos ou boosts
2. **Minijogos** — 1 minijogo simples primeiro (ex: reação/toque) que dá moedas
3. **Missões diárias** — checklist que reseta a cada 24h, dá XP/moedas
4. **Conquistas** — lista de marcos (nível 5, 7 dias seguidos, etc.)
5. **Notificações locais** — alertar quando fome/sono/higiene ficarem baixos
   (usar `expo-notifications`, já incluído no `app.json`)
6. **Save em nuvem** — sincronizar o estado do Zustand com Firebase/Supabase
7. **AdMob recompensado** — `react-native-google-mobile-ads` para moedas extras
8. **Arte final** — trocar o placeholder em `Pet.tsx` por imagem/Lottie da capivara

## Notas técnicas

- Os imports usam aliases (`@components/...`, `@store/...` etc.), configurados
  tanto no `tsconfig.json` (para o TypeScript) quanto no `babel.config.js` via
  `babel-plugin-module-resolver` (para o Metro resolver em runtime).
- `react-native-reanimated/plugin` **precisa** ser o último plugin do Babel.

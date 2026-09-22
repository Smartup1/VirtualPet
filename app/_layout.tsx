// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack>
        {/* Tela principal do jogo */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            title: 'CapyPet'
          }} 
        />
        
        {/* Telas secundárias — cada uma já tem seu próprio cabeçalho
            (fundo em gradiente + botão "← Voltar"), então o header nativo
            do Stack fica desligado para não duplicar visualmente. */}
        <Stack.Screen name="loja" options={{ headerShown: false, title: 'Loja' }} />
        <Stack.Screen name="missoes" options={{ headerShown: false, title: 'Missões' }} />
        <Stack.Screen name="conquistas" options={{ headerShown: false, title: 'Conquistas' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

      </Stack>
    </GestureHandlerRootView>
  );
}

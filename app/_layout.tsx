// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack>
        {/* Rota raiz - redireciona para home */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            title: 'CapyPet'
          }} 
        />
        
        {/* Tela principal do jogo */}
        <Stack.Screen 
          name="home" 
          options={{ 
            headerShown: false,
            title: 'CapyPet'
          }} 
        />
        
        {/* Tela da loja */}
        <Stack.Screen 
          name="loja" 
          options={{ 
            headerShown: true,
            title: '🛒 Loja',
            headerBackTitle: 'Voltar',
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
            headerTitleStyle: {
              fontWeight: '600',
              color: '#333',
            },
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

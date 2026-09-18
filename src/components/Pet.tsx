import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Vibration 
} from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, {
  Ellipse,
  Circle,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from "react-native-svg";

import { useIdleAnimation } from "@animations/idle";
import { useBlinkAnimation } from "@animations/blink";
import { useEatAnimation } from "@animations/eat";
import { useSleepAnimation } from "@animations/sleep";
import { useHappyAnimation } from "@animations/happy"; // NOVO
import { useDanceAnimation } from "@animations/dance";

import { colors } from "@styles/colors";
import { radius } from "@styles/theme";
import { PetMood } from "@ptypes/index";
import { SHOP_ITEMS } from "@constants/shopItems";

interface PetProps {
  mood: PetMood;
  equippedAccessory?: string | null;
  onPetPress?: () => void; // NOVO: callback opcional
}

const OUTLINE = "#5A351E";
const WIDTH = 320;
const HEIGHT = 390;

export default function Pet({
  mood,
  equippedAccessory,
  onPetPress,
}: PetProps) {
  const [isHappy, setIsHappy] = useState(false);
  const [isDancing, setIsDancing] = useState(false);

  // guarda o mood mais recente sem precisar recriar o efeito de dança
  // automática toda vez que ele muda
  const moodRef = useRef(mood);
  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  // Animações existentes
  const idleStyle = useIdleAnimation();
  const blinkStyle = useBlinkAnimation();
  const { animatedStyle: eatStyle, play: playEat } = useEatAnimation();
  const { bodyStyle: sleepBodyStyle, zStyle } = useSleepAnimation(mood === "sleeping");
  
  // NOVA animação de felicidade
  const { happyStyle } = useHappyAnimation(isHappy);

  // NOVA animação de dança
  const { danceStyle } = useDanceAnimation(isDancing);

  // dança sozinho de vez em quando, pra sempre ter movimento na tela
  // mesmo sem interação — mas não enquanto está dormindo ou comendo
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const agendarProximaDanca = () => {
      const espera = 6000 + Math.random() * 6000; // entre 6s e 12s

      timeoutId = setTimeout(() => {
        if (moodRef.current !== "sleeping" && moodRef.current !== "eating") {
          setIsDancing(true);
          setTimeout(() => setIsDancing(false), 1400);
        }
        agendarProximaDanca();
      }, espera);
    };

    agendarProximaDanca();

    return () => clearTimeout(timeoutId);
  }, []);

  // Acessório
  const accessory = equippedAccessory
    ? SHOP_ITEMS.find((item) => item.id === equippedAccessory)
    : null;

  // Efeito para comer
  useEffect(() => {
    if (mood === "eating") {
      playEat();
    }
  }, [mood, playEat]);

  // NOVA função de toque
  const handlePetPress = () => {
    // Feedback tátil (vibração) - opcional
    Vibration.vibrate(10);
    
    // Ativa animação feliz
    setIsHappy(true);

    // Ativa também a dança — o toque interrompe qualquer dança agendada
    // e começa uma nova na hora
    setIsDancing(true);
    setTimeout(() => setIsDancing(false), 1400);
    
    // Chama callback externo se existir
    if (onPetPress) {
      onPetPress();
    }
    
    // Desativa após 1.5 segundos
    setTimeout(() => {
      setIsHappy(false);
    }, 1500);
  };

  return (
    <TouchableOpacity
      onPress={handlePetPress}
      activeOpacity={0.85}
      style={styles.wrapper}
    >
      {/* ZZZ */}
      {mood === "sleeping" && (
        <Animated.Text style={[styles.zzz, zStyle]}>💤</Animated.Text>
      )}

      {/* Brilho de palco atrás do personagem — dá profundidade e um ar de
          "vitrine de app premium" em vez de um fundo chapado */}
      <View style={styles.stageGlow} pointerEvents="none">
        <ExpoLinearGradient
          colors={["rgba(255,216,143,0.35)", "rgba(255,216,143,0)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* Sombra suave em camadas (simula um blur real sem depender de
          filtros SVG, que têm suporte instável em React Native) */}
      <View style={styles.shadowOuter} pointerEvents="none" />
      <View style={styles.shadowMid} pointerEvents="none" />
      <View style={styles.shadowCore} pointerEvents="none" />

      {/* Corpo animado com TODAS as animações combinadas */}
      <Animated.View
        style={[
          styles.character,
          idleStyle,
          eatStyle,
          sleepBodyStyle,
          happyStyle, // NOVA animação
          danceStyle, // NOVA animação de dança
        ]}
      >
        <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          <Defs>
            <RadialGradient id="fur" cx="35%" cy="25%" r="80%">
              <Stop offset="0" stopColor="#FFD88F" />
              <Stop offset="0.35" stopColor="#F5BE68" />
              <Stop offset="0.72" stopColor="#D99345" />
              <Stop offset="1" stopColor="#B87332" />
            </RadialGradient>

            <RadialGradient id="ear" cx="35%" cy="25%" r="80%">
              <Stop offset="0" stopColor="#B8783F" />
              <Stop offset="1" stopColor="#70401F" />
            </RadialGradient>

            <RadialGradient id="snout" cx="35%" cy="20%" r="85%">
              <Stop offset="0" stopColor="#9A6237" />
              <Stop offset="0.6" stopColor="#714323" />
              <Stop offset="1" stopColor="#4D2B18" />
            </RadialGradient>

            <LinearGradient id="paw" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#9A6135" />
              <Stop offset="1" stopColor="#603719" />
            </LinearGradient>

            <RadialGradient id="belly" cx="50%" cy="25%" r="80%">
              <Stop offset="0" stopColor="#FFDFA4" />
              <Stop offset="1" stopColor="#D99A50" />
            </RadialGradient>

            {/* Realce (rim light) usado nas bordas superiores da cabeça e
                do corpo, pra dar sensação de material "fofo"/premium */}
            <LinearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.85} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* ================================================= */}
          {/* PATAS TRASEIRAS */}
          {/* ================================================= */}
          <Ellipse
            cx="76"
            cy="337"
            rx="39"
            ry="23"
            fill="url(#paw)"
            stroke={OUTLINE}
            strokeWidth="3"
          />
          <Ellipse
            cx="244"
            cy="337"
            rx="39"
            ry="23"
            fill="url(#paw)"
            stroke={OUTLINE}
            strokeWidth="3"
          />

          {/* ================================================= */}
          {/* CORPO */}
          {/* ================================================= */}
          <Ellipse
            cx="160"
            cy="275"
            rx="112"
            ry="94"
            fill="url(#fur)"
            stroke={OUTLINE}
            strokeWidth="3"
          />

          {/* Realce de luz no topo do corpo */}
          <Path
            d="M78 232 Q140 196 210 210"
            stroke="url(#rim)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity={0.55}
          />
          <Ellipse
            cx="160"
            cy="286"
            rx="76"
            ry="66"
            fill="url(#belly)"
            opacity={0.28}
          />

          {/* Sombra de contato: onde a cabeça "pousa" sobre o corpo */}
          <Ellipse
            cx="160"
            cy="222"
            rx="82"
            ry="18"
            fill="#5A2E12"
            opacity={0.16}
          />

          {/* ================================================= */}
          {/* ORELHAS */}
          {/* ================================================= */}
          <Ellipse
            cx="70"
            cy="88"
            rx="31"
            ry="42"
            fill="url(#fur)"
            stroke={OUTLINE}
            strokeWidth="4"
            transform="rotate(-18 70 88)"
          />
          <Ellipse
            cx="250"
            cy="88"
            rx="31"
            ry="42"
            fill="url(#fur)"
            stroke={OUTLINE}
            strokeWidth="4"
            transform="rotate(18 250 88)"
          />
          <Ellipse
            cx="70"
            cy="90"
            rx="16"
            ry="25"
            fill="url(#ear)"
            transform="rotate(-18 70 90)"
          />
          <Ellipse
            cx="250"
            cy="90"
            rx="16"
            ry="25"
            fill="url(#ear)"
            transform="rotate(18 250 90)"
          />

          {/* Sombra de contato: base das orelhas contra a cabeça */}
          <Ellipse cx="82" cy="112" rx="16" ry="10" fill="#5A2E12" opacity={0.14} transform="rotate(-18 82 112)" />
          <Ellipse cx="238" cy="112" rx="16" ry="10" fill="#5A2E12" opacity={0.14} transform="rotate(18 238 112)" />

          {/* ================================================= */}
          {/* CABEÇA */}
          {/* ================================================= */}
          <Ellipse
            cx="160"
            cy="157"
            rx="108"
            ry="112"
            fill="url(#fur)"
            stroke={OUTLINE}
            strokeWidth="3"
          />
          <Ellipse
            cx="120"
            cy="85"
            rx="48"
            ry="30"
            fill="#FFF1C8"
            opacity={0.22}
          />
          <Ellipse
            cx="104"
            cy="116"
            rx="22"
            ry="48"
            fill="#FFFFFF"
            opacity={0.08}
          />

          {/* Realce de luz no topo da cabeça — dá o acabamento "glossy" */}
          <Path
            d="M74 96 Q118 46 176 52"
            stroke="url(#rim)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />

          {/* ================================================= */}
          {/* SOBRANCELHAS */}
          {/* ================================================= */}
          <Path
            d="M95 120 Q113 103 133 116"
            stroke="#663B20"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M187 116 Q207 103 225 120"
            stroke="#663B20"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />

          {/* ================================================= */}
          {/* BOCHECHAS */}
          {/* ================================================= */}
          <Ellipse
            cx="72"
            cy="197"
            rx="19"
            ry="13"
            fill="#F18C7E"
            opacity={0.55}
          />
          <Ellipse
            cx="248"
            cy="197"
            rx="19"
            ry="13"
            fill="#F18C7E"
            opacity={0.55}
          />
          <Circle cx="67" cy="193" r="5" fill="#FFC4B8" opacity={0.65} />
          <Circle cx="243" cy="193" r="5" fill="#FFC4B8" opacity={0.65} />

          {/* ================================================= */}
          {/* FOCINHO */}
          {/* ================================================= */}
          <Ellipse
            cx="160"
            cy="199"
            rx="70"
            ry="58"
            fill="url(#snout)"
            stroke={OUTLINE}
            strokeWidth="3"
          />
          <Ellipse
            cx="135"
            cy="178"
            rx="25"
            ry="13"
            fill="#DFA16C"
            opacity={0.25}
          />

          {/* ================================================= */}
          {/* NARIZ */}
          {/* ================================================= */}
          <Ellipse cx="160" cy="179" rx="18" ry="12" fill="#321B10" />
          <Ellipse cx="154" cy="175" rx="5" ry="3" fill="#FFFFFF" opacity={0.18} />

          {/* ================================================= */}
          {/* BOCA */}
          {/* ================================================= */}
          <Path
            d="M160 195 Q157 213 143 216 Q160 232 177 216 Q163 213 160 195"
            fill="#3C2114"
          />
          <Ellipse cx="160" cy="219" rx="15" ry="9" fill="#E97870" />
          <Ellipse cx="155" cy="216" rx="6" ry="3" fill="#FFB0A8" opacity={0.7} />

          {/* ================================================= */}
          {/* PATAS DA FRENTE */}
          {/* ================================================= */}
          <Ellipse
            cx="103"
            cy="335"
            rx="27"
            ry="20"
            fill="url(#paw)"
            stroke={OUTLINE}
            strokeWidth="3"
          />
          <Ellipse
            cx="217"
            cy="335"
            rx="27"
            ry="20"
            fill="url(#paw)"
            stroke={OUTLINE}
            strokeWidth="3"
          />
          <Path
            d="M91 335 Q96 342 101 335"
            stroke="#4A2817"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M104 335 Q109 342 114 335"
            stroke="#4A2817"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M206 335 Q211 342 216 335"
            stroke="#4A2817"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M219 335 Q224 342 229 335"
            stroke="#4A2817"
            strokeWidth="3"
            fill="none"
          />

          {/* Brilho suave no topo das patas dianteiras, pra não ficarem
              "chapadas" ao lado do resto do corpo com gradiente */}
          <Ellipse cx="97" cy="327" rx="10" ry="5" fill="#FFFFFF" opacity={0.18} />
          <Ellipse cx="211" cy="327" rx="10" ry="5" fill="#FFFFFF" opacity={0.18} />

          {/* ================================================= */}
          {/* TEXTURA DA PELAGEM */}
          {/* ================================================= */}
          <Path
            d="M82 95 Q72 108 80 122"
            stroke="#C77E3D"
            strokeWidth="4"
            opacity={0.35}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M72 138 Q61 151 70 164"
            stroke="#C77E3D"
            strokeWidth="4"
            opacity={0.3}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M238 98 Q248 110 241 123"
            stroke="#B86E34"
            strokeWidth="4"
            opacity={0.3}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M76 251 Q62 264 72 277"
            stroke="#C57C3C"
            strokeWidth="5"
            opacity={0.28}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M245 250 Q258 263 248 277"
            stroke="#B66D32"
            strokeWidth="5"
            opacity={0.25}
            fill="none"
            strokeLinecap="round"
          />

          {/* ================================================= */}
          {/* TANGERINA */}
          {/* ================================================= */}
          {!accessory && (
            <>
              <Ellipse
                cx="160"
                cy="34"
                rx="7"
                ry="12"
                fill="#4D9D36"
                transform="rotate(-25 160 34)"
              />
              <Path
                d="M155 31 Q166 23 173 31"
                stroke="#397B2A"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <Circle
                cx="160"
                cy="57"
                r="28"
                fill="#FF8B20"
                stroke={OUTLINE}
                strokeWidth="3"
              />
              <Ellipse
                cx="150"
                cy="47"
                rx="10"
                ry="6"
                fill="#FFD080"
                opacity={0.65}
              />
              <Path
                d="M137 64 Q160 78 182 62"
                stroke="#E86F18"
                strokeWidth="3"
                opacity={0.4}
                fill="none"
              />
            </>
          )}
        </Svg>

        {/* OLHOS */}
        <Animated.View style={[styles.eyesLayer, blinkStyle]}>
          <View style={[styles.eye, { left: 82 }]}>
            <ExpoLinearGradient
              colors={["#4A3020", "#1C0F08"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.3, y: 0 }}
              end={{ x: 0.7, y: 1 }}
            />
            <View style={styles.eyeLargeShine} />
            <View style={styles.eyeSmallShine} />
          </View>
          <View style={[styles.eye, { left: 190 }]}>
            <ExpoLinearGradient
              colors={["#4A3020", "#1C0F08"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.3, y: 0 }}
              end={{ x: 0.7, y: 1 }}
            />
            <View style={styles.eyeLargeShine} />
            <View style={styles.eyeSmallShine} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Acessório */}
      {accessory && <Text style={styles.accessory}>{accessory.icon}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: WIDTH,
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  character: {
    width: WIDTH,
    height: HEIGHT,
  },
  stageGlow: {
    position: "absolute",
    width: WIDTH * 1.15,
    height: WIDTH * 1.15,
    borderRadius: (WIDTH * 1.15) / 2,
    top: HEIGHT / 2 - (WIDTH * 1.15) / 2 - 10,
  },
  // sombra composta em 3 camadas: cada uma mais estreita e mais escura,
  // simulando um blur suave de baixo custo (SVG filters são instáveis em RN)
  shadowOuter: {
    position: "absolute",
    bottom: -4,
    width: 250,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: "rgba(40, 20, 10, 0.08)",
    transform: [{ scaleX: 1.1 }],
  },
  shadowMid: {
    position: "absolute",
    bottom: 3,
    width: 210,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: "rgba(40, 20, 10, 0.14)",
    transform: [{ scaleX: 1.1 }],
  },
  shadowCore: {
    position: "absolute",
    bottom: 9,
    width: 160,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: "rgba(40, 20, 10, 0.20)",
    transform: [{ scaleX: 1.1 }],
  },
  eyesLayer: {
    position: "absolute",
    top: 136,
    left: 0,
    width: WIDTH,
    height: 65,
  },
  eye: {
    position: "absolute",
    width: 48,
    height: 58,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#432719",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  eyeLargeShine: {
    position: "absolute",
    top: 7,
    left: 9,
    width: 15,
    height: 17,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  eyeSmallShine: {
    position: "absolute",
    bottom: 9,
    right: 9,
    width: 6,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#FFF",
    opacity: 0.8,
  },
  zzz: {
    position: "absolute",
    top: -5,
    right: 15,
    fontSize: 32,
    zIndex: 20,
  },
  accessory: {
    position: "absolute",
    top: 0,
    fontSize: 42,
    zIndex: 20,
  },
});

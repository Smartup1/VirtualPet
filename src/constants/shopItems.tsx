import { ShopItem } from "@ptypes/index";

// Catálogo estático da loja. No futuro pode vir de um backend/remote config.
export const SHOP_ITEMS: ShopItem[] = [
  // Acessórios (cosméticos, permanentes, comprados uma vez)
  {
    id: "acc_bow",
    name: "Laço",
    description: "Um laço fofo para o pescoço da capivara.",
    icon: "🎀",
    price: 150,
    currency: "coins",
    category: "accessory",
  },
  {
    id: "acc_hat",
    name: "Chapéu de Sol",
    description: "Perfeito para dias quentes.",
    icon: "👒",
    price: 250,
    currency: "coins",
    category: "accessory",
  },
  {
    id: "acc_glasses",
    name: "Óculos Escuros",
    description: "Estiloso e um pouco convencido.",
    icon: "🕶️",
    price: 8,
    currency: "gems",
    category: "accessory",
  },
  {
    id: "acc_crown",
    name: "Coroa Dourada",
    description: "Para quando sua capivara for realeza.",
    icon: "👑",
    price: 25,
    currency: "gems",
    category: "accessory",
  },

  // Comida (consumível, recupera stats na hora)
  {
    id: "food_watermelon",
    name: "Melancia",
    description: "Recupera bastante fome.",
    icon: "🍉",
    price: 40,
    currency: "coins",
    category: "food",
    statBoost: { hunger: 35 },
  },
  {
    id: "food_carrot",
    name: "Cenoura",
    description: "Lanche rápido e saudável.",
    icon: "🥕",
    price: 20,
    currency: "coins",
    category: "food",
    statBoost: { hunger: 15 },
  },

  // Boosts (consumível, recupera outros stats)
  {
    id: "boost_soap",
    name: "Sabonete Especial",
    description: "Deixa a higiene no talo instantaneamente.",
    icon: "🧼",
    price: 30,
    currency: "coins",
    category: "boost",
    statBoost: { hygiene: 40 },
  },
  {
    id: "boost_pillow",
    name: "Travesseiro de Nuvem",
    description: "Recupera sono na hora, sem precisar esperar.",
    icon: "☁️",
    price: 6,
    currency: "gems",
    category: "boost",
    statBoost: { sleep: 50 },
  },
];

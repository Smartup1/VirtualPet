// src/constants/shopItems.ts
import { ShopItem } from "@ptypes/index";

export const SHOP_ITEMS: ShopItem[] = [
  // Acessórios
  {
    id: "hat_sun",
    name: "Chapéu de Sol",
    description: "Protege do sol com estilo",
    icon: "👒",
    price: 50,
    currency: "coins",
    category: "accessory",
  },
  {
    id: "hat_party",
    name: "Chapéu de Festa",
    description: "Para comemorar",
    icon: "🎉",
    price: 75,
    currency: "coins",
    category: "accessory",
  },
  {
    id: "glasses_cool",
    name: "Óculos Cool",
    description: "Estilo e atitude",
    icon: "😎",
    price: 100,
    currency: "coins",
    category: "accessory",
  },
  {
    id: "crown_gold",
    name: "Coroa de Ouro",
    description: "Para um pet real",
    icon: "👑",
    price: 10,
    currency: "gems",
    category: "accessory",
  },
  
  // Comidas (boost)
  {
    id: "food_pizza",
    name: "Pizza",
    description: "Recupera 40 de fome",
    icon: "🍕",
    price: 30,
    currency: "coins",
    category: "food",
    statBoost: { hunger: 40 },
  },
  {
    id: "food_icecream",
    name: "Sorvete",
    description: "Recupera 25 de felicidade",
    icon: "🍦",
    price: 25,
    currency: "coins",
    category: "food",
    statBoost: { happiness: 25 },
  },
  {
    id: "boost_energy",
    name: "Poção de Energia",
    description: "Recupera 50 de sono",
    icon: "⚡",
    price: 40,
    currency: "coins",
    category: "boost",
    statBoost: { sleep: 50 },
  },
  {
    id: "boost_hygiene",
    name: "Kit de Banho",
    description: "Recupera 40 de higiene",
    icon: "🧼",
    price: 35,
    currency: "coins",
    category: "boost",
    statBoost: { hygiene: 40 },
  },
];
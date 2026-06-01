/* =============================================================================
   data.js — Item Data
   Single source of truth for all items in the game.
   Each item object contains all properties needed for rendering and logic.
   ============================================================================= */

const ITEMS = [

    /* --- MATERIALS --- */
    {
        id:          "item_001",
        name:        "Wooden Stick",
        emoji:       "🪵",
        quantity:    10,
        rarity:      "common",
        type:        "material",
        description: "A simple wooden stick. Useful for crafting basic tools and weapons.",
        stars:       0
    },
    {
        id:          "item_002",
        name:        "Stone Chunk",
        emoji:       "🪨",
        quantity:    5,
        rarity:      "common",
        type:        "material",
        description: "A rough piece of stone. Can be shaped into arrowheads or building blocks.",
        stars:       0
    },
    {
        id:          "item_003",
        name:        "Iron Ore",
        emoji:       "🧱",
        quantity:    1,
        rarity:      "uncommon",
        type:        "material",
        description: "Raw iron ore extracted from deep caves. Smelt it to create iron bars.",
        stars:       0
    },
    {
        id:          "item_004",
        name:        "Silver Crystal",
        emoji:       "💎",
        quantity:    2,
        rarity:      "rare",
        type:        "material",
        description: "A rare silver crystal with magical properties. Sought after by enchanters.",
        stars:       0
    },
    {
        id:          "item_005",
        name:        "Hardwood Plank",
        emoji:       "📦",
        quantity:    8,
        rarity:      "common",
        type:        "material",
        description: "A processed plank of hardwood. Sturdy and ready for construction.",
        stars:       0
    },
    {
        id:          "item_006",
        name:        "Red Ore",
        emoji:       "🔶",
        quantity:    5,
        rarity:      "uncommon",
        type:        "material",
        description: "A crimson-hued ore with fire elemental traces. Used in forging flame weapons.",
        stars:       0
    },

    /* --- CONSUMABLES --- */
    {
        id:          "item_007",
        name:        "Health Potion",
        emoji:       "🧪",
        quantity:    3,
        rarity:      "common",
        type:        "consumable",
        description: "Restores 250 HP when consumed. A staple of any adventurer's pack.",
        stars:       0
    },
    {
        id:          "item_008",
        name:        "Mana Potion",
        emoji:       "💧",
        quantity:    2,
        rarity:      "common",
        type:        "consumable",
        description: "Restores 150 MP when consumed. Essential for spellcasters in long dungeons.",
        stars:       0
    },
    {
        id:          "item_009",
        name:        "Green Slime",
        emoji:       "🟢",
        quantity:    7,
        rarity:      "common",
        type:        "consumable",
        description: "A blob of magical green slime. Used in alchemy and as a lubricant for gears.",
        stars:       0
    },
    {
        id:          "item_010",
        name:        "Blue Flame Essence",
        emoji:       "🔵",
        quantity:    10,
        rarity:      "rare",
        type:        "consumable",
        description: "Condensed blue flame from an arcane spirit. Grants temporary magical resistance.",
        stars:       0
    },
    {
        id:          "item_011",
        name:        "Elixir of Fury",
        emoji:       "🔴",
        quantity:    4,
        rarity:      "uncommon",
        type:        "consumable",
        description: "A blood-red elixir that boosts attack power by 30% for 60 seconds.",
        stars:       0
    },
    {
        id:          "item_012",
        name:        "Solar Burst",
        emoji:       "🌟",
        quantity:    1,
        rarity:      "epic",
        type:        "consumable",
        description: "Releases a burst of solar energy, dealing AoE light damage to all nearby enemies.",
        stars:       0
    },

    /* --- FEATHERS & REAGENTS --- */
    {
        id:          "item_013",
        name:        "Blue Feather",
        emoji:       "🪶",
        quantity:    4,
        rarity:      "uncommon",
        type:        "material",
        description: "A feather from the rare Azurewind hawk. Used in fletching magical arrows.",
        stars:       0
    },
    {
        id:          "item_014",
        name:        "Red Feather",
        emoji:       "🍂",
        quantity:    10,
        rarity:      "common",
        type:        "material",
        description: "A common red feather. Good for basic arrow crafting and decoration.",
        stars:       0
    },
    {
        id:          "item_015",
        name:        "Golden Feather",
        emoji:       "✨",
        quantity:    2,
        rarity:      "rare",
        type:        "material",
        description: "An extremely rare feather from a golden phoenix. Said to bring good fortune.",
        stars:       0
    },

    /* --- FOOD --- */
    {
        id:          "item_016",
        name:        "Yellow Pear",
        emoji:       "🍐",
        quantity:    6,
        rarity:      "common",
        type:        "food",
        description: "A fresh yellow pear. Restores 40 HP and reduces hunger by 15%.",
        stars:       0
    },
    {
        id:          "item_017",
        name:        "Blue Fish",
        emoji:       "🐟",
        quantity:    3,
        rarity:      "common",
        type:        "food",
        description: "A shimmering blue fish caught in the Crystal Lake. Restores 80 HP.",
        stars:       0
    },
    {
        id:          "item_018",
        name:        "Raw Steak",
        emoji:       "🥩",
        quantity:    4,
        rarity:      "common",
        type:        "food",
        description: "A thick cut of raw meat. Cook it first for better HP restoration.",
        stars:       0
    },
    {
        id:          "item_019",
        name:        "Roasted Drumstick",
        emoji:       "🍗",
        quantity:    2,
        rarity:      "common",
        type:        "food",
        description: "A perfectly roasted drumstick. Restores 120 HP and grants +5 strength for 30s.",
        stars:       0
    },

    /* --- WEAPONS --- */
    {
        id:          "item_020",
        name:        "Iron Sword",
        emoji:       "⚔️",
        quantity:    1,
        rarity:      "uncommon",
        type:        "weapon",
        description: "A reliable iron sword. Deals 45–60 physical damage. Suitable for most warriors.",
        stars:       2
    },
    {
        id:          "item_021",
        name:        "Steel Blade",
        emoji:       "🗡️",
        quantity:    1,
        rarity:      "rare",
        type:        "weapon",
        description: "A finely crafted steel blade. Deals 80–95 physical damage. Balanced and precise.",
        stars:       2
    },
    {
        id:          "item_022",
        name:        "Arcane Sword",
        emoji:       "🌀",
        quantity:    1,
        rarity:      "legendary",
        type:        "weapon",
        description: "An ancient sword imbued with arcane energy. Deals 140–180 magic damage. Extremely rare.",
        stars:       3
    }

];

export type MaterialType =
  | "925 Sterling Silver"
  | "18K Yellow Gold"
  | "22K Yellow Gold"
  | "18K Rose Gold"
  | "Platinum 950";

export type CategoryType = "rings" | "earrings" | "necklaces" | "bracelets" | "pendants";

export interface ProductVariant {
  id: string;
  name: string;
  inStock: boolean;
  priceModifier?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CategoryType;
  collection: "silver-collection" | "gold" | "heritage" | "solitaire";
  material: MaterialType;
  availableMaterials: MaterialType[];
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  hoverImage: string;
  description: string;
  story: string;
  specifications: {
    metalPurity: string;
    hallmark: string;
    grossWeightApprox: string;
    dimensions: string;
    gemstones?: string;
    closureType?: string;
  };
  sizes?: string[];
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "vj-ring-01",
    slug: "fortress-of-aurora-solitaire-ring",
    title: "Fortress of Aurora Solitaire Ring",
    subtitle: "Artisan Pavé Crown & 1.5ct Radiant Cut",
    category: "rings",
    collection: "silver-collection",
    material: "925 Sterling Silver",
    availableMaterials: ["925 Sterling Silver", "18K Yellow Gold", "18K Rose Gold"],
    price: 14850,
    originalPrice: 16500,
    isBestSeller: true,
    isNew: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 42,
    images: [
      "/images/ring-solitaire.jpg",
      "/images/ring-hover.jpg",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "/images/ring-hover.jpg",
    description: "Hand-set in recycled 925 sterling silver with a triple-rhodium protective shield. Features a brilliant cushion-cut artisan centre stone cradled in a handcrafted geometric basket.",
    story: "Inspired by ancient Rajput palace architecture, the Fortress ring pays homage to architectural symmetry with subtle open-gallery light windows.",
    specifications: {
      metalPurity: "925 Solid Sterling Silver",
      hallmark: "BIS 925 Laser Stamped",
      grossWeightApprox: "5.82 grams",
      dimensions: "Basket 9.4mm x 9.4mm; Band 2.1mm",
      gemstones: "Lab-Grown Grade AAAAA Simulant (1.5ct eq.)",
    },
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9"],
    tags: ["solitaire", "bestseller", "silver", "pavé"],
  },
  {
    id: "vj-ring-02",
    slug: "chola-dynasty-carved-band",
    title: "Chola Heritage Intaglio Band",
    subtitle: "22K Solid Gold with Florentine Engravings",
    category: "rings",
    collection: "gold",
    material: "22K Yellow Gold",
    availableMaterials: ["22K Yellow Gold", "18K Rose Gold", "Platinum 950"],
    price: 48900,
    originalPrice: 52000,
    isBestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 38,
    images: [
      "/images/ring-hover.jpg",
      "/images/ring-solitaire.jpg",
    ],
    hoverImage: "/images/ring-solitaire.jpg",
    description: "An heirloom band cast in luminous 22-karat yellow gold. Featuring hand-chiseled temple motifs and a silky comfort-fit interior crafted for lifetime wear.",
    story: "Created by our 4th-generation goldsmiths in Jaipur, using heritage hand-graving techniques passed down across three centuries.",
    specifications: {
      metalPurity: "22K Solid Gold (916 Purity)",
      hallmark: "BIS 916 Hallmark with Unique HUID",
      grossWeightApprox: "7.15 grams",
      dimensions: "Width 5.5mm; Thickness 1.8mm",
    },
    sizes: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"],
    tags: ["heritage", "gold", "22k", "wedding", "bestseller"],
  },
  {
    id: "vj-neck-01",
    slug: "nocturne-layered-choker-necklace",
    title: "Nocturne Layered Choker Necklace",
    subtitle: "925 Sterling Silver with Graduated Herringbone Weave",
    category: "necklaces",
    collection: "silver-collection",
    material: "925 Sterling Silver",
    availableMaterials: ["925 Sterling Silver", "18K Yellow Gold"],
    price: 19800,
    originalPrice: 22500,
    isNew: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 29,
    images: [
      "/images/necklace-chain.jpg",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    description: "Fluid, liquid-like articulation that rests seamlessly along the collarbone. Hand-finished with micro-chamfered facets that reflect light with every breath.",
    story: "Sculpted to emulate the serene flow of moonlit rivers. Fluid movement is achieved through more than 180 individually linked silver segments.",
    specifications: {
      metalPurity: "925 Sterling Silver (Anti-Tarnish Treated)",
      hallmark: "BIS 925 Laser Guarantee",
      grossWeightApprox: "24.60 grams",
      dimensions: "Length 15.5 inches + 2.5 inch extender",
      closureType: "Bespoke Valchandson Spring Barrel Clasp",
    },
    sizes: ["16 inch", "18 inch"],
    tags: ["choker", "silver", "necklace", "statement"],
  },
  {
    id: "vj-neck-02",
    slug: "maharani-polki-pendant-necklace",
    title: "Maharani Polki Medallion Necklace",
    subtitle: "18K Gold, Uncut Natural Gemstone & Seed Pearls",
    category: "necklaces",
    collection: "gold",
    material: "18K Yellow Gold",
    availableMaterials: ["18K Yellow Gold", "18K Rose Gold"],
    price: 68500,
    originalPrice: 74000,
    isBestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 51,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      "/images/necklace-chain.jpg",
    ],
    hoverImage: "/images/necklace-chain.jpg",
    description: "A showstopping medallion set with traditional open-back polki uncut stones, encircled by Basra-style freshwater seed pearls and hung on a dainty twisted rope chain.",
    story: "Directly adapted from an archival 1978 Valchandson bridal sketch, re-imagined with modern lightweight comfort for contemporary formal wear.",
    specifications: {
      metalPurity: "18K Solid Gold (750 Purity)",
      hallmark: "BIS 750 Stamped with Bureau Certification",
      grossWeightApprox: "14.2 grams",
      dimensions: "Pendant Diameter 26mm; Chain Length 18 inches",
      gemstones: "Natural Polki Tourmaline & Cultured Pearls",
      closureType: "Safety Lobster Clasp",
    },
    sizes: ["18 inch", "20 inch"],
    tags: ["gold", "pendant", "bridal", "heirloom"],
  },
  {
    id: "vj-ear-01",
    slug: "celestial-cascade-drop-earrings",
    title: "Celestial Cascade Drop Earrings",
    subtitle: "925 Silver with Marquise Cuts & Baguette Falls",
    category: "earrings",
    collection: "silver-collection",
    material: "925 Sterling Silver",
    availableMaterials: ["925 Sterling Silver", "18K Yellow Gold"],
    price: 12400,
    originalPrice: 14000,
    isNew: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 34,
    images: [
      "/images/earrings-cascade.jpg",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    description: "Graceful waterfall drops engineered with ultra-light articulated joints for effortless day-to-night movement. Coated in platinum-group rhodium for everlasting shine.",
    story: "Capturing the fleeting shimmer of shooting stars over desert dunes, each earring contains 18 handset multi-faceted gems.",
    specifications: {
      metalPurity: "925 Solid Sterling Silver",
      hallmark: "BIS 925 Hallmark",
      grossWeightApprox: "8.4 grams (pair)",
      dimensions: "Length 48mm; Width 7mm",
      closureType: "Secure Post with Butterfly & Silicone Grip",
    },
    tags: ["earrings", "silver", "drops", "evening"],
  },
  {
    id: "vj-ear-02",
    slug: "solaris-hammered-gold-huggie-hoops",
    title: "Solaris Hammered Gold Huggie Hoops",
    subtitle: "18K Yellow Gold Everyday Atelier Hoops",
    category: "earrings",
    collection: "gold",
    material: "18K Yellow Gold",
    availableMaterials: ["18K Yellow Gold", "18K Rose Gold", "Platinum 950"],
    price: 32600,
    isBestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 62,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
      "/images/earrings-cascade.jpg",
    ],
    hoverImage: "/images/earrings-cascade.jpg",
    description: "Substantial yet feather-light. Hand-hammered along the outer curve to create an organic, sun-dappled texture that catches gentle ambient radiance.",
    story: "Designed for the woman who never takes her jewellery off. Safe for sleeping, working, and swimming with a secure click-lock mechanism.",
    specifications: {
      metalPurity: "18K Solid Yellow Gold (750)",
      hallmark: "BIS 750 Hallmarked with Unique HUID",
      grossWeightApprox: "5.10 grams (pair)",
      dimensions: "Outer Diameter 14mm; Thickness 3.2mm",
      closureType: "Seamless Integrated Click-Lobe Lock",
    },
    tags: ["hoops", "gold", "huggies", "daily-wear"],
  },
  {
    id: "vj-brac-01",
    slug: "serpentine-sculpted-cuff-bracelet",
    title: "Serpentine Sculpted Cuff Bracelet",
    subtitle: "925 Sterling Silver Flexible Tension Bangle",
    category: "bracelets",
    collection: "silver-collection",
    material: "925 Sterling Silver",
    availableMaterials: ["925 Sterling Silver", "18K Yellow Gold"],
    price: 18200,
    originalPrice: 20500,
    isBestSeller: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 22,
    images: [
      "/images/bracelet-cuff.jpg",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    description: "An architectural open-cuff rendered in heavyweight sterling silver. Tapered ergonomic ends contour comfortably against the wrist bone.",
    story: "Embodying modern Indian minimalism, this cuff eliminates all unnecessary ornamentation to celebrate the pure luster of polished silver.",
    specifications: {
      metalPurity: "925 Solid Sterling Silver",
      hallmark: "BIS 925 Stamped",
      grossWeightApprox: "28.5 grams",
      dimensions: "Inner Circumference 6.5 inches (Adjustable)",
    },
    sizes: ["Small (6.0\")", "Standard (6.5\")", "Large (7.0\")"],
    tags: ["cuff", "silver", "bracelet", "minimalist"],
  },
  {
    id: "vj-brac-02",
    slug: "artisan-tennis-bracelet-solitaire-cut",
    title: "Artisan Solitaire Tennis Bracelet",
    subtitle: "18K Yellow Gold with 4-Prong Continuous Setting",
    category: "bracelets",
    collection: "gold",
    material: "18K Yellow Gold",
    availableMaterials: ["18K Yellow Gold", "18K Rose Gold", "925 Sterling Silver"],
    price: 84900,
    originalPrice: 92000,
    isNew: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 47,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80",
      "/images/bracelet-cuff.jpg",
    ],
    hoverImage: "/images/bracelet-cuff.jpg",
    description: "The definitive luxury statement. Fifty individual round-brilliant stones, each hand-selected for optimal fire and scintillation in a flexible gold link system.",
    story: "Crafted with double safety latches, this piece reflects our founder's belief that true luxury must withstand active everyday living.",
    specifications: {
      metalPurity: "18K Solid Gold (750 Purity)",
      hallmark: "BIS 750 Hallmarked",
      grossWeightApprox: "15.8 grams",
      dimensions: "Length 7.0 inches; Width 3.0mm",
      gemstones: "Lab-Crafted VVS1 D-Color Equivalents (3.5ct total)",
      closureType: "Box Clasp with Dual Hidden Safety Latches",
    },
    sizes: ["6.5 inch", "7.0 inch", "7.5 inch"],
    tags: ["tennis", "gold", "bracelet", "luxury"],
  },
  {
    id: "vj-ring-03",
    slug: "luna-crescent-pearl-ring",
    title: "Luna Crescent Pearl & Diamond Ring",
    subtitle: "South Sea Cultured Pearl cradled in 925 Silver",
    category: "rings",
    collection: "silver-collection",
    material: "925 Sterling Silver",
    availableMaterials: ["925 Sterling Silver", "18K Yellow Gold"],
    price: 11200,
    isNew: true,
    inStock: true,
    rating: 4.7,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80",
    description: "An iridescent 8.5mm South Sea button pearl embraced by an asymmetrical pavé crescent arch. Radiates soft organic charm.",
    story: "Honoring India's historic pearl fisheries of Tuticorin, reimagined into an avant-garde celestial cocktail ring.",
    specifications: {
      metalPurity: "925 Sterling Silver",
      hallmark: "BIS 925 Certified",
      grossWeightApprox: "4.9 grams",
      dimensions: "Pearl 8.5mm; Arch Height 11mm",
    },
    sizes: ["US 5", "US 6", "US 7", "US 8"],
    tags: ["pearl", "silver", "rings", "cocktail"],
  },
  {
    id: "vj-pend-01",
    slug: "sol-invictus-heritage-amulet",
    title: "Sol Invictus Heritage Amulet",
    subtitle: "22K Solid Gold Sun Talisman on Silk Cord Chain",
    category: "pendants",
    collection: "gold",
    material: "22K Yellow Gold",
    availableMaterials: ["22K Yellow Gold", "18K Yellow Gold"],
    price: 54200,
    isBestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 41,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    description: "A deeply embossed solar disk evoking Vedic sun symbols. Polished high-relief sun rays contrast against an antique stippled background.",
    story: "Representing warmth, perseverance, and prosperity, traditionally gifted during milestone life transitions.",
    specifications: {
      metalPurity: "22K Solid Yellow Gold (916 Purity)",
      hallmark: "BIS 916 Stamped with HUID",
      grossWeightApprox: "8.90 grams",
      dimensions: "Medallion Diameter 22mm; Bail 4mm",
    },
    tags: ["pendant", "amulet", "22k", "gold", "talisman"],
  },
  {
    id: "vj-ear-03",
    slug: "chandrika-filigree-jhumkas",
    title: "Chandrika Modern Filigree Drops",
    subtitle: "925 Sterling Silver with Micro-Bead Fringing",
    category: "earrings",
    collection: "silver-collection",
    material: "925 Sterling Silver",
    availableMaterials: ["925 Sterling Silver", "18K Yellow Gold"],
    price: 9800,
    originalPrice: 11500,
    isBestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 56,
    images: [
      "/images/earrings-cascade.jpg",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    description: "A contemporary reinvention of the classic bell jhumka. Open-wire geometric filigree keeps the earrings airy and balanced on sensitive earlobes.",
    story: "Formed using gossamer-thin sterling wires twisted and soldered under magnification by our silver master crafters.",
    specifications: {
      metalPurity: "925 Solid Sterling Silver",
      hallmark: "BIS 925 Hallmark",
      grossWeightApprox: "11.2 grams (pair)",
      dimensions: "Total Drop 38mm; Dome 18mm",
    },
    tags: ["silver", "jhumka", "earrings", "festive"],
  },
  {
    id: "vj-ring-04",
    slug: "eternity-florentine-emerald-band",
    title: "Florentine Emerald Eternity Band",
    subtitle: "18K Gold with Step-Cut Colombian Green Stones",
    category: "rings",
    collection: "gold",
    material: "18K Yellow Gold",
    availableMaterials: ["18K Yellow Gold", "18K Rose Gold", "Platinum 950"],
    price: 42000,
    originalPrice: 46000,
    isNew: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 18,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    ],
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    description: "Intense verdant green step-cut gems channel-set within an eternity band of satin-finished 18K yellow gold with milgrain borders.",
    story: "Green emerald has historically stood for rebirth and good fortune in royal Indian jewelry collections.",
    specifications: {
      metalPurity: "18K Solid Gold (750)",
      hallmark: "BIS 750 Bureau Certified",
      grossWeightApprox: "5.4 grams",
      dimensions: "Band Width 3.8mm",
      gemstones: "Lab Hydrothermal Colombian Emeralds (1.8ct total)",
    },
    sizes: ["US 6", "US 7", "US 8", "US 9"],
    tags: ["emerald", "eternity", "gold", "rings"],
  },
];

export const CATEGORIES = [
  {
    id: "rings",
    name: "Rings",
    slug: "rings",
    count: 8,
    image: "/images/ring-solitaire.jpg",
    description: "Handcrafted solitaires, heirloom bands, and modern cocktail statements.",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    slug: "necklaces",
    count: 6,
    image: "/images/necklace-chain.jpg",
    description: "Articulated chokers, heritage medallions, and cascading collars.",
  },
  {
    id: "earrings",
    name: "Earrings",
    slug: "earrings",
    count: 7,
    image: "/images/earrings-cascade.jpg",
    description: "Architectural drops, everyday huggies, and filigree earrings.",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    slug: "bracelets",
    count: 5,
    image: "/images/bracelet-cuff.jpg",
    description: "Solid silver tension cuffs and continuous solitaire tennis bracelets.",
  },
  {
    id: "silver-collection",
    name: "Silver Collection",
    slug: "silver-collection",
    count: 12,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    description: "Luminous 925 sterling silver hallmarked creations inspired by Beyond Larissa's signature edition.",
  },
  {
    id: "gold",
    name: "Gold Collection",
    slug: "gold",
    count: 10,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    description: "BIS hallmarked 18K and 22K yellow and rose gold heirloom creations.",
  },
];

export const PROMO_CODES: Record<string, { type: "percent" | "fixed"; value: number; description: string }> = {
  VALCHAND10: {
    type: "percent",
    value: 10,
    description: "10% off your heirloom order",
  },
  GOLDEN2026: {
    type: "fixed",
    value: 2000,
    description: "₹2,000 festive atelier discount",
  },
  WELCOME5: {
    type: "percent",
    value: 5,
    description: "5% welcoming member privileges",
  },
};

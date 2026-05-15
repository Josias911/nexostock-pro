export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category:
    | "Audio"
    | "Accesorios"
    | "Pantallas"
    | "Ropa"
    | "Herramientas"
    | "Repuestos";
  stock: number;
  status: "Disponible" | "Stock bajo" | "Agotado" | "Reservado";
  imageCode: string;
  isNew: boolean;
  isFeatured: boolean;
  description: string;
};

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Auriculares Pro",
    slug: "auriculares-pro",
    price: 695,
    category: "Audio",
    stock: 42,
    status: "Disponible",
    imageCode: "AUD-01",
    isNew: true,
    isFeatured: true,
    description: "Sonido claro, estuche compacto y bateria para jornadas largas.",
  },
  {
    id: "prod-002",
    name: "Bocina Bluetooth Max",
    slug: "bocina-bluetooth-max",
    price: 540,
    category: "Audio",
    stock: 18,
    status: "Disponible",
    imageCode: "AUD-02",
    isNew: false,
    isFeatured: true,
    description: "Bocina portatil con bajos potentes y conexion inalambrica.",
  },
  {
    id: "prod-003",
    name: "Teclado Mecanico",
    slug: "teclado-mecanico",
    price: 890,
    category: "Accesorios",
    stock: 24,
    status: "Disponible",
    imageCode: "ACC-14",
    isNew: false,
    isFeatured: false,
    description: "Teclas precisas, estructura resistente y respuesta rapida.",
  },
  {
    id: "prod-004",
    name: "Mouse Inalambrico",
    slug: "mouse-inalambrico",
    price: 285,
    category: "Accesorios",
    stock: 67,
    status: "Disponible",
    imageCode: "ACC-22",
    isNew: true,
    isFeatured: false,
    description: "Diseño ergonomico con sensor optico y bateria recargable.",
  },
  {
    id: "prod-005",
    name: "Monitor 27 pulgadas",
    slug: "monitor-27-pulgadas",
    price: 2495,
    category: "Pantallas",
    stock: 7,
    status: "Stock bajo",
    imageCode: "PAN-27",
    isNew: false,
    isFeatured: true,
    description: "Panel amplio para oficina, diseño delgado y colores definidos.",
  },
  {
    id: "prod-006",
    name: "Camisa Industrial",
    slug: "camisa-industrial",
    price: 165,
    category: "Ropa",
    stock: 35,
    status: "Disponible",
    imageCode: "ROP-08",
    isNew: true,
    isFeatured: false,
    description: "Tela fresca, costuras reforzadas y corte comodo para trabajo.",
  },
  {
    id: "prod-007",
    name: "Taladro Compacto",
    slug: "taladro-compacto",
    price: 725,
    category: "Herramientas",
    stock: 11,
    status: "Stock bajo",
    imageCode: "HER-31",
    isNew: false,
    isFeatured: true,
    description: "Equipo liviano para perforaciones precisas en uso diario.",
  },
  {
    id: "prod-008",
    name: "Kit de Repuestos Basico",
    slug: "kit-repuestos-basico",
    price: 315,
    category: "Repuestos",
    stock: 0,
    status: "Agotado",
    imageCode: "REP-05",
    isNew: false,
    isFeatured: false,
    description: "Piezas esenciales para mantenimiento preventivo y correctivo.",
  },
];

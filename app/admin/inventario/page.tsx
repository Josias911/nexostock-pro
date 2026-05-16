"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { products as baseProducts, type Product } from "@/lib/products";

const ADMIN_PRODUCTS_KEY = "nexostock_admin_products";
const INVENTORY_MOVEMENTS_KEY = "nexostock_inventory_movements";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Pedidos", href: "#" },
  { label: "Clientes", href: "#" },
  { label: "Reportes", href: "#" },
];

type ProductRow = Product & {
  source: "base" | "local";
};

type MovementType = "Entrada" | "Salida" | "Ajuste";

type InventoryMovement = {
  id: string;
  date: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reason: string;
  user: string;
};

type ActiveMovement = {
  product: Product;
  type: MovementType;
};

const exampleMovements: InventoryMovement[] = [
  {
    id: "sample-001",
    date: "15/05/2026",
    productName: "Auriculares Pro",
    type: "Entrada",
    quantity: 12,
    reason: "Reposicion semanal",
    user: "Admin",
  },
  {
    id: "sample-002",
    date: "15/05/2026",
    productName: "Monitor 27 pulgadas",
    type: "Salida",
    quantity: 3,
    reason: "Pedido confirmado",
    user: "Ventas",
  },
  {
    id: "sample-003",
    date: "14/05/2026",
    productName: "Taladro Compacto",
    type: "Ajuste",
    quantity: 10,
    reason: "Conteo fisico",
    user: "Inventario",
  },
  {
    id: "sample-004",
    date: "14/05/2026",
    productName: "Kit de Repuestos Basico",
    type: "Entrada",
    quantity: 8,
    reason: "Ingreso de proveedor",
    user: "Admin",
  },
];

const getStatusFromStock = (stock: number): Product["status"] => {
  if (stock === 0) {
    return "Agotado";
  }

  if (stock <= 10) {
    return "Stock bajo";
  }

  return "Disponible";
};

const getDisplayQuantity = (movement: InventoryMovement) => {
  if (movement.type === "Entrada") {
    return `+${movement.quantity}`;
  }

  if (movement.type === "Salida") {
    return `-${movement.quantity}`;
  }

  return String(movement.quantity);
};

const formatMovementDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

export default function AdminInventoryPage() {
  const [storedProducts, setStoredProducts] = useState<Product[]>([]);
  const [savedMovements, setSavedMovements] = useState<InventoryMovement[]>([]);
  const [activeMovement, setActiveMovement] = useState<ActiveMovement | null>(
    null,
  );
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      const savedProducts = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
      const movements = window.localStorage.getItem(INVENTORY_MOVEMENTS_KEY);

      if (savedProducts) {
        try {
          setStoredProducts(JSON.parse(savedProducts) as Product[]);
        } catch {
          window.localStorage.removeItem(ADMIN_PRODUCTS_KEY);
        }
      }

      if (movements) {
        try {
          setSavedMovements(JSON.parse(movements) as InventoryMovement[]);
        } catch {
          window.localStorage.removeItem(INVENTORY_MOVEMENTS_KEY);
        }
      }
    });
  }, []);

  const allProducts = useMemo<ProductRow[]>(
    () => [
      ...baseProducts.map((product) => ({ ...product, source: "base" as const })),
      ...storedProducts.map((product) => ({
        ...product,
        source: "local" as const,
      })),
    ],
    [storedProducts],
  );

  const movementsToShow = useMemo(() => {
    if (savedMovements.length === 0) {
      return exampleMovements;
    }

    return [...savedMovements].sort(
      (firstMovement, secondMovement) =>
        new Date(secondMovement.date).getTime() -
        new Date(firstMovement.date).getTime(),
    );
  }, [savedMovements]);

  const summaryCards = useMemo(() => {
    const availableUnits = allProducts.reduce(
      (total, product) => total + product.stock,
      0,
    );
    const lowStockProducts = allProducts.filter(
      (product) => product.status === "Stock bajo" || product.stock <= 10,
    );
    const outOfStockProducts = allProducts.filter(
      (product) => product.status === "Agotado" || product.stock === 0,
    );

    return [
      {
        label: "Total de productos",
        value: allProducts.length,
        detail: "Productos en inventario",
      },
      {
        label: "Unidades disponibles",
        value: availableUnits,
        detail: "Existencias registradas",
      },
      {
        label: "Productos con stock bajo",
        value: lowStockProducts.length,
        detail: "Requieren reposicion",
      },
      {
        label: "Productos agotados",
        value: outOfStockProducts.length,
        detail: "Sin unidades disponibles",
      },
    ];
  }, [allProducts]);

  const openMovement = (product: Product, type: MovementType) => {
    setActiveMovement({ product, type });
    setQuantity("");
    setReason("");
    setErrorMessage("");
  };

  const closeMovement = () => {
    setActiveMovement(null);
    setQuantity("");
    setReason("");
    setErrorMessage("");
  };

  const saveMovement = () => {
    if (!activeMovement) {
      return;
    }

    const numericQuantity = Number(quantity);
    const isValidQuantity =
      Number.isInteger(numericQuantity) &&
      (activeMovement.type === "Ajuste"
        ? numericQuantity >= 0
        : numericQuantity > 0);

    if (!isValidQuantity) {
      setErrorMessage("Ingresa una cantidad valida");
      return;
    }

    let updatedStock = activeMovement.product.stock;

    if (activeMovement.type === "Entrada") {
      updatedStock += numericQuantity;
    }

    if (activeMovement.type === "Salida") {
      updatedStock -= numericQuantity;
    }

    if (activeMovement.type === "Ajuste") {
      updatedStock = numericQuantity;
    }

    if (updatedStock < 0) {
      setErrorMessage("No puedes dejar el stock en negativo");
      return;
    }

    const updatedProducts = storedProducts.map((product) =>
      product.id === activeMovement.product.id
        ? {
            ...product,
            stock: updatedStock,
            status: getStatusFromStock(updatedStock),
          }
        : product,
    );

    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      date: new Date().toISOString(),
      productName: activeMovement.product.name,
      type: activeMovement.type,
      quantity: numericQuantity,
      reason: reason.trim() || "Sin motivo especificado",
      user: "Admin",
    };

    const updatedMovements = [newMovement, ...savedMovements];

    window.localStorage.setItem(
      ADMIN_PRODUCTS_KEY,
      JSON.stringify(updatedProducts),
    );
    window.localStorage.setItem(
      INVENTORY_MOVEMENTS_KEY,
      JSON.stringify(updatedMovements),
    );

    setStoredProducts(updatedProducts);
    setSavedMovements(updatedMovements);
    closeMovement();
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-slate-950 px-6 py-6 text-white lg:w-72 lg:border-b-0 lg:border-r lg:border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black text-white">
              N
            </span>
            <span className="text-lg font-bold tracking-tight">
              NexoStock Pro
            </span>
          </Link>

          <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  item.label === "Inventario"
                    ? "bg-emerald-500 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 px-6 py-8 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Administracion
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Inventario
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Controla existencias, stock bajo y movimientos de productos
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <article
                key={card.label}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">
                  {card.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
              </article>
            ))}
          </div>

          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">Control de inventario</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Vista visual de existencias y acciones pendientes.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Codigo</th>
                    <th className="px-6 py-4 font-bold">Producto</th>
                    <th className="px-6 py-4 font-bold">Categoria</th>
                    <th className="px-6 py-4 font-bold">Stock</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4 font-bold">Accion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-emerald-700">
                        {product.imageCode}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {product.slug}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900">
                          {product.stock}
                        </span>
                        <span className="ml-2 text-xs font-semibold text-slate-500">
                          unidades
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {product.source === "base" ? (
                            <>
                              <button
                                className="cursor-not-allowed rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400"
                                disabled
                                type="button"
                              >
                                Entrada
                              </button>
                              <button
                                className="cursor-not-allowed rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400"
                                disabled
                                type="button"
                              >
                                Salida
                              </button>
                              <button
                                className="cursor-not-allowed rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400"
                                disabled
                                type="button"
                              >
                                Ajuste
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                                onClick={() => openMovement(product, "Entrada")}
                                type="button"
                              >
                                Entrada
                              </button>
                              <button
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
                                onClick={() => openMovement(product, "Salida")}
                                type="button"
                              >
                                Salida
                              </button>
                              <button
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                                onClick={() => openMovement(product, "Ajuste")}
                                type="button"
                              >
                                Ajuste
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-bold">Movimientos recientes</h2>
              <p className="mt-1 text-sm text-slate-500">
                Historial visual de entradas, salidas y ajustes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Fecha</th>
                    <th className="px-6 py-4 font-bold">Producto</th>
                    <th className="px-6 py-4 font-bold">Tipo</th>
                    <th className="px-6 py-4 font-bold">Cantidad</th>
                    <th className="px-6 py-4 font-bold">Usuario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movementsToShow.map((movement) => (
                    <tr
                      key={movement.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {formatMovementDate(movement.date)}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {movement.productName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {movement.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        {getDisplayQuantity(movement)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {movement.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>

      {activeMovement ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center sm:justify-center">
          <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-lg">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Movimiento de inventario
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {activeMovement.product.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Tipo de movimiento: {activeMovement.type}
                </p>
              </div>
              <button
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                onClick={closeMovement}
                type="button"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-5">
              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Stock actual:{" "}
                <span className="font-black text-slate-950">
                  {activeMovement.product.stock}
                </span>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">
                  Cantidad
                </span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  min={activeMovement.type === "Ajuste" ? 0 : 1}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder={
                    activeMovement.type === "Ajuste"
                      ? "Nuevo stock"
                      : "Cantidad del movimiento"
                  }
                  type="number"
                  value={quantity}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">
                  Motivo
                </span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  onChange={(event) => {
                    setReason(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Ej. Compra a proveedor, pedido confirmado o conteo fisico"
                  value={reason}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                onClick={closeMovement}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-700"
                onClick={saveMovement}
                type="button"
              >
                Guardar movimiento
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

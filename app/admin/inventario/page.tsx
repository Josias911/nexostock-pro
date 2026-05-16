"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { products as baseProducts, type Product } from "@/lib/products";

const ADMIN_PRODUCTS_KEY = "nexostock_admin_products";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Pedidos", href: "#" },
  { label: "Clientes", href: "#" },
  { label: "Reportes", href: "#" },
];

const recentMovements = [
  {
    date: "15/05/2026",
    product: "Auriculares Pro",
    type: "Entrada",
    quantity: "+12",
    user: "Admin",
  },
  {
    date: "15/05/2026",
    product: "Monitor 27 pulgadas",
    type: "Salida",
    quantity: "-3",
    user: "Ventas",
  },
  {
    date: "14/05/2026",
    product: "Taladro Compacto",
    type: "Ajuste",
    quantity: "-1",
    user: "Inventario",
  },
  {
    date: "14/05/2026",
    product: "Kit de Repuestos Basico",
    type: "Entrada",
    quantity: "+8",
    user: "Admin",
  },
];

export default function AdminInventoryPage() {
  const [storedProducts, setStoredProducts] = useState<Product[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const savedProducts = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);

      if (savedProducts) {
        try {
          setStoredProducts(JSON.parse(savedProducts) as Product[]);
        } catch {
          window.localStorage.removeItem(ADMIN_PRODUCTS_KEY);
        }
      }
    });
  }, []);

  const allProducts = useMemo(
    () => [...baseProducts, ...storedProducts],
    [storedProducts],
  );

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
                          <button
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                            type="button"
                          >
                            Entrada
                          </button>
                          <button
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-amber-50 hover:text-amber-700"
                            type="button"
                          >
                            Salida
                          </button>
                          <button
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                            type="button"
                          >
                            Ajuste
                          </button>
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
                  {recentMovements.map((movement) => (
                    <tr
                      key={`${movement.date}-${movement.product}-${movement.type}`}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {movement.date}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {movement.product}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {movement.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        {movement.quantity}
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
    </main>
  );
}

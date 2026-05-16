"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { products as baseProducts, type Product } from "@/lib/products";

const ADMIN_PRODUCTS_KEY = "nexostock_admin_products";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "#" },
  { label: "Pedidos", href: "#" },
  { label: "Clientes", href: "#" },
  { label: "Reportes", href: "#" },
];

const formatPrice = (price: number) =>
  `Q${price.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

type ProductRow = Product & {
  source: "base" | "local";
};

export default function AdminProductsPage() {
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

  const deleteStoredProduct = (productId: string) => {
    const shouldDelete = window.confirm(
      "¿Seguro que deseas eliminar este producto?",
    );

    if (!shouldDelete) {
      return;
    }

    setStoredProducts((currentProducts) => {
      const updatedProducts = currentProducts.filter(
        (product) => product.id !== productId,
      );

      window.localStorage.setItem(
        ADMIN_PRODUCTS_KEY,
        JSON.stringify(updatedProducts),
      );

      return updatedProducts;
    });
  };

  const summaryCards = useMemo(() => {
    const featuredProducts = allProducts.filter((product) => product.isFeatured);
    const newProducts = allProducts.filter((product) => product.isNew);
    const lowStockProducts = allProducts.filter(
      (product) => product.status === "Stock bajo" || product.stock <= 10,
    );

    return [
      {
        label: "Total productos",
        value: allProducts.length,
        detail: "Productos registrados",
      },
      {
        label: "Productos destacados",
        value: featuredProducts.length,
        detail: "Visibles como prioridad",
      },
      {
        label: "Productos nuevos",
        value: newProducts.length,
        detail: "Marcados para lanzamiento",
      },
      {
        label: "Stock bajo",
        value: lowStockProducts.length,
        detail: "Requieren revisión",
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
                  item.label === "Productos"
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Administración
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Productos
              </h1>
              <p className="mt-2 text-slate-500">
                Administra los productos del catálogo
              </p>
            </div>
            <Link
              href="/admin/productos/nuevo"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Nuevo producto
            </Link>
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
                <h2 className="text-xl font-bold">Listado de productos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Vista administrativa del catálogo actual.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Código</th>
                    <th className="px-6 py-4 font-bold">Nombre</th>
                    <th className="px-6 py-4 font-bold">Categoría</th>
                    <th className="px-6 py-4 font-bold">Precio</th>
                    <th className="px-6 py-4 font-bold">Stock</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4 font-bold">Acciones</th>
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
                      <td className="px-6 py-4 font-semibold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700">
                            Ver
                          </button>
                          {product.source === "base" ? (
                            <button
                              className="cursor-not-allowed rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400"
                              disabled
                              type="button"
                            >
                              Base
                            </button>
                          ) : (
                            <Link
                              href={`/admin/productos/editar/${product.slug}`}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              Editar
                            </Link>
                          )}
                          {product.source === "base" ? (
                            <button
                              className="cursor-not-allowed rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400"
                              disabled
                              type="button"
                            >
                              Base
                            </button>
                          ) : (
                            <button
                              className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                              onClick={() => deleteStoredProduct(product.id)}
                              type="button"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
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

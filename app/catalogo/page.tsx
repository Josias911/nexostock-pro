import Link from "next/link";

import { products } from "@/lib/products";

const formatPrice = (price: number) =>
  `Q${price.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CatalogoPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-950">
      <header className="border-b border-emerald-950/10 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-700/20">
              N
            </span>
            <span className="text-lg font-bold tracking-tight">
              NexoStock Pro
            </span>
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Entrar
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Catálogo digital
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Catálogo de productos
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Explora productos de ejemplo con precios en quetzales, categorías
              y estados de inventario listos para una experiencia comercial
              clara.
            </p>
          </div>

          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-slate-500">
              <svg
                aria-hidden="true"
                className="size-5 text-emerald-700"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
              </svg>
              <span className="sr-only">Buscar productos</span>
              <input
                className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Buscar por nombre, categoría o precio"
                type="search"
              />
            </label>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex min-h-[28rem] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {product.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {product.status}
                  </span>
                  {product.isNew ? (
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                      Nuevo
                    </span>
                  ) : null}
                  {product.isFeatured ? (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                      Destacado
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex h-28 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                      Código visual
                    </p>
                    <p className="mt-2 text-3xl font-black text-emerald-700">
                      {product.imageCode}
                    </p>
                  </div>
                </div>

                <h2 className="mt-6 text-xl font-bold">{product.name}</h2>
                <p className="mt-3 min-h-14 text-sm leading-7 text-slate-600">
                  {product.description}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Precio
                    </p>
                    <p className="mt-1 text-3xl font-black tracking-tight">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Stock
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-900">
                      {product.stock}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/catalogo/${product.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Ver detalle
                </Link>
                <button className="h-11 rounded-full bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700">
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

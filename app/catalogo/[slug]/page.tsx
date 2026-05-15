import Link from "next/link";

import { products } from "@/lib/products";

const formatPrice = (price: number) =>
  `Q${price.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
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
              href="/catalogo"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Volver al catálogo
            </Link>
          </nav>
        </header>

        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-black text-emerald-700">
            N
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tight">
            Producto no encontrado
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            El producto solicitado no existe en el catálogo actual.
          </p>
        </section>
      </main>
    );
  }

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
            href="/catalogo"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Volver al catálogo
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5">
          <div className="flex min-h-80 items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50 px-6 py-16">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
                Código visual del producto
              </p>
              <p className="mt-4 text-6xl font-black tracking-tight text-emerald-700">
                {product.imageCode}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
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

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {product.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Precio
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight">
                {formatPrice(product.price)}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Stock disponible
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight">
                {product.stock}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700">
              Agregar al carrito
            </button>
            <button className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700">
              Consultar por WhatsApp
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

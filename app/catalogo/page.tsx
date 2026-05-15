import Link from "next/link";

const products = [
  {
    name: "Auriculares Pro",
    price: "$89.00",
    category: "Audio",
    stock: "Disponible",
  },
  {
    name: "Teclado Mecánico",
    price: "$124.00",
    category: "Accesorios",
    stock: "Disponible",
  },
  {
    name: "Monitor 27 pulgadas",
    price: "$329.00",
    category: "Pantallas",
    stock: "Stock bajo",
  },
  {
    name: "Mouse Inalámbrico",
    price: "$42.00",
    category: "Accesorios",
    stock: "Disponible",
  },
  {
    name: "Laptop Empresarial",
    price: "$1,150.00",
    category: "Computadoras",
    stock: "Disponible",
  },
  {
    name: "Impresora Térmica",
    price: "$210.00",
    category: "Punto de venta",
    stock: "Reservado",
  },
];

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
              Explora productos de ejemplo con precios, categorías y estados de
              inventario listos para una experiencia comercial clara.
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
              key={product.name}
              className="flex min-h-64 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {product.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {product.stock}
                  </span>
                </div>
                <div className="mt-8 flex h-24 items-center justify-center rounded-2xl bg-slate-50">
                  <span className="text-3xl font-black text-emerald-700">
                    {product.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-bold">{product.name}</h2>
                <p className="mt-2 text-3xl font-black tracking-tight">
                  {product.price}
                </p>
              </div>

              <button className="mt-6 h-11 rounded-full bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700">
                Agregar
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

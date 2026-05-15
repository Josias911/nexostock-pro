const features = [
  {
    title: "Catálogo digital",
    description:
      "Organiza tus productos con precios, disponibilidad y detalles listos para vender.",
    icon: (
      <path d="M6 7.5h12M6 12h12M6 16.5h7M5 3.5h14A1.5 1.5 0 0 1 20.5 5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5Z" />
    ),
  },
  {
    title: "Control de inventario",
    description:
      "Monitorea entradas, salidas y existencias para evitar faltantes o sobrestock.",
    icon: (
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5m-8-4.5 8 4.5" />
    ),
  },
  {
    title: "Pedidos por WhatsApp",
    description:
      "Convierte consultas en pedidos rápidos con una experiencia simple para tus clientes.",
    icon: (
      <path d="M7.5 17.5 4 20l.8-4.1A8.2 8.2 0 1 1 7.5 17.5Zm2-8.3c.2 3 2.3 5.1 5.3 5.3l1-1.3c.2-.3.1-.7-.2-.9l-1.3-.7a.8.8 0 0 0-.9.1l-.5.5a5 5 0 0 1-2.1-2.1l.5-.5a.8.8 0 0 0 .1-.9l-.7-1.3a.7.7 0 0 0-.9-.2l-1.3 1Z" />
    ),
  },
  {
    title: "Reportes de ventas",
    description:
      "Consulta indicadores claros para entender ingresos, pedidos y productos destacados.",
    icon: (
      <path d="M5 19V5m0 14h14M9 15v-4m4 4V8m4 7v-6" />
    ),
  },
  {
    title: "Usuarios y roles",
    description:
      "Asigna permisos por área para que cada persona trabaje con acceso controlado.",
    icon: (
      <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20m9.5-12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM20 20v-1.2a3.2 3.2 0 0 0-2.4-3.1M16 4.3a3.5 3.5 0 0 1 0 6.4" />
    ),
  },
  {
    title: "Generación de PDF",
    description:
      "Crea comprobantes, cotizaciones y documentos profesionales desde el sistema.",
    icon: (
      <path d="M7 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Zm6 0v4h4M8.5 14h7M8.5 17h5" />
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-emerald-950/10 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-700/20">
              N
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-950">
              NexoStock Pro
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-emerald-700" href="#inicio">
              Inicio
            </a>
            <a
              className="transition hover:text-emerald-700"
              href="#caracteristicas"
            >
              Características
            </a>
            <a className="transition hover:text-emerald-700" href="#demo">
              Demo
            </a>
            <a className="transition hover:text-emerald-700" href="#contacto">
              Contacto
            </a>
          </div>
        </nav>
      </header>

      <section
        id="inicio"
        className="relative isolate overflow-hidden border-b border-emerald-950/10"
      >
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_34%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Sistema web para catálogo, ventas e inventario
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Administra productos, pedidos, clientes, inventario y reportes
              desde una plataforma moderna, rápida y pensada para negocios que
              necesitan vender con orden.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700"
              >
                Ver demo
              </a>
              <a
                href="#contacto"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Entrar al panel
              </a>
            </div>
          </div>

          <div
            id="demo"
            className="rounded-[2rem] border border-emerald-950/10 bg-white p-4 shadow-2xl shadow-emerald-950/10"
          >
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    Panel comercial
                  </p>
                  <p className="text-2xl font-bold">Resumen de hoy</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  En línea
                </div>
              </div>

              <div className="grid gap-3 py-5 sm:grid-cols-3">
                {["Ventas", "Pedidos", "Stock bajo"].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10"
                  >
                    <p className="text-xs text-slate-300">{item}</p>
                    <p className="mt-2 text-2xl font-black">
                      {index === 0 ? "$8.4k" : index === 1 ? "36" : "12"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  ["Auriculares Pro", "Disponible", "86"],
                  ["Teclado Mecánico", "Reservado", "24"],
                  ["Monitor 27 pulgadas", "Stock bajo", "7"],
                ].map(([name, status, amount]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-slate-950"
                  >
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-xs text-slate-500">{status}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                      {amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="caracteristicas" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Todo lo necesario para vender y controlar tu operación
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            NexoStock Pro centraliza las tareas diarias para que tu equipo
            trabaje con información clara, menos fricción y mejores decisiones.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <svg
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-center text-white shadow-2xl shadow-slate-950/20 sm:px-10 lg:px-16">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            Lleva tu catálogo, ventas e inventario a un solo lugar
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Empieza con una base ordenada para vender mejor, responder más
            rápido y tomar decisiones con datos confiables.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#demo"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition hover:bg-emerald-50"
            >
              Ver demo
            </a>
            <a
              href="#inicio"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-bold text-white transition hover:border-emerald-300 hover:text-emerald-200"
            >
              Entrar al panel
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

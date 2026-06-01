"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Reportes", href: "/admin/reportes" },
];

const summaryCards = [
  {
    label: "Ventas del mes",
    value: "Q44.9k",
    detail: "Crecimiento estable",
  },
  {
    label: "Pedidos del mes",
    value: "42",
    detail: "18 completados",
  },
  {
    label: "Productos vendidos",
    value: "186",
    detail: "Unidades acumuladas",
  },
  {
    label: "Stock bajo",
    value: "7",
    detail: "Requieren revision",
  },
];

const weeklySales = [
  { label: "Semana 1", value: "Q8,420", percent: 54 },
  { label: "Semana 2", value: "Q11,860", percent: 76 },
  { label: "Semana 3", value: "Q9,740", percent: 62 },
  { label: "Semana 4", value: "Q14,920", percent: 94 },
];

const topProducts = [
  {
    product: "Auriculares Pro",
    category: "Audio",
    units: 38,
    income: "Q26,410.00",
  },
  {
    product: "Monitor 27 pulgadas",
    category: "Pantallas",
    units: 12,
    income: "Q29,940.00",
  },
  {
    product: "Mouse Inalambrico",
    category: "Accesorios",
    units: 44,
    income: "Q12,540.00",
  },
  {
    product: "Taladro Compacto",
    category: "Herramientas",
    units: 16,
    income: "Q11,600.00",
  },
];

const inventoryAlerts = [
  {
    code: "PAN-27",
    product: "Monitor 27 pulgadas",
    stock: 7,
    status: "Stock bajo",
  },
  {
    code: "HER-31",
    product: "Taladro Compacto",
    stock: 9,
    status: "Stock bajo",
  },
  {
    code: "REP-05",
    product: "Kit de Repuestos Basico",
    stock: 0,
    status: "Agotado",
  },
];

const generalSummary = [
  { label: "Total vendido", value: "Q44,940.00" },
  { label: "Promedio por pedido", value: "Q1,070.00" },
  { label: "Cliente mas frecuente", value: "Distribuidora Luna" },
  { label: "Producto mas vendido", value: "Mouse Inalambrico" },
];

export default function AdminReportsPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let shouldIgnoreResult = false;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (shouldIgnoreResult) {
        return;
      }

      if (!session) {
        router.replace("/login");
        return;
      }

      setIsCheckingAuth(false);
    };

    checkSession();

    return () => {
      shouldIgnoreResult = true;
    };
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-950">
        <p className="text-lg font-bold text-slate-500">
          Verificando acceso...
        </p>
      </main>
    );
  }

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
                  item.label === "Reportes"
                    ? "bg-emerald-500 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 text-sm font-bold text-white transition hover:border-emerald-300 hover:bg-emerald-500"
            onClick={logout}
            type="button"
          >
            Cerrar sesión
          </button>
        </aside>

        <section className="flex-1 px-6 py-8 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Administracion
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Reportes
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Analiza ventas, pedidos, inventario y productos destacados
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

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold">Resumen de ventas</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Comparativo visual de ventas por semana.
                </p>
              </div>

              <div className="mt-6 grid gap-5">
                {weeklySales.map((week) => (
                  <div key={week.label}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-bold text-slate-700">
                        {week.label}
                      </span>
                      <span className="text-sm font-black text-slate-950">
                        {week.value}
                      </span>
                    </div>
                    <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${week.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Resumen general</h2>
              <p className="mt-1 text-sm text-slate-500">
                Indicadores principales del periodo actual.
              </p>

              <div className="mt-6 grid gap-4">
                {generalSummary.map((item) => (
                  <article
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <p className="text-sm font-semibold text-slate-500">
                      {item.label}
                    </p>
                    <p className="text-right text-lg font-black text-slate-950">
                      {item.value}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-bold">Productos mas vendidos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ranking visual de productos con mayor salida.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Producto</th>
                    <th className="px-6 py-4 font-bold">Categoria</th>
                    <th className="px-6 py-4 font-bold">Unidades vendidas</th>
                    <th className="px-6 py-4 font-bold">Ingresos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((product) => (
                    <tr key={product.product} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {product.product}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        {product.units}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {product.income}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold">Alertas de inventario</h2>
              <p className="mt-1 text-sm text-slate-500">
                Productos con stock bajo o agotado.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {inventoryAlerts.map((item) => (
                <article
                  key={item.code}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                        {item.code}
                      </p>
                      <h3 className="mt-2 font-black text-slate-950">
                        {item.product}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === "Agotado"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-slate-500">
                    Stock actual
                  </p>
                  <p className="mt-1 text-3xl font-black">{item.stock}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

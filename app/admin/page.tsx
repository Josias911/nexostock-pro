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
  { label: "Productos", value: "248", detail: "32 categorias activas" },
  { label: "Pedidos", value: "36", detail: "8 pendientes de revisar" },
  { label: "Ventas del día", value: "$8.4k", detail: "18 ventas completadas" },
  { label: "Stock bajo", value: "12", detail: "Requieren reposición" },
];

const recentOrders = [
  {
    id: "#NP-1024",
    client: "Distribuidora Luna",
    total: "$640.00",
    status: "Confirmado",
  },
  {
    id: "#NP-1023",
    client: "Tienda Central",
    total: "$285.00",
    status: "Pendiente",
  },
  {
    id: "#NP-1022",
    client: "Carlos Mendez",
    total: "$1,120.00",
    status: "En preparación",
  },
  {
    id: "#NP-1021",
    client: "Office Market",
    total: "$430.00",
    status: "Entregado",
  },
];

export default function AdminPage() {
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
                  item.label === "Dashboard"
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Administración
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Dashboard
              </h1>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Ver catálogo
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
                <h2 className="text-xl font-bold">Pedidos recientes</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Últimos movimientos registrados en ventas.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Pedido</th>
                    <th className="px-6 py-4 font-bold">Cliente</th>
                    <th className="px-6 py-4 font-bold">Total</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.client}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {order.total}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {order.status}
                        </span>
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

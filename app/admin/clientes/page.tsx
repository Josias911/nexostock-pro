"use client";

import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Reportes", href: "#" },
];

const clients = [
  {
    name: "Mariana Lopez",
    phone: "502 4210 8821",
    municipality: "Guatemala",
    department: "Guatemala",
    orders: 8,
    totalPurchased: "Q6,840.00",
    lastOrder: "15/05/2026",
    status: "Activo",
  },
  {
    name: "Distribuidora Luna",
    phone: "502 3388 4022",
    municipality: "Mixco",
    department: "Guatemala",
    orders: 14,
    totalPurchased: "Q18,420.00",
    lastOrder: "15/05/2026",
    status: "Activo",
  },
  {
    name: "Tienda Central",
    phone: "502 5541 2098",
    municipality: "Villa Nueva",
    department: "Guatemala",
    orders: 6,
    totalPurchased: "Q4,980.00",
    lastOrder: "14/05/2026",
    status: "Activo",
  },
  {
    name: "Carlos Mendez",
    phone: "502 4122 7730",
    municipality: "San Miguel Petapa",
    department: "Guatemala",
    orders: 3,
    totalPurchased: "Q1,930.00",
    lastOrder: "14/05/2026",
    status: "Activo",
  },
  {
    name: "Office Market",
    phone: "502 3091 6655",
    municipality: "Antigua Guatemala",
    department: "Sacatepequez",
    orders: 11,
    totalPurchased: "Q12,760.00",
    lastOrder: "13/05/2026",
    status: "Inactivo",
  },
];

const totalOrders = clients.reduce((total, client) => total + client.orders, 0);

const summaryCards = [
  {
    label: "Total clientes",
    value: clients.length,
    detail: "Clientes registrados",
  },
  {
    label: "Clientes activos",
    value: clients.filter((client) => client.status === "Activo").length,
    detail: "Con actividad reciente",
  },
  {
    label: "Pedidos acumulados",
    value: totalOrders,
    detail: "Pedidos historicos",
  },
  {
    label: "Total vendido",
    value: "Q44.9k",
    detail: "Ventas asociadas",
  },
];

const featuredClient = clients[1];

type Client = (typeof clients)[number];

type ClientOrder = {
  id: string;
  date: string;
  total: string;
  status: string;
  paymentMethod: string;
};

const clientDetails: Record<
  string,
  { address: string; email: string; history: ClientOrder[] }
> = {
  "502 4210 8821": {
    address: "Zona 10, 12 calle 4-55, Guatemala",
    email: "mariana.lopez@nexostock.demo",
    history: [
      {
        id: "#NP-1032",
        date: "15/05/2026",
        total: "Q1,245.00",
        status: "Pendiente",
        paymentMethod: "Pago contra entrega",
      },
      {
        id: "#NP-1018",
        date: "08/05/2026",
        total: "Q860.00",
        status: "Entregado",
        paymentMethod: "Deposito o transferencia",
      },
    ],
  },
  "502 3388 4022": {
    address: "Boulevard El Naranjo, bodega 8, Mixco",
    email: "compras@distribuidoraluna.demo",
    history: [
      {
        id: "#NP-1031",
        date: "15/05/2026",
        total: "Q2,860.00",
        status: "Confirmado",
        paymentMethod: "Deposito o transferencia",
      },
      {
        id: "#NP-1009",
        date: "02/05/2026",
        total: "Q3,420.00",
        status: "Entregado",
        paymentMethod: "Deposito o transferencia",
      },
    ],
  },
  "502 5541 2098": {
    address: "Centro comercial local 14, Villa Nueva",
    email: "tiendacentral@nexostock.demo",
    history: [
      {
        id: "#NP-1030",
        date: "14/05/2026",
        total: "Q780.00",
        status: "En preparacion",
        paymentMethod: "Pago contra entrega",
      },
      {
        id: "#NP-1004",
        date: "28/04/2026",
        total: "Q1,140.00",
        status: "Entregado",
        paymentMethod: "Pago contra entrega",
      },
    ],
  },
  "502 4122 7730": {
    address: "Colonia Prados, casa 22, San Miguel Petapa",
    email: "carlos.mendez@nexostock.demo",
    history: [
      {
        id: "#NP-1029",
        date: "14/05/2026",
        total: "Q430.00",
        status: "Entregado",
        paymentMethod: "Pago contra entrega",
      },
    ],
  },
  "502 3091 6655": {
    address: "5a avenida norte 18, Antigua Guatemala",
    email: "ventas@officemarket.demo",
    history: [
      {
        id: "#NP-1028",
        date: "13/05/2026",
        total: "Q1,120.00",
        status: "Cancelado",
        paymentMethod: "Deposito o transferencia",
      },
      {
        id: "#NP-0996",
        date: "19/04/2026",
        total: "Q2,300.00",
        status: "Entregado",
        paymentMethod: "Deposito o transferencia",
      },
    ],
  },
};

const getClientDetail = (client: Client) =>
  clientDetails[client.phone] ?? {
    address: "Direccion de ejemplo, zona central",
    email: "cliente@nexostock.demo",
    history: [
      {
        id: "#NP-0001",
        date: client.lastOrder,
        total: client.totalPurchased,
        status: "Entregado",
        paymentMethod: "Pago contra entrega",
      },
    ],
  };

export default function AdminClientsPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [historyClient, setHistoryClient] = useState<Client | null>(null);

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
                  item.label === "Clientes"
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
              Clientes
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Consulta clientes, pedidos y comportamiento de compra
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
                <h2 className="text-xl font-bold">Listado de clientes</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Vista comercial de clientes y actividad de compra.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Cliente</th>
                    <th className="px-6 py-4 font-bold">Telefono</th>
                    <th className="px-6 py-4 font-bold">Municipio</th>
                    <th className="px-6 py-4 font-bold">Departamento</th>
                    <th className="px-6 py-4 font-bold">Pedidos</th>
                    <th className="px-6 py-4 font-bold">Total comprado</th>
                    <th className="px-6 py-4 font-bold">Ultimo pedido</th>
                    <th className="px-6 py-4 font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((client) => (
                    <tr key={client.phone} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">
                          {client.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-emerald-700">
                          {client.status}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {client.phone}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {client.municipality}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {client.department}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        {client.orders}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {client.totalPurchased}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {client.lastOrder}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => setSelectedClient(client)}
                            type="button"
                          >
                            Ver
                          </button>
                          <button
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                            onClick={() => setHistoryClient(client)}
                            type="button"
                          >
                            Historial
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">Cliente destacado</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Perfil con mayor actividad comercial reciente.
                </p>
              </div>
              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {featuredClient.status}
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:col-span-1">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Nombre del cliente
                </p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">
                  {featuredClient.name}
                </h3>
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  {featuredClient.phone}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {featuredClient.municipality}
                </p>
              </article>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Total de pedidos
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {featuredClient.orders}
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Total comprado
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {featuredClient.totalPurchased}
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-2">
                  <p className="text-sm font-semibold text-slate-500">
                    Ultimo pedido realizado
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {featuredClient.lastOrder}
                  </p>
                </article>
              </div>
            </div>
          </section>
        </section>
      </div>

      {selectedClient ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center sm:justify-center">
          <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Datos del cliente
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {selectedClient.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {selectedClient.phone}
                </p>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                onClick={() => setSelectedClient(null)}
                type="button"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Nombre del cliente", value: selectedClient.name },
                { label: "Telefono", value: selectedClient.phone },
                { label: "Municipio", value: selectedClient.municipality },
                { label: "Departamento", value: selectedClient.department },
                { label: "Estado", value: selectedClient.status },
                { label: "Total de pedidos", value: selectedClient.orders },
                { label: "Total comprado", value: selectedClient.totalPurchased },
                { label: "Ultimo pedido", value: selectedClient.lastOrder },
                {
                  label: "Direccion de ejemplo",
                  value: getClientDetail(selectedClient).address,
                },
                {
                  label: "Correo de ejemplo",
                  value: getClientDetail(selectedClient).email,
                },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-black text-slate-900">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {historyClient ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center sm:justify-center">
          <section className="max-h-[90vh] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:max-w-3xl">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Historial de pedidos
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {historyClient.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {historyClient.phone}
                </p>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                onClick={() => setHistoryClient(null)}
                type="button"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-5">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-bold">Pedido</th>
                      <th className="px-5 py-4 font-bold">Fecha</th>
                      <th className="px-5 py-4 font-bold">Total</th>
                      <th className="px-5 py-4 font-bold">Estado</th>
                      <th className="px-5 py-4 font-bold">Metodo de pago</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getClientDetail(historyClient).history.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-black text-emerald-700">
                          {order.id}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {order.date}
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {order.total}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {order.paymentMethod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

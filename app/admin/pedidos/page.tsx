"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ORDERS_STORAGE_KEY = "nexostock_orders";

type OrderStatus =
  | "Pendiente"
  | "Confirmado"
  | "En preparación"
  | "Entregado"
  | "Cancelado";

type OrderProduct = {
  name: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
};

type Order = {
  id: string;
  client: string;
  phone: string;
  municipality: string;
  address?: string;
  paymentMethod?: string;
  products?: OrderProduct[];
  total: string;
  status: OrderStatus;
  date: string;
};

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Reportes", href: "/admin/reportes" },
];

const statusOptions: OrderStatus[] = [
  "Pendiente",
  "Confirmado",
  "En preparación",
  "Entregado",
  "Cancelado",
];

const exampleOrders: Order[] = [
  {
    id: "#NP-1032",
    client: "Mariana Lopez",
    phone: "502 4210 8821",
    municipality: "Guatemala",
    address: "Zona 10, 12 calle 4-55, oficina 302",
    paymentMethod: "Pago contra entrega",
    products: [
      {
        name: "Auriculares Pro",
        quantity: 1,
        unitPrice: "Q695.00",
        subtotal: "Q695.00",
      },
      {
        name: "Mouse Inalambrico",
        quantity: 2,
        unitPrice: "Q285.00",
        subtotal: "Q570.00",
      },
    ],
    total: "Q1,245.00",
    status: "Pendiente",
    date: "15/05/2026",
  },
  {
    id: "#NP-1031",
    client: "Distribuidora Luna",
    phone: "502 3388 4022",
    municipality: "Mixco",
    address: "Boulevard El Naranjo, bodega 8",
    paymentMethod: "Depósito o transferencia",
    products: [
      {
        name: "Monitor 27 pulgadas",
        quantity: 1,
        unitPrice: "Q2,495.00",
        subtotal: "Q2,495.00",
      },
      {
        name: "Kit de Repuestos Basico",
        quantity: 1,
        unitPrice: "Q365.00",
        subtotal: "Q365.00",
      },
    ],
    total: "Q2,860.00",
    status: "Confirmado",
    date: "15/05/2026",
  },
  {
    id: "#NP-1030",
    client: "Tienda Central",
    phone: "502 5541 2098",
    municipality: "Villa Nueva",
    address: "Centro comercial local 14, zona 4",
    paymentMethod: "Pago contra entrega",
    products: [
      {
        name: "Bocina Bluetooth Max",
        quantity: 1,
        unitPrice: "Q540.00",
        subtotal: "Q540.00",
      },
      {
        name: "Camisa Industrial",
        quantity: 1,
        unitPrice: "Q240.00",
        subtotal: "Q240.00",
      },
    ],
    total: "Q780.00",
    status: "En preparación",
    date: "14/05/2026",
  },
  {
    id: "#NP-1029",
    client: "Carlos Mendez",
    phone: "502 4122 7730",
    municipality: "San Miguel Petapa",
    address: "Colonia Prados, casa 22",
    paymentMethod: "Pago contra entrega",
    products: [
      {
        name: "Teclado Mecanico",
        quantity: 1,
        unitPrice: "Q430.00",
        subtotal: "Q430.00",
      },
    ],
    total: "Q430.00",
    status: "Entregado",
    date: "14/05/2026",
  },
  {
    id: "#NP-1028",
    client: "Office Market",
    phone: "502 3091 6655",
    municipality: "Antigua Guatemala",
    address: "5a avenida norte 18",
    paymentMethod: "Depósito o transferencia",
    products: [
      {
        name: "Taladro Compacto",
        quantity: 1,
        unitPrice: "Q725.00",
        subtotal: "Q725.00",
      },
      {
        name: "Kit de Repuestos Basico",
        quantity: 1,
        unitPrice: "Q395.00",
        subtotal: "Q395.00",
      },
    ],
    total: "Q1,120.00",
    status: "Cancelado",
    date: "13/05/2026",
  },
];

const latestOrderProducts = [
  { name: "Auriculares Pro", quantity: 1, subtotal: "Q695.00" },
  { name: "Mouse Inalambrico", quantity: 2, subtotal: "Q570.00" },
];

const fallbackProducts: OrderProduct[] = [
  {
    name: "Auriculares Pro",
    quantity: 1,
    unitPrice: "Q695.00",
    subtotal: "Q695.00",
  },
  {
    name: "Mouse Inalambrico",
    quantity: 2,
    unitPrice: "Q285.00",
    subtotal: "Q570.00",
  },
];

const normalizeOrderStatus = (status: string): OrderStatus => {
  if (status === "En preparacion") {
    return "En preparación";
  }

  if (statusOptions.includes(status as OrderStatus)) {
    return status as OrderStatus;
  }

  return "Pendiente";
};

const getStatusClass = (status: OrderStatus) => {
  if (status === "Pendiente") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "Confirmado") {
    return "bg-sky-50 text-sky-700";
  }

  if (status === "En preparación") {
    return "bg-violet-50 text-violet-700";
  }

  if (status === "Entregado") {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-red-50 text-red-700";
};

const getOrderProducts = (order: Order) =>
  order.products && order.products.length > 0
    ? order.products
    : fallbackProducts;

const getOrderAddress = (order: Order) =>
  order.address ?? "Direccion de ejemplo, zona central";

const getOrderPaymentMethod = (order: Order) =>
  order.paymentMethod ?? "Pago contra entrega";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(exampleOrders);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>("Pendiente");
  const latestOrder = orders[0] ?? exampleOrders[0];

  useEffect(() => {
    queueMicrotask(() => {
      const savedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);

      if (savedOrders) {
        try {
          const parsedOrders = (JSON.parse(savedOrders) as Order[]).map(
            (order) => ({
              ...order,
              status: normalizeOrderStatus(order.status),
            }),
          );

          setOrders(parsedOrders);
          window.localStorage.setItem(
            ORDERS_STORAGE_KEY,
            JSON.stringify(parsedOrders),
          );
          return;
        } catch {
          window.localStorage.removeItem(ORDERS_STORAGE_KEY);
        }
      }

      window.localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(exampleOrders),
      );
      setOrders(exampleOrders);
    });
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        label: "Total pedidos",
        value: orders.length,
        detail: "Pedidos registrados",
      },
      {
        label: "Pendientes",
        value: orders.filter((order) => order.status === "Pendiente").length,
        detail: "Por confirmar",
      },
      {
        label: "En preparación",
        value: orders.filter((order) => order.status === "En preparación")
          .length,
        detail: "En proceso interno",
      },
      {
        label: "Entregados",
        value: orders.filter((order) => order.status === "Entregado").length,
        detail: "Pedidos completados",
      },
    ],
    [orders],
  );

  const openStatusModal = (order: Order) => {
    setActiveOrder(order);
    setSelectedStatus(order.status);
  };

  const closeStatusModal = () => {
    setActiveOrder(null);
    setSelectedStatus("Pendiente");
  };

  const openDetailModal = (order: Order) => {
    setDetailOrder(order);
  };

  const closeDetailModal = () => {
    setDetailOrder(null);
  };

  const saveOrderStatus = () => {
    if (!activeOrder) {
      return;
    }

    const updatedOrders = orders.map((order) =>
      order.id === activeOrder.id
        ? { ...order, status: selectedStatus }
        : order,
    );

    window.localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(updatedOrders),
    );
    setOrders(updatedOrders);
    closeStatusModal();
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
                  item.label === "Pedidos"
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
              Pedidos
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Administra los pedidos recibidos desde el catalogo
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
                <h2 className="text-xl font-bold">Listado de pedidos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Seguimiento visual de pedidos recibidos y estados actuales.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Pedido</th>
                    <th className="px-6 py-4 font-bold">Cliente</th>
                    <th className="px-6 py-4 font-bold">Telefono</th>
                    <th className="px-6 py-4 font-bold">Municipio</th>
                    <th className="px-6 py-4 font-bold">Total</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4 font-bold">Fecha</th>
                    <th className="px-6 py-4 font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-black text-emerald-700">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {order.client}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.phone}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.municipality}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {order.total}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => openDetailModal(order)}
                            type="button"
                          >
                            Ver
                          </button>
                          <button
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                            onClick={() => openStatusModal(order)}
                            type="button"
                          >
                            Cambiar estado
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
                <h2 className="text-xl font-bold">
                  Detalle rapido del ultimo pedido
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Resumen visual para revision inicial del pedido mas reciente.
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                  latestOrder.status,
                )}`}
              >
                {latestOrder.status}
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Datos del cliente
                </h3>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-semibold text-slate-500">Nombre</dt>
                    <dd className="font-bold text-slate-900">
                      {latestOrder.client}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-semibold text-slate-500">Telefono</dt>
                    <dd className="font-bold text-slate-900">
                      {latestOrder.phone}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-semibold text-slate-500">Municipio</dt>
                    <dd className="font-bold text-slate-900">
                      {latestOrder.municipality}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-semibold text-slate-500">
                      Metodo de pago
                    </dt>
                    <dd className="font-bold text-slate-900">
                      {getOrderPaymentMethod(latestOrder)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Productos solicitados
                </h3>
                <div className="mt-4 divide-y divide-slate-100">
                  {latestOrderProducts.map((product) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Cantidad: {product.quantity}
                        </p>
                      </div>
                      <p className="font-black text-slate-900">
                        {product.subtotal}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-4 text-white">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-slate-300">
                    Total
                  </span>
                  <span className="text-2xl font-black">
                    {latestOrder.total}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>

      {activeOrder ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center sm:justify-center">
          <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:max-w-lg">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Cambiar estado
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                {activeOrder.id}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Cliente: {activeOrder.client}
              </p>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-bold text-slate-700">
                Estado del pedido
              </span>
              <select
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                onChange={(event) =>
                  setSelectedStatus(event.target.value as OrderStatus)
                }
                value={selectedStatus}
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                onClick={closeStatusModal}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-700"
                onClick={saveOrderStatus}
                type="button"
              >
                Guardar estado
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {detailOrder ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center sm:justify-center">
          <section className="max-h-[90vh] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:max-w-3xl">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Detalle del pedido
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {detailOrder.id}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                      detailOrder.status,
                    )}`}
                  >
                    {detailOrder.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {detailOrder.date}
                  </span>
                </div>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                onClick={closeDetailModal}
                type="button"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Datos del cliente
                  </h3>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-semibold text-slate-500">Cliente</dt>
                      <dd className="text-right font-bold text-slate-900">
                        {detailOrder.client}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-semibold text-slate-500">Telefono</dt>
                      <dd className="text-right font-bold text-slate-900">
                        {detailOrder.phone}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-semibold text-slate-500">
                        Municipio
                      </dt>
                      <dd className="text-right font-bold text-slate-900">
                        {detailOrder.municipality}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-semibold text-slate-500">
                        Direccion
                      </dt>
                      <dd className="max-w-56 text-right font-bold text-slate-900">
                        {getOrderAddress(detailOrder)}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-semibold text-slate-500">
                        Metodo de pago
                      </dt>
                      <dd className="text-right font-bold text-slate-900">
                        {getOrderPaymentMethod(detailOrder)}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Resumen
                  </h3>
                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="font-semibold text-slate-500">
                        Pedido
                      </span>
                      <span className="font-black text-slate-900">
                        {detailOrder.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="font-semibold text-slate-500">
                        Fecha
                      </span>
                      <span className="font-black text-slate-900">
                        {detailOrder.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950 px-4 py-3 text-white">
                      <span className="font-bold uppercase tracking-[0.14em] text-slate-300">
                        Total general
                      </span>
                      <span className="text-xl font-black">
                        {detailOrder.total}
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Productos solicitados
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-bold">Producto</th>
                        <th className="px-5 py-4 font-bold">Cantidad</th>
                        <th className="px-5 py-4 font-bold">
                          Precio unitario
                        </th>
                        <th className="px-5 py-4 font-bold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getOrderProducts(detailOrder).map((product) => (
                        <tr key={product.name} className="hover:bg-slate-50">
                          <td className="px-5 py-4 font-bold text-slate-900">
                            {product.name}
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {product.quantity}
                          </td>
                          <td className="px-5 py-4 font-semibold text-slate-700">
                            {product.unitPrice}
                          </td>
                          <td className="px-5 py-4 font-black text-slate-900">
                            {product.subtotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

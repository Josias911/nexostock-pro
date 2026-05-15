"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Product } from "@/lib/products";

const CART_STORAGE_KEY = "nexostock_cart";
const WHATSAPP_NUMBER = "50233838037";
const SHIPPING_FEE = 25;

type CartItem = {
  product: Product;
  quantity: number;
};

type CustomerForm = {
  fullName: string;
  phone: string;
  municipality: string;
  department: string;
  address: string;
  paymentMethod: "Pago contra entrega" | "Depósito o transferencia";
};

const formatPrice = (price: number) =>
  `Q${price.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<CustomerForm>({
    fullName: "",
    phone: "",
    municipality: "",
    department: "",
    address: "",
    paymentMethod: "Pago contra entrega",
  });

  const productsSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );
  const finalTotal = productsSubtotal + SHIPPING_FEE;

  useEffect(() => {
    queueMicrotask(() => {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart) as CartItem[];
          setCartItems(parsedCart);
        } catch {
          window.localStorage.removeItem(CART_STORAGE_KEY);
        }
      }

      setHasLoadedCart(true);
    });
  }, []);

  const updateField = <Field extends keyof CustomerForm>(
    field: Field,
    value: CustomerForm[Field],
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
    setErrorMessage("");
  };

  const sendOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasMissingFields =
      formData.fullName.trim() === "" ||
      formData.phone.trim() === "" ||
      formData.municipality.trim() === "" ||
      formData.department.trim() === "" ||
      formData.address.trim() === "" ||
      formData.paymentMethod.trim() === "";

    if (hasMissingFields) {
      setErrorMessage("Por favor completa todos los datos del pedido.");
      return;
    }

    const productLines = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.name} x ${item.quantity} - ${formatPrice(
            item.product.price * item.quantity,
          )}`,
      )
      .join("\n");

    const message = [
      "Nuevo pedido - NexoStock Pro",
      "",
      "Datos del cliente:",
      `Nombre: ${formData.fullName}`,
      `Teléfono: ${formData.phone}`,
      `Municipio: ${formData.municipality}`,
      `Departamento: ${formData.department}`,
      `Dirección: ${formData.address}`,
      `Método de pago: ${formData.paymentMethod}`,
      "",
      "Productos:",
      productLines,
      "",
      "Resumen:",
      `Subtotal: ${formatPrice(productsSubtotal)}`,
      `Envío: ${formatPrice(SHIPPING_FEE)}`,
      `Total final: ${formatPrice(finalTotal)}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

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

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Preparar pedido
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Finalizar pedido
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Revisa el resumen, completa tus datos y envía el pedido por
            WhatsApp.
          </p>
        </div>

        {!hasLoadedCart ? (
          <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-500">
              Cargando pedido...
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-black tracking-tight">
              No hay productos en el pedido
            </h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Agrega productos desde el catálogo para preparar un pedido.
            </p>
            <Link
              href="/catalogo"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Volver al catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold">Resumen de productos</h2>
              </div>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <article
                    key={item.product.id}
                    className="grid gap-4 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <h3 className="font-bold">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Cantidad: {item.quantity} · Precio:{" "}
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        Subtotal
                      </p>
                      <p className="text-lg font-black">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-200 bg-slate-50 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-500">
                    Subtotal de productos
                  </span>
                  <span className="font-bold">
                    {formatPrice(productsSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-500">
                    Envío
                  </span>
                  <span className="font-bold">{formatPrice(SHIPPING_FEE)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                    Total final
                  </span>
                  <span className="text-2xl font-black">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </section>

            <form
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              onSubmit={sendOrder}
            >
              <h2 className="text-xl font-bold">Datos del cliente</h2>

              {errorMessage ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-6 grid gap-5">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Nombre completo
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    type="text"
                    value={formData.fullName}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Teléfono
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    onChange={(event) => updateField("phone", event.target.value)}
                    type="tel"
                    value={formData.phone}
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      Municipio
                    </span>
                    <input
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      onChange={(event) =>
                        updateField("municipality", event.target.value)
                      }
                      type="text"
                      value={formData.municipality}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      Departamento
                    </span>
                    <input
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      onChange={(event) =>
                        updateField("department", event.target.value)
                      }
                      type="text"
                      value={formData.department}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Dirección
                  </span>
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    value={formData.address}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Método de pago
                  </span>
                  <select
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    onChange={(event) =>
                      updateField(
                        "paymentMethod",
                        event.target.value as CustomerForm["paymentMethod"],
                      )
                    }
                    value={formData.paymentMethod}
                  >
                    <option>Pago contra entrega</option>
                    <option>Depósito o transferencia</option>
                  </select>
                </label>
              </div>

              <button
                className="mt-7 h-12 w-full rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700"
                type="submit"
              >
                Enviar pedido por WhatsApp
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import type { Product } from "@/lib/products";

const ADMIN_PRODUCTS_KEY = "nexostock_admin_products";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Reportes", href: "/admin/reportes" },
];

type ProductForm = {
  name: string;
  imageCode: string;
  slug: string;
  category: Product["category"];
  price: string;
  stock: string;
  status: Product["status"];
  description: string;
  isNew: boolean;
  isFeatured: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  imageCode: "",
  slug: "",
  category: "Audio",
  price: "",
  stock: "",
  status: "Disponible",
  description: "",
  isNew: false,
  isFeatured: false,
};

export default function EditProductPage() {
  const params = useParams<{ slug?: string | string[] }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);
  const [productId, setProductId] = useState("");
  const [hasLoadedProduct, setHasLoadedProduct] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const slug = Array.isArray(params.slug)
    ? (params.slug[0] ?? "")
    : (params.slug ?? "");

  useEffect(() => {
    queueMicrotask(() => {
      const storedProducts = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
      let currentProducts: Product[] = [];

      if (storedProducts) {
        try {
          currentProducts = JSON.parse(storedProducts) as Product[];
        } catch {
          currentProducts = [];
        }
      }

      const product = currentProducts.find((item) => item.slug === slug);

      setProducts(currentProducts);

      if (product) {
        setProductId(product.id);
        setFormData({
          name: product.name,
          imageCode: product.imageCode,
          slug: product.slug,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          status: product.status,
          description: product.description,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
        });
      }

      setHasLoadedProduct(true);
    });
  }, [slug]);

  const updateField = <Field extends keyof ProductForm>(
    field: Field,
    value: ProductForm[Field],
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
    setErrorMessage("");
  };

  const saveChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasEmptyRequiredField =
      formData.name.trim() === "" ||
      formData.imageCode.trim() === "" ||
      formData.slug.trim() === "" ||
      formData.category.trim() === "" ||
      formData.price.trim() === "" ||
      formData.stock.trim() === "" ||
      formData.status.trim() === "" ||
      formData.description.trim() === "";

    if (hasEmptyRequiredField) {
      setErrorMessage("Completa todos los campos obligatorios.");
      return;
    }

    const updatedProduct: Product = {
      id: productId,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      status: formData.status,
      imageCode: formData.imageCode.trim(),
      isNew: formData.isNew,
      isFeatured: formData.isFeatured,
      description: formData.description.trim(),
    };

    const updatedProducts = products.map((product) =>
      product.id === productId ? updatedProduct : product,
    );

    window.localStorage.setItem(
      ADMIN_PRODUCTS_KEY,
      JSON.stringify(updatedProducts),
    );

    router.push("/admin/productos");
  };

  const renderShell = (children: React.ReactNode) => (
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

        <section className="flex-1 px-6 py-8 lg:px-8">{children}</section>
      </div>
    </main>
  );

  if (!hasLoadedProduct) {
    return renderShell(
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-bold text-slate-500">
          Cargando producto...
        </p>
      </div>,
    );
  }

  if (!productId) {
    return renderShell(
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">
          Producto no encontrado
        </h1>
        <Link
          href="/admin/productos"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Volver a productos
        </Link>
      </div>,
    );
  }

  return renderShell(
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Administración
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Editar producto
          </h1>
          <p className="mt-2 text-slate-500">
            Actualiza la información del producto creado desde el admin
          </p>
        </div>
        <Link
          href="/admin/productos"
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
        >
          Cancelar
        </Link>
      </div>

      <form
        className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={saveChanges}
      >
        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Nombre del producto
            </span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => updateField("name", event.target.value)}
              type="text"
              value={formData.name}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Código visual
            </span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => updateField("imageCode", event.target.value)}
              type="text"
              value={formData.imageCode}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Slug</span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => updateField("slug", event.target.value)}
              type="text"
              value={formData.slug}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Categoría</span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) =>
                updateField("category", event.target.value as Product["category"])
              }
              value={formData.category}
            >
              <option>Audio</option>
              <option>Accesorios</option>
              <option>Pantallas</option>
              <option>Ropa</option>
              <option>Herramientas</option>
              <option>Repuestos</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Precio</span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => updateField("price", event.target.value)}
              type="number"
              value={formData.price}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Stock</span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => updateField("stock", event.target.value)}
              type="number"
              value={formData.stock}
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-bold text-slate-700">Estado</span>
            <select
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) =>
                updateField("status", event.target.value as Product["status"])
              }
              value={formData.status}
            >
              <option>Disponible</option>
              <option>Stock bajo</option>
              <option>Agotado</option>
            </select>
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-bold text-slate-700">
              Descripción
            </span>
            <textarea
              className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              value={formData.description}
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-sm font-bold text-slate-700">
              Marcar como Nuevo
            </span>
            <input
              checked={formData.isNew}
              className="size-5 accent-emerald-600"
              onChange={(event) => updateField("isNew", event.target.checked)}
              type="checkbox"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-sm font-bold text-slate-700">
              Marcar como Destacado
            </span>
            <input
              checked={formData.isFeatured}
              className="size-5 accent-emerald-600"
              onChange={(event) =>
                updateField("isFeatured", event.target.checked)
              }
              type="checkbox"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/admin/productos"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Cancelar
          </Link>
          <button
            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-700"
            type="submit"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </>,
  );
}

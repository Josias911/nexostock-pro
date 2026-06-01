"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { type Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";

const ADMIN_PRODUCTS_KEY = "nexostock_admin_products";

const sidebarItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Inventario", href: "/admin/inventario" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Reportes", href: "/admin/reportes" },
];

const formatPrice = (price: number) =>
  `Q${price.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getStatusFromStock = (stock: number): Product["status"] => {
  if (stock === 0) {
    return "Agotado";
  }

  if (stock <= 10) {
    return "Stock bajo";
  }

  return "Disponible";
};

type ProductRow = Product & {
  createdAt?: string | null;
  source: "supabase" | "local";
};

type SupabaseProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: Product["category"];
  stock: number;
  status: Product["status"] | null;
  image_code: string | null;
  is_new: boolean | null;
  is_featured: boolean | null;
  description: string;
  created_at: string | null;
};

const mapSupabaseProduct = (product: SupabaseProduct): ProductRow => {
  const stock = Number(product.stock);

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    category: product.category,
    stock,
    status: product.status ?? getStatusFromStock(stock),
    imageCode: product.image_code ?? "",
    isNew: Boolean(product.is_new),
    isFeatured: Boolean(product.is_featured),
    description: product.description,
    createdAt: product.created_at,
    source: "supabase",
  };
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [supabaseProducts, setSupabaseProducts] = useState<ProductRow[]>([]);
  const [storedProducts, setStoredProducts] = useState<Product[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    queueMicrotask(() => {
      const savedProducts = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);

      if (savedProducts) {
        try {
          setStoredProducts(JSON.parse(savedProducts) as Product[]);
        } catch {
          window.localStorage.removeItem(ADMIN_PRODUCTS_KEY);
        }
      }
    });
  }, []);

  useEffect(() => {
    let shouldIgnoreResult = false;

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setProductsError(null);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, price, category, stock, status, image_code, is_new, is_featured, description, created_at",
        );

      if (shouldIgnoreResult) {
        return;
      }

      if (error) {
        setSupabaseProducts([]);
        setProductsError("No se pudieron cargar los productos desde Supabase.");
      } else {
        setSupabaseProducts(
          ((data ?? []) as SupabaseProduct[]).map(mapSupabaseProduct),
        );
      }

      setIsLoadingProducts(false);
    };

    loadProducts();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  const allProducts = useMemo<ProductRow[]>(
    () => [
      ...supabaseProducts,
      ...storedProducts.map((product) => ({
        ...product,
        status: getStatusFromStock(product.stock),
        source: "local" as const,
      })),
    ],
    [storedProducts, supabaseProducts],
  );

  const deleteStoredProduct = (productId: string) => {
    const shouldDelete = window.confirm(
      "¿Seguro que deseas eliminar este producto?",
    );

    if (!shouldDelete) {
      return;
    }

    setStoredProducts((currentProducts) => {
      const updatedProducts = currentProducts.filter(
        (product) => product.id !== productId,
      );

      window.localStorage.setItem(
        ADMIN_PRODUCTS_KEY,
        JSON.stringify(updatedProducts),
      );

      return updatedProducts;
    });
    setProductsError(null);
    setSuccessMessage("Producto eliminado correctamente.");
    window.setTimeout(() => setSuccessMessage(""), 2500);
  };

  const deleteSupabaseProduct = async (productId: string) => {
    const shouldDelete = window.confirm(
      "¿Seguro que deseas eliminar este producto?",
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingProductId(productId);
    setProductsError(null);
    setSuccessMessage("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    setDeletingProductId(null);

    if (error) {
      setProductsError("No se pudo eliminar el producto.");
      return;
    }

    setSupabaseProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
    setSuccessMessage("Producto eliminado correctamente.");
    window.setTimeout(() => setSuccessMessage(""), 2500);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const summaryCards = useMemo(() => {
    const featuredProducts = allProducts.filter((product) => product.isFeatured);
    const newProducts = allProducts.filter((product) => product.isNew);
    const lowStockProducts = allProducts.filter(
      (product) => product.status === "Stock bajo" || product.stock <= 10,
    );

    return [
      {
        label: "Total productos",
        value: allProducts.length,
        detail: "Productos registrados",
      },
      {
        label: "Productos destacados",
        value: featuredProducts.length,
        detail: "Visibles como prioridad",
      },
      {
        label: "Productos nuevos",
        value: newProducts.length,
        detail: "Marcados para lanzamiento",
      },
      {
        label: "Stock bajo",
        value: lowStockProducts.length,
        detail: "Requieren revisión",
      },
    ];
  }, [allProducts]);

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
                  item.label === "Productos"
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
                Productos
              </h1>
              <p className="mt-2 text-slate-500">
                Administra los productos del catálogo
              </p>
            </div>
            <Link
              href="/admin/productos/nuevo"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Nuevo producto
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
                <h2 className="text-xl font-bold">Listado de productos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Vista administrativa del catálogo actual.
                </p>
                {isLoadingProducts ? (
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    Cargando productos...
                  </p>
                ) : null}
                {productsError ? (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {productsError}
                  </p>
                ) : null}
                {successMessage ? (
                  <p className="mt-2 text-sm font-bold text-emerald-700">
                    {successMessage}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Código</th>
                    <th className="px-6 py-4 font-bold">Nombre</th>
                    <th className="px-6 py-4 font-bold">Categoría</th>
                    <th className="px-6 py-4 font-bold">Precio</th>
                    <th className="px-6 py-4 font-bold">Stock</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                    <th className="px-6 py-4 font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingProducts ? (
                    <tr>
                      <td
                        className="px-6 py-10 text-center font-bold text-slate-500"
                        colSpan={7}
                      >
                        Cargando productos...
                      </td>
                    </tr>
                  ) : null}
                  {!isLoadingProducts && allProducts.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-10 text-center font-bold text-slate-500"
                        colSpan={7}
                      >
                        No hay productos registrados.
                      </td>
                    </tr>
                  ) : null}
                  {!isLoadingProducts && allProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-emerald-700">
                        {product.imageCode}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {product.slug}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/catalogo/${product.slug}`}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/admin/productos/editar/${product.slug}`}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            Editar
                          </Link>
                          {product.source === "supabase" ? (
                            <button
                              className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                              disabled={deletingProductId === product.id}
                              onClick={() => deleteSupabaseProduct(product.id)}
                              type="button"
                            >
                              {deletingProductId === product.id
                                ? "Eliminando..."
                                : "Eliminar"}
                            </button>
                          ) : (
                            <button
                              className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                              onClick={() => deleteStoredProduct(product.id)}
                              type="button"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
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

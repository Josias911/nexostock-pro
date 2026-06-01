"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { type Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";

const formatPrice = (price: number) =>
  `Q${price.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const CART_STORAGE_KEY = "nexostock_cart";
const ADMIN_PRODUCTS_KEY = "nexostock_admin_products";

const getStatusFromStock = (stock: number): Product["status"] => {
  if (stock === 0) {
    return "Agotado";
  }

  if (stock <= 10) {
    return "Stock bajo";
  }

  return "Disponible";
};

type CartItem = {
  product: Product;
  quantity: number;
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
};

const mapSupabaseProduct = (product: SupabaseProduct): Product => {
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
  };
};

export default function CatalogoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);
  const [storedProducts, setStoredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const catalogProducts = useMemo(
    () => [
      ...supabaseProducts,
      ...storedProducts.map((product) => ({
        ...product,
        status: getStatusFromStock(product.stock),
      })),
    ],
    [storedProducts, supabaseProducts],
  );
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return catalogProducts;
    }

    return catalogProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.category,
        product.description,
        product.imageCode,
        product.price.toString(),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [catalogProducts, searchTerm]);
  const hasProductsToShow = filteredProducts.length > 0;
  const showEmptyProductsState =
    !isLoadingProducts && !productsError && !hasProductsToShow;
  const showProductsGrid = !isLoadingProducts && hasProductsToShow;
  const showErrorMessage = !isLoadingProducts && productsError !== null;
  const productCountLabel =
    filteredProducts.length === 1 ? "producto" : "productos";
  const productCountText = `${filteredProducts.length} ${productCountLabel}`;
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  useEffect(() => {
    let shouldIgnoreResult = false;

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setProductsError(null);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, price, category, stock, status, image_code, is_new, is_featured, description",
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
    queueMicrotask(() => {
      const searchParams = new URLSearchParams(window.location.search);

      if (searchParams.get("carrito") === "1") {
        setIsCartOpen(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, hasLoadedCart]);

  const addToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
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
              Explora productos de ejemplo con precios en quetzales, categorías
              y estados de inventario listos para una experiencia comercial
              clara.
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
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                value={searchTerm}
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-y border-slate-200 py-4 text-sm font-bold text-slate-500">
          <span>
            {isLoadingProducts ? "Cargando productos..." : productCountText}
          </span>
          {showErrorMessage ? (
            <span className="text-right text-red-600">{productsError}</span>
          ) : null}
        </div>

        {showEmptyProductsState ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold text-slate-500">
              No hay productos para mostrar.
            </p>
          </div>
        ) : null}

        {showProductsGrid ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="flex min-h-[28rem] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"
            >
              <div>
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

                <div className="mt-6 flex h-28 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                      Código visual
                    </p>
                    <p className="mt-2 text-3xl font-black text-emerald-700">
                      {product.imageCode}
                    </p>
                  </div>
                </div>

                <h2 className="mt-6 text-xl font-bold">{product.name}</h2>
                <p className="mt-3 min-h-14 text-sm leading-7 text-slate-600">
                  {product.description}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Precio
                    </p>
                    <p className="mt-1 text-3xl font-black tracking-tight">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Stock
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-900">
                      {product.stock}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/catalogo/${product.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Ver detalle
                </Link>
                <button
                  className="h-11 rounded-full bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  onClick={() => addToCart(product)}
                  type="button"
                >
                  Agregar
                </button>
              </div>
            </article>
            ))}
          </div>
        ) : null}
      </section>

      <button
        className="fixed bottom-6 right-6 z-30 inline-flex h-14 items-center gap-3 rounded-full bg-slate-950 px-6 text-sm font-bold text-white shadow-2xl shadow-slate-950/25 transition hover:bg-emerald-700"
        onClick={() => setIsCartOpen(true)}
        type="button"
      >
        Carrito
        <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
          {totalItems}
        </span>
      </button>

      {isCartOpen ? (
        <div className="fixed inset-0 z-40">
          <button
            aria-label="Cerrar carrito"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
            type="button"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Carrito
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Productos agregados
                </h2>
              </div>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                onClick={() => setIsCartOpen(false)}
                type="button"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cartItems.length === 0 ? (
                <div className="flex h-full min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                  <p className="text-lg font-bold text-slate-500">
                    Tu carrito está vacío
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <article
                      key={item.product.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-950">
                            {item.product.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <button
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                          onClick={() => removeFromCart(item.product.id)}
                          type="button"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                          <button
                            className="flex size-9 items-center justify-center rounded-full bg-white text-lg font-black text-slate-700 shadow-sm transition hover:text-emerald-700"
                            onClick={() => decreaseQuantity(item.product.id)}
                            type="button"
                          >
                            -
                          </button>
                          <span className="min-w-10 text-center text-sm font-black">
                            {item.quantity}
                          </span>
                          <button
                            className="flex size-9 items-center justify-center rounded-full bg-white text-lg font-black text-slate-700 shadow-sm transition hover:text-emerald-700"
                            onClick={() => increaseQuantity(item.product.id)}
                            type="button"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            Subtotal
                          </p>
                          <p className="text-lg font-black">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  Total general
                </span>
                <span className="text-2xl font-black tracking-tight">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700"
              >
                Continuar pedido
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}

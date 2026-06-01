"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { type Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";

const ADMIN_PRODUCTS_KEY = "nexostock_admin_products";
const CART_STORAGE_KEY = "nexostock_cart";
const WHATSAPP_NUMBER = "50233838037";

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

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [product, setProduct] = useState<Product | null>(null);
  const [hasLoadedProduct, setHasLoadedProduct] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    let shouldIgnoreResult = false;

    const loadProduct = async () => {
      setHasLoadedProduct(false);
      setProduct(null);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, price, category, stock, status, image_code, is_new, is_featured, description",
        )
        .eq("slug", slug)
        .maybeSingle();

      if (shouldIgnoreResult) {
        return;
      }

      if (error) {
        setHasLoadedProduct(true);
        return;
      }

      if (data) {
        setProduct(mapSupabaseProduct(data as SupabaseProduct));
        setHasLoadedProduct(true);
        return;
      }

      const savedProducts = window.localStorage.getItem(ADMIN_PRODUCTS_KEY);
      let localProduct: Product | undefined;

      if (savedProducts) {
        try {
          const storedProducts = JSON.parse(savedProducts) as Product[];
          localProduct = storedProducts.find((item) => item.slug === slug);
        } catch {
          window.localStorage.removeItem(ADMIN_PRODUCTS_KEY);
        }
      }

      if (localProduct) {
        setProduct({
          ...localProduct,
          status: getStatusFromStock(localProduct.stock),
        });
      }

      setHasLoadedProduct(true);
    };

    loadProduct();

    return () => {
      shouldIgnoreResult = true;
    };
  }, [slug]);

  const addToCart = (selectedProduct: Product) => {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    let currentCart: CartItem[] = [];

    if (storedCart) {
      try {
        currentCart = JSON.parse(storedCart) as CartItem[];
      } catch {
        currentCart = [];
      }
    }

    const existingItem = currentCart.find(
      (item) => item.product.id === selectedProduct.id,
    );
    const updatedCart = existingItem
      ? currentCart.map((item) =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...currentCart, { product: selectedProduct, quantity: 1 }];

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    setCartMessage("Producto agregado al carrito");
  };

  const consultOnWhatsApp = (selectedProduct: Product) => {
    const message = [
      "Hola, quiero información de este producto:",
      `Nombre: ${selectedProduct.name}`,
      `Precio: ${formatPrice(selectedProduct.price)}`,
      `Código: ${selectedProduct.imageCode}`,
      `Categoría: ${selectedProduct.category}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (!hasLoadedProduct) {
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

        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
          <p className="text-lg font-bold text-slate-500">
            Cargando producto...
          </p>
        </section>
      </main>
    );
  }

  if (!product) {
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

        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-black text-emerald-700">
            N
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tight">
            Producto no encontrado
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            El producto solicitado no existe en el catálogo actual.
          </p>
          <Link
            href="/catalogo"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Volver al catálogo
          </Link>
        </section>
      </main>
    );
  }

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

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5">
          <div className="flex min-h-80 items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50 px-6 py-16">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
                Código visual del producto
              </p>
              <p className="mt-4 text-6xl font-black tracking-tight text-emerald-700">
                {product.imageCode}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
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

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {product.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Precio
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight">
                {formatPrice(product.price)}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Stock disponible
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight">
                {product.stock}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700"
              onClick={() => addToCart(product)}
              type="button"
            >
              Agregar al carrito
            </button>
            <button
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-sm font-bold text-slate-900 transition hover:border-emerald-300 hover:text-emerald-700"
              onClick={() => consultOnWhatsApp(product)}
              type="button"
            >
              Consultar por WhatsApp
            </button>
          </div>

          {cartMessage ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              {cartMessage}
            </div>
          ) : null}

          <Link
            href="/catalogo?carrito=1"
            className="mt-4 inline-flex h-11 w-fit items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Ver carrito
          </Link>
        </div>
      </section>
    </main>
  );
}

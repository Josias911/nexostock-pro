"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Product = {
  name: string;
  price: number;
  stock: number;
  category: string;
};

export default function TestSupabasePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("name, price, stock, category");

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setProducts(data ?? []);
      setIsLoading(false);
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Prueba de Supabase</h1>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {isLoading && (
            <p className="text-slate-600">Cargando productos...</p>
          )}

          {!isLoading && errorMessage && (
            <p className="text-red-600">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && (
            <ul className="space-y-3">
              {products.map((product) => (
                <li
                  key={`${product.name}-${product.category}`}
                  className="rounded-md border border-slate-200 p-4"
                >
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="text-sm text-slate-600">
                    Precio: Q{product.price}
                  </p>
                  <p className="text-sm text-slate-600">
                    Stock: {product.stock}
                  </p>
                  <p className="text-sm text-slate-600">
                    Categoria: {product.category}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

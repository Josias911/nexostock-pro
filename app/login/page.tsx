"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const AUTH_STORAGE_KEY = "nexostock_auth";
const TEMP_EMAIL = "admin@nexostock.com";
const TEMP_PASSWORD = "123456";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email.trim() === TEMP_EMAIL && password === TEMP_PASSWORD) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      router.push("/admin");
      return;
    }

    setErrorMessage("Correo o contraseña incorrectos.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-6 py-12 text-slate-950">
      <section className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-700/20">
            N
          </span>
          <span className="text-xl font-bold tracking-tight">
            NexoStock Pro
          </span>
        </Link>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-emerald-950/10">
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight">
              Iniciar sesión
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Accede al panel administrativo para gestionar productos, pedidos
              e inventario.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={submitLogin}>
            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Correo</span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="correo@empresa.com"
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Contraseña
              </span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Ingresa tu contraseña"
                type="password"
                value={password}
              />
            </label>

            <button
              className="h-12 w-full rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700"
              type="submit"
            >
              Entrar al panel
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

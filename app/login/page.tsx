import Link from "next/link";

export default function LoginPage() {
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

          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Correo</span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="correo@empresa.com"
                type="email"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">
                Contraseña
              </span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="Ingresa tu contraseña"
                type="password"
              />
            </label>

            <button className="h-12 w-full rounded-full bg-emerald-600 px-6 text-sm font-bold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-700">
              Entrar al panel
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

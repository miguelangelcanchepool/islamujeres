"use client";

import { useActionState } from "react";
import { signIn, signOut, type SignInState } from "@/app/admin/actions";

const initialState: SignInState = null;

export function LoginForm({ denied }: { denied: boolean }) {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <>
      {denied ? (
        <p className="admin-note" role="alert">
          Esta sesión no puede administrar la guía.
        </p>
      ) : null}
      {state?.error ? (
        <p className="admin-note" role="alert">
          {state.error}
        </p>
      ) : null}
      <form action={action} className="admin-form">
        <label>
          Correo
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            disabled={pending}
          />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={pending}
          />
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
      {denied ? (
        <form action={signOut} className="admin-signout">
          <button type="submit">Cerrar sesión</button>
        </form>
      ) : null}
    </>
  );
}

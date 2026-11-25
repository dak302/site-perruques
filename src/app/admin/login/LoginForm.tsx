"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus aria-describedby={error ? "pw-err" : undefined} aria-invalid={!!error} />
        {error && <span id="pw-err" className="field__error" role="alert">{error}</span>}
      </div>
      <button className="btn btn--primary btn--block" disabled={pending}>{pending ? "Connexion…" : "Se connecter"}</button>
    </form>
  );
}

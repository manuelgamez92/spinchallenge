"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { login } from "@/src/features/accounts/services/wallet-api";
import { loginSchema, type LoginSchemaInput } from "@/src/features/authentication/schemas/login.schema";
import { sessionStarted } from "@/src/features/authentication/store/authentication.slice";
import { loginScreenStyles } from "@/src/features/authentication/styles/login.styles";
import { PageShell } from "@/src/components/layout/page-shell";
import { Spinner } from "@/src/components/ui/spinner";
import { useFeatureFlags } from "@/src/services/feature-flags/feature-flags.service";
import { useAppDispatch } from "@/src/store/hooks";

export function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
    },
    mode: "onBlur",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      dispatch(sessionStarted(user));
      router.push("/home");
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);
  });

  const featureFlags = useFeatureFlags();

  return (
    <PageShell className={loginScreenStyles.shell}>
      <div className={loginScreenStyles.grid}>
        <section className={loginScreenStyles.heroCard}>
          <div className={loginScreenStyles.heroGlow} />
          <div className={loginScreenStyles.heroContent}>
            <span className={loginScreenStyles.heroBadge}>
              Mini Wallet Challenge
            </span>
            <div className={loginScreenStyles.heroTextGroup}>
              <h1 className={loginScreenStyles.heroTitle}>
               Una wallet diseñada para acompañarte en cada momento de tu vida.
              </h1>
              <p className={loginScreenStyles.heroSubtitle}>
                Tu cartera virtual en la palma de tu mano.
              </p>
            </div>
            <div className={loginScreenStyles.heroBullets}>
              {[
                "Autenticación mock con persistencia",
                "Movimientos y saldo con cache local",
                "Transferencias con validaciones reales",
              ].map((item) => (
                <article key={item} className={loginScreenStyles.heroBullet}>
                  {item}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={loginScreenStyles.formCard}>
          <div className={loginScreenStyles.formHeader}>
            <p className={loginScreenStyles.overline}>Acceso seguro</p>
            <h2 className={loginScreenStyles.formTitle}>Inicia sesión</h2>
            <p className={loginScreenStyles.formDescription}>
              Usa un email o teléfono válido.
            </p>
          </div>

          <form className={loginScreenStyles.form} onSubmit={onSubmit}>
            <div className={loginScreenStyles.fieldGroup}>
              <label className={loginScreenStyles.label} htmlFor="identifier">
                Email o teléfono
              </label>
              <input
                {...form.register("identifier")}
                autoComplete="username"
                className="field-input"
                id="identifier"
                placeholder="test.user@spin.com o 52 66 2298 5745"
              />
              {form.formState.errors.identifier ? (
                <p className={loginScreenStyles.fieldError}>{form.formState.errors.identifier.message}</p>
              ) : null}
            </div>

            {loginMutation.isError ? (
              <div className={loginScreenStyles.mutationError}>
                {loginMutation.error.message}
              </div>
            ) : null}

            <button className={loginScreenStyles.submit} disabled={loginMutation.isPending} type="submit">
              {loginMutation.isPending ? (
                <span className={loginScreenStyles.submitPending}>
                  <Spinner /> Validando acceso...
                </span>
              ) : (
                "Entrar al dashboard"
              )}
            </button>
          </form>

        </section>
      </div>
    </PageShell>
  );
}
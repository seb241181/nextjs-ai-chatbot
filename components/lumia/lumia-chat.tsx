"use client";

import { useState } from "react";
import type { LumiaApiResponse } from "@/lib/lumia/types";

export function LumiaChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LumiaApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lumia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale: "fr" }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Erreur inconnue");
      }

      const payload = (await response.json()) as LumiaApiResponse;
      setResult(payload);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Erreur inconnue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mt-16 w-full max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-6 shadow-[0_0_80px_rgba(255,255,255,0.05)] backdrop-blur">
      <h2 className="text-xl uppercase tracking-[0.2em]">Miroir de Lumia</h2>
      <p className="mt-3 text-sm text-zinc-400">
        Pose une question. Lumia répond en conscience, puis structure le
        blocage.
      </p>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <textarea
          className="h-36 w-full rounded-xl border border-white/15 bg-black p-4 text-sm outline-hidden transition focus:border-white/40"
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ex: Pourquoi je répète les mêmes schémas malgré mes efforts ?"
          value={question}
        />
        <button
          className="rounded-full border border-white/40 px-6 py-2 text-sm transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? "Révélation en cours..." : "Recevoir la lecture"}
        </button>
      </form>

      {error ? <p className="mt-4 text-red-400 text-sm">{error}</p> : null}

      {result ? (
        <article className="mt-8 space-y-4 rounded-xl border border-white/15 bg-black/60 p-5">
          <p className="text-xs text-zinc-500">Session: {result.sessionId}</p>
          <pre className="whitespace-pre-wrap text-sm text-zinc-100">
            {result.outputMarkdown}
          </pre>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black p-4 text-xs text-zinc-300">
            {JSON.stringify(result.summary, null, 2)}
          </pre>
        </article>
      ) : null}
    </section>
  );
}

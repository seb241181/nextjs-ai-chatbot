import { NextResponse } from "next/server";
import { z } from "zod";
import { LUMIA_SYSTEM_PROMPT } from "@/lib/lumia/prompts";
import type { LumiaSummary } from "@/lib/lumia/types";
import { insertReadingSession } from "@/lib/supabase/rest";

const requestSchema = z.object({
  question: z.string().min(5),
  locale: z.string().default("fr"),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
});

const summarySchema = z.object({
  blocage_principal: z.string(),
  origine_probable: z.string(),
  croyance_associee: z.string(),
  action_recommandee: z.string(),
  intensite: z.number().min(0).max(10),
  tags: z.array(z.string()),
});

const jsonFenceRegex = /```json\s*([\s\S]*?)```/i;

function extractJsonSummary(content: string): LumiaSummary {
  const fenced = content.match(jsonFenceRegex);

  if (fenced?.[1]) {
    return summarySchema.parse(JSON.parse(fenced[1]));
  }

  const jsonStart = content.lastIndexOf("{");
  if (jsonStart === -1) {
    throw new Error("No JSON summary found in Lumia response.");
  }

  return summarySchema.parse(JSON.parse(content.slice(jsonStart)));
}

function stripJsonFromMarkdown(content: string) {
  return content.replace(jsonFenceRegex, "").trim();
}

export async function POST(request: Request) {
  try {
    const { question, locale, email, firstName } = requestSchema.parse(
      await request.json()
    );

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: LUMIA_SYSTEM_PROMPT }],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Question de l'utilisateur: ${question}\n\nRéponds d'abord en Markdown concis, puis ajoute un bloc JSON final entre \`\`\`json et \`\`\`.`,
              },
            ],
          },
        ],
      }),
      cache: "no-store",
    });

    if (!openAiResponse.ok) {
      const errorBody = await openAiResponse.text();
      return NextResponse.json(
        { error: `OpenAI error: ${openAiResponse.status} ${errorBody}` },
        { status: 502 }
      );
    }

    const completion = (await openAiResponse.json()) as {
      output_text?: string;
    };

    if (!completion.output_text) {
      return NextResponse.json(
        { error: "OpenAI returned no text output." },
        { status: 502 }
      );
    }

    const summary = extractJsonSummary(completion.output_text);
    const outputMarkdown = stripJsonFromMarkdown(completion.output_text);

    const sessionId = await insertReadingSession({
      email,
      first_name: firstName,
      locale,
      lumia_question: question,
      lumia_context: { source: "web", step: "lumia" },
      lumia_output_md: outputMarkdown,
      lumia_summary_json: summary,
    });

    return NextResponse.json({
      sessionId,
      outputMarkdown,
      summary,
    });
  } catch (error) {
    console.error("Lumia route error", error);
    return NextResponse.json(
      { error: "Unable to process Lumia request." },
      { status: 400 }
    );
  }
}

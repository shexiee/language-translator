import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

type TranslateResponse = {
  translatedText: string;
  detectedSourceLang?: string;
  provider: "google" | "mymemory";
};

async function translateWithGoogle(
  text: string,
  source: string,
  target: string,
): Promise<TranslateResponse> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", source);
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Google translate failed: ${res.status}`);
  }

  const data = (await res.json()) as [
    Array<[string, string, unknown, unknown, unknown]>,
    unknown,
    string,
  ];

  const segments = data?.[0] ?? [];
  const translatedText = segments.map((s) => s?.[0] ?? "").join("");
  const detectedSourceLang = data?.[2];

  return {
    translatedText,
    detectedSourceLang: typeof detectedSourceLang === "string" ? detectedSourceLang : undefined,
    provider: "google",
  };
}

async function translateWithMyMemory(
  text: string,
  source: string,
  target: string,
): Promise<TranslateResponse> {
  const src = source === "auto" ? "Autodetect" : source;
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${src}|${target}`);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`MyMemory failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };

  const translatedText = data?.responseData?.translatedText ?? "";
  if (!translatedText) {
    throw new Error("MyMemory returned empty translation");
  }

  return { translatedText, provider: "mymemory" };
}

function chunkText(text: string, size: number): string[] {
  if (text.length <= size) return [text];
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + size, text.length);
    if (end < text.length) {
      const lastBreak = text.lastIndexOf(" ", end);
      if (lastBreak > i + size / 2) end = lastBreak;
    }
    chunks.push(text.slice(i, end));
    i = end;
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  let body: { text?: string; source?: string; target?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  const source = (body.source ?? "auto").trim() || "auto";
  const target = (body.target ?? "").trim();

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (!target) {
    return NextResponse.json({ error: "Target language is required" }, { status: 400 });
  }

  const chunks = chunkText(text, 4500);

  try {
    const results = await Promise.all(
      chunks.map((chunk) => translateWithGoogle(chunk, source, target)),
    );
    return NextResponse.json({
      translatedText: results.map((r) => r.translatedText).join(""),
      detectedSourceLang: results[0]?.detectedSourceLang,
      provider: "google" as const,
    });
  } catch (googleErr) {
    try {
      const results = await Promise.all(
        chunks.map((chunk) => translateWithMyMemory(chunk, source, target)),
      );
      return NextResponse.json({
        translatedText: results.map((r) => r.translatedText).join(" "),
        provider: "mymemory" as const,
      });
    } catch (mmErr) {
      return NextResponse.json(
        {
          error: "Translation services are unavailable. Please try again.",
          detail: googleErr instanceof Error ? googleErr.message : String(googleErr),
        },
        { status: 502 },
      );
    }
  }
}

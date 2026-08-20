"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { Tool } from "../types/tool.types";

interface ToolSchemaRunnerProps {
  tool: Tool;
}

// 🟢 হেল্পার ফাংশনসমূহ (Pure Browser APIs)

const utf8ToBase64 = (str: string) => {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binString);
};

const base64ToUtf8 = (str: string) => {
  const binString = atob(str);
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const toWords = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .trim()
    .split(/\s+/);
};

const toCamelCase = (str: string) => {
  const words = toWords(str);
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
};

const toSnakeCase = (str: string) =>
  toWords(str)
    .map((w) => w.toLowerCase())
    .join("_");

const toKebabCase = (str: string) =>
  toWords(str)
    .map((w) => w.toLowerCase())
    .join("-");

const toPascalCase = (str: string) =>
  toWords(str)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");

const toTitleCase = (str: string) =>
  toWords(str)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const generateNanoId = (size = 21) => {
  const chars = "useandom-26T1983_40STFn9758705601243_";
  let id = "";
  const randomValues = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) {
    id += chars[randomValues[i] % chars.length];
  }
  return id;
};

const generatePassword = (length = 16) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|";
  let pass = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
};

const parseChmod = (val: string) => {
  const num = parseInt(val.trim(), 8);
  if (isNaN(num)) return "Invalid octal value (e.g. 755)";
  const modes = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
  const digits = val.trim().split("").map((d) => parseInt(d, 10));
  if (digits.length !== 3 && digits.length !== 4) return "Invalid chmod (use 3 digits like 755 or 644)";
  const relevant = digits.slice(-3);
  return relevant.map((d) => modes[d] || "???").join("");
};

export function ToolSchemaRunner({ tool }: ToolSchemaRunnerProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"primary" | "secondary">("primary");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const actionKey = (tool.actionKey || "GENERIC").toUpperCase();

  const isGenerator = [
    "UUID_GEN",
    "NANOID_GEN",
    "PASSWORD_GEN",
    "LOREM_IPSUM",
  ].includes(actionKey);

  const { output, isError, errorMessage } = useMemo(() => {
    if (!input.trim() && !isGenerator) {
      return { output: "", isError: false, errorMessage: "" };
    }

    try {
      switch (actionKey) {
        // --- ১. এনকোডিং ও ডিকোডিং ---
        case "BASE64":
        case "BASE64_ENCODE":
          return {
            output: mode === "primary" ? utf8ToBase64(input) : base64ToUtf8(input.trim()),
            isError: false,
          };

        case "URL_ENCODE":
          return {
            output: mode === "primary" ? encodeURIComponent(input) : decodeURIComponent(input),
            isError: false,
          };

        case "HTML_ENTITIES":
          return {
            output:
              mode === "primary"
                ? input.replace(/[\u00A0-\u9999<>&]/g, (i) => `&#${i.charCodeAt(0)};`)
                : input.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec)),
            isError: false,
          };

        case "HEX_ASCII":
          if (mode === "primary") {
            const hex = Array.from(new TextEncoder().encode(input))
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(" ");
            return { output: hex, isError: false };
          } else {
            const cleanHex = input.replace(/\s+/g, "");
            const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);
            return { output: new TextDecoder().decode(bytes), isError: false };
          }

        case "NUMBER_BASE": {
          const num = parseInt(input.trim(), 10);
          if (isNaN(num)) return { output: "Invalid Decimal Number", isError: false };
          return {
            output: `Decimal: ${num}\nBinary: ${num.toString(2)}\nHex: 0x${num.toString(16).toUpperCase()}\nOctal: ${num.toString(8)}`,
            isError: false,
          };
        }

        // --- ২. ডাটা ও ফরম্যাটিং ---
        case "JSON_FORMAT": {
          const parsed = JSON.parse(input);
          return {
            output: mode === "primary" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed),
            isError: false,
          };
        }

        case "SQL_FORMAT": {
          const formatted = input
            .replace(/\s+/g, " ")
            .replace(/\b(SELECT|FROM|WHERE|LEFT JOIN|INNER JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE)\b/gi, "\n$1")
            .trim();
          return { output: formatted, isError: false };
        }

        case "CSV_JSON": {
          const lines = input.trim().split("\n");
          if (lines.length < 2) return { output: "CSV requires at least header and 1 row.", isError: false };
          const headers = lines[0].split(",").map((h) => h.trim());
          const records = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim());
            return headers.reduce((acc: any, header, idx) => {
              acc[header] = values[idx] ?? "";
              return acc;
            }, {});
          });
          return { output: JSON.stringify(records, null, 2), isError: false };
        }

        // --- ৩. কেস কনভার্টার ---
        case "CASE_CONVERTER":
        case "CASE_CAMEL":
          return { output: toCamelCase(input), isError: false };
        case "CASE_SNAKE":
          return { output: toSnakeCase(input), isError: false };
        case "CASE_KEBAB":
          return { output: toKebabCase(input), isError: false };
        case "CASE_PASCAL":
          return { output: toPascalCase(input), isError: false };
        case "CASE_TITLE":
          return { output: toTitleCase(input), isError: false };
        case "CASE_UPPER":
          return { output: input.toUpperCase(), isError: false };
        case "CASE_LOWER":
          return { output: input.toLowerCase(), isError: false };

        // --- ৪. টেক্সট ইউটিলিটি ---
        case "SLUG_GEN": {
          const slug = input
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return { output: slug, isError: false };
        }

        case "WORD_COUNTER": {
          const words = input.trim() ? input.trim().split(/\s+/).length : 0;
          const chars = input.length;
          const charsNoSpace = input.replace(/\s+/g, "").length;
          const lines = input ? input.split("\n").length : 0;
          const readingTime = Math.ceil(words / 200);
          return {
            output: `Words: ${words}\nCharacters: ${chars}\nCharacters (no spaces): ${charsNoSpace}\nLines: ${lines}\nEstimated Reading Time: ~${readingTime} min`,
            isError: false,
          };
        }

        case "REMOVE_DUPLICATE_LINES": {
          const unique = Array.from(new Set(input.split("\n"))).join("\n");
          return { output: unique, isError: false };
        }

        case "SORT_LINES": {
          const sorted = input.split("\n").sort((a, b) =>
            mode === "primary" ? a.localeCompare(b) : b.localeCompare(a)
          ).join("\n");
          return { output: sorted, isError: false };
        }

        case "EXTRACT_EMAILS": {
          const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
          const matches = Array.from(new Set(input.match(emailRegex) || []));
          return {
            output: matches.length > 0 ? matches.join("\n") : "No email addresses found.",
            isError: false,
          };
        }

        // --- ৫. জেনারেটর ---
        case "UUID_GEN":
          return {
            output: Array.from({ length: 5 }, () => crypto.randomUUID()).join("\n"),
            isError: false,
          };

        case "NANOID_GEN":
          return {
            output: Array.from({ length: 5 }, () => generateNanoId()).join("\n"),
            isError: false,
          };

        case "PASSWORD_GEN":
          return {
            output: Array.from({ length: 5 }, () => generatePassword(18)).join("\n"),
            isError: false,
          };

        case "LOREM_IPSUM":
          return {
            output:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            isError: false,
          };

        // --- ৬. ক্রিপ্টো / সিকিউরিটি ও সিস্টেম ক্যালকুলেটর ---
        case "CHMOD_CALC":
          return { output: parseChmod(input), isError: false };

        case "UNIX_TIMESTAMP": {
          const ts = parseInt(input.trim(), 10);
          if (isNaN(ts)) {
            const parsedDate = new Date(input.trim());
            if (isNaN(parsedDate.getTime())) return { output: "Invalid Timestamp or Date String", isError: false };
            return {
              output: `Timestamp (seconds): ${Math.floor(parsedDate.getTime() / 1000)}\nTimestamp (ms): ${parsedDate.getTime()}`,
              isError: false,
            };
          }
          const d = new Date(ts > 9999999999 ? ts : ts * 1000);
          return {
            output: `UTC: ${d.toUTCString()}\nISO: ${d.toISOString()}\nLocal: ${d.toString()}`,
            isError: false,
          };
        }

        default:
          return { output: input, isError: false };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid syntax or conversion error";
      return { output: "", isError: true, errorMessage: message };
    }
  }, [input, mode, actionKey, refreshTrigger, isGenerator]);

  return (
    <ToolLayout
      title={tool.title}
      description={tool.shortDesc || ""}
      category={
        tool.categories?.length
          ? tool.categories.map((c) => c.title).join(", ")
          : "DEVELOPER"
      }
      inputValue={input}
      outputValue={output}
      isError={isError}
      errorMessage={errorMessage}
      onInputChange={setInput}
      onReset={() => setInput("")}
      onLoadSample={() => {
        if (actionKey === "JSON_FORMAT") {
          setInput('{"name":"Hafiq Dev","role":"Full-Stack Engineer","active":true,"skills":["Next.js","AWS"]}');
        } else if (actionKey === "CSV_JSON") {
          setInput("name,role,experience\nAlex,Engineer,5\nJohn,Designer,3");
        } else if (actionKey === "SQL_FORMAT") {
          setInput("select id, name, email from users where status = 'ACTIVE' order by id desc limit 10;");
        } else if (actionKey === "BASE64" || actionKey === "BASE64_ENCODE") {
          setInput("Hello World! Client-side utility engine is active.");
        } else if (actionKey === "URL_ENCODE") {
          setInput("https://example.com/search?q=fullstack engineering & Next.js");
        } else if (actionKey === "EXTRACT_EMAILS") {
          setInput("Contact us at support@example.com or admin@domain.org for inquiries.");
        } else if (actionKey === "CHMOD_CALC") {
          setInput("755");
        } else if (actionKey === "UNIX_TIMESTAMP") {
          setInput(Math.floor(Date.now() / 1000).toString());
        } else {
          setInput("The quick brown fox jumps over the lazy dog.");
        }
      }}
      controls={
        ["BASE64", "BASE64_ENCODE", "URL_ENCODE", "HTML_ENTITIES", "HEX_ASCII"].includes(actionKey) ? (
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant={mode === "primary" ? "default" : "outline"}
              onClick={() => setMode("primary")}
              className="h-7 text-xs"
            >
              Encode
            </Button>
            <Button
              size="sm"
              variant={mode === "secondary" ? "default" : "outline"}
              onClick={() => setMode("secondary")}
              className="h-7 text-xs"
            >
              Decode
            </Button>
          </div>
        ) : actionKey === "JSON_FORMAT" ? (
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant={mode === "primary" ? "default" : "outline"}
              onClick={() => setMode("primary")}
              className="h-7 text-xs"
            >
              Beautify
            </Button>
            <Button
              size="sm"
              variant={mode === "secondary" ? "default" : "outline"}
              onClick={() => setMode("secondary")}
              className="h-7 text-xs"
            >
              Minify
            </Button>
          </div>
        ) : actionKey === "SORT_LINES" ? (
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant={mode === "primary" ? "default" : "outline"}
              onClick={() => setMode("primary")}
              className="h-7 text-xs"
            >
              Sort A-Z
            </Button>
            <Button
              size="sm"
              variant={mode === "secondary" ? "default" : "outline"}
              onClick={() => setMode("secondary")}
              className="h-7 text-xs"
            >
              Sort Z-A
            </Button>
          </div>
        ) : isGenerator ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="h-7 gap-1.5 text-xs"
          >
            <RefreshCw className="h-3 w-3" /> Regenerate
          </Button>
        ) : null
      }
    />
  );
}
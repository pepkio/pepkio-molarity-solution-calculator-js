/** Integration tests against live Pepkio Tools API. */

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { describe, expect, it } from "vitest";

import { PepkioClient } from "../src/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load monorepo .env for local integration runs (never log keys).
const monorepoEnv = resolve(__dirname, "../../../.env");
if (existsSync(monorepoEnv)) {
  loadEnv({ path: monorepoEnv });
}

const packageEnv = resolve(__dirname, "../.env");
if (existsSync(packageEnv)) {
  loadEnv({ path: packageEnv });
}

const ENVIRONMENTS = [
  { name: "local", baseUrl: "https://tools.localtest.me" },
  { name: "production", baseUrl: "https://tools.pepkio.com" },
] as const;

function apiKeyFor(baseUrl: string): string | undefined {
  if (baseUrl.includes("localtest.me")) {
    return process.env.LOCAL_PEPKIO_API_KEY ?? process.env.PEPKIO_API_KEY;
  }
  return process.env.PEPKIO_API_KEY;
}

function clientFor(env: (typeof ENVIRONMENTS)[number]): PepkioClient | null {
  const apiKey = apiKeyFor(env.baseUrl);
  if (!apiKey) {
    return null;
  }
  return new PepkioClient({ apiKey, baseUrl: env.baseUrl });
}

describe.each(ENVIRONMENTS)("$name integration", (env) => {
  const client = clientFor(env);
  const maybeIt = client ? it : it.skip;

  maybeIt("fetches manifest", async () => {
    const manifest = await client!.getManifest({ refresh: true });
    expect(manifest.tool_id).toBe("molarity-solution-calculator");
    const names = await client!.listExamples();
    expect(names).toContain("powder_cuso4");
    expect(names).toContain("dilution_pbs_10x");
    expect(names).toContain("serial_1M_to_1uM");
  });

  maybeIt("runs powder_cuso4 example", async () => {
    const input = await client!.getExampleInput("powder_cuso4");
    const result = await client!.run(input);
    expect(result.status).toBe("completed");
    expect(result.run_id).toBeTruthy();
    expect(result.permalink).toBeTruthy();
    expect(result.result).toBeTruthy();
    expect(result.result?.mode).toBe("powder");
    const inner = result.result?.result as Record<string, unknown> | undefined;
    expect(inner).toBeTruthy();
    const massG = inner?.mass_g;
    expect(typeof massG).toBe("number");
    expect(massG as number).toBeGreaterThan(0.07);
    expect(massG as number).toBeLessThan(0.15);
    expect(result.result?.error).toBeUndefined();
  });

  maybeIt("runs dilution_pbs_10x example", async () => {
    const input = await client!.getExampleInput("dilution_pbs_10x");
    const result = await client!.run(input);
    expect(result.status).toBe("completed");
    expect(result.result).toBeTruthy();
    expect(result.result?.mode).toBe("dilution");
    const stockVolume = (result.result?.result as Record<string, unknown> | undefined)
      ?.stock_volume_L;
    expect(typeof stockVolume).toBe("number");
    expect(Math.abs((stockVolume as number) - 0.1)).toBeLessThan(0.01);
  });

  maybeIt("runs serial_1M_to_1uM example", async () => {
    const input = await client!.getExampleInput("serial_1M_to_1uM");
    const result = await client!.run(input);
    expect(result.status).toBe("completed");
    expect(result.result).toBeTruthy();
    expect(result.result?.mode).toBe("serial");
    expect((result.result?.result as Record<string, unknown> | undefined)?.step_count).toBe(4);
  });
});

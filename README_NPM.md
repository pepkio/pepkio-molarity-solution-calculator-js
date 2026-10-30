# Pepkio Molarity Solution Calculator

Node.js ESM library and CLI that submit powder, dilution, and serial solution-prep parameters to the Pepkio Molarity Solution Calculator API and return bench-ready protocol steps.

# What It Does

The Pepkio Molarity Solution Calculator computes laboratory solution preparation parameters through a hosted REST API. This package wraps that API for Node.js (≥18), bundlers, and CI so you can fetch the tool manifest, run named examples, or pass custom input JSON without reimplementing calculator logic locally.

Three calculation modes are available via the `mode` field: **powder** (mass to weigh from solid reagent), **dilution** (C₁V₁ = C₂V₂ volumes), and **serial** (multi-step concentration tables). Calculator arithmetic runs on Pepkio servers; `run` requires a network connection and an API key.

# Features

- Three modes: `powder`, `dilution`, and `serial`
- Powder mode: anhydrous molecular weight, hydrate notation (e.g. ·5H₂O), and supplier purity percent
- Dilution mode: stock and target concentration (`M`, `mM`, `uM`, `nM`); stock volume, diluent volume, and dilution factor
- Serial mode: step count, per-tube volume in µL, concentration and transfer/diluent volumes at each step
- Plain-language `protocol_steps` returned with every run
- Named manifest examples: `powder_cuso4`, `dilution_pbs_10x`, `serial_1M_to_1uM`
- Manifest helpers: `getManifest`, `listExamples`, `getExampleInput` (no API key required)
- `run`, `getRun`, and `waitForRun` for sync execution
- CLI: `pepkio-molarity-solution-calculator manifest` and `run`

# Installation

```bash
npm install pepkio-molarity-solution-calculator
```

Requires Node.js 18 or newer.

# Configuration

Set an API key with **tools:run** scope before calling `run()`:

```bash
export PEPKIO_API_KEY="your-key"
```

Create a key at [Pepkio API keys](https://www.pepkio.com/account/api-keys).

Optional overrides:

| Variable | Purpose |
|----------|---------|
| `PEPKIO_API_KEY` | Production API key (required for `run`) |
| `LOCAL_PEPKIO_API_KEY` | Local dev key when `PEPKIO_API_BASE_URL` points to `tools.localtest.me` |
| `PEPKIO_API_BASE_URL` | API host (default `https://tools.pepkio.com`) |

# Quick Example

```typescript
import { PepkioClient } from "pepkio-molarity-solution-calculator";

const client = new PepkioClient({ apiKey: process.env.PEPKIO_API_KEY });

const input = await client.getExampleInput("powder_cuso4");
const result = await client.run(input);

console.log(result.result?.result); // { mass_g: 0.126, ... }
console.log(result.result?.protocol_steps);
console.log(result.permalink);
```

# CLI

```bash
npx pepkio-molarity-solution-calculator manifest --examples
npx pepkio-molarity-solution-calculator run --example powder_cuso4
```

Pass `--base-url` and `--api-key` to override environment defaults.

# Typical Use Cases

- Weighing hydrated salts for stock solutions (for example CuSO₄·5H₂O at labeled purity)
- Diluting concentrated buffers (for example 10× PBS to 1× in a defined final volume)
- Quick serial dilution estimates (for example 1 M to 1 µM in four steps)
- Cell culture media and reagent stock preparation
- CI or workflow runners that need programmatic solution-prep calculations

# Scientific Background

To prepare a solution from solid: **mass (g) = M × V (L) × MW (g/mol)**. For hydrated salts, use the effective molecular weight that includes crystal water; adjust mass upward when bottle purity is below 100%.

For a single dilution, **C₁V₁ = C₂V₂** relates stock concentration, final concentration, and volumes. In serial dilution with constant ratio DF per step, concentration after n steps is **Cₙ = C₀ / DFⁿ**.

For pipette-aware serial plans with plate maps, use the separate [Serial Dilution Planner](https://www.pepkio.com/tools/serial-dilution-planner) tool.

# Web Application

For researchers who prefer a graphical interface, an interactive web version is available.

Web Application: https://www.pepkio.com/tools/molarity-solution-calculator

The web UI adds live results as you type, saved recipes for buffers you prepare regularly, shareable links that restore inputs, one-click handoff from powder result to dilution tab, printable worksheets, and warnings when serial volumes are below practical pipetting limits.

# Documentation and Resources

GitHub Repository: https://github.com/pepkio/pepkio-molarity-solution-calculator-js

Web Application: https://www.pepkio.com/tools/molarity-solution-calculator

Python client (PyPI): https://pypi.org/project/pepkio-molarity-solution-calculator/

# About Pepkio

Pepkio (https://www.pepkio.com/) develops software tools and bioinformatics solutions for life science researchers, including laboratory calculators and analysis services.

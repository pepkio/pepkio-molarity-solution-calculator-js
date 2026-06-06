export const mockManifest: Record<string, unknown> = {
  tool_id: "molarity-solution-calculator",
  title: "Molarity Solution Calculator",
  execution_mode: "sync",
  examples: [
    {
      name: "powder_cuso4",
      input: {
        mode: "powder",
        mw_anhydrous_g_per_mol: 159.61,
        hydrate_notation: "·5H2O",
        purity_percent: 99,
        target_concentration: 10,
        target_concentration_unit: "mM",
        final_volume: 50,
        final_volume_unit: "mL",
      },
      output: { result: { mass_g: 0.126 } },
    },
    {
      name: "dilution_pbs_10x",
      input: {
        mode: "dilution",
        stock_concentration: 10,
        stock_unit: "M",
        target_concentration: 1,
        target_unit: "M",
        final_volume: 1,
        final_volume_unit: "L",
      },
      output: { result: { stock_volume_L: 0.1 } },
    },
    {
      name: "serial_1M_to_1uM",
      input: {
        mode: "serial",
        stock_concentration: 1,
        stock_unit: "M",
        target_concentration: 1,
        target_unit: "uM",
        num_steps: 4,
        final_volume_ul: 100,
      },
      output: { result: { step_count: 4 } },
    },
  ],
};

export const mockRunResponse: Record<string, unknown> = {
  run_id: "run_test123",
  status: "completed",
  result: {
    mode: "powder",
    result: { mass_g: 0.126 },
    warnings: [],
    protocol_steps: [],
  },
  error: null,
  result_url: "https://tools.pepkio.com/api/tools/v1/runs/run_test123",
  permalink: "https://tools.pepkio.com/r/run_test123",
};

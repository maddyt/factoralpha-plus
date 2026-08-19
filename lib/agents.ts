export function buildEarningsPrepRequest({ ticker, quarter, question }) {
  const quarterText = quarter ? `for ${quarter}` : "";

  return {
    agent_id: "earnings-prep-agent-v1",
    input: {
      type: "message",
      role: "user",
      content: [
        {
          type: "text",
          text: `
You are an earnings prep research agent.

Ticker: ${ticker}
Quarter: ${quarterText || "latest upcoming or most recently reported quarter"}
User question: ${question}

Tasks:
1. Fetch and summarize recent filings, earnings releases, and transcripts.
2. Extract key metrics (revenue, EPS, margins, guidance) and compare vs prior quarter/year.
3. Identify main drivers, risks, and "what changed" vs last quarter.
4. Generate 2–3 plausible scenarios for the next 12 months and key watch items.

Return a single JSON object with the following shape:

{
  "snapshot": {
    "ticker": "...",
    "quarter": "...",
    "as_of_date": "...",
    "summary": "..."
  },
  "key_numbers": [
    { "label": "Revenue", "current": "...", "prior": "...", "comment": "..." },
    { "label": "EPS", "current": "...", "prior": "...", "comment": "..." }
  ],
  "drivers_and_risks": {
    "drivers": ["..."],
    "risks": ["..."]
  },
  "scenarios": [
    {
      "name": "Base case",
      "description": "...",
      "key_watch_items": ["..."]
    },
    {
      "name": "Upside case",
      "description": "...",
      "key_watch_items": ["..."]
    }
  ]
}
        `.trim(),
        },
      ],
    },
    tools: [
      { name: "sec_filings_tool" },
      { name: "earnings_transcripts_tool" },
      { name: "fundamentals_data_tool" },
    ],
  };
}

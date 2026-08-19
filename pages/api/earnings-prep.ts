import { supabase } from "../../lib/supabaseClient";
import { callAgent } from "../../lib/anthropicClient";
import { buildEarningsPrepRequest } from "../../lib/agents";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, projectId, ticker, quarter, question } = req.body;

  if (!userId || !projectId || !ticker || !question) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const agentPayload = buildEarningsPrepRequest({ ticker, quarter, question });
    const agentResponse = await callAgent(agentPayload);

    const briefJson =
      agentResponse?.output?.content?.[0]?.text
        ? JSON.parse(agentResponse.output.content[0].text)
        : agentResponse;

    const { data, error } = await supabase
      .from("earnings_briefs")
      .insert({
        user_id: userId,
        project_id: projectId,
        ticker,
        quarter,
        question,
        brief: briefJson,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ brief: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}

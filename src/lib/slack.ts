// Internal ops alerts via a Slack Incoming Webhook — not student-facing.
// Configured once at the workspace level (SLACK_WEBHOOK_URL), so a failure
// here should never block the request that triggered it.

export function slackConfigured(): boolean {
  return !!process.env.SLACK_WEBHOOK_URL;
}

export async function sendSlackAlert(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    // Best-effort — never let a Slack outage break the app.
  }
}

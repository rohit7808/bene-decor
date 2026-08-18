/**
 * Helper to safely parse fetch responses into JSON.
 * Verifies Content-Type is 'application/json' and prevents
 * 'Unexpected token <, <!DOCTYPE ...' syntax errors when non-200/HTML pages are returned.
 */
export async function safeJsonFetch<T = any>(
  res: Response
): Promise<{ success: boolean; data?: T; error?: string; status: number }> {
  const status = res.status;
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    console.warn(`[safeJsonFetch] ${res.url} returned status ${status} (${contentType || "no content-type"}):`, text.slice(0, 120));
    return {
      success: false,
      error: `Server error (${status}). Expected JSON but received HTML or plain text.`,
      status,
    };
  }

  try {
    const data = await res.json();
    return {
      success: res.ok && data?.success !== false,
      data,
      error: data?.error || (res.ok ? undefined : `Request failed (${status})`),
      status,
    };
  } catch (err: any) {
    console.error(`[safeJsonFetch JSON Parse Error] ${res.url}:`, err);
    return {
      success: false,
      error: "Failed to parse API response as JSON.",
      status,
    };
  }
}

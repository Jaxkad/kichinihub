/** Keep browser/library diagnostics out of customer-facing feedback. */
export function feedbackMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!(error instanceof Error)) return fallback;
  const code = (error as Error & { code?: string }).code;
  if (code?.startsWith("auth/")) {
    if (code === "auth/network-request-failed") return "We couldn’t connect. Check your internet connection and try again.";
    return "Please sign in again to continue.";
  }
  if (/failed to fetch|fetch failed|networkerror|network request failed|load failed/i.test(error.message))
    return "We couldn’t connect. Check your internet connection and try again.";
  if (error.name !== "Error" || /firebase|storage\/|auth\/|unexpected token|json|codec|decode|invalid argument|undefined|permission_denied/i.test(error.message)) return fallback;
  return error.message || fallback;
}

export function validationFeedback(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; code: string }>): string {
  const issue = issues[0];
  if (!issue) return "Please check the details you entered and try again.";
  const field = String(issue.path.at(-1) ?? "");
  if (field === "revision") return "Someone may have changed this page. Refresh it before trying again.";
  if (field === "password") return "Choose a password between 12 and 128 characters long.";
  if (field === "endsAt") return "Choose an end date and time after the event starts.";
  if (field === "url") return "Please choose the photo or video again using the upload button.";
  if (field === "alt") return "Add a short description of the image.";
  if (field === "price") return "Enter a price between 0 and 100,000,000, using numbers only.";
  const labels: Record<string, string> = { title:"title", name:"name", description:"description", email:"email address", displayName:"team member’s name", startsAt:"event start date and time", venue:"venue", social:"contact details", rsvp:"phone number", theme:"category colour", images:"photos and videos" };
  const label = labels[field];
  return label ? `Please check the ${label} and try again.` : "Some details need attention. Check your entries before trying again.";
}

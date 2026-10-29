export type Platform = "instagram" | "facebook" | "reddit";

export type SocialAccount = {
  platform: Platform;
  /** Username without the "@" or "u/". Accounts with an empty handle are not shown. */
  handle: string;
  /** Full profile URL. */
  url: string;
  /** Optional profile picture in /public, e.g. "/images/social/instagram.jpg" (square works best). */
  avatar?: string;
  /** Optional display name shown above the handle. */
  name?: string;
  /** Optional one-line bio. A playful default is shown per platform when omitted. */
  bio?: string;
  /**
   * Optional numbers to show, e.g. [{ label: "Followers", value: "1.2K" }].
   * Only add figures you have checked yourself: they are not fetched live and won't update on their own.
   */
  stats?: readonly { label: string; value: string }[];
};

/** Line shown as the section title. */
export const socialLabel = "Distract me on";

/**
 * Fill in your own accounts. Entries with an empty `handle` are skipped, and the whole
 * section disappears if none are filled in. Put profile pictures in /public/images/social/.
 */
export const socialAccounts: readonly SocialAccount[] = [
  { platform: "instagram", handle: "nirmal_nio_", url: "https://www.instagram.com/nirmal_nio_/" },
  { platform: "facebook", handle: "nirmal.govind", url: "https://www.facebook.com/nirmal.govind/" },
  { platform: "reddit", handle: "Big-Journalist5252", url: "https://www.reddit.com/user/Big-Journalist5252/" },
] as const;

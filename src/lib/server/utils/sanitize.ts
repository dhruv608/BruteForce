import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user-submitted rich-text HTML before saving to the DB.
 * Uses the same allowlist as the client-side HTMLRenderer so what
 * gets stored matches what gets rendered.
 *
 * Defense-in-depth: blocks malicious HTML (e.g. <script>, on* attrs,
 * javascript: URLs) at the boundary, so even if the render-time
 * sanitization is ever bypassed or changed, the DB stays clean.
 */
export const sanitizeRichText = (html: string | null | undefined): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
  });
};

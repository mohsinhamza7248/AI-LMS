/**
 * Extracts YouTube Video ID from various URL formats
 * Supports: standard (watch?v=), shorts, live, embed, and youtu.be
 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Robust regex for YouTube IDs (v2)
  // 1. Matches domains: youtube.com, youtu.be, m.youtube.com, etc.
  // 2. Matches paths: /watch?v=..., /embed/..., /v/..., /shorts/..., /live/...
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo ID from various URL formats
 */
export function getVimeoId(url: string | null | undefined): string | null {
  if (!url) return null;
  
  const regex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const match = url.match(regex);
  
  return match ? match[1] : null;
}

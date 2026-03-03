import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_SEO = {
  title: "Pomodoro Guard | Focus Timer and Social Productivity",
  description:
    "Pomodoro Guard is a focus timer app with streaks, stats, social challenges, and collaborative focus rooms.",
  noindex: false,
};

const ROUTE_SEO = {
  "/": {
    title: "Pomodoro Guard | Focus Timer and Social Productivity",
    description:
      "Build consistent focus with Pomodoro sessions, streak tracking, detailed stats, and friendly accountability.",
  },
  "/timer": {
    title: "Pomodoro Timer | Pomodoro Guard",
    description:
      "Run focused Pomodoro sessions with smooth controls and stay accountable with your productivity goals.",
  },
  "/stats": {
    title: "Productivity Stats | Pomodoro Guard",
    description:
      "Track your focus time, daily progress, and streak patterns to improve your productivity over time.",
  },
  "/milestones": {
    title: "Milestones and Progress | Pomodoro Guard",
    description:
      "Unlock milestones and monitor progress as you complete focus sessions and maintain momentum.",
  },
  "/friends": {
    title: "Friends and Leaderboard | Pomodoro Guard",
    description:
      "Connect with friends, compare progress, and stay motivated through social productivity challenges.",
  },
  "/rooms": {
    title: "Focus Rooms | Pomodoro Guard",
    description:
      "Join collaborative focus rooms and run sessions together for better accountability and concentration.",
  },
  "/challenges": {
    title: "Friend Challenges | Pomodoro Guard",
    description:
      "Create and join focus challenges with friends to keep your productivity streak going.",
  },
  "/shop": {
    title: "Rewards Shop | Pomodoro Guard",
    description:
      "Use your earned points in the rewards shop and gamify your focus routine.",
  },
  "/settings": {
    title: "Settings | Pomodoro Guard",
    description: "Customize your Pomodoro Guard experience, preferences, and account options.",
  },
  "/admin": {
    title: "Admin | Pomodoro Guard",
    description: "Administrative controls for Pomodoro Guard.",
    noindex: true,
  },
};

function getSeo(pathname) {
  if (ROUTE_SEO[pathname]) return ROUTE_SEO[pathname];
  if (pathname.startsWith("/friends/")) {
    return {
      title: "Friend Profile | Pomodoro Guard",
      description: "View shared productivity activity and profile details.",
      noindex: true,
    };
  }
  return DEFAULT_SEO;
}

function setMeta(property, content, attr = "name") {
  let tag = document.head.querySelector(`meta[${attr}="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
}

function setStructuredData(siteUrl) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pomodoro Guard",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description:
      "Pomodoro Guard is a focus timer app with streaks, stats, social challenges, and collaborative focus rooms.",
  };

  let script = document.getElementById("structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

export default function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeo(location.pathname);
    const canonicalUrl = `${window.location.origin}${location.pathname}`;

    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta(
      "robots",
      seo.noindex
        ? "noindex,nofollow"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    );

    setMeta("og:type", "website", "property");
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:url", canonicalUrl, "property");

    setMeta("twitter:card", "summary");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);

    setCanonical(canonicalUrl);
    setStructuredData(window.location.origin);
  }, [location.pathname]);

  return null;
}

import { useEffect } from "react";
import { getAppUrl } from "../lib/runtimeBase.js";

function setMetaAttribute(selector, attribute, key, content) {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

export function useManagedMeta({
  title,
  description,
  path = "/",
  keywords,
  image = "/images/1.jpg",
  type = "website",
  jsonLd,
}) {
  useEffect(() => {
    const canonical = /^https?:\/\//i.test(path) ? path : getAppUrl(path);
    const resolvedImage = /^https?:\/\//i.test(image) ? image : getAppUrl(image);

    document.title = title;
    setMetaAttribute('meta[name="description"]', "name", "description", description);
    setMetaAttribute('meta[property="og:type"]', "property", "og:type", type);
    setMetaAttribute('meta[property="og:title"]', "property", "og:title", title);
    setMetaAttribute(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMetaAttribute('meta[property="og:url"]', "property", "og:url", canonical);
    setMetaAttribute('meta[property="og:image"]', "property", "og:image", resolvedImage);
    setMetaAttribute('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaAttribute(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    setMetaAttribute('meta[name="twitter:image"]', "name", "twitter:image", resolvedImage);

    if (keywords) {
      setMetaAttribute('meta[name="keywords"]', "name", "keywords", keywords);
    }

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonical);

    let structuredDataTag = document.head.querySelector('script[data-managed="json-ld"]');
    if (jsonLd) {
      if (!structuredDataTag) {
        structuredDataTag = document.createElement("script");
        structuredDataTag.type = "application/ld+json";
        structuredDataTag.dataset.managed = "json-ld";
        document.head.appendChild(structuredDataTag);
      }

      structuredDataTag.textContent = JSON.stringify(jsonLd);
    } else if (structuredDataTag) {
      structuredDataTag.remove();
    }
  }, [description, image, jsonLd, keywords, path, title, type]);
}

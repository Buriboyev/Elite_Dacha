import { useCallback, useEffect, useState } from "react";

export function normalizePathname(pathname) {
  const normalized = (pathname || "/").replace(/\/+$/, "");
  return normalized || "/";
}

export function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", to);
    setPathname(window.location.pathname);
  }, []);

  return { pathname, navigate };
}

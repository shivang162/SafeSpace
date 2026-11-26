export type RouteShellKey = 'landing' | 'auth' | 'app' | 'admin';

export interface RouteTransitionSpec {
  axis: 'x' | 'y';
  direction: 1 | -1;
}

const APP_ROUTE_ORDER: readonly string[] = [
  '/dashboard',
  '/discover',
  '/communities',
  '/real-talk',
  '/same-here',
  '/my-space',
  '/talk-it-out',
  '/mood-tracker',
  '/journal',
];

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

/**
 * Groups routes by top-level layout shell so shell-to-shell switches
 * (Landing <-> Auth <-> Main App <-> Admin) animate as full-page transitions
 * while intra-app navigations keep the sidebar shell mounted.
 */
export function getRouteShellKey(pathname: string): RouteShellKey {
  const path = normalizePath(pathname);
  if (path === '/') return 'landing';
  if (path === '/auth') return 'auth';
  if (path === '/admin' || path.startsWith('/admin/')) return 'admin';

  const isAppRoute = APP_ROUTE_ORDER.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  return isAppRoute ? 'app' : 'landing';
}

function getAppRouteIndex(pathname: string): number {
  const path = normalizePath(pathname);
  return APP_ROUTE_ORDER.findIndex(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

/**
 * Determines direction-aware transition axis & polarity between two routes.
 * - Detail drill-in (e.g. /communities -> /communities/:id) glides horizontally forward.
 * - Detail back (e.g. /communities/:id -> /communities) glides horizontally back.
 * - Moving down/up the sidebar glides vertically along the travel direction.
 */
export function getRouteTransitionSpec(
  prevPath: string,
  nextPath: string
): RouteTransitionSpec {
  const prev = normalizePath(prevPath);
  const next = normalizePath(nextPath);

  if (prev === '/communities' && next.startsWith('/communities/')) {
    return { axis: 'x', direction: 1 };
  }
  if (prev.startsWith('/communities/') && next === '/communities') {
    return { axis: 'x', direction: -1 };
  }

  const prevIdx = getAppRouteIndex(prev);
  const nextIdx = getAppRouteIndex(next);

  if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
    return { axis: 'y', direction: nextIdx > prevIdx ? 1 : -1 };
  }

  return { axis: 'y', direction: 1 };
}

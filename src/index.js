import Router from './components/router/index.marko';

const router = () => process.browser ? window.router : null;

const isActive = (p) => {
  const path = p.split('?')[0];
  const href = router().getState();
  if (href === '/' && path !== '/') return false;
  return path.startsWith(href);
};
export { Router, router, isActive };

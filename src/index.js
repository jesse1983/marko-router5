const Router = require('./components/router/index.marko');

const router = () => process.browser ? window.router : null;

const isActive = (p, state) => {
  const objRouter = router();
  if (objRouter) {
    const path = p.split('?')[0];
    const current = state || objRouter.getState();
    if (path === '/' && current.path !== '/') return false;
    if (path === '/' && current.path === '/') return true;
    return current.path.startsWith(path);
  }
  return window.location.pathname === p;
};

const navigate = (path) => {
  const objRouter = router();
  if (!objRouter) return;
  const match = objRouter.matchPath(path);
  if (match) objRouter.navigate(match.name, match.params);
}
module.exports = { Router, router, isActive, navigate };

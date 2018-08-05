const Router = require('./components/router/index.marko');

const router = () => process.browser ? window.router : null;

const isActive = (path, state) => {
  const objRouter = router();
  if (path && objRouter) {
    const match = objRouter.matchPath(path.split('?')[0]);
    const current = state && state.path ? objRouter.matchPath(state.path) : objRouter.getState();
    if (match) return current.name.startsWith(match.name);
  }
  return false;
};

const navigate = (path) => {
  const objRouter = router();
  if (!objRouter) return;
  const match = objRouter.matchPath(path);
  if (match) objRouter.navigate(match.name, match.params);
}
module.exports = { Router, router, isActive, navigate };

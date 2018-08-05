const { createRouter } = require('router5');
const browserPlugin = require('router5/plugins/browser').default;
const { cloneDeep } = require('lodash');

module.exports = class {
  onCreate(input) {
    this.routes = input.routes || [];
    this.options = Object.assign({
      queryParamsMode: 'loose',
      defaultRoute: '/',
    }, (input.options || {}));
    this.state = {
      toState: null,
      fromState: null,
      renderBody: null,
      inputs: {}
    }
    this.notReady = true;
  }
  onMount() {
    this.router = createRouter(this.routes, this.options);
    this.router
      .useMiddleware(router => (toState, fromState, done) => this.beforeChangeRoute(toState, fromState, done))
      .usePlugin(browserPlugin({
        useHash: this.options.useHash || false,
      }))
      .start(this.options.initialRoute || (window.location.pathname + window.location.search));
    if (this.options.initialRoute !== this.options.defaultRoute) {
      const goto = this.router.matchPath(this.options.initialRoute);
      if (goto) this.router.navigate(goto.name, goto.params);
    }
    window.router = this.router;
  }
  beforeChangeRoute(toState, fromState, done) {
    const family = this.createFamilyComponents(toState);
    if (family.length > 0 && family[0].component) {
      const renderBody = this.addChildren(family, toState.params, 0);
      // const renderChild = this.renderChild(toState);
      const inputs = cloneDeep(this.input);
      delete inputs.routes;
      delete inputs.options;
      delete inputs.renderBody;
      delete inputs._target;
      inputs.params = toState.params;
      this.setState({
        toState,
        fromState,
        renderBody,
        inputs,
      });
      if (this.notReady) {
        this.forceUpdate();
        this.notReady = false;
      }
    }
    done();
  }
  createFamilyComponents(toState) {
    return this.routesStack(this.routes, toState.path);
  }
  routesStack(routes, path, root = '') {
    const stack = [];
    routes.forEach((route) => {
      const match = this.router.matchPath(path);
      const compond = [root, route.name].filter(e => !!e).join('.');
      if (route.children) {
        const children = this.routesStack(route.children, path, compond);
        if (children.length > 0) {
          children.forEach(c => stack.push(c));
          stack.unshift(route);
        }
      }
      if (compond === match.name) stack.unshift(route);
    });
    return stack;
  }
  addChildren(family, params, index) {
    if (!family[index]) return null;
    const modifiedComponent = cloneDeep(family[index].component);
    const fn = modifiedComponent._;
    modifiedComponent._ = (input, out) => {
      if (family[index + 1]) {
        input.renderBody = this.addChildren(family, params, index + 1);
        delete input._target;
      }
      return fn(input, out);
    };
    return modifiedComponent;
  }
}

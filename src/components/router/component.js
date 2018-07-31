import route5 from 'router5';
import browserPlugin from 'router5/plugins/browser';
import { cloneDeep } from 'lodash';

class Route5Component {
  onCreate(input) {
    this.routes = input.routes || [];
    this.options = Object.assign({
      queryParamsMode: 'loose',
    }, (input.options || {}));
    this.state = {
      toState: null,
      fromState: null,
      renderBody: null,
    }
    this.notReady = true;
  }
  onMount() {
    this.router = route5(this.routes, this.options);
    this.router
      .useMiddleware(router => (toState, fromState, done) => this.beforeChangeRoute(toState, fromState, done))
      .usePlugin(browserPlugin({
        useHash: this.options.useHash || false,
      }))
      .start();
    window.router = this.router;
  }
  beforeChangeRoute(toState, fromState, done) {
    const family = this.createFamilyComponents(toState);
    if (family.length > 0 && family[0].component) {
      const renderBody = this.addChildren(family, toState.params, 0);
      // const renderChild = this.renderChild(toState);
      this.setState({
        toState,
        fromState,
        renderBody,
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
      }
      input.params = params;
      return fn(input, out);
    };
    return modifiedComponent;
  }
}

module.exports = Route5Component;

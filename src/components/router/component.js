const { createRouter } = require('router5');
const browserPlugin = require('router5-plugin-browser').default;
const { cloneDeep } = require('lodash');
const { EventEmitter } = require('events');

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
      inputs: {},
    }
    this.notReady = true;
  }
  onMount() {
    this.router = createRouter(this.routes, this.options);
    this.router.usePlugin(this.pluginEvent());
    this.router.useMiddleware(router => (toState, fromState, done) => this.dataMiddlewareFactory(toState, fromState, done))
    this.router.useMiddleware(router => (toState, fromState, done) => this.beforeChangeRoute(toState, fromState, done))
    this.router.usePlugin(browserPlugin({ useHash: this.options.useHash || false }))
    this.router.start();
    if (this.input.initialPath) {
      const isPath = typeof this.input.initialPath === 'string';
      const initialPath = isPath ? this.input.initialPath : window.location.pathname + window.location.search;
      const goto = this.router.matchPath(initialPath);
      if (goto) this.router.navigate(goto.name, goto.params);
    }
    window.router = this.router;
  }
  dataMiddlewareFactory(toState, fromState, done) {
    if (this.input.awaitPromise && this.input.awaitPromise.constructor.name.toLowerCase() === 'function') {
      const promise = this.input.awaitPromise(toState, fromState);
      if (['Promise', 'awaitPromise'].indexOf(promise.constructor.name) > -1) {
        promise.then((resolved) => {
          toState.resolved = resolved;
          done();
        });
      } else {
        done();
        throw new Error('before-change attribute must be a function that return a promise');
      }
    } else {
      done();
    }
  }
  beforeChangeRoute(toState, fromState, done) {
    const family = this.createFamilyComponents(toState);
    if (family.length > 0 && family[0].component) {
      const renderBody = this.addChildren(family, toState.params, 0);
      // const renderChild = this.renderChild(toState);
      const inputs = cloneDeep(this.input);
      delete inputs.awaitPromise;
      delete inputs.routes;
      delete inputs.options;
      delete inputs.renderBody;
      delete inputs._target;
      inputs.params = toState.params;
      inputs.resolved = toState.resolved;
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
  pluginEvent() {
    return (router) => {
      return {
        pluginName: 'pluginEvent',
        onStart: (toState, fromState) => this.emitStates('start', { toState, fromState }),
        onStop: (toState, fromState) => this.emitStates('stop', { toState, fromState }),
        onTransitionStart: (toState, fromState) => this.emitStates('transition-start', { toState, fromState }),
        onTransitionSuccess: (toState, fromState) => this.emitStates('transition-success', { toState, fromState }),
        onTransitionError: (toState, fromState, err) => this.emitStates('transition-error', { toState, fromState, err }),
      }
    }
  }
  emitStates(eventName, states) {
    try {
      return this.emit(eventName, states);
    } catch (e) {
      return e;
    }
  }
}

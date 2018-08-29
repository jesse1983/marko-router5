const { isActive, navigate } = require('../../index');

module.exports = class {
  onMount() {
    if (window.router) {
      window.router.useMiddleware(route => (toState, fromState, done) => this.middleActive(toState, fromState, done));
    }
    if (!this.pass) this.middleActive({ path: window.location.pathname });
  }

  navigate(ev) {
    ev.preventDefault();
    if (this.input.href) navigate(this.input.href);
    else throw new Error('Missing attribute \'href\' on route-link component');
  }

  middleActive(toState, fromState, done) {
    this.pass = true;
    const a = this.input.parentClass ? this.getEl('a').parentElement : this.getEl('a');
    const className = this.input.activeClass || 'active';
    if (isActive(this.input.href, toState)) {
      className.split(' ').forEach(c => a.classList.add(c));
    } else {
      className.split(' ').forEach(c => a.classList.remove(c));
    }
    if (done) done();
  }
}

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
    navigate(this.input.href);
  }

  middleActive(toState, fromState, done) {
    this.pass = true;
    const a = this.input.parentElement ? this.getEl('a').parentElement : this.getEl('a');
    const className = this.input.activeClass || 'active';
    if (isActive(this.input.href, toState)) {
      className.split(' ').forEach(c => a.classList.add(c));
    } else {
      className.split(' ').forEach(c => a.classList.remove(c));
    }
    if (done) done();
  }
}

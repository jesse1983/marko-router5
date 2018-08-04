module.exports = class {
  onMount() {
    if (window.router) {
      window.router.useMiddleware(route => (toState, fromState, done) => this.middleActive(toState, fromState, done));
    }
  }

  navigate(ev) {
    ev.preventDefault();
    if (this.input.href) {
      const goto = window.router.matchPath(this.input.href);
      if (goto && goto.name) window.router.navigate(goto.name, goto.params);
    }
  }

  middleActive(toState, fromState, done) {
    const a = this.input.parentElement ? this.getEl('a').parentElement : this.getEl('a');
    const className = this.input.activeClass || 'active';
    if (this.isActive(toState.path, this.input.href)) {
      className.split(' ').forEach(c => a.classList.add(c));
    } else {
      className.split(' ').forEach(c => a.classList.remove(c));
    }
    if (done) done();
  }

  isActive(p, href) {
    if (p && href) {
      const path = p.split('?')[0];
      if (href === '/' && path !== '/') return false;
      return path.startsWith(href);
    }
    return false;
  }
}

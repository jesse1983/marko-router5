# Getting Started

Flexible and powerful routing for MarkoJS.

Full documentation: [https://jesse1983.github.io/marko-router5](https://jesse1983.github.io/marko-router5)

## Installation

Install marko-router5 package:
```sh
npm i marko-router5 -D
```
## Usage

Define routes on main marko file:

```html
<!-- Define routes -->
$ const routes = [
  { name: 'home', path: '/', component: require('./home.marko') },
  { name: 'products', path: '/products', component: require('./products.marko') },
  { name: 'contact', path: '/contact', component: require('./contact.marko') },
]

<div>
  <router routes=routes />
</div>
```

## Navigate

Add `route-link` tag instead `a` tag:

```html
<route-link href="/" class="nav-item">Home</route-link>
<route-link href="/products" class="nav-item">Products</route-link>
<route-link href="/contact" class="nav-item">Contact</route-link>
```

or

Import `navigate` method:

```js
const { navigate } = require('marko-router5');

navigate('/products');
```

## Nested routes

```js
$ const routes = [
  { name: 'products', path: '/products', component: require('./products.marko'), children: [
    { name: 'notebooks', path: '/notebooks', component: require('./notebooks.marko') },
    { name: 'desktops', path: '/desktops', component: require('./desktops.marko') },
    { name: 'others', path: '/others', component: require('./others.marko'), children: [
      { name: 'cpu-processors', path: '/cpu-processors', component: require('./cpu-processors.marko') },
      { name: 'memory-cards', path: '/memory-cards', component: require('./memory-cards.marko') },
    ] },
  ] },
]
```

-----

# Advanced

## Router

### Attributes

#### Options
All router options are on [Router Options](https://router5.js.org/guides/router-options) page.

```html
<router routes=routes options={ defaultRoute: 'home' } />
```

#### InitialPath
A initial path can be a string (ex: `/dashboard`) or a bool (if true, initial path will be current window location).

```html
<router routes=routes initial-path="/dashboard" />
<!-- or -->
<router routes=routes initial-path />
```

#### noWrapper
Remove `<div class="router5-placeholder">` wrapper.

```xml
<router routes=routes no-wrapper />
```

### Events

#### transitionStart

Before route change. **Value**: an object with next and previous route state `{ toState, fromState }`:

```
class {
  transitionStartMethod(states) {
    // use states.toState or states.fromState
  }
}
<route routes=routes on-transition-start('transitionStartMethod') />
```

#### transitionSuccess

After route change. **Value**: an object with next and previous route state `{ toState, fromState }`:

```
class {
  transitionSuccessMethod(states) {
    // use states.toState or states.fromState
  }
}
<route routes=routes on-transition-success('transitionSuccessMethod') />
```

#### transitionError

After route change and throw an error. **Value**: an object with next and previous route state and the error `{ toState, fromState, err }`:

```
class {
  transitionErrorMethod(states) {
    // use states.toState, states.fromState or states.err
  }
}
<route routes=routes on-transition-error('transitionErrorMethod') />
```

## Route Link

### Attributes

#### ActiveClass
Automatically current link will have class `active`. You can change class name using attribute `active-class`:
```html
<route-link href="/" class="nav-item" active-class="current">Home</route-link>
```
Result is:
```html
<a href="/" class="nav-item current">Home</a>
```

#### ParentClass
If you need add `active` class on parent element instead `a` tag, add `parent-class`:
```html
<li>
  <route-link href="/" class="nav-item" parent-class>Home</route-link>
</li>
```
Result is:
```html
<li class="active">
  <a href="/" class="nav-item">Home</a>
</li>
```

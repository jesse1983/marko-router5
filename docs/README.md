# Getting Started

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

## Router options

```html
<router routes=routes options={ defaultRoute: 'home' } />
```
All router options are on [Router Options](https://router5.js.org/guides/router-options) page.

## Navigate options

### ActiveClass
Automatically current link will have class `active`. You can change class name using attribute `active-class`:
```html
<route-link href="/" class="nav-item" active-class="current">Home</route-link>
```
Result is:
```html
<a href="/" class="nav-item current">Home</a>
```

### ParentClass
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

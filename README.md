# Getting Started

## Installation

Install marko-router5 package:
```
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
  <!-- Create navigation using router-link instead a tag -->
  <route-link href="/">Home</route-link>
  <route-link href="/products">Products</route-link>
  <route-link href="/contact">Contact</route-link>

  <!-- Add router -->
  <router routes=routes />
</div>
```
## Path syntax

TODO

## Router options

TODO

## Nested routes

TODO

# Advanced

## Middleware

TODO

## Loading async data

TODO


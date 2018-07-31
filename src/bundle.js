import Index from './examples/index.marko'

import 'uikit/dist/css/uikit.min.css';
const el = document.querySelector('#content');

const router = Index.renderSync().appendTo(el);

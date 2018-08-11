import Index from './index.marko'

import 'uikit/dist/css/uikit.min.css';

const router = Index.renderSync({ }).appendTo(document.querySelector('#content'));

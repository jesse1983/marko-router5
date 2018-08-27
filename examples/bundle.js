import Index from './index.marko'

import 'uikit/dist/css/uikit.min.css';

Index.renderSync({ }).appendTo(document.querySelector('#content'));

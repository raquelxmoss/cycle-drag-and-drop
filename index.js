import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div} from '@cycle/dom';

import app from './src/app';

const drivers = {
  DOM: makeDOMDriver('.app')
};

run(app, drivers);

import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div} from '@cycle/dom';
import mousePositionDriver from './drivers/mouse-position-driver';

import app from './src/app';

const drivers = {
  DOM: makeDOMDriver('.app'),
  Mouse: mousePositionDriver
};

run(app, drivers);

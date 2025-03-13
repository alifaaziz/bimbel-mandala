import root from './root.js';
import auth from './auth.js';
import users from './users.js';


/** @import {Application} from 'express' */

/** @param {Application} app */
export default (app) => {
    root(app);
    auth(app);
    users(app);
  };
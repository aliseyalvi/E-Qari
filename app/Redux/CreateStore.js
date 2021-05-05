import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { reactotron } from '../config/ReactotronConfig';
import { appReducer } from './Reducers/';

const middleware = [thunk];

// if (__DEV__) {
//   middleware.push(reduxLogger);
// }

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const store = createStore(rootReducer, applyMiddleware(...middleware));

export { store };

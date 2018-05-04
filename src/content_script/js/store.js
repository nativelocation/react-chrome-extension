import { createStore, applyMiddleware } from 'redux';
import { attemptFollow, attemptUnfollow } from './utilities';

const automations = {
  attemptFollow,
  attemptUnfollow,
}

const defaultState = {
  userFollowMinTime: 1,
  userFollowMaxTime: 1,
  userUnfollowMinTime: 1,
  userUnfollowMaxTime: 1,
  automatingFollow: false,
  automatingUnfollow: false,
}

function reducer(state = defaultState, action) {
  let newState = Object.assign({}, state);

  if (action.type == 'set') {
    newState = Object.assign(newState, action.values);
  }

  return newState;
}

let timeout = {};

const toggleAutomation = store => next => action => {
  
  if (action.type != 'automate.follow' && action.type != 'automate.unfollow') {
    return next(action);
  }

  let automationType = action.type === 'automate.follow' ? 'Follow' : 'Unfollow';

  if (timeout[automationType]) {
    clearTimeout(timeout[automationType]);
    timeout = {};
    return next({
      type: "set",
      values: {
        [`automating${automationType}`]: false
      }
    });
  }

  function automationLoop() {
    let state = store.getState();

    let timeoutSeconds = (Math.random() * (state[`user${automationType}MaxTime`] - state[`user${automationType}MinTime`])) + state[`user${automationType}MinTime`];

    timeout[automationType] = setTimeout(() => {

      automations[`attempt${automationType}`]().then(() => {
        automationLoop();
      }).catch(err => {
        console.error("Problem with Holofollower", err);
        clearTimeout(timeout[automationType]);
        timeout[automationType] = {};
        return next({
          type: "set",
          values: {
            [`automating${automationType}`]: false
          }
        });
      });
    }, timeoutSeconds * 1000);
  }

  automationLoop();

  return next({
    type: "set",
    values: {
      [`automating${automationType}`]: true
    }
  });
}

export default createStore(
  reducer,
  applyMiddleware(toggleAutomation)
);
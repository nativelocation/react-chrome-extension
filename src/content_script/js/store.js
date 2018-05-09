import {
  createStore,
  applyMiddleware
} from 'redux'
import {
  attemptFollow,
  attemptUnfollow,
  attemptLike,
  attemptComment
} from './utilities'

const workers = () => {
  onmessage = function(event) {
    setTimeout(() => {
      postMessage(1);
    }, 1000);
  }
}

let code = workers.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});

const automations = {
  attemptFollow,
  attemptUnfollow,
  attemptLike,
  attemptComment
}

const defaultState = {
  userFollowMinTime:        1,
  userFollowMaxTime:        1,
  userUnfollowMinTime:      1,
  userUnfollowMaxTime:      1,
  userLikeMinTime:          1,
  userLikeMaxTime:          1,
  userCommentMinTime:       1,
  userCommentMaxTime:       1,
  userCommentContent:       '',
  automatingFollow:         false,
  automatingUnfollow:       false,
  automatingLike:           false,
  automatingComment:        false
}

function reducer(state = defaultState, action) {
  let newState = Object.assign({}, state)

  if (action.type == 'set') {
    newState = Object.assign(newState, action.values)
  }

  return newState
}

let timeout = {}

// const myWorker = new Worker(URL.createObjectURL(blob));

const toggleAutomation = store => next => action => {
  
  // if (action.type != 'automate.follow' && action.type != 'automate.unfollow') {
  //   return next(action)
  // }

  let automationType = ''

  switch(action.type) {
    case 'automate.follow':
      automationType = 'Follow'
      break;
    case 'automate.unfollow':
      automationType = 'Unfollow'
      break;
    case 'automate.like':
      automationType = 'Like'
      break;
    case 'automate.comment':
      automationType = 'Comment'
      break;
    default:
      return next(action)
  }

  if (timeout['Follow']) {
    // clearTimeout(timeout['Follow'])
    timeout['Follow'].terminate()
    timeout['Like'] = undefined
    timeout = {}
    return next({
      type: 'set',
      values: {
        ['automatingFollow']: false
      }
    })
  }
  if (timeout['Unfollow']) {
    // clearTimeout(timeout['Unfollow'])
    timeout['Unfollow'].terminate()
    timeout['Unfollow'] = undefined
    timeout = {}
    return next({
      type: 'set',
      values: {
        ['automatingUnfollow']: false
      }
    })
  }
  if (timeout['Like']) {
    // clearTimeout(timeout['Like'])
    timeout['Like'].terminate()
    timeout['Like'] = undefined
    timeout = {}
    return next({
      type: 'set',
      values: {
        ['automatingLike']: false
      }
    })
  }
  if (timeout['Comment']) {
    // clearTimeout(timeout['Comment'])
    timeout['Comment'].terminate()
    timeout['Comment'] = undefined
    timeout = {}
    return next({
      type: 'set',
      values: {
        ['automatingComment']: false
      }
    })
  }

  // stopLoop()
  let ccount = 0;
  timeout[automationType] = new Worker(URL.createObjectURL(blob))

  timeout[automationType].onmessage = function(event) {
    if (automationType === 'Comment') {
      automations[`attempt${automationType}`](state.userCommentContent, userCommentMinTime, userCommentMaxTime)
      .then(() => {
        // automationLoop()
      })
    } else if (automationType === 'Like') {
      automations[`attempt${automationType}`]()
      // automationLoop()
      timeout[automationType].postMessage(1)
    } else {
      automations[`attempt${automationType}`]()
      .then(() => {
        // automationLoop()
        ccount++
        console.log(ccount)
        timeout[automationType].postMessage(1)
      })
      .catch(err => {
        console.error('Problem with Holofollower', err)
        // clearTimeout(timeout[automationType])
        // timeout[automationType] = {}
        // return next({
        //   type: 'set',
        //   values: {
        //     [`automating${automationType}`]: false
        //   }
        // })
      })
    }
  }
  // function automationLoop() {
  //   let state = store.getState()

  //   let timeoutSeconds = (Math.random() * (state[`user${automationType}MaxTime`] - state[`user${automationType}MinTime`])) + state[`user${automationType}MinTime`]
  //   console.log('here')

  //   timeout[automationType].postMessage(1)
  // }

  // automationLoop()
  timeout[automationType].postMessage(1)

  return next({
    type: 'set',
    values: {
      [`automating${automationType}`]: true
    }
  })
}

export default createStore(
  reducer,
  applyMiddleware(toggleAutomation)
)

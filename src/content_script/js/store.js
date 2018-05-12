import {
    createStore,
    applyMiddleware
} from 'redux'
import {
    attemptFollow,
    attemptUnfollow,
    attemptLike
} from './utilities'

let timeoutSeconds = 1000
const workers = () => {
    onmessage = function(event) {
        setTimeout(() => {
            postMessage(1)
        }, 1000)
    }
}
let code = workers.toString()
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"))
const blob = new Blob([code], {type: "application/javascript"})

const automations = {
    attemptFollow,
    attemptUnfollow,
    attemptLike
}

const defaultState = {
    userFollowMinTime:        1,
    userFollowMaxTime:        1,
    userUnfollowMinTime:      1,
    userUnfollowMaxTime:      1,
    userLikeMinTime:          1,
    userLikeMaxTime:          1,
    automatingFollow:         false,
    automatingUnfollow:       false,
    automatingLike:           false,
    active:                   true,
    fullLoad:                 false,
    likelimitEnable:          false,
    followlimitEnable:        false,
    COUNT_LIMIT:              500
}

function reducer(state = defaultState, action) {
    let newState = Object.assign({}, state)
    if (action.type == 'set' || action.type == 'likelimit'  || action.type == 'followlimit') {
        newState = Object.assign(newState, action.values)
    }
    return newState
}
let timeout = {}

const toggleAutomation = store => next => action => {
    let automationType = ''
    switch(action.type) {
        case 'automate.follow':
            automationType = 'Follow'
            break
        case 'automate.unfollow':
            automationType = 'Unfollow'
            break
        case 'automate.like':
            automationType = 'Like'
            break
        case 'likelimit':
            next(action)
            break
        case 'followlimit':
            next(action)
            break
        default:
            return next(action)
    }

    if (timeout['Follow']) {
        timeout['Follow'].terminate()
        timeout['Follow'] = undefined
        timeout = {}
        return next({
            type: 'set',
            values: {
                ['automatingFollow']: false
            }
        })
    }
    if (timeout['Unfollow']) {
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

    let state = store.getState()
    timeout[automationType] = new Worker(URL.createObjectURL(blob))
    timeout[automationType].onmessage = function(event) {
        timeoutSeconds = ((Math.random() * (state[`user${automationType}MaxTime`] - state[`user${automationType}MinTime`])) + state[`user${automationType}MinTime`]) * 1000
        if (automationType === 'Like') {
            automations[`attempt${automationType}`](state['active'], state['COUNT_LIMIT'])
            .then((e) => {
                console.log('then', e)
                timeout[automationType].postMessage(timeoutSeconds)
            })
            .catch(err => {
                next({
                    type: 'likelimit',
                    values: {
                        ['likelimitEnable']: true
                    }
                })
                timeout['Like'].terminate()
                timeout['Like'] = undefined
                timeout = {}
                return next({
                    type: 'set',
                    values: {
                        ['automatingLike']: false
                    }
                })
            })
        } else {
            automations[`attempt${automationType}`](state['active'], state['COUNT_LIMIT'])
            .then(() => {
                timeout[automationType].postMessage(timeoutSeconds)
            })
            .catch(err => {
                next({
                    type: 'followlimit',
                    values: {
                        ['followlimitEnable']: true
                    }
                })
                timeout['Follow'].terminate()
                timeout['Follow'] = undefined
                timeout = {}
                return next({
                    type: 'set',
                    values: {
                        ['automatingFollow']: false
                    }
                })
            })
        }
    }
    timeout[automationType].postMessage(timeoutSeconds)
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

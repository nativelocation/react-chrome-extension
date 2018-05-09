import Spinner from 'node-spintax'

const worker = () => {
  setTimeout(() => {
    postMessage(1);
  }, 1000);
}

let code = worker.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const myWorker = new Worker(URL.createObjectURL(blob));

const TIMEOUT_LOAD_DATA = 1000
const ATTEMPT_LIMIT = 1000
let WHOLE_BUTTONS = 0

function openFollowTabs(resolve, reject) {
  if (document.querySelector('.followers-tabs')) return resolve()

  let followersButton = document.querySelectorAll('.ds-holospace-stats')
  if (!followersButton.length) return reject()
  followersButton = followersButton[1]
  if (!followersButton) return reject()
  followersButton.click()
  setTimeout(resolve, TIMEOUT_LOAD_DATA)
}

function openCommentTabs(resolve, reject) {
  if (document.querySelector('.ds-comment-input.ds-form-wrapper.ng-isolate-scope.ng-valid .ds-textarea-wrapper .ds-textarea-container .ds-textarea.ds-text')) return resolve()

  let commentClassName = '.ds-engagement.ng-isolate-scope:not(.ng-hide) div .ds-engagement-icon.dsicon-comment'
  let commentsButton = document.querySelectorAll(commentClassName)
  if (!commentsButton.length) return reject()
  commentsButton = commentsButton[0]
  if (!commentsButton) return reject()
  commentsButton.click()
  setTimeout(resolve, TIMEOUT_LOAD_DATA)
}

function clickFollowButton(resolve, reject, className, modButton, listHeight = 0, attempt = 0) {
  let buttons = document.querySelectorAll('.btn-follow-follower')
  // console.log('WHOLE_BUTTONS', WHOLE_BUTTONS, buttons.length)
  // if (buttons.length == WHOLE_BUTTONS) {
  //   console.log('second', buttons, buttons.length, WHOLE_BUTTONS)
  //   WHOLE_BUTTONS = 0
  //   return reject()
  // }
  let button = document.querySelectorAll(className)[0]
  let activeList = document.querySelector('.tab-pane.active > .w-modal-follow-list')

  if (!button && (parseInt(listHeight) !== parseInt(activeList.scrollHeight))) {
    activeList.scrollTop = activeList.scrollHeight
    myWorker.onmessage = function(event) {
      clickFollowButton.bind(this, resolve, reject, className, modButton, activeList.scrollHeight, attempt+1)
    };
    // setTimeout(clickFollowButton.bind(this, resolve, reject, className, modButton, activeList.scrollHeight, attempt+1), 800)
    // setTimeout(function() { console.log('buttons', buttons, WHOLE_BUTTONS); WHOLE_BUTTONS = buttons.length }, 1000)
    return resolve()
  } else if (button) {
    let position = button.getBoundingClientRect()
    if (window.innerHeight < position.y || position.y < 0) {
      activeList.scrollTop = activeList.scrollTop + position.y - 200
    }
    button.click()
    if (modButton) modButton(button)
  }

  return resolve()
}

function clickPublishButton(resolve, reject, className, callback) {
  let button = document.querySelectorAll(className)[0]
  console.log(button)
  if (button) {
    button.click()
    // if (callback) setTimeout(callback, TIMEOUT_LOAD_DATA)
  }

  return resolve()
}

export function attemptFollow() {
  return new Promise(openFollowTabs)
  .then(() => {
    document.querySelectorAll('.nav-tabs a')[0].click()
  })
  .then(() => new Promise(
    (resolve, reject) => clickFollowButton(
      resolve,
      reject,
      '.btn-follow-follower:not(.following)',
      button => button.classList.add('following'),
      // ListHeight
    )
  ))
}

export function attemptUnfollow() {
  return new Promise(openFollowTabs)
  .then(() => {
    document.querySelectorAll('.nav-tabs a')[1].click()
  })
  .then(() => new Promise(
    (resolve, reject) => clickFollowButton(
      resolve,
      reject,
      '.btn-follow-follower.following', 
      button => button.classList.remove('following')
    )
  ))
}

export function attemptLike() {
  let buttonClassName = '.ds-engagement.ng-isolate-scope:not(.ng-hide) div .dsicon-heart.ds-engagement-icon:not(.ds-engagement-icon--liked)'
  let button = document.querySelectorAll(buttonClassName)[0]
  if (button) {
    button.click()
    button.classList.add('ds-engagement-icon--liked')
  }
}

export function attemptComment(commentSpin, minTime, maxTime) {
  return new Promise(openCommentTabs)
  .then(() => new Promise(
    (resolve, reject) => {
      let spinner = new Spinner(commentSpin)
      let comment = spinner.unspinRandom(1);
      console.log(comment)
      let textContainer = document.querySelector('.ds-comment-input.ds-form-wrapper.ng-isolate-scope.ng-valid .ds-textarea-wrapper .ds-textarea-container .ds-textarea.ds-text')
      console.log(textContainer)
      
      textContainer.addEventListener('input', function() {
        textContainer.innerHTML = `<p>${comment[0]}</p>`
      })
      let event = new Event('input', {
        'bubbles': true,
        'cancelable': true
      })
      textContainer.dispatchEvent(event)
      return resolve()
    }
  ))
  .then(() => new Promise(
    (resolve, reject) => clickPublishButton(
      resolve,
      reject,
      '.ds-comments-publish.ds-body-link.ds-comments-publish--allowed',
      () => {
        // window.location = 'https://www.holonis.com/feeds'
      }
    )
  ))
  .catch(err => console.error('Holofollowers problem', err))
}

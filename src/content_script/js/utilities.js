const TIMEOUT_LOAD_DATA = 1000
const ATTEMPT_LIMIT = 10

function openTabs(resolve, reject) {
  if (document.querySelector('.followers-tabs')) return resolve()

  let followersButton = document.querySelectorAll('.ds-holospace-stats')
  if (!followersButton.length) return reject()
  followersButton = followersButton[1]
  if (!followersButton) return reject()
  followersButton.click()
  setTimeout(resolve, TIMEOUT_LOAD_DATA)
}

function clickFollowButton(resolve, reject, className, modButton, listHeight = 0, attempt = 0) {
  let button = document.querySelectorAll(className)[0]
  let activeList = document.querySelector('.tab-pane.active > .w-modal-follow-list')
  
  // No follow/unfollow, scroll down and attempt to load additional ones
  if (!button && (listHeight != activeList.scrollHeight || attempt < ATTEMPT_LIMIT)) {
    activeList.scrollTop = activeList.scrollHeight
    listHeight = activeList.scrollHeight
    // TODO: Follow timeout can probably be calculated using an background script interceptor and more complex messaging
    setTimeout(clickFollowButton.bind(this, resolve, reject, className, modButton, activeList.scrollHeight, attempt+1), TIMEOUT_LOAD_DATA)
    return
  } else if (!button && listHeight == activeList.scrollHeight) {
    // If the attempt has been made, then just abort because there's no more action to take
    return reject()
  } else if (button) {
    button.click()
    if (modButton) modButton(button)
  }

  return resolve()
}

export function attemptFollow() {
  return new Promise(openTabs)
  .then(() => {
    document.querySelectorAll('.nav-tabs a')[0].click()
  })
  .then(() => new Promise((resolve, reject) => clickFollowButton(resolve, reject, '.btn-follow-follower:not(.following)', button => button.classList.add('following'))))
}

export function attemptUnfollow() {
  return new Promise(openTabs)
  .then(() => {
    document.querySelectorAll('.nav-tabs a')[1].click()
  })
  .then(() => new Promise((resolve, reject) => clickFollowButton(resolve, reject, '.btn-follow-follower.following', button => button.classList.remove('following'))))
  .catch(err => console.error("Holofollowers problem", err))
}
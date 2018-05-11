import Spinner from 'node-spintax'

const TIMEOUT_LOAD_DATA = 1000
let LOCALDB_FOLLOW = ''
let followButtons = 0
let counts = '1'

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

function clickFollowButton(resolve, reject, className, modButton, active, listHeight = 0, attempt = 0) {
    let buttons = document.querySelectorAll(className)
    let button = buttons[0]
    let activeList = document.querySelector('.tab-pane.active > .w-modal-follow-list')

    if ((active || !button) && (parseInt(counts) > parseInt(followButtons))) {
        activeList.scrollTop = activeList.scrollHeight
        counts = document.querySelectorAll('.hide-scroll .followers-tabs .active a span.ng-binding')[0].textContent
        counts = counts.substring(1, counts.length - 1)
        followButtons = document.querySelectorAll('.btn-follow-follower').length
        return resolve()
    } else if (button) {
        let wrapElement = button.parentElement.querySelector('.followers-info-wrapper .name.ds-space-name')
        let userLink = wrapElement.getAttribute('href')
        let username = wrapElement.querySelector('.ds-space-name-container .ds-space-name-text').textContent
        if (LOCALDB_FOLLOW === '') {
            LOCALDB_FOLLOW = JSON.parse(localStorage.getItem('Following'))
        }
        let users = LOCALDB_FOLLOW.users
        users = users.concat([{
            profileLink: userLink,
            username: username
        }])
        LOCALDB_FOLLOW.users = users
        localStorage.setItem('Following', JSON.stringify(LOCALDB_FOLLOW))
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

export function attemptFollow(active) {
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
            active
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

export function attemptLike(active) {
    return new Promise(function(resolve, reject) {
        let buttonClassName = '.ds-engagement:not(.ng-hide) .ds-engagement-bottom .dsicon-heart.ds-engagement-icon:not(.ds-engagement-icon--liked)'
        let button = document.querySelectorAll(buttonClassName)[0]
        let slideRoute = document.querySelectorAll('section.wrapper-feeds')[0]
        if (active || !button) {
            window.scrollTo(0, slideRoute.getBoundingClientRect().height)
            return resolve()
        } else if (button) {
            let position = button.getBoundingClientRect()
            let positionY = window.scrollY + position.top - 100
            window.scrollTo(0, positionY)
            button.click()
            button.classList.add('ds-engagement-icon--liked')
            return resolve()
        }
    })
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

import Spinner from 'node-spintax'

const TIMEOUT_LOAD_DATA = 1000
let LOCALDB_FOLLOW = ''
let LOCALDB_LIKE = ''
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
            let likelink = button.parentElement.parentElement.parentElement.querySelectorAll('.tile-content .tile-content-wrapper a.tile-general-link')[0].getAttribute('href')
            if (LOCALDB_LIKE === '') {
                LOCALDB_LIKE = JSON.parse(localStorage.getItem('Like'))
            }
            let link = LOCALDB_LIKE.link
            link = link.concat([likelink])
            LOCALDB_LIKE.link = link
            localStorage.setItem('Like', JSON.stringify(LOCALDB_LIKE))
            button.click()
            button.classList.add('ds-engagement-icon--liked')
            return resolve()
        }
    })
}

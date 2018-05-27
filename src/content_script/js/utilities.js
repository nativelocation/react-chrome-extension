import Spinner from 'node-spintax'
import _ from 'lodash'

const TIMEOUT_LOAD_DATA = 1000
let LOCALDB_FOLLOW = ''
let LOCALDB_LIKE = ''
let LOCALDB_COMMENT = ''
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

function clickFollowButton(resolve, reject, className, modButton, active, COUNT_LIMIT, sku, listHeight = 0, attempt = 0) {
    let buttons = document.querySelectorAll(className)
    let button = buttons[0]
    let activeList = document.querySelector('.tab-pane.active > .w-modal-follow-list')
    if (LOCALDB_FOLLOW === '') {
        LOCALDB_FOLLOW = JSON.parse(localStorage.getItem('Following'))
    }
    let users = LOCALDB_FOLLOW.users
    if (users.length > COUNT_LIMIT && sku === 'free') {
        return reject()
    } else {
        if ((active || !button) && (parseInt(counts) > parseInt(followButtons))) {
            activeList.scrollTop = activeList.scrollHeight
            counts = document.querySelectorAll('.hide-scroll .followers-tabs .active a span.ng-binding')[0].textContent
            if (counts.substring(counts.length - 2, counts.length - 1) === 'k') {
                counts = counts.substring(1, counts.length - 2) + '000'
            } else {
                counts = counts.substring(1, counts.length - 1)
            }
            followButtons = document.querySelectorAll('.btn-follow-follower').length
            return resolve()
        } else if (button) {
            let wrapElement = button.parentElement.querySelector('.followers-info-wrapper .name.ds-space-name')
            let userLink = wrapElement.getAttribute('href')
            let username = wrapElement.querySelector('.ds-space-name-container .ds-space-name-text').textContent
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
}

export function attemptFollow(active, COUNT_LIMIT, sku) {
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
            active,
            COUNT_LIMIT,
            sku
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

export function attemptLike(active, COUNT_LIMIT, sku) {
    return new Promise(function(resolve, reject) {
        let buttonClassName = '.ds-engagement:not(.ng-hide) .ds-engagement-bottom .dsicon-heart.ds-engagement-icon:not(.ds-engagement-icon--liked)'
        let button = document.querySelectorAll(buttonClassName)[0]
        let slideRoute = document.querySelectorAll('section.wrapper-feeds')[0]
        if (LOCALDB_LIKE === '') {
            LOCALDB_LIKE = JSON.parse(localStorage.getItem('Like'))
        }
        let link = LOCALDB_LIKE.link
        if (link.length > COUNT_LIMIT && sku === 'free') {
            return reject()
        } else {
            if (active || !button) {
                window.scrollTo(0, slideRoute.getBoundingClientRect().height)
                return resolve()
            } else if (button) {
                let position = button.getBoundingClientRect()
                let positionY = window.scrollY + position.top - 100
                window.scrollTo(0, positionY)
                let likelink = button.parentElement.parentElement.parentElement.querySelectorAll('.tile-content .tile-content-wrapper a.tile-general-link')[0].getAttribute('href')
                link = link.concat([likelink])
                LOCALDB_LIKE.link = link
                localStorage.setItem('Like', JSON.stringify(LOCALDB_LIKE))
                button.click()
                button.classList.add('ds-engagement-icon--liked')
                return resolve()
            }
        }
    })
}

export function attemptComment(commentSpin, active, COUNT_LIMIT, sku) {
    let nextPromise = 0
    return new Promise(function(resolve, reject){
        if (document.querySelector('.ds-comment-input.ds-form-wrapper.ng-isolate-scope.ng-valid .ds-textarea-wrapper .ds-textarea-container .ds-textarea.ds-text')) return resolve()
        let slideRoute = document.querySelectorAll('section.wrapper-feeds')[0]
        if (LOCALDB_COMMENT === '') {
            LOCALDB_COMMENT = JSON.parse(localStorage.getItem('Comment'))
        }
        let link = LOCALDB_COMMENT.link
        if (link.length > COUNT_LIMIT && sku === 'free') {
            return reject()
        } else {
            let postContainers = document.querySelectorAll('.grid-item.tile--post')
            let commentContainers = _.filter(postContainers, (postContainer) => {
                let hrefitem = postContainer.querySelectorAll('.wrapper-tile .tile-content .tile-content-wrapper .tile-general-link')[0].href
                if (_.findIndex(link, (linkitem) => {
                    if (linkitem === hrefitem) {
                        return true
                    }
                }) < 0) {
                    return true
                }
            })
            if (active || commentContainers.length === 0 || !commentContainers[0]) {
                window.scrollTo(0, slideRoute.getBoundingClientRect().height)
                return resolve()
            } else if (commentContainers[0]) {
                let position = commentContainers[0].getBoundingClientRect()
                let positionY = window.scrollY + position.top - 100
                window.scrollTo(0, positionY)

                link = link.concat([commentContainers[0].querySelectorAll('.wrapper-tile .tile-content .tile-content-wrapper .tile-general-link')[0].href])
                LOCALDB_COMMENT.link = link
                localStorage.setItem('Comment', JSON.stringify(LOCALDB_COMMENT))
                let commentClassName = '.ds-engagement.ng-isolate-scope:not(.ng-hide) div .ds-engagement-icon.dsicon-comment'
                let commentsButton = commentContainers[0].querySelectorAll(commentClassName)
                if (commentsButton.length === 0) {
                    return resolve()
                }
                commentsButton = commentsButton[0]
                if (!commentsButton) {
                    return resolve()
                }
                commentsButton.click()
                setTimeout(function() {
                    nextPromise = 1
                    resolve()
                }, 1500)
            }
        }
    })
    .then((e) => new Promise(function(resolve, reject){
        if (nextPromise === 1) {
            let spinner = new Spinner(commentSpin)
            let comment = spinner.unspinRandom(1)
            let textContainer = document.querySelector('.ds-comment-input.ds-form-wrapper.ng-isolate-scope.ng-valid .ds-textarea-wrapper .ds-textarea-container .ds-textarea.ds-text')
            let dispatchCount = 0
            let button = document.querySelectorAll('.ds-modal .ds-post .ds-comments .ds-comments-wrapper .ds-comments-form .ds-comments-publish')[0]
            let closeBtn = document.querySelectorAll('.ds-modal-close.dsicon-close')[0]
            textContainer.addEventListener('input', function(event) {
                textContainer.innerHTML = `${comment[0]}`
                setTimeout(function() {
                    if (button) {
                        button.click()
                    }
                    if (dispatchCount > 0) {
                        if (closeBtn) {
                            closeBtn.click()
                        }
                    }
                    dispatchCount = 1
                }, 500)
            })
            let firstEvent = new Event('input', {
                'bubbles': true,
                'cancelable': true
            })
            let secondEvent = new Event('input', {
                'bubbles': true,
                'cancelable': true
            })
            textContainer.dispatchEvent(firstEvent)
            textContainer.dispatchEvent(secondEvent)
            return resolve()
        }
        return resolve()
    }))
}

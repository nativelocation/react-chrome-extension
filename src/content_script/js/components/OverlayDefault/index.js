import { h, Component } from 'preact'
import OverlayUserFollow from '../OverlayUserFollow'
import OverlayUserUnfollow from '../OverlayUserUnfollow'

export default class extends Component {

    constructor() {
        super()
    }

    render(props, state) {

        let isUserPage = !!document.querySelector('.ds-cover-wrapper')
        let isOwnPage = !!document.querySelector('.ds-holospace-edit')

        return (
            <div>
                Visit your profile or another user's profile to view automation options.
            </div>
        )
    }
}
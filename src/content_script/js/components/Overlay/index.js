import { h, Component } from 'preact'
import OverlayUserFollow from '../OverlayUserFollow'
import OverlayUserUnfollow from '../OverlayUserUnfollow'
import OverlayDefault from '../OverlayDefault'

export default class extends Component {

  constructor() {
    super()
  }

  render(props, state) {

    let isUserPage = !!document.querySelector('.ds-cover-wrapper')
    let isOwnPage = !!document.querySelector('.ds-holospace-edit')

    return (
      <div
        className="holofollowers-overlay">
        { isUserPage && !isOwnPage && <OverlayUserFollow /> }
        { isUserPage && isOwnPage && <OverlayUserUnfollow /> }
        { !isUserPage && <OverlayDefault /> }
      </div>
    )
  }
}
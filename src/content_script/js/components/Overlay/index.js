import { h, Component } from 'preact'
import OverlayUserFollow from '../OverlayUserFollow'
import OverlayUserUnfollow from '../OverlayUserUnfollow'
import OverlayAutoLike from '../OverlayAutoLike'
import OverlayDefault from '../OverlayDefault'

export default class extends Component {

  constructor() {
    super()
  }

  render(props, state) {

    let isUserPage = !!document.querySelector('.ds-cover-wrapper')
    let isOwnPage = !!document.querySelector('.ds-holospace-edit')
    let isSearchPage = !!document.querySelector('.holo-tabs.list-blank.clearfix') ||
    !!document.querySelector('.ds-recommendations-container')

    return (
      <div
        className='holofollowers-overlay'>
        { isUserPage && !isOwnPage && <OverlayUserFollow onSet={props.onSet} /> }
        { isUserPage && isOwnPage && <OverlayUserUnfollow onSet={props.onSet} /> }
        { isSearchPage && <OverlayAutoLike onSet={props.onSet} /> }
        { !isUserPage && <OverlayDefault /> }
      </div>
    )
  }
}
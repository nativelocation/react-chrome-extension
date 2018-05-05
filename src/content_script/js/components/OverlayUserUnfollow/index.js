import { connect } from 'preact-redux'
import { h, Component } from 'preact'
class OverlayUserUnfollow extends Component {

  changeMaxTime(props, val) {

    if (val < props.userUnfollowMinTime) {
      val = props.userUnfollowMinTime
    }

    props.dispatch({ 
      type: 'set',
      values: {
        userUnfollowMaxTime: val
      }
    })

  }

  changeMinTime(props, val) {

    if (val < 1) val = 1

    if (val > props.userUnfollowMaxTime) {
      val = props.userUnfollowMaxTime
    }

    props.dispatch({ 
      type: 'set',
      values: {
        userUnfollowMinTime: val
      }
    })
  }

  beginUnfollowing(props) {
    props.dispatch({
      type: 'automate.unfollow'
    })
  }

  render(props, state) {
    return (
      <div>
        <label>
          <input
            value={props.userUnfollowMinTime}
            onInput={event => this.changeMinTime(props, event.target.value)}
            onChange={event => this.setState()}
            type="number" />
          Minimum wait seconds
        </label>
        <label>
          <input
            value={props.userUnfollowMaxTime}
            onInput={event => this.changeMaxTime(props, event.target.value)}
            onChange={event => this.setState()}
            type="number" />
          Maximum wait seconds
        </label>
        <button onClick={() => this.beginUnfollowing(props)}>{
          props.automatingUnfollow ? 'Stop unfollowing' : 'Begin automatically unfollowing'
        }</button>
      </div>
    )
  }
}

export default connect(state => state)(OverlayUserUnfollow)
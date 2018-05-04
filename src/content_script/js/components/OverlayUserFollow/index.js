import { connect } from 'preact-redux';
import { h, Component } from 'preact';
class OverlayUserFollow extends Component {

  changeMaxTime(props, val) {

    if (val < props.userFollowMinTime) {
      val = props.userFollowMinTime;
    }

    props.dispatch({ 
      type: 'set',
      values: {
        userFollowMaxTime: val
      }
    });

  }

  changeMinTime(props, val) {

    if (val < 1) val = 1;

    if (val > props.userFollowMaxTime) {
      val = props.userFollowMaxTime;
    }

    props.dispatch({ 
      type: 'set',
      values: {
        userFollowMinTime: val
      }
    });
  }

  beginFollowing(props) {
    props.dispatch({
      type: 'automate.follow'
    })
  }

  render(props, state) {
    return (
      <div>
        <label>
          <input
            value={props.userFollowMinTime}
            onInput={event => this.changeMinTime(props, event.target.value)}
            onChange={event => this.setState()}
            type="number" />
          Minimum wait seconds
        </label>
        <label>
          <input
            value={props.userFollowMaxTime}
            onInput={event => this.changeMaxTime(props, event.target.value)}
            onChange={event => this.setState()}
            type="number" />
          Maximum wait seconds
        </label>
        <button onClick={() => this.beginFollowing(props)}>{
          props.automatingFollow ? 'Stop following' : 'Begin automatically following'
        }</button>
      </div>
    )
  }
}

export default connect(state => state)(OverlayUserFollow);
import { connect } from 'preact-redux'
import { h, Component } from 'preact'

class OverlayAutoLike extends Component {

    changeLikeMaxTime(props, val) {
        if (val < props.userLikeMinTime) {
            val = props.userLikeMinTime
        }
        props.dispatch({ 
            type: 'set',
            values: {
                userLikeMaxTime: val
            }
        })
    }

    changeLikeMinTime(props, val) {
        if (val < 1) val = 1
        if (val > props.userLikeMaxTime) {
            val = props.userLikeMaxTime
        }
        props.dispatch({ 
            type: 'set',
            values: {
                userLikeMinTime: val
            }
        })
    }
    
    beginLike(props) {
        props.onSet('automate.like')
        props.dispatch({
            type: 'automate.like'
        })
    }

    render(props, state) {
        return (
            <div>
                <label>
                    <input
                        value={props.userLikeMinTime}
                        onInput={event => this.changeLikeMinTime(props, event.target.value)}
                        onChange={event => this.setState()}
                        type="number"
                    />
                    Minimum wait seconds
                </label>
                <label>
                    <input
                        value={props.userLikeMaxTime}
                        onInput={event => this.changeLikeMaxTime(props, event.target.value)}
                        onChange={event => this.setState()}
                        type="number"
                    />
                    Maximum wait seconds
                </label>
                <button onClick={props.likelimitEnable ? () => {} : () => this.beginLike(props)}>
                    {props.likelimitEnable ? 'Please update Pro version'
                        : props.automatingLike ? 'Stop autoLike' : 'Begin automatically Like'}
                </button>
            </div>
        )
    }
}

export default connect(state => state)(OverlayAutoLike)

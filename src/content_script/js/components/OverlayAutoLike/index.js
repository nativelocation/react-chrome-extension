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

    changeCommentMaxTime(props, val) {
        if (val < props.userCommentMinTime) {
            val = props.userCommentMinTime
        }
        props.dispatch({ 
            type: 'set',
            values: {
                userCommentMaxTime: val
            }
        })
    }

    changeCommentMinTime(props, val) {
        if (val < 1) val = 1
        if (val > props.userCommentMaxTime) {
            val = props.userCommentMaxTime
        }
        props.dispatch({ 
            type: 'set',
            values: {
                userCommentMinTime: val
            }
        })
    }

    changCommentSpin(props, val) {
        props.dispatch({ 
            type: 'set',
            values: {
                userCommentContent: val
            }
        })
    }
    
    beginLike(props) {
        props.onSet('automate.like')
        props.dispatch({
            type: 'automate.like'
        })
    }

    beginComment(props) {
        props.onSet('automate.comment')
        props.dispatch({
            type: 'automate.comment'
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
            <button onClick={() => this.beginLike(props)}>
                {props.automatingLike ? 'Stop autoLike' : 'Begin automatically Like'}
            </button>
            {/* <div style={{ height: '20px' }}></div>
            <label>
                <input
                    value={props.userCommentMinTime}
                    onInput={event => this.changeCommentMinTime(props, event.target.value)}
                    onChange={event => this.setState()}
                    type="number"
                />
                Minimum wait seconds
            </label>
            <label>
                <input
                    value={props.userCommentMaxTime}
                    onInput={event => this.changeCommentMaxTime(props, event.target.value)}
                    onChange={event => this.setState()}
                    type="number"
                />
                Maximum wait seconds
            </label>
            <label>
                <input
                    value={props.userCommentContent}
                    onInput={event => this.changCommentSpin(props, event.target.value)}
                    onChange={event => this.setState()}
                    type="text"
                />
                Comment
            </label>
            <button onClick={() => this.beginComment(props)}>
                {props.automatingComment ? 'Stop autoComment' : 'Begin automatically Comment'}
            </button> */}
        </div>
        )
    }
}

export default connect(state => state)(OverlayAutoLike)

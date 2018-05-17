import { connect } from 'preact-redux'
import { h, Component } from 'preact'
import Portal from 'preact-portal'
import Overlay from '../Overlay'

class App extends Component {

    constructor() {
        super()
        this.state = {
            showOverlay     :   false,
            handlelimit     :   false,
            actionState     :   false,
            actionType      :   ''
        }
    }

    componentWillMount() {
        if (localStorage.getItem('Following') === null) {
            localStorage.setItem('Following', JSON.stringify({
                users: []
            }))
        }
        if (localStorage.getItem('Like') === null) {
            localStorage.setItem('Like', JSON.stringify({
                link: []
            }))
        }
        let dbfollow = JSON.parse(localStorage.getItem('Following'))
        let users = dbfollow.users
        if (users.length > this.props.COUNT_LIMIT) {
            this.props.dispatch({
                type: 'set',
                values: {
                    ['followlimitEnable']: true
                }
            })
        }
        let dblike = JSON.parse(localStorage.getItem('Like'))
        let link = dblike.link
        if (link.length > this.props.COUNT_LIMIT) {
            this.props.dispatch({
                type: 'set',
                values: {
                    ['likelimitEnable']: true
                }
            })
        }
        window.addEventListener('focus', this.onFocus.bind(this));
        window.addEventListener('blur', this.onBlur.bind(this));
    }

    onFocus () {
        this.props.dispatch({
            type: 'set',
            values: {
                ['active']: true
            }
        })
        this.props.dispatch({
            type: this.state.actionType
        })
        this.props.dispatch({
            type: this.state.actionType
        })
    }

    onBlur () {
        this.props.dispatch({
            type: 'set',
            values: {
                ['active']: false
            }
        })
        this.props.dispatch({
            type: this.state.actionType
        })
        this.props.dispatch({
            type: this.state.actionType
        })
    }

    onSetState (type) {
        this.setState({
            actionState: !this.state.actionState,
            actionType: type
        })
    }

    render(props, state) {

        return (
            <div
                className='holofollowers-wrap'
                onMouseLeave={() => this.setState({ showOverlay: false }) }
            >
                <div
                    className='holofollowers-activate-panel'
                    onMouseEnter={
                        (props.likelimitEnable || props.followlimitEnable)
                            ? () => {}
                            : () => this.setState({ showOverlay: true })
                    }
                    onClick={() => {this.setState({ handlelimit: true })}}
                >
                    F
                </div>
                {state.showOverlay && <Overlay onSet={this.onSetState.bind(this)}/>}
                <Portal into='body'>
                    <div className={this.state.handlelimit ? 'holofollowers-modal open' : 'holofollowers-modal'}>
                        <div className='backdrop' onClick={() => {this.setState({ handlelimit: false })}}/>
                        <div className='inner'>
                            <div className='holofollowers-text'>
                                <span className='holofollowers-first'>YOUR TRIAL IS COMPLETE</span><br/>
                                <span className='holofollowers-second'>PLEASE UPGRADE TO THE PRO VERSION</span><br/>
                                <span className='holofollowers-third'>GET UNLIMITED FOLLOWING,</span><br/>
                                <span className='holofollowers-fourth'>{`UNFOLLOWING & LIKES`}</span><br/>
                            </div>
                            <div className='holofollowers-button-container'>
                                <button
                                    className='holofollowers-button'
                                    type='button'
                                    onClick={() => {this.setState({ handlelimit: false })}}
                                >
                                    Subscribe
                                </button>
                            </div>
                            <div className='holofollowers-fifth'>
                                Only $9.99/mo Cancel Anytime
                            </div>
                        </div>
                    </div>
                </Portal>
            </div>
        )
    }
}

export default connect(state=>state)(App)

import { connect } from 'preact-redux'
import { h, Component } from 'preact'
import Portal from 'preact-portal'
import Overlay from '../Overlay'
import '../../buy.js'

class App extends Component {

    constructor() {
        super()
        this.state = {
            showOverlay     :   false,
            handlelimit     :   true,
            actionState     :   false,
            actionType      :   '',
            sku             :   'free',
            licenses        :   null,
            reload          :   false
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
        if (localStorage.getItem('Comment') === null) {
            localStorage.setItem('Comment', JSON.stringify({
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
            this.setState({
                handlelimit: false
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
            this.setState({
                handlelimit: false
            })
        }
        let dbcomment = JSON.parse(localStorage.getItem('Comment'))
        let clink = dbcomment.link
        if (clink.length > this.props.COUNT_LIMIT) {
            this.props.dispatch({
                type: 'set',
                values: {
                    ['commentlimitEnable']: true
                }
            })
            this.setState({
                handlelimit: false
            })
        }
        window.addEventListener('focus', this.onFocus.bind(this));
        window.addEventListener('blur', this.onBlur.bind(this));

        google.payments.inapp.getSkuDetails({
            'parameters': {env: "prod"},
            'success': this.onSkuDetails.bind(this),
            'failure': this.onSkuDetailsFailed.bind(this)
        })
    }

    onSkuDetails (response) {
        let products = response.response.details.inAppProducts
        this.setState({
            sku: products[1].sku
        })
        google.payments.inapp.getPurchases({
            'parameters': {env: "prod"},
            'success': this.onLicenseUpdate.bind(this),
            'failure': this.onLicenseUpdateFailed.bind(this)
        })
    }

    onSkuDetailsFailed (response) {
        console.log('onSkuDetailsFailed', response)
    }

    onLicenseUpdate (response) {
        let licenses = response.response.details
        if (licenses.length !== 0) {
            console.log(licenses)
            this.setState({
                licenses: licenses[1]
            })
            this.props.dispatch({
                type: 'set',
                values: {
                    ['sku']: this.state.sku
                }
            })
            this.props.dispatch({
                type: 'set',
                values: {
                    ['licenses']: licenses
                }
            })
        }
        if (this.state.reload) {
            window.location.reload()
        }
    }

    onLicenseUpdateFailed (response) {
        console.log('onLicenseUpdateFailed', response)
    }

    onPurchase (response) {
        google.payments.inapp.getPurchases({
            'parameters': {env: "prod"},
            'success': this.onPurchaseUpdate.bind(this),
            'failure': this.onLicenseUpdateFailed.bind(this)
        })
    }

    onPurchaseUpdate (response) {
        this.setState({
            reload: true
        })
        this.onLicenseUpdate(response)
    }

    onPurchaseFailed (response) {
        console.log('onPurchaseFailed', response)
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
        console.log(this.state.reload)
        return (
            <div
                className='holofollowers-wrap'
                onMouseLeave={() => this.setState({ showOverlay: false }) }
            >
                <div
                    className='holofollowers-activate-panel'
                    onMouseEnter={
                        (props.sku !== 'free' && state.licenses)
                            ? () => this.setState({ showOverlay: true })
                            : (props.sku === 'free' && (props.likelimitEnable || props.commentlimitEnable || props.followlimitEnable))
                                ? () => {}
                                : () => this.setState({ showOverlay: true })
                    }
                    onClick={(props.sku === 'free' && (props.likelimitEnable || props.commentlimitEnable || props.followlimitEnable))
                        ? () => {
                            console.log('onClick',
                                this.state.showOverlay,
                                this.state.licenses,
                                props.sku,
                                props.likelimitEnable,
                                props.commentlimitEnable,
                                props.followlimitEnable)
                            this.setState({ handlelimit: true })}
                        : () => {}
                    }
                >
                    F
                </div>
                {state.showOverlay && <Overlay onSet={this.onSetState.bind(this)}/>}
                <Portal into='body'>
                    <div className={(this.state.handlelimit && (props.likelimitEnable || props.commentlimitEnable || props.followlimitEnable)) ? 'holofollowers-modal open' : 'holofollowers-modal'}>
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
                                    onClick={() => {
                                        google.payments.inapp.buy({
                                          parameters: {env: "prod"},
                                            'sku': this.state.sku,
                                            'success': this.onPurchase.bind(this),
                                            'failure': this.onPurchaseFailed.bind(this)
                                        })
                                        this.setState({ handlelimit: false })
                                    }}
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

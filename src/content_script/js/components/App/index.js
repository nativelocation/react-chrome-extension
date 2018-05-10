import { connect } from 'preact-redux'
import { h, Component } from 'preact'
import Overlay from '../Overlay'

class App extends Component {

  constructor() {
    super()
    this.state = {
      showOverlay: false,
      actionState: false,
      actionType: ''
    }
  }

  componentWillMount() {
    window.addEventListener('focus', this.onFocus.bind(this));
    window.addEventListener('blur', this.onBlur.bind(this));
  }

  onFocus () {
    console.log('onFocus')
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
    console.log('onBlur')
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
        onMouseLeave={() => this.setState({ showOverlay: false }) }>
        <div
          className='holofollowers-activate-panel'
          onMouseEnter={() => this.setState({ showOverlay: true }) }
        >
          F
        </div>
        { state.showOverlay && <Overlay onSet={this.onSetState.bind(this)} /> }
      </div>
    )
  }
}

export default connect(state=>state)(App)

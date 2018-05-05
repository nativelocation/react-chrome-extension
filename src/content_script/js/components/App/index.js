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
    window.addEventListener('focus', this.onChange.bind(this));
    window.addEventListener('blur', this.onChange.bind(this));
  }

  onChange () {
    if (this.state.actionState) {
      this.props.dispatch({
        type: this.state.actionType
      })
    }
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

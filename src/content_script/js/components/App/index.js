import { h, Component } from 'preact'
import Overlay from '../Overlay'

export default class extends Component {

  constructor() {
    super()
    this.state = {
      showOverlay: false
    }
  }

  render(props, state) {
    return (
      <div
        className="holofollowers-wrap"
        onMouseLeave={() => this.setState({ showOverlay: false }) }>
        <div 
          className="holofollowers-activate-panel"
          onMouseEnter={() => this.setState({ showOverlay: true }) }
        >
        F
        </div>
        { state.showOverlay && <Overlay /> }
      </div>
    )
  }
}
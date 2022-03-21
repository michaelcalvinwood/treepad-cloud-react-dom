import './App.scss';
import { Component } from 'react';
import Trees from './components/Trees/Trees';
import Controls from './components/Controls/Controls';
import Branches from './components/Branches/Branches';
import Leaves from './components/Leaves/Leaves';
import './styles/fontawesome/css/all.css'

class App extends Component {
  state = {
    windowState: {
      trees: true,
      controls: true,
      branches: true,
      leaves: true
    },
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }

  clickHandler = (e, window) => {
    console.group ('App clickHandler')
    let windowState = this.state.windowState;
    windowState[window] = !windowState[window]; 
    console.log (window, windowState);
    this.setState({
      windowState: windowState,
    })
    console.groupEnd();
  }

  windowResize = () => {
    this.setState(
      {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      }
    )
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
  }

  render () {
    if (this.state.windowWidth > 768) {
      return (
        <div className="app">
          <Trees 
            windowState={this.state.windowState}
            clickHandler={this.clickHandler}/>
          <Controls
            windowState={this.state.windowState}
            clickHandler={this.clickHandler}/>
          <Branches
            windowState={this.state.windowState}
            clickHandler={this.clickHandler}/>
          <Leaves 
            lwindowState={this.state.windowState}
            clickHandler={this.clickHandler}/>
        </div>
      )
    }
    return (
      <div>
        Screen dimensions not supported
      </div>
    ) 
  }
}

export default App;

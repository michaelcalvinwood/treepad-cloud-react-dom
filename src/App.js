import './App.scss';
import { Component } from 'react';
import Layout001 from './components/Layout001/Layout001';

// import Trees from './components/Trees/Trees';
// import Controls from './components/Controls/Controls';
// import Branches from './components/Branches/Branches';
// import Leaves from './components/Leaves/Leaves';
// import './styles/fontawesome/css/all.css'

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
        <Layout001 
          windowState={this.state.windowState} 
          windowHeight={this.state.windowHeight}
          windowWidth={this.state.windowWidth}
          clickHandler={this.clickHandler}/>
      )
    }
    return (
      <div>
        {this.state.windowWidth})
      </div>
    ) 
  }
}

export default App;

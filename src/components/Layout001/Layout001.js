import { Component } from 'react';
import Trees from './Trees/Trees';
import Controls from './Controls/Controls';
import Branches from './Branches/Branches';
import Leaves from './Leaves/Leaves';
import '../../styles/fontawesome/css/all.css'

class App extends Component {
  
  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
  }

  render () {
    const {windowState, windowHeight, windowWidth, clickHandler} = this.props;

    if (windowWidth > 768) {
      return (
        <div className="app">

          <Controls
            windowState={windowState}
            clickHandler={clickHandler}/>
          <Branches
            windowState={windowState}
            clickHandler={clickHandler}/>
          <Leaves 
            windowState={windowState}
            clickHandler={clickHandler}/>
          <Trees 
            windowState={windowState}
            clickHandler={clickHandler}/>

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

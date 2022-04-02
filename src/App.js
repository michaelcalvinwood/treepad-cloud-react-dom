import './App.scss';
import { Component } from 'react';
import Layout001 from './components/Layout001/Layout001';
import GetUser from './components/GetUser/GetUser'

// import Trees from './components/Trees/Trees';
// import Controls from './components/Controls/Controls';
// import Branches from './components/Branches/Branches';
// import Leaves from './components/Leaves/Leaves';
// import './styles/fontawesome/css/all.css'

class App extends Component {
  state = {
    userName: false,
    userId: false,
    deviceId: 0,
    email: false,
    password: false,
    jwt: false,
    windowState: {
      trees: true,
      controls: true,
      branches: true,
      leaves: true
    },
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }

  setUser = (userId, userName, jwt = 'public') => {
    this.setState({
      userName: userName,
      userId: userId,
      jwt: jwt
    })

    console.log ('App.js setUser', userName, userId);
  }
  

  toggleWindow = (e, window) => {
    
    let windowState = this.state.windowState;
    windowState[window] = !windowState[window]; 
    console.log (window, windowState);
    this.setState({
      windowState: windowState,
    })
    
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
    document.title="TreePad Cloud";
  }

  render () {
    console.log('App.js render', 'this.state.userName', this.state.userName, 'this.state.userId', this.state.userId);
    if (!this.state.userName || !this.state.userId) {
      return (
        <GetUser 
          setUser={this.setUser}
          setBranchPool={this.setBranchPool} />
      )
    }

    if (this.state.windowWidth > 768) {
      return (
        <Layout001 
          windowState={this.state.windowState} 
          windowHeight={this.state.windowHeight}
          windowWidth={this.state.windowWidth}
          toggleWindow={this.toggleWindow}
          userName={this.state.userName}
          userId={this.state.userId}
          jwt={this.state.jwt} />
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

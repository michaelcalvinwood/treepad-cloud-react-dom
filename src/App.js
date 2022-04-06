import './App.scss';
import { Component } from 'react';
import Layout001 from './components/Layout001/Layout001';
import GetUser from './components/GetUser/GetUser'
import axios from 'axios';

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
    view: 'userView',
    viewTreeId: false,
    viewTreeName: '',
    viewTreeIcon: '',
    viewBranchId: false,
    prevUrl: ''
  }

  setUser = (userId, userName, jwt = 'public') => {
    this.setState({
      userName: userName,
      userId: userId,
      jwt: jwt
    })
  }

  setWindowState = windowState => {
    this.setState({windowState: windowState});
  }
  

  toggleWindow = (e, window) => {
    let windowState = this.state.windowState;
    windowState[window] = !windowState[window]; 
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

  getUrlParts = url => {

  }

  authenticateUrl = location => {
    if (location.href === this.state.prevUrl) return;

    const request = {
      url: `${process.env.REACT_APP_BASE_URL}/authenticate`,
      method: 'post',
      data: {
        url: JSON.stringify(location)
      }
    }

    axios(request)
    .then(res => {
      sessionStorage.authToken = res.data.token;
      sessionStorage.userId = res.data.userid.toString();
      sessionStorage.userName = res.data.username;
      const userId = Number(res.data.userid);
      
      if (res.data.view === 'leafView') {
        this.setState({
          userId: userId,
          userName: res.data.username,
          view: res.data.view,
          viewTreeId: res.data.treeId,
          viewBranchId: res.data.branchId,
          windowState: {
            trees: false,
            controls: false,
            branches: false,
            leaves: true
          }
        })
      }

      if (res.data.view === 'branchView') {
        this.setState({
          userId: userId,
          userName: res.data.username,
          view: res.data.view,
          viewTreeId: res.data.treeId,
          viewBranchId: res.data.branchId,
          windowState: {
            trees: false,
            controls: false,
            branches: true,
            leaves: true
          }
        })
      }
    })
    .catch(err => {
      console.error('App.js authenticateUrl axios', err);
    })

    this.setState({prevUrl: location.href});
  }

  validateView = () => {
    
    const location = window.location;

    this.authenticateUrl(location);
  }

  componentDidUpdate() {
    this.validateView();
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
    document.title="TreePad Cloud";
    this.validateView();
  }

  render () {
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
          jwt={this.state.jwt}
          setWindowState={this.setWindowState}
          view={this.state.view}
          viewBranchId={this.state.viewBranchId}
          viewTreeId={this.state.viewTreeId} />
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

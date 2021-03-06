import './App.scss';
import { Component } from 'react';
import Layout001 from './components/Layout001/Layout001';
import GetUser from './components/GetUser/GetUser'
import axios from 'axios';

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
    viewBranchOrder: [],
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

  isAllowed = branchId => {
    const {viewBranchId, viewBranchOrder} = this.state;

    if (!viewBranchOrder.length) return false;

    // get index of allowed branch
    
    let viewLevel;
    let parts;
    let index = -1;
    for (let i = 0; i < viewBranchOrder.length; ++i) {
      parts = viewBranchOrder[i].split(":");
      if (parts[0].toString() === viewBranchId.toString()) {
        index = i;
        viewLevel = parts[1];
        break;
      }
    }

    // get numChildren
    let numChildren = 0;
    for (let i = index + 1; i < viewBranchOrder.length; ++i) {
      parts = viewBranchOrder[i].split(":");
      if (parts[1] <= viewLevel) break;
      ++numChildren
    }
    
    for (let i = index; i < index + numChildren + 1; ++i) {
      parts = viewBranchOrder[i].split(":");
      if (parts[0].toString() === branchId.toString()) {
        return true;
      }
    }
    return false;
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
      if (res.data.view === 'leafView') {
        sessionStorage.authToken = res.data.token;
        sessionStorage.userId = res.data.userid.toString();
        sessionStorage.userName = res.data.username;
        sessionStorage.view=res.data.view;
        const userId = Number(res.data.userid);
        
        this.setState({
          userId: userId,
          userName: res.data.username,
          view: res.data.view,
          viewTreeId: res.data.treeId,
          viewTreeName: res.data.treeName,
          viewTreeIcon: `${process.env.REACT_APP_BASE_URL}/${res.data.treeIcon}`,
          viewBranchId: res.data.branchId,
          windowState: {
            trees: false,
            controls: true,
            branches: false,
            leaves: true
          },
          viewBranchOrder: JSON.parse(res.data.branchOrder)
        })
        return;
      }

      if (res.data.view === 'branchView') {
        sessionStorage.authToken = res.data.token;
        sessionStorage.userId = res.data.userid.toString();
        sessionStorage.userName = res.data.username;
        sessionStorage.view=res.data.view;
        const userId = Number(res.data.userid);
        
        this.setState({
          userId: userId,
          userName: res.data.username,
          view: res.data.view,
          viewTreeId: res.data.treeId,
          viewTreeName: res.data.treeName,
          viewTreeIcon: `${process.env.REACT_APP_BASE_URL}/${res.data.treeIcon}`,
          viewBranchId: res.data.branchId,
          windowState: {
            trees: false,
            controls: true,
            branches: true,
            leaves: true
          },
          viewBranchOrder: JSON.parse(res.data.branchOrder)
        })
        return;
      }
      const sessionView = sessionStorage.getItem('view');
      if (!sessionView) return;
      sessionStorage.clear();
      this.setState({
        view: 'userView'
      })
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
          viewTreeId={this.state.viewTreeId}
          viewTreeName={this.state.viewTreeName}
          viewTreeIcon={this.state.viewTreeIcon}
          isAllowed={this.isAllowed} />
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

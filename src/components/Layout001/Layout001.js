import { Component } from 'react';
import Trees from './Trees/Trees';
import Controls from './Controls/Controls';
import Branches from './Branches/Branches';
import Leaves from './Leaves/Leaves';
import '../../styles/fontawesome/css/all.css'
import GetUser from './GetUser/GetUser';
import iconList from '../../assets/data/svg-filenames.json';


class App extends Component {

  state = {
    userName: localStorage.getItem('userName') || false,
    userId: localStorage.getItem('userId') || 1, // Important: Change to false after adding signup
    selectedTree: localStorage.getItem('selectedTree') || -2,
    selectedBranch: localStorage.getItem('selectedBranch') || false
  }
  
  setUser = (userName, userId) => {
    this.setState({
      userName: userName,
      userId: userId
    })

    console.log ('Layou001 setUser', userName, userId);
  }

  setTheTree = treeId => {
    console.log ("Layout001.js setTree", treeId)

    this.setState({
      selectedTree: treeId
    })
  }

  setBranch = branchId => {
    this.setState({
      selectedBranch: branchId
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
  }

  render () {
    const {windowState, windowHeight, windowWidth, clickHandler,setTheTree} = this.props;

    if (!this.state.userName || !this.state.userId) {
      return (
        <GetUser setUser={this.setUser} />
      )
    }

    if (windowWidth > 768) {
      return (
        <div className="app">

          <Controls
            windowState={windowState}
            clickHandler={clickHandler}/>
          <Branches
            windowState={windowState}
            clickHandler={clickHandler}
            treeId={this.state.selectedTree}
            branchId={this.state.selectedBranch}/>
          <Leaves 
            windowState={windowState}
            clickHandler={clickHandler}/>
          <Trees 
            windowState={windowState}
            clickHandler={this.setTheTree}
            userName={this.state.userName}
            userId={this.state.userId}
            iconList={iconList}
            selectedTree={this.state.selectedTree}/>
          {/* <Modals modalName=''/> */}
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

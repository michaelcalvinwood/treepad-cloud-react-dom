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
    userId: localStorage.getItem('userId') || false
  }
  
  setUser = (userName, userId) => {
    this.setState({
      userName: userName,
      userId: userId
    })

    console.log ('Layou001 setUser', userName, userId);
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
  }

  render () {
    const {windowState, windowHeight, windowWidth, clickHandler} = this.props;

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
            clickHandler={clickHandler}/>
          <Leaves 
            windowState={windowState}
            clickHandler={clickHandler}/>
          <Trees 
            windowState={windowState}
            clickHandler={clickHandler}
            userName={this.state.userName}
            userId={this.state.userId}
            iconList={iconList}/>
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

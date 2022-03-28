import './Branches.scss';
import branchIcon from '../../../assets/icons/branch.svg';
import React from 'react';
import Axios from 'axios';
import axios from 'axios';

class Branches extends React.Component {

    constructor() {
      super();
      // this.fetchingTree is set to the treeId of the tree whose branches are being fetched.
      this.fetchingTree = -1;
    }

    state = {
      branches: [],
      activeBranch: 1,
      treeId: false,
      lastUpdate: 0,
    }

    updateBranchName = (e, branchId) => {
      console.log (`Update ${branchId}: ${e.target.value}`);
      const updatedBranches = this.state.branches.map(branch => {
        console.log (branch.branchId, branchId);
        if (branch.branchId === branchId) branch.name = e.target.value;
        return branch;
      });
      console.log (updatedBranches);
      this.setState({
        branches: updatedBranches
      })
    } 

    displayBranchContent = () => {
      if (this.state.branches === false) return (<></>);

      return (
        this.state.branches.map(branch => {
          let className = `branches__branch branches__branch-${branch.branchId} branches__branch--level-${branch.level}`
          if (branch.status !== null) className += ` branches__branch--status-${branch.status}`;
          if (Number(branch.branchId) === this.state.activeBranch) className += ' branches__branch--active';
          return (
            <div><input
              className={className}
              onChange={e => this.updateBranchName(e, branch.branchId)}
              type='text'
              value={branch.name === null ? '' : branch.name} />
            </div>
          )
        })
      )
    }

    getBranches = treeId => {
        console.log (`Branches.js getBranches(${treeId})`);
        const request = {
          url: process.env.REACT_APP_BASE_URL + '/branches/order/' + treeId,
          method: "get",
        }

        this.fetchingTree = treeId;

        axios(request)
        .then(response => {

          let {branch_order, tree_id} = response.data.message[0];

          branch_order = JSON.parse(branch_order);

          console.log ("branch order", typeof branch_order);
          console.log ("treeId", tree_id);

          let branches = branch_order.map(branch => {
            console.log ('map branch', branch);
            let branchParts = branch.split(':');
            let item = {};

            item.branchId = branchParts[0];
            item.level = branchParts[1];
            if (!branchParts[2]) item.status = null;
            else item.status = branchParts[2];

            item.name = null;
            return item
          });

          console.log ('hola branches', branches);

          this.setState ({
            branches: branches,
            activeBranch: 1,
            treeId: tree_id,
            lastUpdate: Date.now()
          })

          
        })
        .catch(err => {
          console.log ('Error getting branch order', request);
          
        })
    }

    componentDidUpdate() {
      const {treeId} = this.props;

      console.log ("Branches componentDidUpdate: ", treeId, this.state.branches);

      if (treeId <= 0) return;

      if (treeId !== this.fetchingTree) this.getBranches(treeId);
      
    }

    componentDidMount() {
      const {treeId} = this.props;

      console.log ("Branches did mount", treeId);

      if (treeId <= 0) return;

      if (treeId !== this.state.treeId) this.getBranches(treeId);
      
    }

    render() {
      const {windowState, clickHandler, treeId} = this.props;

      console.group('Branches');
      console.log(windowState);
  
      let mainClassName = 'branches branches--active';
      
      if (windowState.trees) mainClassName += '-trees';
      if (windowState.branches) mainClassName += '-branches';
      if (windowState.leaves) mainClassName += '-leaves';
      if (windowState.controls) mainClassName += '-controls';
  
      let titleClassName = 'branches__title';
      let contentClassName = 'branches__content'
      
      if (!windowState.branches) {
          titleClassName += ' branches__title--closed';
          contentClassName += ' branches__content--closed';
      } else if (treeId <= 0) {
          contentClassName += ' branches__content--closed';
      }
  
      console.log ("branches mainClassName", mainClassName);
  
      console.groupEnd();
  
    return (
     
        <section className={mainClassName}>
            <div 
              className={titleClassName}
              onClick={e => clickHandler(e, 'branches')} >
                <img className="branches__icon" src={branchIcon} alt="branches" />
            </div>
            <div className={contentClassName}>
              {this.displayBranchContent()}
            </div>
                
        </section>
    )
    }
    
}

export default Branches
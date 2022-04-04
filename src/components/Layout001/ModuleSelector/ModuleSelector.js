import React, { Component } from 'react';
import axios from 'axios';
import './ModuleSelector.scss';
import ModuleSelectorCard from '../ModuleSelectorCard/ModuleSelectorCard';

export class ModuleSelector extends Component {
    state = {
        availableModules: []
    }

    selector = moduleName => {
        console.log(`ModuleSelector selector ${moduleName}`, 'color: orange')
        const request = {
            url: `${process.env.REACT_APP_BASE_URL}/modules/${this.props.branchId}`,
            method: "put", 
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            },
            data: {
                moduleName: moduleName
            }
        }
        axios(request)
        .then(res => {
            console.log('ModuleSelector selector axios', res.data);
            this.props.getActiveModule(true);
        })
        .catch(err => {
            console.error('ModuleSelector selector axios', err);
        })
    }

    fetchAvailableModules = () => {
        console.log('ModuleSelector fetchAvailableModules()');
        if (!this.state.availableModules.length) {
            const request = {
                url: `${process.env.REACT_APP_BASE_URL}/modules/`,
                method: "get", 
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            }

            axios(request)
            .then(res => {
                console.log('ModuleSelector fetchAvailableModules axios', res.data);
                this.setState({availableModules: res.data});
            })
            .catch(err => {
                console.err('ModuleSelector fetchAvailableModules axios', err);
            })
        }
    }

    componentDidUpdate() {
        this.fetchAvailableModules();
    }
    componentDidMount() {
        this.fetchAvailableModules();
    }
  render() {
    return (
      <div className="module-selector">
          {
              this.state.availableModules.map(module => {
                  return (
                      <ModuleSelectorCard 
                        icon={`${process.env.REACT_APP_BASE_URL}${module.module_icon}`}
                        title={module.module_name} 
                        selector={() => this.selector(module.module_name)}/>
                  )
              })
          }
      </div>
    )
  }
}

export default ModuleSelector
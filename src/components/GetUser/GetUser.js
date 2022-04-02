import axios from 'axios';
import React from 'react';
import './GetUser.scss';

// This is where signup and login will occur

class GetUser extends React.Component {

    constructor() {
        super();
        this.userName = '';
        this.email = '';
        this.password = '';
    }

    updateUserName = e => {
        this.userName = e.target.value;
    }

    updateEmail = e => {
        this.email = e.target.value;
    }

    updatePassword = e => {
        this.password = e.target.value;
    }

    // getBranchPool = userId => {
    //     const request = {
    //         url: `${process.env.REACT_APP_BASE_URL}/branch-pool/${userId}`,
    //         method: 'get',
    //         headers: {
    //             Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
    //         }
    //     }

    //     axios(request)
    //     .then(res => {
    //         console.log (`GetUser.js getBranchPool(${userId}) axios response.data`, res.data.message[0]);
    //         this.props.setBranchPool(res.data.message[0].user_id, JSON.parse(res.data.message[0].branch_pool));
    //     })
    //     .catch(err => {
    //         console.log (`GetUser.js getBranchPool(${userId}) axios error`, err);
    //     })
    // }

    handleLogin = e => {
        e.preventDefault();

        if (!this.userName) return;

        if (!this.password) return;

        const userName = this.userName;
        const password = this.password;
        
        // login
        const request = {
            url: `${process.env.REACT_APP_BASE_URL}/login`,
            method: 'post',
            data: {
                userName: userName,
                password: password
            }
        }

        axios(request)
        .then(res => {
            console.log(`GetUser.js handleLogin axios success`, res.data);
            sessionStorage.authToken = res.data.token;
            sessionStorage.userId = res.data.userId.toString();
            sessionStorage.userName = userName;
            const userId = Number(res.data.userId);
            this.props.setUser(userId, userName);
            // this.getBranchPool(userId);
        })
        .catch(err => {
            console.error(`GetUser.js handleLogin axios error`, err);
        })
        
        console.log (`GetUser.js handleLogin`, 'request', request);
    }

    componentDidMount() {
        const token = sessionStorage.getItem('authToken');
        if (!token) return;

        const userId = sessionStorage.getItem('userId');
        if (!userId) return;

        const userName = sessionStorage.getItem('userName');
        if (!userName) return;

        this.props.setUser(Number(userId), userName);
        // this.getBranchPool(Number(userId));
    }
    render() {
        return (
            <div className='get-user modal'>
                <div className='modal__container'>
                    <h1>Login/Sign Up</h1>
                    <form 
                        className='get-user__form'
                        onSubmit={this.handleLogin} >
                        <input 
                            className='get-user__user-name'
                            onChange={this.updateUserName} 
                            placeholder='user name'
                            type='text'/>
                        <input
                            className='get-user__email'
                            onChange={this.updateEmail}
                            placeholder='email'
                            type='text' />
                        <input
                            className='get-user__password'
                            onChange={this.updatePassword}
                            placeholder='password'
                            type='password' />
                        <button className='get-user__button'>Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default GetUser;
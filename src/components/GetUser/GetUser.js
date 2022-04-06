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
                sessionStorage.authToken = res.data.token;
                sessionStorage.userId = res.data.userId.toString();
                sessionStorage.userName = userName;
                const userId = Number(res.data.userId);
                this.props.setUser(userId, userName);
            })
            .catch(err => {
                console.error(`GetUser.js handleLogin axios error`, err);
            })
    }

    componentDidMount() {
        const token = sessionStorage.getItem('authToken');
        if (!token) return;

        const userId = sessionStorage.getItem('userId');
        if (!userId) return;

        const userName = sessionStorage.getItem('userName');
        if (!userName) return;

        this.props.setUser(Number(userId), userName);
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
                            type='text' />
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
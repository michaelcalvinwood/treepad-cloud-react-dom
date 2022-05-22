import axios from 'axios';
import React from 'react';
import './GetUser.scss';
import treePadIcon from '../../assets/icons/treepadcloud-icon.svg';

// This is where signup and login will occur

class GetUser extends React.Component {

    constructor() {
        super();
        this.userName = '';
        this.email = '';
        this.password = '';
    }

    state = {
        action: 'login'
    }

    setSignup = () => {
        this.setState({action: 'signup'});
    }

    setLogin = () => {
        this.setState({action: 'login'});
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
        const {action} = this.state;

        return (
            <div className='get-user modal'>
                <div className='get-user__modal-container modal__container'>
                    <div className='get-user__logo-container'>
                        <img className='get-user__logo' src={treePadIcon} />
                        <p className='get-user__product-name'>TreePad Cloud</p>
                    </div>
                    
                    {action === 'login' ?
                    <h1 className="get-user__heading">Login</h1> :
                    <h1 className="get-user__heading">Sign Up</h1>}
                    <form
                        className='get-user__form'
                        onSubmit={this.handleLogin} >
                        <input
                            className='get-user__user-name'
                            onChange={this.updateUserName}
                            placeholder='user name'
                            type='text' />
                        {action === 'login' ?
                        '' :
                        <input
                            className='get-user__email'
                            onChange={this.updateEmail}
                            placeholder='email'
                            type='text' /> }
                        <input
                            className='get-user__password'
                            onChange={this.updatePassword}
                            placeholder='password'
                            type='password' />
                        <button className='get-user__button'>Submit</button>
                        {action === 'login' ?
                        <p 
                            className='get-user__solicit-signup'
                            onClick={this.setSignup}>
                            Signup
                        </p> :
                        <p 
                            className='get-user__solicit-login'
                            onClick={this.setLogin}>
                            Login
                        </p>}
                    </form>
                </div>
            </div>
        )
    }
}

export default GetUser;
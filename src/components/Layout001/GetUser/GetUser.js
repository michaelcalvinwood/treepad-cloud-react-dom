import axios from 'axios';
import React from 'react';
import './GetUser.scss';

// This is where signup and login will occur

class GetUser extends React.Component {

    getBranchPool = userId => {
        const request = {
            url: `${process.env.REACT_APP_BASE_URL}/branch-pool/${userId}`,
            method: 'get'
        }

        axios(request)
        .then(res => {
            console.log (`GetUser.js getBranchPool(${userId}) axios response.data`, res.data.message[0]);
            

            this.props.setBranchPool(res.data.message[0].user_id, JSON.parse(res.data.message[0].branch_pool));
        })
        .catch(err => {
            console.log (`GetUser.js getBranchPool(${userId}) axios error`, err);
        })
    }

    componentDidMount() {
        this.props.setUser(2, 'admin');
        this.getBranchPool(2);
        
    }
    render() {
        return (
            <div>GetUser</div>
        )
    }
}

export default GetUser;
import React from 'react';
import './GetUser.scss';

// This is where signup and login will occur

class GetUser extends React.Component {

    componentDidMount() {
        this.props.setUser('admin', 1);
    }
    render() {
        return (
            <div>GetUser</div>
        )
    }
}

export default GetUser;
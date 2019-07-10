import React, {Component} from 'react';
import axios from 'axios';

class App extends Component {

    componentDidMount() {
        axios.get('/api/product/brands').then((response) => {
            console.log(response);
        })
    }


    render() {
        return (
            <div>
                <h1>Hello world</h1>
            </div>
        );
    }
}

export default App;

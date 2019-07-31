import React from 'react';
import {Switch, Route} from "react-router-dom";
import Layout from "./hoc/layout";
import Home from "./components/Home";
import RegisterLogin from "./components/RegisterLogin";
import Register from "./components/RegisterLogin/Register";

import Dashboard from "./components/Dashboard";


const Routes = () => {
    return (
        <Layout>
            <Switch>

                <Route path="/dashboard" exact component={Dashboard}/>

                <Route path="/register" exact component={Register}/>
                <Route path="/register_login" exact component={RegisterLogin}/>
                <Route path="/" exact component={Home}/>
            </Switch>
        </Layout>
    );
};

export default Routes;

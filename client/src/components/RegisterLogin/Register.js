import React, {Component} from 'react';

import FormField from "../utils/Form/FormField";
import {update, generateData, isFormValid} from "../utils/Form/formActions";

import Dialog from '@material-ui/core/Dialog';

import {withRouter} from 'react-router-dom';


import {connect} from "react-redux";

import {registerUser} from '../../actions/user_actions';

class Register extends Component {

    state = {
        formError: false,
        formSuccess: false,
        formData: {
            first_name: {
                element: 'input',
                value: '',
                config: {
                    name: 'first_name_input',
                    type: 'text',
                    placeholder: 'Enter your First Name'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            last_name: {
                element: 'input',
                value: '',
                config: {
                    name: 'last_name_input',
                    type: 'text',
                    placeholder: 'Enter your Last Name'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            email: {
                element: 'input',
                value: '',
                config: {
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            password: {
                element: 'input',
                value: '',
                config: {
                    name: 'password_input',
                    type: 'password',
                    placeholder: 'Enter your password'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            confirm_password: {
                element: 'input',
                value: '',
                config: {
                    name: 'confirm_password_input',
                    type: 'password',
                    placeholder: 'Confirm your password'
                },
                validation: {
                    required: true,
                    confirm: 'password'
                },
                valid: false,
                touched: false,
                validationMessage: ''
            }
        }
    };


    updateForm = (element) => {
        const newFormData = update(element, this.state.formData, 'register');
        this.setState({
            formError: false,
            formData: newFormData
        })
    };

    submitForm = (event) => {
        event.preventDefault();

        let dataToSubmit = generateData(this.state.formData, 'register');
        let formIsValid = isFormValid(this.state.formData, 'register');

        if (formIsValid) {
            // console.log(dataToSubmit);
            this.props.dispatch(registerUser(dataToSubmit))
                .then(response => {
                    if (response.payload.registerSuccess) {
                        console.log(response.payload);
                        this.setState({
                            formError: false,
                            formSuccess: true
                        });
                        setTimeout(() => {
                            this.props.history.push('/register_login');
                        }, 3000)

                    } else {
                        this.setState({formError: true})
                    }
                }).catch((error) => {
                this.setState({formError: true})
            })
        } else {
            this.setState({formError: true})
        }
    };


    render() {
        return (
            <div className="page_wrapper">
                <div className="container">
                    <div className="register_login_container">
                        <div className="left">
                            <form onSubmit={(event) => this.submitForm(event)}>
                                <h2>Personal information</h2>
                                <div className="form_block_two">
                                    <div className="block">
                                        <FormField
                                            id={'first_name'}
                                            formData={this.state.formData.first_name}
                                            change={(element) => this.updateForm(element)}
                                        />
                                    </div>
                                    <div className="block">
                                        <FormField
                                            id={'last_name'}
                                            formData={this.state.formData.last_name}
                                            change={(element) => this.updateForm(element)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <FormField
                                        id={'email'}
                                        formData={this.state.formData.email}
                                        change={(element) => this.updateForm(element)}
                                    />
                                </div>
                                <h2>Verify password</h2>
                                <div className="form_block_two">
                                    <div className="block">
                                        <FormField
                                            id={'password'}
                                            formData={this.state.formData.password}
                                            change={(element) => this.updateForm(element)}
                                        />
                                    </div>
                                    <div className="block">
                                        <FormField
                                            id={'confirm_password'}
                                            formData={this.state.formData.confirm_password}
                                            change={(element) => this.updateForm(element)}
                                        />
                                    </div>

                                </div>

                                {this.state.formError ?
                                    <div className="error_label">
                                        Please check your data
                                    </div>
                                    : null
                                }

                                <button onClick={(event) => this.submitForm(event)}>Create an account</button>

                            </form>
                        </div>
                    </div>
                </div>


                <Dialog open={this.state.formSuccess}>
                    <div className="dialog_alert">
                        <div>Congratulations !</div>
                        <div>
                            You will be redirected to the LOGIN in a couple seconds ..
                        </div>
                    </div>
                </Dialog>

            </div>
        );
    }
}

export default connect()(withRouter(Register));
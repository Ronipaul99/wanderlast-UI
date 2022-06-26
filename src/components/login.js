import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginform: {
                contactNo: "",
                password: ""
            },
            loginformErrorMessage: {
                contactNo: "",
                password: ""
            },
            loginformValid: {
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,
            userId: "",
            spinner:false,
        }
    }

    handleClick = () => {
        this.setState({ loadRegister: true })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { loginform } = this.state;
        this.setState({
            loginform: { ...loginform, [name]: value }
        });
        this.validateField(name, value);
        
    }

    login = () => {
        this.setState({spinner:true})
        const { loginform } = this.state;
        const {loginformErrorMessage} = this.state;
        setTimeout(()=>{
            axios.post(backendUrlUser+'/login', loginform)
            .then(response => {
              //  console.log(response);
              this.setState({spinner:false})
                let userId = response.data.userId;
                sessionStorage.setItem("contactNo", response.data.contactNo);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userName", response.data.name);;
                this.setState({ loadHome: true, userId: userId },()=>{
                    window.location.reload();
                })

            }).catch((Error) => {
                if(Error){
                    this.setState({spinner:false})
                    this.errorMessage = Error.response.data.message;
                    if(this.errorMessage==="Incorrect password"){
                        loginformErrorMessage.password=this.errorMessage;
                    }else{
                         loginformErrorMessage.contactNo=this.errorMessage;
                    }
                    sessionStorage.clear();
                    this.setState({loginformErrorMessage})
                }else{
                    this.errorMessage = Error.message;
                }
                
            })
        }, 500);

       
         console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.login();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.loginformErrorMessage;
        let formValid = this.state.loginformValid;
        switch (fieldName) {
            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Contact number should be a valid 10 digit number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                    // } else if (!(value.match(/[a-zA-z]/) && value.match(/[0-9]/) && value.match([/_/]))) {
                    //     // fieldValidationErrors.password = "Please Enter a valid password"
                    //     // formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    
    
}
/*this.context.router.push('/home/' + this.state.userId)*/ 
    render() {
         if (this.state.loadHome === true) return < Redirect to={'/home/' + this.state.userId} />
        if (this.state.loadRegister === true) return <Redirect to={'/register'} />
        if(this.state.spinner) return(<div > 
            <div id="details" className="details-section">
            <div className="text-center">
            <ProgressSpinner></ProgressSpinner>
        </div>
    </div></div>)
        return (
            <div className="login">
                <section id="loginPage" className="loginSection">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="card col-md-4 offset-md-4" style={{paddingTop:"2%",marginTop:"-90px",height:"500px"}}>
                            <div className="card-title text-primary">
                                <h1>Login</h1>
                            </div>
                            <div className="card-body"style={{paddingLeft:"10%"}}>
                                <form className="form" onSubmit={this.handleSubmit}> {/* [formGroup]="loginForm" (ngSubmit)="login()" */}
                                    <div className="form-group">
                                        <label htmlFor="uContactNo" style={{marginRight:"50%"}}><b>Contact Number</b><span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            value={this.state.loginform.contactNo}
                                            onChange={this.handleChange}
                                            id="uContactNo"
                                            name="contactNo"
                                            className="form-control"
                                        />
                                    </div>
                                    {this.state.loginformErrorMessage.contactNo ? (<span className="text-danger">
                                        {this.state.loginformErrorMessage.contactNo}
                                    </span>)
                                        : null}

                                    <div className="form-group">
                                        <label htmlFor="uPass" style={{marginRight:"70%"}}><b>Password</b><span className="text-danger">*</span></label>
                                        <input
                                            type="password"
                                            value={this.state.loginform.password}
                                            onChange={this.handleChange}
                                            id="uPass"
                                            name="password"
                                            className="form-control"
                                        />
                                    </div>
                                    {this.state.loginformErrorMessage.password ? (<span className="text-danger">
                                        {this.state.loginformErrorMessage.password}
                                    </span>)
                                        : null}<br />
                                    <span><span className="text-danger">*</span> marked feilds are mandatory</span>
                                    <br />
                                    

                                    <button
                                        type="submit"
                                        disabled={!this.state.loginformValid.buttonActive}
                                        className="btn btn-primary"
                                    >
                                        Login
                                    </button>
                                </form>
                                <br />
                                {/* <!--can be a button or a link based on need --> */}
                                <button className="btn btn-block btn-primary" onClick={this.handleClick} >Click to Register</button>
                        </div>
                        </div>
                    </div>
                </section>
                {/* <div * ngIf= "!registerPage" >
            <router-outlet></router-outlet>
            </div > */}
                {/* *ngIf="!registerPage" */}
                {/* </div > */}
            </div>

        )
    }
}

export default Login;
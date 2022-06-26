import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';
import { ProgressSpinner } from 'primereact/progressspinner';
class Register extends Component{
    constructor(){
        super()
        this.state={
             registerform:{
                name:'',
                emailId:'',
                contactNo:'',
                password:''
             },
             registerformValidate:{
                name:false,
                emailId:false,
                contactNo:false,
                password:false,
                Confirmpassword:false,
                buttonActive:false
             },
             registerformErr:{
                nameErr:'',
                emailIdErr:'',
                contactNoEr:'',
                passwordErr:'',
                confirmpasswordErr:'',
             },
             registersuccess:{
                 status:false,
                 successMessage:''
             },
             loadLogin:false,
             spinner:false
        }
    }
  
    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        const { registerform } = this.state;
        this.setState({
            registerform: { ...registerform, [name]: value }
        },()=>{
           // console.log(this.state.registerform);
        });
        this.validateField(name, value);
       
    } 
    validateField = (fieldName, value) => { 
        const {registerformErr} = this.state;
       const {registerformValidate} = this.state;
        switch (fieldName) {
            case "contactNo":
                let cnoRegex = /^[1-9]{1}[0-9]{9}$/
                if (!value || value === "") {
                    registerformErr.contactNoEr = "Please enter your contact Number";
                    registerformValidate.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    registerformErr.contactNoEr = "Contact number should be a valid 10 digit number";
                    registerformValidate.contactNo = false;
                } else {
                    registerformErr.contactNoEr = "";
                    registerformValidate.contactNo = true;
                }
                break;
            case "password":
                const strongRegex = new RegExp("^(?=.*[A-z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{7,20})");
                const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                if (!value || value === "") {
                    registerformErr.passwordErr = "Password is manadatory";
                    registerformValidate.password = false;
                    } else if (value.match(strongRegex)) {
                        registerformErr.passwordErr="Strong Password"
                        registerformValidate.password = true;
                }else if (value.match(mediumRegex)) {
                    registerformErr.passwordErr="Medium Password"
                    registerformValidate.password = false;
                }else {
                    registerformErr.passwordErr = "weak Password";
                    registerformValidate.password = false;
                }
                break;
                case 'name':
                   const nameregex = new RegExp("^([a-zA-Z ]{3})(([a-zA-Z ])?[a-zA-Z]*)*$")
                    if(value==='' || !value){
                        registerformErr.nameErr="Name is manadatory";
                        registerformValidate.name=false;
                    }else if(value.match(nameregex)){
                        registerformErr.nameErr="";
                        registerformValidate.name=true;
                    }else{
                        registerformErr.nameErr="Invalid Name Type";
                        registerformValidate.name=false;
                    }
                    break;
                case 'emailId':
                    const emailRegex = new RegExp("^([a-zA-Z0-9]+)@([a-zA-Z0-9]+)\.([a-zA-Z]{2,5})$");
                    if(value==='' || !value){
                        registerformErr.emailIdErr="Name is manadatory";
                        registerformValidate.emailId=false;
                    }else if(value.match(emailRegex)){
                        registerformErr.emailIdErr="";
                        registerformValidate.emailId=true;
                    }else{
                        registerformErr.emailIdErr="Invalid Email type";
                        registerformValidate.emailId=false;
                    }
                    break;
                    case "Confirmpassword":
                        if(!value || value===""){
                            registerformErr.confirmpasswordErr="Confirm password";
                            registerformValidate.Confirmpassword= false;
                        }else if(value === this.state.registerform.password){
                            registerformErr.confirmpasswordErr="";
                            registerformValidate.Confirmpassword= true;
                        }else{
                            registerformErr.confirmpasswordErr="Password doesnot match";
                            registerformValidate.Confirmpassword= false;
                        }
                        break;
            default:
                break;
        }
        registerformValidate.buttonActive = registerformValidate.contactNo && registerformValidate.password 
        && registerformValidate.name && registerformValidate.emailId && registerformValidate.Confirmpassword;
        this.setState({
            registerformValidate,
            registerformErr,
            successMessage: ""
        },()=>{
            // console.log(this.state.registerformValidate);
            // console.log("-----------------------------");
            // console.log(this.state.registerformErr);
            // console.log("______________________________");     
        });
    }
    handleSubmit = (event) =>{
        event.preventDefault();
        this.setState({spinner:true})
        setTimeout(()=>{
            this.Register()
        }, 500);
    }
    Register = () => {
        const {registerform} = this.state;
        let {loadLogin} = this.state;
        const {registersuccess} = this.state;
        axios.post(backendUrlUser+'/register',registerform).then((registerData)=>{
            this.setState({spinner:false})
            loadLogin = true;
            registersuccess.successMessage=registerData.data.message;
            registersuccess.status=true;
            this.setState({loadLogin,registersuccess},()=>{console.log(this.state.loadLogin);});
        }).catch((err)=>{
            this.setState({spinner:false})
            if(err.response){
                registersuccess.successMessage=err.response.data.message;
            }else{
                registersuccess.successMessage=err.message; 
            }
             
        })
        this.setState({loadLogin,registersuccess},()=>{console.log(this.state.loadLogin);});
    }
    render(){
        if(this.state.spinner) return(<div>
            <div id="details" className="details-section">
               <div className="text-center">
                   <ProgressSpinner></ProgressSpinner>
               </div>
        </div>
        </div>)
        return(
            <div className="register"style={{height:"900px", marginTop:"-100px"}}>
                <div className="container h-100 d-flex justify-content-center">
                    
                {this.state.registersuccess.status? (
                    <div className="card col-md-8 col-lg-8  jumbotron my-auto" style={{height:"250px",paddingTop:"7px"}}>
                        <div className="card-body">
                            <div className="caed-title">
                                <h3>Thank You for Register</h3>
                            </div>
                            <div className="card-body" style={{paddingTop:"8%"}}>
                                <h5 className="text-success">{this.state.registersuccess.successMessage}</h5>
                                <h6> To login <Link to="/login">Click</Link> Here </h6>
                            </div>
                        </div>
                    </div>
                ):
                  <div className="card col-md-6 col-lg-5 offset-md-4 jumbotron my-auto" style={{height:"680px", width:"400px",paddingTop:"7px"}}>
                  <div className="card-body">

                     <div className="card-title display-4"><b>Join Us</b></div>
                        <form onSubmit={this.handleSubmit}style={{height:"400px"}}>
                            <div className="form-group">
                                <label htmlFor="Name" style={{marginRight:"80%"}}>Name<span className="text-danger">*</span></label>
                                <input type="txt" className="form-control" name="name" id="Name" placeholder="Enter your Name" onKeyUp={this.handleChange}/> 
                                <small id="nameErr" className="form-text text-danger">{this.state.registerformErr.nameErr}</small>
                            </div>
                            <div className="form-group">
                                 <label htmlFor="email" style={{marginRight:"65%"}}>Email address<span className="text-danger">*</span></label>
                                <input type="email" className="form-control" name="emailId" id="email" aria-describedby="emailHelp" placeholder="Enter email" onKeyUp={this.handleChange}/>
                                <small id="emailErr" className="form-text text-danger">{this.state.registerformErr.emailIdErr}</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="contactNo" style={{marginRight:"69%"}}>Contact No<span className="text-danger">*</span></label>
                                <input type="number" className="form-control" name="contactNo" id="contactNo"  placeholder="Enter phone no" onKeyUp={this.handleChange}/>
                                <small id="contactErr" className="form-text text-danger">{this.state.registerformErr.contactNoEr}</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" style={{marginRight:"73%"}}>Password<span className="text-danger">*</span></label>
                                <input type="password" className="form-control" name="password" id="password" placeholder="Password" onKeyUp={this.handleChange}/>
                                    {this.state.registerformErr.passwordErr==="Strong Password" && 
                                    <small id="passwordErr" className="form-text text-success">{this.state.registerformErr.passwordErr}</small>}

                                    {this.state.registerformErr.passwordErr==="Medium Password" &&
                                    <small id="passwordErr" className="form-text text-warning">{this.state.registerformErr.passwordErr}</small>}
                           
                                    {this.state.registerformErr.passwordErr===("weak Password" || "Password is manadatory") && 
                                    <small id="passwordErr" className="form-text text-danger">{this.state.registerformErr.passwordErr}</small>}
                                {this.state.registerformErr.passwordErr===("")&& 
                                 <small id="passwordErr" className="form-text text-primary">Password should be strong password *</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="Confirmpassword" style={{marginRight:"58%"}}>confirm Password</label>
                                <input type="password" className="form-control" name="Confirmpassword" id="Confirmpassword" placeholder="confirm Password" onKeyUp={this.handleChange}/>
                                <small id="conpasErr" className="form-text text-danger">{this.state.registerformErr.confirmpasswordErr}</small>
                            </div>
                                {this.state.registerformValidate.buttonActive ? <button type="submit" className="btn btn-primary">Sign Up</button>
                                :<button type="submit" disabled={!this.state.registerformValidate.buttonActive} className="btn btn-danger">Sign Up</button>}
                                <br></br>
                                <br></br>
                            <small id="registerErr" className="form-text text-danger">{this.state.registersuccess.successMessage ?this.state.registersuccess.successMessage:"Enter The  * mandatory fields"}</small>
                        </form>
                                        
                       </div>
                       </div>
                      }
                      
        </div>
        </div>
        )
    }
}

export default Register;
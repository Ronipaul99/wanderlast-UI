import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { backendUrlPackage, backendUrlBooking } from '../BackendURL';
import { ProgressSpinner } from 'primereact/progressspinner';
class Book extends Component{
    constructor(){
        super()
        this.state={
            bookingform:{
                name:'',
                noOfPersons:0,
                checkInDate:'',
                checkOutDate:'',
                totalamount:'',
                destId:'',
                userId:''
            },
            bookingdata:{
                noOfPersons:0,
                checkInDate:'',
                checkOutDate:'',
            },
            bookingstatus:false,
            bookingErr : "",
            calcelstatus:false,
             spinner:false
        }
    }
    getbookingDetails = () => {
           let {bookingform , bookingdata} = this.state;
           bookingform.noOfPersons = sessionStorage.getItem('noOfPersons');
           bookingform.checkInDate = sessionStorage.getItem('checkInDate');
           bookingform.checkOutDate = sessionStorage.getItem('checkOutDate');
           bookingform.name= sessionStorage.getItem('name');
           bookingform.totalamount = sessionStorage.getItem('totalcharges');
           bookingform.destId = sessionStorage.getItem('dealId');
           bookingform.userId = sessionStorage.getItem('userId');

           bookingdata.noOfPersons=sessionStorage.getItem('noOfPersons');
           bookingdata.checkInDate = sessionStorage.getItem('checkInDate');
           bookingdata.checkOutDate = sessionStorage.getItem('checkOutDate');
           this.setState({bookingform , bookingdata})
           sessionStorage.setItem("userId",bookingform.userId)
        
    }
   
    componentWillMount(){
        this.getbookingDetails();
        this.load()
    }
    load = () =>{
        this.setState({spinner:true})
       setTimeout(()=>{
              this.setState({spinner:false})
       }, 1000);
    }
    book = () =>{
        this.setState({spinner:true})
        const destId=this.state.bookingform.destId;
        const userId = this.state.bookingform.userId;
        setTimeout(()=>{
            axios.post(backendUrlBooking+"/"+userId+"/"+destId, this.state.bookingdata).then((bookingdata)=>{
                if(bookingdata){
                    this.setState({bookingstatus:true , spinner:false});
                }
            }).catch((err)=>{
                this.setState({spinner:false})
                if(err){
                    this.setState({bookingErr:err.response.data.message})
                }
            })
     }, 3000);
        
    }
    calcel = () =>{
       this.setState({calcelstatus: true})
    }
    render(){
        if(this.state.spinner) return(<div>
            <div id="details" className="details-section">
               <div className="text-center">
                   <ProgressSpinner></ProgressSpinner>
               </div>
        </div>
        </div>)
        const {bookingform} = this.state;
        if(this.state.calcelstatus) return(<Redirect to="/"></Redirect>)
        return(
            <div>
               {!this.state.bookingstatus ?(<div>
                {bookingform.userId === null? (
                <div style={{height:"350px"}}>
                    <div className="card col-md-5 bookLogin" >
                        <div className="card-body">
                           <h3>To continue please Login .....</h3> <br/>
                           <h6><Link to="/login">click</Link> Here</h6>
                        </div>
                    </div>
                </div>
                ):(
                    <div className="">
                        <div className="card col-md-8 offset-md-2">
                            <div className="card-title">
                            </div>
                            <div className="card-body">
                            <table className="table">
                                  <thead className="thead-light">
                                      <tr>
                                         <th scope="col" colSpan="3">Confirm Booking</th>
                                     </tr>
                                  </thead>
                                   <tbody>
                                        <tr>
                                           <td><b>Package Name</b></td>
                                           <td><b>{bookingform.name}</b></td>
                                      </tr>
                                    <tr>
                                         <td><b>check-in Date</b></td>
                                         <td><b>{bookingform.checkInDate}</b></td>
                                     </tr>
                                     <tr>
                                         <td><b>check-out Date</b></td>
                                         <td><b>{bookingform.checkOutDate}</b></td>
                                     </tr>
                                     <tr>
                                         <td><b>No of Bookings</b></td>
                                         <td><b>{bookingform.noOfPersons}</b></td>
                                     </tr>
                                     <tr>
                                         <td><b>Total Ammount</b></td>
                                         <td><b>Rs: {bookingform.totalamount}</b></td>
                                     </tr>
                                    
                                </tbody>
                          </table>
                              <div className="row">
                                  <div className="col-md-2 offset-md-4"><button className="btn btn-primary" onClick={this.book}>checkout</button></div>
                                  <div className="col-md-2"><button className="btn btn-danger" onClick={this.calcel}>cancel</button></div>
                               </div>
                         </div>
                        </div>
                    </div>
                )}
                </div>):(<div style={{height:"450px"}}>
                    <div className="card col-md-8 bookingsuccess" >
                         <div className="card-title">
                             <h3 ><b>Booking Confirmed!!</b></h3>
                        </div>
                        <div className="card-body">
                            <h4 className="text-success">Congratulations! Trip Planned to{bookingform.name}</h4><br/>
                             <h6>Trip starts on: {bookingform.checkInDate}</h6>
                             <h6>Trip ends on: {bookingform.checkOutDate}</h6><br/>
                              <h6> <Link to="/viewBookings">To view your bookings click  here</Link></h6>
                        </div>
                    </div>
                </div>)}
            </div>
        )
    }
}


export default Book;
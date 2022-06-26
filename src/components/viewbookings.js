import React, { Component } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { backendUrlBooking } from '../BackendURL';
import { Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';

class VierwBookings extends Component{
     constructor(){
         super()
         this.state={
             bookings :[],
             userId:'',
             errormessage:'',
             ststus:'',
             cancelerr:'',
             dialogvisible:false,
             bookingId:'',
             spinner:false
         }
     }
     setuser = ()=>{
         const userId = sessionStorage.getItem('userId');
         this.setState({userId:userId});
     }
     getbookings = () =>{
        const userId = sessionStorage.getItem('userId');
        this.setState({userId:userId})
        console.log("hiii"+userId);
        axios.get(backendUrlBooking+"/getDetails/"+userId).then(response => {
                this.setState({ bookings : response.data, errormessage: null })
                console.log(this.state.bookings);
                
            }).catch(error => {
                this.setState({ errormessage: error.message , bookings:null })
            })
     }
     componentDidMount(){
       this.getbookings() 
       this.loadviewbooking()
      
     }
     onHide = (event) => {
        this.setState({ dialogvisible: false });
      }
    
     confirmcalcel = (bookingId) =>{
         this.setState({bookingId:bookingId})
         this.setState({dialogvisible:true})
     }
     cancelbooking = (bookingId) =>{
            axios.delete(backendUrlBooking+"/cancelBooking/"+bookingId).then((response)=>{
                console.log(response.data.message);
                this.setState({dialogvisible:false})
                window.location.reload();
            }).catch((err)=>{
                this.setState({dialogvisible:false})
                this.setState({cancelerr:err.message})
            })
     }
     displaybookings = () =>{
         let bookings=[];
         console.log(this.state.bookings);
            
         this.state.bookings.forEach((booking,index)=>{
        let element=(
              <div className="card col-md-8 offset-md-2" key={index}>
                   <div className="card-header text-left">
                         booking Id : {booking.bookingId}
                    </div>   
                   <div className="card-body row align-items-center no-gutters mb-4 mb-lg-5">    
                         <div className="row col-md-12">
                             <div className="col-md-6">
                                  <h5><b>{booking.destinationName}</b></h5>
                                     <h6>Trip starts on {booking.checkInDate}</h6>
                                     <h6> Trip ends on  {booking.checkOutDate}</h6>
                                     <h6 className="text-center">Travellers {booking.noOfPersons}</h6>
                             </div>
                             <div className="col offset-md-3">
                                 <h6>Fare Details {booking.totalCharges}</h6>
                                 calcel booking
                                 <br/>
                               <Link to="/viewBookings" onClick={()=>{this.confirmcalcel(booking.bookingId)}}>claim refund</Link>
                           </div>
                         </div>
                     </div>
               </div>
        )
        bookings.push(element)

       })
       return bookings;
     }

     loadviewbooking = () =>{
         this.setState({spinner:true})
        setTimeout(()=>{
               this.setState({spinner:false})
        }, 1000);
     }
  render(){
    const footer = (
        <div>
          <Button label="Yes" icon="pi pi-check" onClick={()=>{this.cancelbooking(this.state.bookingId)}} />
          <Button label="No" icon="pi pi-times" onClick={this.onHide} className="p-button-secondary" />
        </div>
      );
      if(this.state.spinner) return(<div>
        <div id="details" className="details-section">
           <div className="text-center">
               <ProgressSpinner></ProgressSpinner>
           </div>
       </div>
    </div>)
      return(
          <div style={{minimumheight:"500px"}}>
              {this.state.userId?(
                 <div>
                    {this.state.bookings.length>0? (
                    <div style={{paddingTop:"50px"}}>   
                     {this.displaybookings()}
                     <div className="content-section implementation">
                         <Dialog
                              header="Confirmation"
                             visible={this.state.dialogvisible}
                             style={{ width: '50vw' }}
                             footer={footer}
                             onHide={this.onHide}
                             maximizable>
                             Are you sure you want to cancle?
                         </Dialog>
                      </div>
                      </div>) :
                       (<div>
                           <div style={{height:"400px"}}>
                               <div className="card col-md-8 offset-md-2" style={{height:"150px", marginTop:"100px", padding:"10px"}}>
                                   <div className="card-title">
                                       <h3 className="text-danger"><b>Oops.. !!  No bookings Available  !!</b></h3>
                                  </div>
                               <div className="card-body">
                               <h5>To continue Booking</h5>
                               <h6><Link to="/packages">Click here </Link></h6>
                        </div>
                   </div>
                </div>
                      </div>)}
                </div>
              ):(
                <div style={{height:"400px"}}>
                    <div className="card col-md-8 offset-md-2" style={{height:"150px", marginTop:"100px", padding:"10px"}}>
                        <div className="card-title">
                            <h3><b>To view bookings please login</b></h3>
                        </div>
                        <div className="card-body">
                            <h5>To login <Link to="/login">click</Link> here</h5>
                        </div>
                   </div>
                </div>
              )}
          </div>
      )
  }

}


export default VierwBookings;
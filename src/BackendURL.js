
const port = 4000;
export const backendUrlUser = `https://wanderlast.herokuapp.com/user`; // /register - POST, /login - POST, /getBookings/:userId - GET
export const backendUrlPackage = `https://wanderlast.herokuapp.com/package`; // /hotDeals -> GET, /destinations -> GET, 
export const backendUrlBooking = `https://wanderlast.herokuapp.com/book`; // /:userId/:destinationId -> POST, /cancelBooking/:bookingId -> DELETE, /getDetails/:destinationId - GET, 


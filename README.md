# node-backend-REST

This is a quick demo of a backend(server-side) application with Node.js.
Requests are sent to the server using REST api. 
Every time a login is made, a new JWT(Json web token) is generated. To authenticate the user,
every time a request is triggered, a sync request having an authorization header with the JWT inside is done. From the server, 
a status code is received, if this is a 401, redirection to login page is needed, since the JWT has been malformed or it has expired. 
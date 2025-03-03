import app from './app';

//import server tyoe definition
import { Server } from 'http';

//initialize the server
const PORT: string | 3000 = process.env.PORT || 3000;

//initialize the server fort he aoolication to listen for requests on specified port number ie 3000 by defuaol
const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//export the server for testing
export default server;
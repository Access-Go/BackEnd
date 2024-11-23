

require('dotenv').config();



const server = require('./src/server');


const db = require('./src/lib/connection');


const PORT = process.env.PORT || 8080;



db.connect()
    .then(() => {
        console.log('DB Connected');
        server.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('DB Connection Failed: ', error);
    });
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

//Create el servidor/aplicacion de express
const app = express();

//Conexion de base de datos
dbConnection();

//Directorio Público
app.use( express.static('public'));

//Cors
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() )

//Rutas
app.use( '/api/auth', require('./routes/auth') );

//Manejar demas rutas
app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
} )

app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en puerto ${ process.env.PORT }` )
} );
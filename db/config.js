const Mongoose = require("mongoose");

const dbConnection = async() => {


    try {

        await Mongoose.connect( process.env.BD_CNN, {
            
        });

        console.log('base de datos online')

    } catch (error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}
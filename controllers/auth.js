const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response ) => {

    const { email, name, password } = req.body;

    try {
        //Verificar si hay un email igual
        const usuario = await Usuario.findOne({ email });

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        //Crear usuario con el modelo
        const dbUSer = new Usuario( req.body ); 

        //Hash de la contraseña
        const salt = bcrypt.genSaltSync();
        dbUSer.password = bcrypt.hashSync( password, salt )

        //Generar el JWT
        const token = await generarJWT( dbUSer.id, name );


        //Crear usuario de DB
        await dbUSer.save();

        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUSer.id,
            email: dbUSer.email,
            name,
            token
        });

    } catch(error) {
            return res.status(500).json({
                ok: true,
                msg: 'Por favor hable con el administrador'
            });
        }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        //Confirmar si el correo existe

        const dbUser = await Usuario.findOne({ email });

        if( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        //Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        //Generar el json web token

        const token = await generarJWT( dbUser.id, dbUser.name, dbUser.email );

        //Respuesta del servicio
        return res.json({
                    ok: true,
                    uid: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    token
                });

    } catch( error ) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renew = async(req, res) => {

    const { uid } = req;

    //Leer la base de datos para traer el email
    const dbUser = await Usuario.findById(uid);

    //Generar el JWT
    const token = await generarJWT( uid, dbUser.name, dbUser.email);

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renew
}
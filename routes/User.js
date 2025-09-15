const express = require('express');
const router = express.Router();

// Importing the User model to our server
const User = require('./../models/User')

// Encryption of the user's password
const bcrypt = require('bcrypt');



// Endpoint for Sign Up - (Registrarse)

router.post('/signup', (req,res)=> {
    let {name, email, password, createdAt} = req.body;
    name = name.trim(); //Removing possible whitespaces we may found
    email = email.trim();
    password = password.trim();
    createdAt = createdAt.trim();


    if(password.length < 8){
        res.json({
            status: "Denegado",
            message: "Tamaño de contrasena debe ser mayor o igual a 8 caracteres"
        })
    } else{
        //Cheking out whether the user has registered previously or not
        //For this, we use the ORM that provide us Mongoose, with its predefined repository operations
        User.find({email}).then(result => {
            // If the user exists, return an error
            if (result.length) {
                res.json({
                    status: "Denegado",
                    message: "La dirección email ya se encuentra en uso"
                })
            } else {
                //We proceed to create the user in the DB, encrypting their password using bcrypt module
                 const saltRounds = 10;
                 bcrypt.hash(password, saltRounds).then(hashedPassword => {
                
                    const newUser = new User({
                        name,
                        email,
                        password : hashedPassword,
                        createdAt
                    })

                    newUser.save().then(result => {
                        res.json({
                            status : "Exitoso",
                            message : "Registro existoso",
                            data : result,
                        })
                    }).catch(err => {
                        res.json({
                            status : "Denegado",
                            message : "Error ocurrió almacenando el usuario"
                     })
                    })
                    
                }).catch(err =>{
                    console.log(err);
                    res.json({
                        status : "Denegado",
                        message : "Error ocurrió encriptando la contrasena"

                    })
                 })
            }

        }).catch(err => {
            console.log(err);
            res.json({
                status:"Denegado",
                message:"Ocurrió un error verificando si existía una cuenta preexistente"
            })
        })
    }
});


// End point for Sign In - (Ingresar)

router.post('/signin', (req,res)=>{
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password == ""){
        res.json({
            status : "Denegado",
            message : "Credenciales vacias"
        })
    } else{
        //Check if the user provided exists in the DB
        User.find({email}).then(data =>{
            if (data) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result=>{
                    if (result) {
                        res.json({
                            status : "Petición exitosa",
                            message : "LogIn exitoso",
                            data : data
                        })
                    } else{
                        res.json({
                            status : "Denegado",
                            message : "Contraseña inválida"
                        })
                    }
                }).catch(err => {
                    res.json({
                        status : "Denegado",
                        message : "Error ocurrido durante la validación de contraseña"
                    })
                })
            } else{
                res.json({
                    status: "Denegado",
                    message : "Credenciales inválidas"
                })
            }
        }).catch(err => {
            res.json({
                status: "Denegado",
                message: "Error buscando usuario en la base de datos"
            })
        })
    }
});

module.exports = router;
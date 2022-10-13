//importar paquetes
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')
const router = express.Router();
const UserSchema = require('./models/User.js') //importar modelo de BD
const fs = require("fs"), //importar libreria para leer archivo
    NOMBRE_ARCHIVO = "conexion_string.txt";

    //leer cadena de conexion desde archivo
fs.readFile(NOMBRE_ARCHIVO, 'utf8', (error, datos) => {
    if (error) throw error;
    console.log(datos);
    //conexion con BD
    mongoose.connect(datos)
});


//codificación de la información para los servicios web
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//crear servicio web

router.get('/', (req, res) => {
    res.send("Test");
});
router.get('/saludar/:nombre', (req, res) => {
    var nombre = req.params.nombre;
    res.send("Hello "+nombre);
});

router.get('/validar_edad/:edad', (req, res) => {
    var edad = req.params.edad;
    var respuesta = "";
    if(edad>= 18){
        respuesta = "Mayor de edad";
    }else{
        respuesta = "Menor de edad"
    }
    res.send(respuesta);
});

router.post('/saludar2/:nombre', (req, res) => {
    var nombre = req.params.nombre;
    res.send("Hello "+nombre +" postman");
});


//servicio para traer la informacion de la BD

router.get('/user', (req, res) => {
    UserSchema.find(function(err, data){
        if(err){
            console.log(err)
        }else{
            res.send(data)
        }
    })
});


//servicio para guardar informacion

router.post('/user', (req, res) => {
    let newUser = new UserSchema({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        telefono: req.body.telefono,
        password: req.body.password,
    })
    newUser.save(function(err, data){
        if(err){
            console.log(err)
        }else{
        res.send("saved successfully " + newUser)
        }
    });
})


//configurar ejecucion de seridor

app.use(router)
app.listen(port,() => {
    console.log('Listening on '+port)
})

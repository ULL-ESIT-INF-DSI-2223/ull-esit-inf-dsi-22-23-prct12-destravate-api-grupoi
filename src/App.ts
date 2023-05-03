import express from 'express';
//import {Gestor} from './Gestor.js';
import bodyParser from 'body-parser';
import { ResponseType } from './Types.js';
import {Actividad} from './Actividad.js';
import {IRutaData, Ruta, Geolocalizacion} from './Ruta.js';
import {IGrupoData} from './Grupo.js';
import {IRetoData} from './Reto.js';
import {IUsuarioData} from './Usuario.js';

import Ajv from 'ajv';
const ajv = new Ajv();

/**
 * Schema to validate json files
 */
const schema_track = {
    type: 'object',
    properties: {
        id: { id: 'string' },
        nombre: { nombre: 'string' },
        inicio: { inicio: 'Geolocalizacion' },
        final: { final: 'Geolocalizacion' },
        longitud: { longitud: 'number' },
        desnivel: { desnivel: 'number' },
        usuarios: { usuarios: 'string[]' },
        actividad: { actividad: 'Actividad' },
        calificacion: { calificacion: 'number' },
    },
    required: ['id','nombre','inicio','final','longitud','desnivel','usuarios','actividad','calificacion'],
};
const validate = ajv.compile(schema_track);

export const app = express();

/**
 * This allows to analize json format bodies
 */
app.use(bodyParser.json());

/**********************RUTAS********************************/
app.get('/tracks', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.showTrack(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.showTrack(id, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });

    }else{
        const outputError: ResponseType<string> = {
            type: 'read',
            success: false,
            output: undefined,
            error: 'Un nombre o un id deben ser introducidos'
        }
        res.status(400).send({
            error: outputError
        })
    }
})

app.post('/tracks', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos de la ruta'
        }
        res.status(400).send({
            error: error
        })
    } else {
        const gestor = new Gestor();
        const trackData: IRutaData = req.body;
        const isValid = validate(req.body);
        const geo: Geolocalizacion = {
            latitud: 0,
            longitud: 0
        };
        if (isValid) {
            const newTrack = new Ruta("",geo, geo, 0, 0, [], Actividad.Correr,0);
            gestor.addTrack(newTrack, (err, result) => {
                if(err){
                    res.status(500).json({error: err});
                } else {
                    res.send({response: result});
                }
            });
        } else {
            const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
                type: 'add',
                success: false,
                output: undefined,
                error: validate.errors
            };
            res.status(400).json({error: error});
        }
    }
});

/**
 * Elimina un track
 */
app.delete('/tracks', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.deleteTrack(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.deleteTrack(id, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });

    }else{
        const outputError: ResponseType<string> = {
            type: 'remove',
            success: false,
            output: undefined,
            error: 'Un nombre o un id deben ser introducidos'
        }
        res.status(400).send({
            error: outputError
        })
    }  
});

/**
 * Modifica una ruta
 */
app.patch('/tracks', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos de la ruta a modificar'
        }
        res.status(400).send({
            error: error
        })
    }else {
        const isValid = validate(req.body);
        if (isValid){
            const gestor = new Gestor();
            const geo: Geolocalizacion = {
                latitud: 0,
                longitud: 0
            };
            if(req.query.nombre){
            //Por Nombre
            const nombre = req.query.nombre;
            const newTrack = new Ruta("",geo, geo, 0, 0, [], Actividad.Correr,0);
            gestor.modifyTrack(nombre, newTrack, (err, result) => {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    res.send({response: result});
                }
            })
            
            }else if(req.query.id){
            //Por Id
            const id = req.query.id;
            const newTrack = new Ruta("",geo, geo, 0, 0, [], Actividad.Correr,0);
            gestor.modifyTrack(id, newTrack, (err, result) => {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    res.send({response: result});
                }
            })
            }
        } else{
            const error: ResponseType<Ajv.ErrorObject[] | null | undefined> = {
                type: 'update',
                success: false,
                output: undefined,
                error: validate.errors
            };
            res.status(400).json({error: error});
        } 
    }
});

/**
 * Default route that returns 404 Not Found
 */
app.get('*', (req, res) => {
    res.status(404).json({error: 'Route not found'});
});

/**
 * Server listening port 3000
 */
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
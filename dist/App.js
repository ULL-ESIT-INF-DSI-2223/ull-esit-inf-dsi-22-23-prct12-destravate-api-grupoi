import express from 'express';
import bodyParser from 'body-parser';
import { GestorManager } from './Gestor.js';
import { Actividad } from './Actividad.js';
import { Ruta } from './Ruta.js';
import Ajv from 'ajv';
const ajv = new Ajv();
export const app = express();
/**
 * Schema to validate json files
 */
const schemaTrack = {
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
    required: ['id', 'nombre', 'inicio', 'final', 'longitud', 'desnivel', 'usuarios', 'actividad', 'calificacion'],
};
const validateTrack = ajv.compile(schemaTrack);
/**
 * This allows to analize json format bodies
 */
app.use(bodyParser.json());
/**********************RUTAS********************************/
/**
 * Lista un track
 */
app.get('/tracks', async (req, res) => {
    const gestor = new GestorManager();
    if (req.query.nombre === "*" || req.query.id === "*") {
        try {
            const result = await gestor.showTrack("", "*");
            res.send({ response: result });
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            const nombre = req.query.nombre.toString();
            try {
                const result = await gestor.showTrack(nombre, "nombre");
                res.send({ response: result });
            }
            catch (err) {
                res.status(500).send({ error: err });
            }
        }
        else if (req.query.id) {
            //Por Id
            const id = req.query.id.toString();
            try {
                const result = await gestor.showTrack(id, "id");
                res.send({ response: result });
            }
            catch (err) {
                res.status(500).send({ error: err });
            }
        }
        else {
            const outputError = {
                type: 'read',
                success: false,
                output: undefined,
                error: 'Un nombre o un id deben ser introducidos'
            };
            res.status(400).send({ error: outputError });
        }
    }
});
/**
 * Añade un track
 */
app.post('/tracks', async (req, res) => {
    if (!req.body) {
        const error = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos de la ruta'
        };
        res.status(400).send({ error: error });
    }
    else {
        const gestor = new GestorManager();
        const trackData = req.body;
        const isValid = validateTrack(req.body);
        const geo = {
            latitud: 0,
            longitud: 0
        };
        if (isValid) {
            const newTrack = new Ruta("", geo, geo, 0, 0, [], Actividad.Correr, 0, true).parse(trackData);
            try {
                const result = await gestor.addTrack(newTrack);
                res.send({ response: result });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
        }
        else {
            const error = {
                type: 'add',
                success: false,
                output: undefined,
                error: validateTrack.errors
            };
            res.status(400).send({ error: error });
        }
    }
});
/**
 * Elimina un track
 */
app.delete('/tracks', async (req, res) => {
    const gestor = new GestorManager();
    if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        try {
            const result = await gestor.deleteTrack(nombre, "nombre");
            res.send({ response: result });
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }
    else if (req.query.id) {
        //Por Id
        const id = req.query.id.toString();
        try {
            const result = await gestor.deleteTrack(id, "id");
            res.send({ response: result });
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }
    else {
        const outputError = {
            type: 'remove',
            success: false,
            output: undefined,
            error: 'Un nombre o un id deben ser introducidos'
        };
        res.status(400).send({ error: outputError });
    }
});
/**
 * Modifica una ruta
 */
app.patch('/tracks', async (req, res) => {
    if (!req.body) {
        const error = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos de la ruta a modificar'
        };
        res.status(400).send({ error: error });
    }
    else {
        const isValid = validateTrack(req.body);
        const rutaData = req.body;
        if (isValid) {
            const gestor = new GestorManager();
            const geo = {
                latitud: 0,
                longitud: 0
            };
            if (req.query.nombre) {
                //Por Nombre
                const nombre = req.query.nombre.toString();
                const newTrack = new Ruta("", geo, geo, 0, 0, [], Actividad.Correr, 0).parse(rutaData);
                try {
                    const result = await gestor.updateTrack(nombre, newTrack, "nombre");
                    res.send({ response: result });
                }
                catch (err) {
                    res.status(500).send({ error: err });
                }
            }
            else if (req.query.id) {
                //Por Id
                const id = req.query.id.toString();
                const newTrack = new Ruta("", geo, geo, 0, 0, [], Actividad.Correr, 0).parse(rutaData);
                try {
                    const result = await gestor.updateTrack(id, newTrack, "id");
                    res.send({ response: result });
                }
                catch (err) {
                    res.status(500).send({ error: err });
                }
            }
            else {
                const error = {
                    type: 'update',
                    success: false,
                    output: undefined,
                    error: 'Debe introducir la id o el nombre de la ruta a modificar'
                };
                res.status(400).send({ error: error });
            }
        }
        else {
            const error = {
                type: 'update',
                success: false,
                output: undefined,
                error: validateTrack.errors
            };
            res.status(400).json({ error: error });
        }
    }
});
/**
 * Default route that returns 404 Not Found
 */
app.get('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
/**
 * Server listening port 3000
 */
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});

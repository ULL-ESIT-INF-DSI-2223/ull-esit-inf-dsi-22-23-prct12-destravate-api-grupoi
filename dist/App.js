import express from 'express';
import bodyParser from 'body-parser';
import { GestorManager } from './Gestor.js';
import { Usuario } from './Usuario.js';
import { RutaModel } from './RutaModel.js';
import { connect } from 'mongoose';
import Ajv from 'ajv';
export const app = express();
const ajv = new Ajv();
/**
 * Esto permite analizar el body en formato json
 */
app.use(bodyParser.json());
/**
 * Para conectarse a la base de datos
 */
connect('mongodb://127.0.0.1:27017/actividadesDeportivas').then(() => {
    console.log('Connected to the database');
}).catch(() => {
    console.log('Something went wrong when conecting to the database');
});
/**********************RUTAS********************************/
/**
 * Esquema para validar JSON's de rutas
 */
const schemaTrack = {
    type: 'object',
    properties: {
        //id: { id: 'string' },
        nombre: { nombre: 'string' },
        inicio: { inicio: 'Geolocalizacion' },
        final: { final: 'Geolocalizacion' },
        longitud: { longitud: 'number' },
        desnivel: { desnivel: 'number' },
        usuarios: { usuarios: 'string[]' },
        actividad: { actividad: 'Actividad' },
        calificacion: { calificacion: 'number' },
    },
    required: [/*'id',*/ 'nombre', 'inicio', 'final', 'longitud', 'desnivel', 'usuarios', 'actividad', 'calificacion'],
};
const validateTrack = ajv.compile(schemaTrack);
/**
 * Lista un track
 */
app.get('/tracks', async (req, res) => {
    const gestor = new GestorManager();
    if (req.query.nombre == undefined && req.query.id == undefined) {
        RutaModel.find()
            .then((result) => {
            res.status(200).send(result);
        })
            .catch((err) => {
            const error = {
                type: 'read',
                success: false,
                output: undefined,
                error: err
            };
            res.status(400).send({ error: error });
        });
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            const nombre = req.query.nombre.toString();
            RutaModel.findOne({ nombre: nombre }).then((result) => {
                if (result != null) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El nombre no coincide cn ninguna ruta"
                    };
                    res.status(400).send({ error: error });
                }
            })
                .catch((err) => {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            });
        }
        else if (req.query.id) {
            //Por Id
            const id = req.query.id.toString();
            RutaModel.findById(id).then((result) => {
                if (result != null) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El id no coincide con ninguna ruta"
                    };
                    res.status(400).send({ error: error });
                }
            })
                .catch((err) => {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            });
        }
    }
});
/*
/**
 * Añade un track
 */
app.post('/tracks', async (req, res) => {
    if (req.body == JSON.stringify({})) {
        const error = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos de la ruta'
        };
        res.status(400).send({ error: error });
    }
    else {
        const trackData = new RutaModel(req.body);
        const isValid = validateTrack(req.body);
        if (isValid) {
            trackData.save().then((RutaGuardada) => {
                res.status(200).send(RutaGuardada);
            }).catch((err) => {
                const error = {
                    type: 'add',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            });
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
    if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        RutaModel.deleteOne({ nombre: nombre }).then((result) => {
            if (result.deletedCount == 1) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ninguna ruta"
                };
                res.status(400).send({ error: error });
            }
        }).catch((err) => {
            const error = {
                type: 'remove',
                success: false,
                output: undefined,
                error: err
            };
            res.status(400).send({ error: error });
        });
    }
    else if (req.query.id) {
        //Por Id
        const id = req.query.id.toString();
        RutaModel.findByIdAndDelete(id).then((result) => {
            if (result != null) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ninguna ruta"
                };
                res.status(400).send({ error: error });
            }
        }).catch((err) => {
            const error = {
                type: 'remove',
                success: false,
                output: undefined,
                error: err
            };
            res.status(400).send({ error: error });
        });
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
    if (JSON.stringify(req.body) == "{}") {
        const error = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos de la ruta a modificar'
        };
        res.status(400).send({ error: error });
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            const nombre = req.query.nombre.toString();
            const aModificar = req.body;
            RutaModel.updateOne({ nombre: nombre }, aModificar).then((result) => {
                if (result.modifiedCount >= 1) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ninguna ruta"
                    };
                    res.status(400).send({ error: error });
                }
            }).catch((err) => {
                const error = {
                    type: 'update',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            });
        }
        else if (req.query.id) {
            //Por Id
            const id = req.query.id.toString();
            const aModificar = req.body;
            RutaModel.findByIdAndUpdate(id, aModificar).then((result) => {
                if (result != null) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ninguna ruta"
                    };
                    res.status(400).send({ error: error });
                }
            }).catch((err) => {
                const error = {
                    type: 'update',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            });
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
});
/**********************USUARIOS********************************/
/**
 * Schema to validate json files
 */
const schema_user = {
    type: 'object',
    properties: {
        id: { id: 'string' },
        nombre: { nombre: 'string' },
        actividad: { actividad: 'Actividad' },
        amigos: { amigos: 'string[]' },
        grupos: { grupos: 'string[]' },
        estadisticas: { estadisticas: 'EstadisticasEntrenamiento' },
        rutas: { rutas: 'string[]' },
        retos: { retos: 'string[]' },
        historicoRutas: { historicoRutas: 'Map<string, string[]>' },
    },
    required: ['id', 'nombre', 'actividad', 'amigos', 'grupos', 'estadisticas', 'rutas', 'retos', 'historicoRutas'],
};
const validateUser = ajv.compile(schema_user);
/**
 * Añade un usuario
 */
app.post('/users', async (req, res) => {
    if (!req.body) {
        const error = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del usuario'
        };
        res.status(400).send({ error: error });
    }
    else {
        const gestor = new GestorManager();
        const userData = req.body;
        const isValid = validateUser(req.body);
        const geo = {
            latitud: 0,
            longitud: 0
        };
        if (isValid) {
            const newUser = new Usuario("").parse(userData);
            try {
                const result = await gestor.addUser(newUser);
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
                error: validateUser.errors
            };
            res.status(400).send({ error: error });
        }
    }
});
/**
 * Elimina un usuario
 */
app.delete('/users', async (req, res) => {
    const gestor = new GestorManager();
    if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        try {
            const result = await gestor.deleteUser(nombre, "nombre");
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
            const result = await gestor.deleteUser(id, "id");
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
 * Modifica un usuario
 */
app.patch('/users', async (req, res) => {
    if (!req.body) {
        const error = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del usuario a modificar'
        };
        res.status(400).send({ error: error });
    }
    else {
        const isValid = validateUser(req.body);
        const userData = req.body;
        if (isValid) {
            const gestor = new GestorManager();
            const geo = {
                latitud: 0,
                longitud: 0
            };
            if (req.query.nombre) {
                //Por Nombre
                const nombre = req.query.nombre.toString();
                const newUser = new Usuario("").parse(userData);
                try {
                    const result = await gestor.updateUser(nombre, newUser, "nombre");
                    res.send({ response: result });
                }
                catch (err) {
                    res.status(500).send({ error: err });
                }
            }
            else if (req.query.id) {
                //Por Id
                const id = req.query.id.toString();
                const newUser = new Usuario("").parse(userData);
                try {
                    const result = await gestor.updateUser(id, newUser, "id");
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
                    error: 'Debe introducir la id o el nombre del usuario a modificar'
                };
                res.status(400).send({ error: error });
            }
        }
        else {
            const error = {
                type: 'update',
                success: false,
                output: undefined,
                error: validateUser.errors
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

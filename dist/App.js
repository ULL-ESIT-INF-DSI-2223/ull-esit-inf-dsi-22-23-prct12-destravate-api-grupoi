import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import Ajv from 'ajv';
import { RutaModel } from './Modelos/RutaModel.js';
import { UsuarioModel } from './Modelos/UsuarioModel.js';
import { GrupoModel } from './Modelos/GrupoModel.js';
import { RetoModel } from './Modelos/RetoModel.js';
export const app = express();
const ajv = new Ajv.default();
/**
 * Esto permite analizar el body en formato json
 */
app.use(bodyParser.json());
/**
 * Para conectarse a la base de datos
 */
await connect('mongodb://127.0.0.1:27017/actividadesDeportivas').then(() => {
    console.log('Connected to the database');
}).catch(() => {
    console.log('Something went wrong when conecting to the database');
});
/**********************RUTAS********************************/
/**
 * Esquema para validar JSON's de rutas
 */
const schemaGeolocalizacion = {
    type: 'object',
    properties: {
        latitud: { type: 'number' },
        longitud: { type: 'number' },
    },
    required: ['latitud', 'longitud'],
};
const schemaActividad = {
    type: 'string',
    enum: ['Bicicleta', 'Correr']
};
const schemaTrack = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        inicio: { $ref: 'Geolocalizacion' },
        final: { $ref: 'Geolocalizacion' },
        longitud: { type: 'number' },
        desnivel: { type: 'number' },
        usuarios: { type: 'array', items: { type: 'string' } },
        actividad: { $ref: 'Actividad' },
        calificacion: { type: 'number' },
    },
    required: ['nombre', 'inicio', 'final', 'longitud', 'desnivel', 'usuarios', 'actividad', 'calificacion'],
};
ajv.addSchema(schemaGeolocalizacion, 'Geolocalizacion');
ajv.addSchema(schemaActividad, 'Actividad');
const validateTrack = ajv.compile(schemaTrack);
/**
 * Lista un track
 */
app.get('/tracks', async (req, res) => {
    if (req.query.nombre == undefined && req.query.id == undefined) {
        try {
            const tracks = await RutaModel.find().populate('usuarios', 'nombre');
            res.status(200).send(tracks);
        }
        catch (err) {
            const error = {
                type: 'read',
                success: false,
                output: undefined,
                error: err
            };
            res.status(400).send({ error: error });
        }
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            try {
                const nombre = req.query.nombre.toString();
                const tracks = await RutaModel.findOne({ nombre: nombre }).populate('usuarios', 'nombre');
                if (tracks != null) {
                    res.status(200).send(tracks);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El nombre no coincide con ninguna ruta"
                    };
                    res.status(400).send({ error: error });
                }
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
        else if (req.query.id) {
            //Por Id
            try {
                const id = req.query.id.toString();
                const tracks = await RutaModel.findById(id).populate('usuarios', 'nombre');
                if (tracks != null) {
                    res.status(200).send(tracks);
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
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
    }
});
/*
/**
 * Añade un track
 */
app.post('/tracks', async (req, res) => {
    if (JSON.stringify(req.body) == "{}") {
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
const schemaEstadisticasEntrenamiento = {
    type: "object",
    properties: {
        semana: {
            type: "object",
            properties: {
                km: { type: "number" },
                desnivel: { type: "number" }
            },
            required: ["km", "desnivel"],
            additionalProperties: false
        },
        mes: {
            type: "object",
            properties: {
                km: { type: "number" },
                desnivel: { type: "number" }
            },
            required: ["km", "desnivel"],
            additionalProperties: false
        },
        anio: {
            type: "object",
            properties: {
                km: { type: "number" },
                desnivel: { type: "number" }
            },
            required: ["km", "desnivel"],
            additionalProperties: false
        }
    },
    required: ["semana", "mes", "anio"]
};
ajv.addSchema(schemaEstadisticasEntrenamiento, 'EstadisticasEntrenamiento');
const schema_user = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        actividad: { $ref: 'Actividad' },
        amigos: { type: 'array', items: { type: 'string' } },
        grupos: { type: 'array', items: { type: 'string' } },
        estadisticas: { $ref: 'EstadisticasEntrenamiento' },
        rutas: { type: 'array', items: { type: 'string' } },
        retos: { type: 'array', items: { type: 'string' } },
        historicoRutas: {
            type: 'object',
            patternProperties: {
                '^[a-zA-Z0-9-_]+$': { type: 'array', items: { type: 'string' } }
            }
        },
    },
    required: ['nombre', 'actividad', 'amigos', 'grupos', 'estadisticas', 'rutas', 'retos', 'historicoRutas'],
};
const validateUser = ajv.compile(schema_user);
/**
 * Añade un usuario
 */
app.post('/users', async (req, res) => {
    if (JSON.stringify(req.body) == "{}") {
        const error = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del usuario'
        };
        res.status(400).send({ error: error });
    }
    else {
        const userData = new UsuarioModel(req.body);
        const isValid = validateUser(req.body);
        if (isValid) {
            userData.save().then((UsuarioGuardado) => {
                res.status(200).send(UsuarioGuardado);
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
                error: validateUser.errors
            };
            res.status(400).send({ error: error });
        }
    }
});
/**
 * Elimina un Usuario
 */
app.delete('/users', async (req, res) => {
    if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        UsuarioModel.deleteOne({ nombre: nombre }).then((result) => {
            if (result.deletedCount == 1) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ningun usuario"
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
        UsuarioModel.findByIdAndDelete(id).then((result) => {
            if (result != null) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ningun usuario"
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
 * Lista un Usuario
 */
app.get('/users', async (req, res) => {
    if (req.query.nombre == undefined && req.query.id == undefined) {
        try {
            const users = await UsuarioModel.find().populate('rutas', 'nombre').populate('grupos', 'nombre').populate('amigos', 'nombre').populate('retos', 'nombre');
            res.status(200).send(users);
        }
        catch (err) {
            const error = {
                type: 'read',
                success: false,
                output: undefined,
                error: err
            };
            res.status(400).send({ error: error });
        }
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            try {
                const nombre = req.query.nombre.toString();
                const users = await UsuarioModel.findOne({ nombre: nombre }).populate('rutas', 'nombre').populate('grupos', 'nombre').populate('amigos', 'nombre').populate('retos', 'nombre');
                if (users != null) {
                    res.status(200).send(users);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El nombre no coincide cn ningun usuario"
                    };
                    res.status(400).send({ error: error });
                }
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
        else if (req.query.id) {
            //Por Id
            try {
                const id = req.query.id.toString();
                const users = await UsuarioModel.findById(id).populate('rutas', 'nombre').populate('grupos', 'nombre').populate('amigos', 'nombre').populate('retos', 'nombre');
                if (users != null) {
                    res.status(200).send(users);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El id no coincide con ningun usuario"
                    };
                    res.status(400).send({ error: error });
                }
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
    }
});
/**
 * Modifica una Usuarios
 */
app.patch('/users', async (req, res) => {
    if (JSON.stringify(req.body) == "{}") {
        const error = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del usuario a modificar'
        };
        res.status(400).send({ error: error });
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            const nombre = req.query.nombre.toString();
            const aModificar = req.body;
            UsuarioModel.updateOne({ nombre: nombre }, aModificar).then((result) => {
                if (result.modifiedCount >= 1) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ningun usuario"
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
            UsuarioModel.findByIdAndUpdate(id, aModificar).then((result) => {
                if (result != null) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ningun usuario"
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
                error: 'Debe introducir la id o el nombre del usuario a modificar'
            };
            res.status(400).send({ error: error });
        }
    }
});
/**********************Grupos********************************/
const schemaGroup = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        miembrosID: { type: 'array', items: { type: 'string' } },
        propietarioID: { type: 'string' },
        estadisticas: { $ref: 'EstadisticasEntrenamiento' },
        ranking: { type: 'array', items: { type: 'string' } },
        rutasFav: { type: 'array', items: { type: 'string' } },
        historicoRutas: {
            type: 'object',
            patternProperties: {
                '^[a-zA-Z0-9-_]+$': { type: 'array', items: { type: 'string' } }
            }
        }
    },
    required: ['nombre', 'miembrosID', 'propietarioID', 'estadisticas', 'ranking', 'rutasFav', 'historicoRutas'],
};
const validateGroup = ajv.compile(schemaGroup);
/**
 * Añade un Grupo
 */
app.post('/groups', async (req, res) => {
    if (JSON.stringify(req.body) == "{}") {
        const error = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del grupo'
        };
        res.status(400).send({ error: error });
    }
    else {
        const groupData = new GrupoModel(req.body);
        const isValid = validateGroup(req.body);
        if (isValid) {
            groupData.save().then((GrupoGuardado) => {
                res.status(200).send(GrupoGuardado);
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
 * Elimina un grupo
 */
app.delete('/groups', async (req, res) => {
    if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        GrupoModel.deleteOne({ nombre: nombre }).then((result) => {
            if (result.deletedCount == 1) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ningun grupo"
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
        GrupoModel.findByIdAndDelete(id).then((result) => {
            if (result != null) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ningun grupo"
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
 * Lista un grupo
 */
app.get('/groups', async (req, res) => {
    if (req.query.nombre == undefined && req.query.id == undefined) {
        try {
            const groups = await GrupoModel.find().populate('miembrosID', 'nombre').populate('propietarioID', 'nombre').populate('rutasFav', 'nombre');
            res.status(200).send(groups);
        }
        catch (err) {
            const error = {
                type: 'read',
                success: false,
                output: undefined,
                error: err
            };
            res.status(400).send({ error: error });
        }
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            try {
                const nombre = req.query.nombre.toString();
                const groups = await GrupoModel.findOne({ nombre: nombre }).populate('miembrosID', 'nombre').populate('propietarioID', 'nombre').populate('rutasFav', 'nombre');
                if (groups != null) {
                    res.status(200).send(groups);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El nombre no coincide cn ninguna Grupo"
                    };
                    res.status(400).send({ error: error });
                }
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
        else if (req.query.id) {
            //Por Id
            try {
                const id = req.query.id.toString();
                const groups = await GrupoModel.findById(id).populate('miembrosID', 'nombre').populate('propietarioID', 'nombre').populate('rutasFav', 'nombre');
                if (groups != null) {
                    res.status(200).send(groups);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El id no coincide con ningun grupo"
                    };
                    res.status(400).send({ error: error });
                }
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
    }
});
/**
 * Modifica un grupo
 */
app.patch('/groups', async (req, res) => {
    if (JSON.stringify(req.body) == "{}") {
        const error = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del grupo a modificar'
        };
        res.status(400).send({ error: error });
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            const nombre = req.query.nombre.toString();
            const aModificar = req.body;
            GrupoModel.updateOne({ nombre: nombre }, aModificar).then((result) => {
                if (result.modifiedCount >= 1) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ningun grupo"
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
            GrupoModel.findByIdAndUpdate(id, aModificar).then((result) => {
                if (result != null) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ningun grupo"
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
                error: 'Debe introducir la id o el nombre del grupo a modificar'
            };
            res.status(400).send({ error: error });
        }
    }
});
/**********************RETOS********************************/
const schemaReto = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        rutas: { type: 'array', items: { type: 'string' } },
        actividad: { $ref: 'Actividad' },
        total: { type: 'number' },
        usuarios: { type: 'array', items: { type: 'string' } },
    },
    required: ['nombre', 'rutas', 'actividad', 'total', 'usuarios'],
};
const validateReto = ajv.compile(schemaReto);
/**
 * Añade un reto
 */
app.post('/challenges', async (req, res) => {
    if (JSON.stringify(req.body) == "{}") {
        const error = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del reto'
        };
        res.status(400).send({ error: error });
    }
    else {
        const retoData = new RetoModel(req.body);
        const isValid = validateReto(req.body);
        if (isValid) {
            retoData.save().then((RetoGuardado) => {
                res.status(200).send(RetoGuardado);
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
 * Elimina un reto
 */
app.delete('/challenges', async (req, res) => {
    if (req.query.nombre) {
        //Por Nombre
        const nombre = req.query.nombre.toString();
        RetoModel.deleteOne({ nombre: nombre }).then((result) => {
            if (result.deletedCount == 1) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ningun reto"
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
        RetoModel.findByIdAndDelete(id).then((result) => {
            if (result != null) {
                res.status(200).send(result);
            }
            else {
                const error = {
                    type: 'remove',
                    success: false,
                    output: undefined,
                    error: "El nombre no coincide con ningun reto"
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
 * Lista un reto
 */
app.get('/challenges', async (req, res) => {
    if (req.query.nombre == undefined && req.query.id == undefined) {
        try {
            const retos = await RetoModel.find().populate('rutas', 'nombre').populate('usuarios', 'nombre');
            res.status(200).send(retos);
        }
        catch (err) {
            const error = {
                type: 'read',
                success: false,
                output: undefined,
                error: err
            };
            res.status(400).send({ error: error });
        }
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            try {
                const nombre = req.query.nombre.toString();
                const retos = await RetoModel.findOne({ nombre: nombre }).populate('rutas', 'nombre').populate('usuarios', 'nombre');
                if (retos != null) {
                    res.status(200).send(retos);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El nombre no coincide cn ningun reto"
                    };
                    res.status(400).send({ error: error });
                }
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
        else if (req.query.id) {
            //Por Id
            try {
                const id = req.query.id.toString();
                const retos = await RetoModel.findById(id).populate('rutas', 'nombre').populate('usuarios', 'nombre');
                if (retos != null) {
                    res.status(200).send(retos);
                }
                else {
                    const error = {
                        type: 'read',
                        success: false,
                        output: undefined,
                        error: "El id no coincide con ningun reto"
                    };
                    res.status(400).send({ error: error });
                }
            }
            catch (err) {
                const error = {
                    type: 'read',
                    success: false,
                    output: undefined,
                    error: err
                };
                res.status(400).send({ error: error });
            }
        }
    }
});
/**
 * Modifica un reto
 */
app.patch('/challenges', async (req, res) => {
    if (JSON.stringify(req.body) == "{}") {
        const error = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del reto a modificar'
        };
        res.status(400).send({ error: error });
    }
    else {
        if (req.query.nombre) {
            //Por Nombre
            const nombre = req.query.nombre.toString();
            const aModificar = req.body;
            RetoModel.updateOne({ nombre: nombre }, aModificar).then((result) => {
                if (result.modifiedCount >= 1) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ningun reto"
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
            RetoModel.findByIdAndUpdate(id, aModificar).then((result) => {
                if (result != null) {
                    res.status(200).send(result);
                }
                else {
                    const error = {
                        type: 'update',
                        success: false,
                        output: undefined,
                        error: "El nombre o el elemento a modificar no coinciden con ningun reto"
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
                error: 'Debe introducir la id o el nombre del reto a modificar'
            };
            res.status(400).send({ error: error });
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

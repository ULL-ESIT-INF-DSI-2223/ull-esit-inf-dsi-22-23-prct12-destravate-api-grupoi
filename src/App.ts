import express from 'express';
//import {Gestor} from './Gestor.js';
import bodyParser from 'body-parser';
import { ResponseType } from './Types.js';
import {Actividad} from './Actividad.js';
import {IRutaData, Ruta, Geolocalizacion} from './Ruta.js';
import {IGrupoData} from './Grupo.js';
import {IRetoData} from './Reto.js';
import {IUsuarioData, Usuario} from './Usuario.js';

import Ajv from 'ajv';
import { Grupo } from './Grupo.js';
import { Reto } from './Reto.js';
const ajv = new Ajv();

export const app = express();

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

/**
 * This allows to analize json format bodies
 */
app.use(bodyParser.json());

/**********************RUTAS********************************/
/**
 * Lista un track
 */
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

/**
 * Añade un track
 */
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
            const newTrack = new Ruta("",geo, geo, 0, 0, [], Actividad.Correr,0).parse(trackData);
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
        const rutaData: IRutaData = req.body;
        if (isValid){
            const gestor = new Gestor();
            const geo: Geolocalizacion = {
                latitud: 0,
                longitud: 0
            };
            if(req.query.nombre){
            //Por Nombre
            const nombre = req.query.nombre;
            const newTrack = new Ruta("",geo, geo, 0, 0, [], Actividad.Correr,0).parse(rutaData);
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
            const newTrack = new Ruta("",geo, geo, 0, 0, [], Actividad.Correr,0).parse(rutaData);
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
    required: ['id','nombre','actividad','amigos','grupos','estadisticas','rutas','retos','historicoRutas'],
};
const validate1 = ajv.compile(schema_user);

/**
 * Lista un usuario
 */
app.get('/users', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.showUser(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.showUser(id, (error, outputMessage) => {
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

/**
 * Añade un usuario
 */
app.post('/users', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del usuario'
        }
        res.status(400).send({
            error: error
        })
    } else {
        const gestor = new Gestor();
        const userData: IUsuarioData = req.body;
        const isValid = validate1(req.body);
        if (isValid) {
            const newUser = new Usuario("").parse(userData);
            gestor.addUser(newUser, (err, result) => {
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
                error: validate1.errors
            };
            res.status(400).json({error: error});
        }
    }
});

/**
 * Elimina un usuario
 */
app.delete('/users', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.deleteUser(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.deleteUser(id, (error, outputMessage) => {
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
 * Modifica un usuario
 */
app.patch('/users', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del usuario a modificar'
        }
        res.status(400).send({
            error: error
        })
    }else {
        const isValid = validate1(req.body);
        const userData: IUsuarioData = req.body;
        if (isValid){
            const gestor = new Gestor();
            if(req.query.nombre){
            //Por Nombre
            const nombre = req.query.nombre;
            const newUser = new Usuario("").parse(userData);
            gestor.modifyUser(nombre, newUser, (err, result) => {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    res.send({response: result});
                }
            })
            
            }else if(req.query.id){
            //Por Id
            const id = req.query.id;
            const newUser = new Usuario("").parse(userData);
            gestor.modifyUser(id, newUser, (err, result) => {
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
                error: validate1.errors
            };
            res.status(400).json({error: error});
        } 
    }
});
/**********************GRUPOS********************************/
/**
 * Schema to validate json files
 */
const schema_group = {
    type: 'object',
    properties: {
        id: { id: 'string' },
        nombre: { nombre: 'string' },
        miembrosID: { miembrosID: 'string[]' },
        propietariosID: { propietariosID: 'string' },
        estadisticas: { estadisticas: 'EstadisticasEntrenamiento' },
        ranking: { ranking: 'string[]' },
        rutasFav: { rutasFav: 'string[]' },
        historicoRutas: { historicoRutas: 'Map<string, string[]>' },
    },
    required: ['id','nombre','miembrosID','propietarioID','estadisticas','ranking','rutasFav','historicoRutas'],
};
const validate2 = ajv.compile(schema_group);

/**
 * Lista un grupo
 */
app.get('/groups', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.showGroup(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.showGroup(id, (error, outputMessage) => {
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

/**
 * Añade un grupo
 */
app.post('/groups', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del grupo'
        }
        res.status(400).send({
            error: error
        })
    } else {
        const gestor = new Gestor();
        const groupData: IGrupoData = req.body;
        const isValid = validate2(req.body);
        if (isValid) {
            const newGrupo = new Grupo("",[]).parse(groupData);
            gestor.addGrupo(newGrupo, (err, result) => {
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
                error: validate2.errors
            };
            res.status(400).json({error: error});
        }
    }
});

/**
 * Elimina un grupo
 */
app.delete('/groups', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.deleteGrupo(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.deleteGrupo(id, (error, outputMessage) => {
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
 * Modifica un grupo
 */
app.patch('/groups', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del grupo a modificar'
        }
        res.status(400).send({
            error: error
        })
    }else {
        const isValid = validate2(req.body);
        const grupoData: IGrupoData = req.body;
        if (isValid){
            const gestor = new Gestor();
            if(req.query.nombre){
            //Por Nombre
            const nombre = req.query.nombre;
            const newGrupo = new Grupo("",[]).parse(grupoData);
            gestor.modifyGrupo(nombre, newGrupo, (err, result) => {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    res.send({response: result});
                }
            })
            
            }else if(req.query.id){
            //Por Id
            const id = req.query.id;
            const newGrupo = new Grupo("",[]).parse(grupoData);
            gestor.modifyGrupo(id, newGrupo, (err, result) => {
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
                error: validate2.errors
            };
            res.status(400).json({error: error});
        } 
    }
});
/**********************RETOS********************************/
/**
 * Schema to validate json files
 */
const schema_reto = {
    type: 'object',
    properties: {
        id: { id: 'string' },
        nombre: { nombre: 'string' },
        rutas: { miembrosID: 'string[]' },
        actividad: { propietariosID: 'string' },
        total: { estadisticas: 'EstadisticasEntrenamiento' },
        usuarios: { ranking: 'string[]' },
    },
    required: ['id','nombre','rutas','actividad','total','usuarios'],
};
const validate3 = ajv.compile(schema_reto);

/**
 * Lista un reto
 */
app.get('/challenges', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.showReto(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.showReto(id, (error, outputMessage) => {
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

/**
 * Añade un reto
 */
app.post('/challenges', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'add',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del reto'
        }
        res.status(400).send({
            error: error
        })
    } else {
        const gestor = new Gestor();
        const challengeData: IRetoData = req.body;
        const isValid = validate3(req.body);
        if (isValid) {
            const newReto = new Reto("",[], Actividad.Correr,[]).parse(challengeData);
            gestor.addReto(newReto, (err, result) => {
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
                error: validate3.errors
            };
            res.status(400).json({error: error});
        }
    }
});

/**
 * Elimina un reto
 */
app.delete('/challenges', (req, res) => {
    const gestor = new Gestor();
    if(req.query.nombre){
    //Por Nombre
    const nombre = req.query.nombre.toString();
    gestor.deleteReto(nombre, (error, outputMessage) => {
        if (error){
            res.status(500).send({error: error});
        } else{
            res.send({response: outputMessage});
        }
    });
    }else if(req.query.id){
    //Por Id
    const id = req.query.id.toString();
    gestor.deleteReto(id, (error, outputMessage) => {
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
 * Modifica un reto
 */
app.patch('/challenges', (req, res) => {
    if (!req.body) {
        const error: ResponseType<string> = {
            type: 'update',
            success: false,
            output: undefined,
            error: 'Debe introducir los datos del reto a modificar'
        }
        res.status(400).send({
            error: error
        })
    }else {
        const isValid = validate3(req.body);
        const challengeData: IRetoData = req.body;
        if (isValid){
            const gestor = new Gestor();
            if(req.query.nombre){
            //Por Nombre
            const nombre = req.query.nombre;
            const newReto = new Reto("",[],Actividad.Correr,[]).parse(challengeData);
            gestor.modifyReto(nombre, newReto, (err, result) => {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    res.send({response: result});
                }
            })
            
            }else if(req.query.id){
            //Por Id
            const id = req.query.id;
            const newReto = new Reto("",[],Actividad.Correr,[]).parse(challengeData);
            gestor.modifyReto(id, newReto, (err, result) => {
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
                error: validate3.errors
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
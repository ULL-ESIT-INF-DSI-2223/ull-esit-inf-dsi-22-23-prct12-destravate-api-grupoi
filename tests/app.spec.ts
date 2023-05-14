import request from 'supertest';
import {app} from '../src/App.js';
import { UsuarioModel } from '../src/Modelos/UsuarioModel.js';
import { GrupoModel } from '../src/Modelos/GrupoModel.js';
import { RutaModel } from '../src/Modelos/RutaModel.js';
import { RetoModel } from '../src/Modelos/RetoModel.js';

beforeEach(async () => {
    await UsuarioModel.deleteMany();
    await GrupoModel.deleteMany();
    await RutaModel.deleteMany();
    await RetoModel.deleteMany();
});

/**
 * Usuarios
 */
describe('POST /users', () =>{
    it('Should succesfully create a new user', async () => {
        await request(app).post('/users').send({
                "nombre": "Usuario Prueba",
                "actividad": "Correr",
                "amigos": [],
                "grupos": [],
                "estadisticas": {
                  "semana": { "km": 50, "desnivel": 1000 },
                  "mes": { "km": 200, "desnivel": 5000 },
                  "anio": { "km": 1000, "desnivel": 20000 }
                },
                "rutas": [],
                "retos": [],
                "historicoRutas": {}
        }).expect(200);
    });
});

/**
 * Usuarios: Eliminar
 */
describe('DELETE /users', () => {
    it('Should successfully delete a user by name', async () => {
      const newUser = new UsuarioModel({
                "nombre": "Usuario Prueba",
                "actividad": "Correr",
                "amigos": [],
                "grupos": [],
                "estadisticas": {
                  "semana": { "km": 50, "desnivel": 1000 },
                  "mes": { "km": 200, "desnivel": 5000 },
                  "anio": { "km": 1000, "desnivel": 20000 }
                },
                "rutas": [],
                "retos": [],
                "historicoRutas": {}
      });
      const savedUser = await newUser.save();
  
      await request(app)
        .delete('/users')
        .query({ nombre: savedUser.nombre })
        .expect(200);
    });
  
    it('Should successfully delete a user by id', async () => {
      const newUser = new UsuarioModel({
        "nombre": "Usuario Prueba",
        "actividad": "Correr",
        "amigos": [],
        "grupos": [],
        "estadisticas": {
            "semana": { "km": 50, "desnivel": 1000 },
            "mes": { "km": 200, "desnivel": 5000 },
            "anio": { "km": 1000, "desnivel": 20000 }
        },
        "rutas": [],
        "retos": [],
        "historicoRutas": {}
      });
      const savedUser = await newUser.save();
  
      await request(app)
        .delete('/users')
        .query({ id: savedUser.id })
        .expect(200);
    });
  
    it('Should return an error when no name or id is provided', async () => {
      await request(app).delete('/users').expect(400);
    });
  });
  
  /**
   * Usuarios: Listar
   */
  describe('GET /users', () => {
    it('Should successfully get all users', async () => {
      await request(app).get('/users').expect(200);
    });
  
    it('Should successfully get a user by name', async () => {
      const newUser = new UsuarioModel({
                "nombre": "Usuario Prueba",
                "actividad": "Correr",
                "amigos": [],
                "grupos": [],
                "estadisticas": {
                  "semana": { "km": 50, "desnivel": 1000 },
                  "mes": { "km": 200, "desnivel": 5000 },
                  "anio": { "km": 1000, "desnivel": 20000 }
                },
                "rutas": [],
                "retos": [],
                "historicoRutas": {}
      });
      const savedUser = await newUser.save();
  
      await request(app)
        .get('/users')
        .query({ nombre: savedUser.nombre })
        .expect(200);
    });
  
    it('Should successfully get a user by id', async () => {
      const newUser = new UsuarioModel({
        "nombre": "Usuario Prueba",
        "actividad": "Correr",
        "amigos": [],
        "grupos": [],
        "estadisticas": {
          "semana": { "km": 50, "desnivel": 1000 },
          "mes": { "km": 200, "desnivel": 5000 },
          "anio": { "km": 1000, "desnivel": 20000 }
        },
        "rutas": [],
        "retos": [],
        "historicoRutas": {}
      });
      const savedUser = await newUser.save();
  
      await request(app)
        .get('/users')
        .query({ id: savedUser.id })
        .expect(200);
    });
  
    it('Should return an error when no user is found by name', async () => {
      await request(app)
        .get('/users')
        .query({ nombre: 'non-existent-user' })
        .expect(400);
    });
  
    it('Should return an error when no user is found by id', async () => {
      await request(app)
        .get('/users')
        .query({ id: 'non-existent-id' })
        .expect(400);
    });
  });
  
  /**
   * Usuarios: Modificar
   */
  describe('PATCH /users', () => {
    it('Should successfully update a user by name', async () => {
      const newUser = new UsuarioModel({
        "nombre": "Usuario Prueba",
        "actividad": "Correr",
        "amigos": [],
        "grupos": [],
        "estadisticas": {
          "semana": { "km": 50, "desnivel": 1000 },
          "mes": { "km": 200, "desnivel": 5000 },
          "anio": { "km": 1000, "desnivel": 20000 }
        },
        "rutas": [],
        "retos": [],
        "historicoRutas": {}
      });
      const savedUser = await newUser.save();
  
      await request(app)
        .patch('/users')
        .query({ nombre: savedUser.nombre })
        .send({
          nombre: 'Nombre actualizado',
          actividad: "Correr",
          amigos: [],
          grupos: [],
          estadisticas: {
            "semana": { "km": 50, "desnivel": 1000 },
            "mes": { "km": 200, "desnivel": 5000 },
            "anio": { "km": 1000, "desnivel": 20000 }
          },
          rutas: [],
          retos: [],
          historicoRutas: {}
        })
        .expect(200);
    });
  
    it('Should successfully update a user by id', async () => {
      const newUser = new UsuarioModel({
        "nombre": "Usuario Prueba",
        "actividad": "Correr",
        "amigos": [],
        "grupos": [],
        "estadisticas": {
          "semana": { "km": 50, "desnivel": 1000 },
          "mes": { "km": 200, "desnivel": 5000 },
          "anio": { "km": 1000, "desnivel": 20000 }
        },
        "rutas": [],
        "retos": [],
        "historicoRutas": {}
      });
      const savedUser = await newUser.save();
  
      await request(app)
        .patch('/users')
        .query({ id: savedUser.id })
        .send({
          nombre: 'Nombre actualizado',
          actividad: "Correr",
          amigos: [],
          grupos: [],
          estadisticas: {
            "semana": { "km": 50, "desnivel": 1000 },
            "mes": { "km": 200, "desnivel": 5000 },
            "anio": { "km": 1000, "desnivel": 20000 }
          },
          rutas: [],
          retos: [],
          historicoRutas: {}
        })
        .expect(200);
    });
  
    it('Should return an error when no name or id is provided', async () => {
      await request(app).patch('/users').expect(400);
    });
  
    it('Should return an error when no user is found by name', async () => {
      await request(app)
        .patch('/users')
        .query({ nombre: "nombrenoexistente" })
        .send({
          nombre: 'Nombre actualizado',
          actividad: "Correr",
          amigos: [],
          grupos: [],
          estadisticas: {
            "semana": { "km": 50, "desnivel": 1000 },
            "mes": { "km": 200, "desnivel": 5000 },
            "anio": { "km": 1000, "desnivel": 20000 }
          },
          rutas: [],
          retos: [],
          historicoRutas: {}
        })
        .expect(400);
    });
});

/**
 * Rutas
 */
describe('POST /tracks', () => {
    it('Should successfully create a new route', async () => {
        await request(app).post('/tracks').send({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
        }).expect(200);
    });
});

/**
 * Rutas: Eliminar
 */
describe('DELETE /tracks', () => {
    it('Should successfully delete a route by id', async () => {
        const newRoute = new RutaModel({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
        });
        const savedRoute = await newRoute.save();

        await request(app)
            .delete('/tracks')
            .query({ id: savedRoute.id })
            .expect(200);
    });

    it('Should return an error when no id is provided', async () => {
        await request(app).delete('/tracks').expect(400);
    });
});

/**
 * Rutas: Listar
 */
describe('GET /tracks', () => {
    it('Should successfully get all routes', async () => {
        await request(app).get('/tracks').expect(200);
    });

    it('Should successfully get a route by id', async () => {
        const newRoute = new RutaModel({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
        });
        const savedRoute = await newRoute.save();

        await request(app)
            .get('/tracks')
            .query({ id: savedRoute.id })
            .expect(200);
    });

    it('Should return an error when no route is found by id', async () => {
        await request(app)
            .get('/tracks')
            .query({ id: 'non-existent-id' })
            .expect(400);
    });
});

/**
 * Rutas: Modificar
 */
describe('PATCH /tracks', () => {
    it('Should successfully update a route by id', async () => {
        const newRoute = new RutaModel({
            "nombre": "Ruta Prueba",
            "inicio": {
                "latitud": 40.7128,
                "longitud": -74.0060
            },
            "final": {
            "latitud": 40.7128,
            "longitud": -74.0060
            },
            "longitud": 5,
            "desnivel": 100,
            "usuarios": [],
            "actividad": "Correr",
            "calificacion": 4
            });
            const savedRoute = await newRoute.save();
            await request(app)
            .patch('/tracks')
            .query({ id: savedRoute.id })
            .send({
                "nombre": "Ruta Actualizada",
                "inicio": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "final": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "longitud": 10,
                "desnivel": 200,
                "usuarios": [],
                "actividad": "Correr",
                "calificacion": 5
            })
            .expect(200);
    });
    
    it('Should return an error when no id is provided', async () => {
        await request(app).patch('/tracks').expect(400);
    });
    
    it('Should return an error when no route is found by id', async () => {
        await request(app)
            .patch('/tracks')
            .query({ id: "idnoexistente" })
            .send({
                "nombre": "Ruta Actualizada",
                "inicio": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "final": {
                    "latitud": 40.7128,
                    "longitud": -74.0060
                },
                "longitud": 10,
                "desnivel": 200,
                "usuarios": [],
                "actividad": "Correr",
                "calificacion": 5
            })
            .expect(400);
    });
});    

/**
 * Retos: Crear
 */
describe('POST /challenges', () => {
    it('Should successfully create a new challenge', async () => {
        await request(app).post('/challenges').send({
            "nombre": "Reto Prueba",
            "rutas": [],
            "actividad": "Correr",
            "total": 100,
            "usuarios": []
        }).expect(200);
    });
});

/**
 * Retos: Eliminar
 */
describe('DELETE /challenges', () => {
    it('Should successfully delete a challenge by id', async () => {
        const newChallenge = new RetoModel({
            "nombre": "Reto Prueba",
            "rutas": [],
            "actividad": "Correr",
            "total": 100,
            "usuarios": []
        });
        const savedChallenge = await newChallenge.save();

        await request(app)
            .delete('/challenges')
            .query({ id: savedChallenge.id })
            .expect(200);
    });

    it('Should return an error when no id is provided', async () => {
        await request(app).delete('/challenges').expect(400);
    });
});

/**
 * Retos: Listar
 */
describe('GET /challenges', () => {
    it('Should successfully get all challenges', async () => {
        await request(app).get('/challenges').expect(200);
    });

    it('Should successfully get a challenge by id', async () => {
        const newChallenge = new RetoModel({
            "nombre": "Reto Prueba",
            "rutas": [],
            "actividad": "Correr",
            "total": 100,
            "usuarios": []
        });
        const savedChallenge = await newChallenge.save();

        await request(app)
            .get('/challenges')
            .query({ id: savedChallenge.id })
            .expect(200);
    });

    it('Should return an error when no challenge is found by id', async () => {
        await request(app)
            .get('/challenges')
            .query({ id: 'non-existent-id' })
            .expect(400);
    });
});

/**
 * Retos: Modificar
 */
describe('PATCH /challenges', () => {
    it('Should successfully update a challenge by id', async () => {
        const newChallenge = new RetoModel({
            "nombre": "Reto Prueba",
            "rutas": [],
            "actividad": "Correr",
            "total": 100,
            "usuarios": []
        });
        const savedChallenge = await newChallenge.save();

        await request(app)
            .patch('/challenges')
            .query({ id: savedChallenge.id })
            .send({
                "nombre": "Reto Actualizado",
                "rutas": [],
                "actividad": "Correr",
                "total": 200,
                "usuarios": []
            })
            .expect(200);
    });

    it('Should return an error when no id is provided', async () => {
        await request(app).patch('/challenges').expect(400);
    });

    it('Should return an error when no challenge is found by id', async () => {
        await request(app)
            .patch('/challenges')
            .query({ id: "idnoexistente" })
            .send({
                "nombre": "Reto Actualizado",
                "rutas": [],
                "actividad": "Correr",
                "total": 200,
                "usuarios": []
            })
            .expect(400);
    });
});

/**
 * Grupos
 */
describe('POST /groups', () => {
    it('Should successfully create a new group', async () => {
        await request(app).post('/groups').send({
            "nombre": "Grupo Prueba",
            "miembrosID": [],
            "propietarioID": "60e9c1f1b5027e08fcd7900e",
            "estadisticas": {
                "semana": { "km": 50, "desnivel": 1000 },
                "mes": { "km": 200, "desnivel": 5000 },
                "anio": { "km": 1000, "desnivel": 20000 }
            },
            "ranking": [],
            "rutasFav": [],
            "historicoRutas": {}
        }).expect(200);
    });
});

/**
 * Grupos: Eliminar
 */
describe('DELETE /groups', () => {
    it('Should successfully delete a group by name', async () => {
        const newGroup = new GrupoModel({
            "nombre": "Grupo Prueba",
            "miembrosID": [],
            "propietarioID": "60e9c1f1b5027e08fcd7900e",
            "estadisticas": {
                "semana": { "km": 50, "desnivel": 1000 },
                "mes": { "km": 200, "desnivel": 5000 },
                "anio": { "km": 1000, "desnivel": 20000 }
            },
            "ranking": [],
            "rutasFav": [],
            "historicoRutas": {}
        });
        const savedGroup = await newGroup.save();

        await request(app)
            .delete('/groups')
            .query({ nombre: savedGroup.nombre })
            .expect(200);
    });

    it('Should successfully delete a group by id', async () => {
        const newGroup = new GrupoModel({
            "nombre": "Grupo Prueba",
            "miembrosID": [],
            "propietarioID": "60e9c1f1b5027e08fcd7900e",
            "estadisticas": {
                "semana": { "km": 50, "desnivel": 1000 },
                "mes": { "km": 200, "desnivel": 5000 },
                "anio": { "km": 1000, "desnivel": 20000 }
            },
            "ranking": [],
            "rutasFav": [],
            "historicoRutas": {}
        });
        const savedGroup = await newGroup.save();

        await request(app)
            .delete('/groups')
            .query({ id: savedGroup.id })
            .expect(200);
    });

    it('Should return an error when no name or id is provided', async () => {
        await request(app).delete('/groups').expect(400);
    });
});

/**
 * Grupos: Listar
 */
describe('GET /groups', () => {
    it('Should successfully get all groups', async () => {
        await request(app).get('/groups').expect(200);
    });

    it('Should successfully get a group by name', async () => {
        const newGroup = new GrupoModel({
            "nombre": "Grupo Prueba",
            "miembrosID": [],
            "propietarioID": "60e9c1f1b5027e08fcd7900e",
            "estadisticas": {
                "semana": { "km": 50, "desnivel": 1000 },
                "mes": { "km": 200, "desnivel": 5000 },
                "anio": { "km": 1000, "desnivel": 20000 }
            },
            "ranking": [],
            "rutasFav": [],
            "historicoRutas": {}
        });
        const savedGroup = await newGroup.save();

        await request(app)
            .get('/groups')
            .query({id: savedGroup.id})
            .expect(200);
    });

    it('Should return an error when no group is found by id', async () => {
        await request(app)
            .get('/groups')
            .query({id: 'non-existing-id'})
            .expect(400);
    });
});

/**
 * Grupos: Modificar
 */
describe('PATCH /groups', () => {
    it('Should successfully update a group by id', async () => {
        const newGroup = new GrupoModel({
            "nombre": "Grupo Prueba",
            "miembrosID": [],
            "propietarioID": "60e9c1f1b5027e08fcd7900e",
            "estadisticas": {
                "semana": { "km": 50, "desnivel": 1000 },
                "mes": { "km": 200, "desnivel": 5000 },
                "anio": { "km": 1000, "desnivel": 20000 }
            },
            "ranking": [],
            "rutasFav": [],
            "historicoRutas": {}
        });
        const savedGroup = await newGroup.save();

        await request(app)
            .patch('/groups')
            .query({ id: savedGroup.id })
            .send({
                "nombre": "Grupo Actualizado",
                "miembrosID": [],
                "propietarioID": "60e9c1f1b5027e08fcd7900e",
                "estadisticas": {
                    "semana": { "km": 50, "desnivel": 1000 },
                    "mes": { "km": 200, "desnivel": 5000 },
                    "anio": { "km": 1000, "desnivel": 20000 }
                },
                "ranking": [],
                "rutasFav": [],
                "historicoRutas": {}
                })
            .expect(200);
    });

    it('Should return an error when no id is provided', async () => {
        await request(app).patch('/groups').expect(400);
    });

    it('Should return an error when no group is found by id', async () => {
        await request(app)
            .patch('/groups')
            .query({ id: "idnoexistente" })
            .send({
                "nombre": "Grupo Actualizado",
                "miembrosID": [],
                "propietarioID": "60e9c1f1b5027e08fcd7900e",
                "estadisticas": {
                    "semana": { "km": 50, "desnivel": 1000 },
                    "mes": { "km": 200, "desnivel": 5000 },
                    "anio": { "km": 1000, "desnivel": 20000 }
                },
                "ranking": [],
                "rutasFav": [],
                "historicoRutas": {}
            })
            .expect(400);
    });
});
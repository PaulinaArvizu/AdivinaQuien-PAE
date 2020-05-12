const request = require("supertest");
const app = require("../server");

test('Obtener usuarios', async () => {
    const resp = await request(app)
        .get('/api/users')
        .expect(200)
    
    console.log(resp.body);
    expect(resp.body).toBeTruthy();
    expect(Array.isArray(resp.body)).toBe(true);

})

test('Crear usuario', async () => {
    let user ={"email": "test2@t.t","password": "1234", "nombre": "test2"}
    const resp = await request(app)
        .post('/api/users')
        .send(user)
        .expect(201)

    console.log(resp.body);
    expect(resp.body).toHaveLength(1);
    expect(resp.body[0]).toHaveProperty("email", user.email)
    expect(resp.body[0]).toHaveProperty("password", user.password)
    expect(resp.body[0]).toHaveProperty("nombre", user.nombre)

})

test('Obtener usuario por correo', async () => {
    let user ={"email": "test2@t.t","password": "1234", "nombre": "test2"}
    const resp = await request(app)
        .get('/api/users/test2@t.t')
        .expect(200)

    console.log(resp.body);
    expect(resp.body).toHaveProperty("email", user.email)
    expect(resp.body).toHaveProperty("password", user.password)
    expect(resp.body).toHaveProperty("nombre", user.nombre)

})

test('Put en usuario', async () => {
    let cambios ={ 
           "password": "password", 
           "nombre": "nombre", 
           "fotoPerfil": "", 
           "historialPartidas": [1,2], 
           "albumes": [1], 
           "fotos": [1,2,3,4], 
           "amigos": [2] 
        } 
    const resp = await request(app)
        .put('/api/users/test2@t.t')
        .send(cambios)
        .expect(200)

    console.log(resp.body);
    expect(resp.body).toHaveProperty("historialPartidas", cambios.historialPartidas)
    expect(resp.body).toHaveProperty("password", cambios.password)
    expect(resp.body).toHaveProperty("fotos", cambios.fotos)
    expect(resp.body).toHaveProperty("amigos", cambios.amigos)
    expect(resp.body).toHaveProperty("nombre", cambios.nombre)
    expect(resp.body).toHaveProperty("albumes", cambios.albumes)
})

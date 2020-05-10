const request = require("supertest");
const app = require("../server");

test('Obtener albumes', async () => {
    const resp = await request(app)
        .get('/api/albums')
        .expect(200)

    console.log(resp.body);
    expect(resp.body).toBeTruthy();
    expect(Array.isArray(resp.body)).toBe(true);
})

test('Crear album', async () => {
    let newAlbum = {
        "nombre": "test album 1",
        "fotos": [1, 2]
    };
    const resp = await request(app)
        .post('/api/albums')
        .send(newAlbum)
        .expect(201)
    console.log(resp.body)
    expect(resp.body[0]).toHaveProperty("nombre", newAlbum.nombre)
    expect(resp.body[0]).toHaveProperty("fotos", newAlbum.fotos)
})

test('Obtener album por id', async () => {
    const albumes = await request(app)
        .get('/api/albums')
        .expect(200)
    let a = albumes.body[albumes.body.length-1]
    console.log(a)
    const resp = await request(app)
        .get(`/api/albums/${a._id}`)
        .expect(200)
    console.log(resp.body)
    expect(resp.body).toHaveProperty("nombre")
    expect(resp.body).toHaveProperty("fotos")
    expect(resp.body).toHaveProperty("_id")
})

test('put album por id', async () => {
    const albumes = await request(app)
        .get('/api/albums')
        .expect(200)
    let cambios = {
        "nombre": "Nuevo nombre",
        "fotos": [3, 4]
    }
    let a = albumes.body[albumes.body.length-1]
    console.log(a)
    const resp = await request(app)
        .put(`/api/albums/${a._id}`)
        .send(cambios)
        .expect(200)
    console.log(resp.body)
    expect(resp.body).toHaveProperty("nombre", cambios.nombre)
    expect(resp.body).toHaveProperty("fotos", cambios.fotos)
})

test('borrar album por id', async () => {
    const albumes = await request(app)
        .get('/api/albums')
        .expect(200)
    let datos = {
        "nombre": "Nuevo nombre",
        "fotos": [3, 4]
    }
    let a = albumes.body[albumes.body.length-1]
    console.log(a)
    const resp = await request(app)
        .delete(`/api/albums/${a._id}`)
        .expect(200)
    console.log(resp.body)
    expect(resp.body).toHaveProperty("nombre", datos.nombre)
    expect(resp.body).toHaveProperty("fotos", datos.fotos)
    expect(resp.body).toHaveProperty("_id")
})
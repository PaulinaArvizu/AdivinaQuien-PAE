const request = require("supertest");
const app = require("../server");

test('Obtener partidas', async () => {
    const resp = await request(app)
        .get('/api/partidas')
        .expect(200)

    console.log(resp.body);
    expect(resp.body).toBeTruthy();
    expect(Array.isArray(resp.body)).toBe(true);
})

test('crear partida', async () => {
    const resp = await request(app)
        .post('/api/partidas')
        .send({
            jugador1: 'test1@t.t',
            jugador2: 'test2@t.t',
            album: 'idrandom'
        })
        .expect(201)
    let partida = resp.body[0]
    expect(partida).toHaveProperty('Jugador1', 'test1@t.t')
    expect(partida).toHaveProperty('Jugador2', 'test2@t.t')
    expect(partida).toHaveProperty('ganador')
    expect(partida).toHaveProperty('album', 'idrandom')
    expect(partida).toHaveProperty('status')
    expect(partida).toHaveProperty('_id')
})

test('conseguir partida por id', async () => {

    const partidas = await request(app)
        .get('/api/partidas')
        .expect(200)
    let p = partidas.body[partidas.body.length - 1]
    const resp = await request(app)
        .get('/api/partidas/' + p._id)
        .expect(200)
    let partida = resp.body;
    expect(partida).toHaveProperty('Jugador1', 'test1@t.t')
    expect(partida).toHaveProperty('Jugador2', 'test2@t.t')
    expect(partida).toHaveProperty('ganador')
    expect(partida).toHaveProperty('album', 'idrandom')
    expect(partida).toHaveProperty('status')
    expect(partida).toHaveProperty('_id', p._id)
})

test('put partida', async () => {

    const partidas = await request(app)
        .get('/api/partidas')
        .expect(200)
    let p = partidas.body[partidas.body.length - 1]
    let update = {
        'ganador': p.Jugador1,
        'status': true
    }
    console.log(p)
    const resp = await request(app)
        .put('/api/partidas/' + p._id)
        .send(update)
        .expect(200)
    expect(resp.body).toHaveProperty('Jugador1', 'test1@t.t')
    expect(resp.body).toHaveProperty('Jugador2', 'test2@t.t')
    expect(resp.body).toHaveProperty('ganador', update.ganador)
    expect(resp.body).toHaveProperty('album', 'idrandom')
    expect(resp.body).toHaveProperty('status', update.status)
    expect(resp.body).toHaveProperty('_id', p._id)
})

test('eliminar partida por id', async () => {

    const partidas = await request(app)
        .get('/api/partidas')
        .expect(200)
    let p = partidas.body[partidas.body.length - 1]
    console.log(p)
    const resp = await request(app)
        .delete('/api/partidas/' + p._id)
        .expect(200)
    console.log(resp.body)
    expect(resp.body).toHaveProperty('Jugador1', p.Jugador1)
    expect(resp.body).toHaveProperty('Jugador2', p.Jugador2)
    expect(resp.body).toHaveProperty('ganador', p.ganador)
    expect(resp.body).toHaveProperty('album', p.album)
    expect(resp.body).toHaveProperty('status', p.status)
    expect(resp.body).toHaveProperty('_id', p._id)
})
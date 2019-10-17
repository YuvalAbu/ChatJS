const express = require('express')
const chat = express()
const helmet = require('helmet')
const jwt = require('jsonwebtoken')

const { server: { port }, jwtSecret } = require('./config')
const { decodeJWT } = require('./middlewares')

const server = require('http').createServer(chat)
const io = require('socket.io')(server)

const deadEnd = (req, res) => {
    res.sendFile(`${__dirname}/html/chat.html`)
}

chat.use(helmet())

io.on('connection', socket => {
    socket.emit('chat', {
        from: 'Server',
        msg: 'Bienvenu sur le chat' 
    })
    socket.broadcast.emit('chat', {
        from: 'Server',
        msg: 'Un nouvel utilisateur est connécté' 
    })
    socket.on('chat', data => {
        const { msg, token } = data
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                // socket.broadcast.emit('chat', {
                //     from: 'Server', 
                //     msg: 'Problème de connexion'
                // })
                return
            }
            const { name } = decodedToken
            socket.broadcast.emit('chat', {
                from: name, 
                msg
            })
            socket.emit('chat', {
                from: name, 
                msg
            })
        })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('chat', {
            from: 'Server',
            msg: 'Un utilisateur est parti' 
        })
    })
})

chat.get('/', (req, res) => {
    res.sendFile(`${__dirname}/html/chat.html`)
})

chat.get('/signin', (req, res) => {
    res.sendFile(`${__dirname}/html/signin.html`)
})

chat.get('/signup', (req, res) => {
    res.sendFile(`${__dirname}/html/signin.html`)
})

chat.get('/401', (req, res) => {
    res.sendFile(`${__dirname}/html/401.html`)
})
chat.get('/admin', (req, res) => {
    res.sendFile(`${__dirname}/html/admin_liste_user.html`)
})
chat.get('/admin/:_id', (req, res) => {
    res.sendFile(`${__dirname}/html/admin_form.html`)
})


chat.get('*', deadEnd)
chat.post('*', deadEnd)
chat.put('*', deadEnd)
chat.delete('*', deadEnd)

server.listen(port.chat, () => console.log(`Chat lancé sur le port ${port.chat}`))
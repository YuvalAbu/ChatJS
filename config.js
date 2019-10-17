// Please rename this file config.js

module.exports = {
    dbUrl: 'mongodb+srv://med:azerty@cluster0-ecats.mongodb.net/test?retryWrites=true&w=majority',
    // dbUrl: 'mongodb+srv://mfahim:azerty123@cluster0-6bkk7.mongodb.net/test?retryWrites=true&w=majority',
    // dbUrl: 'mongodb+srv://<username>:<password>@<hostname>/<collection-name>',
    jwtSecret: 'motus-et-bouche-cousue',
    server: {
        host: 'http://locahost',
        port: {
            api: 3000,
            chat: 3001
        }
    }
}
  
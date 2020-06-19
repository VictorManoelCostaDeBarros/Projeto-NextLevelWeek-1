const express = require("express")
const server = express()

// Pegar o banco de dados
const db = require("./database/db")

// configura pasta publica
server.use(express.static("public"))

// abilitar o uso do req.body na nossa aplicaçãp
server.use(express.urlencoded({ extended: true }))

// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true 
})

// Configura caminhos da aplicação
// pagina inical
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um titulo"})
})

server.get("/create-point", (req, res) => {
    // req.query: Query string da nossa url
    // console.log(req.query)
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    // req.body: O corpo do nosso formulario
    // console.log(req.body)

    // inserir dados no banco de dados 

    const query = `
        INSERT INTO places (
            image,
            name,
            adress,
            adress2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.adress,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.render("err-create-point.html")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true})
    }
     db.run(query, values, afterInsertData)



    
})

server.get("/search", (req, res) => {
    const search = req.query.search

    if(search == "") {
        // Pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }

    // Pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }
        const total = rows.length
        // Mostra a página html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total})
        })
    
})

// Ligar o Servidor
server.listen(3000)
const http = require("http")
const fs = require('fs')
const path = require('path')
const logFilePath = path.join(__dirname, "logs.txt");

function formatarData() {
    const data = new Date();

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    const segundos = String(data.getSeconds()).padStart(2, "0");

    return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

const server = http.createServer((req, res) => {
    const time = formatarData()
    const method = req.method
    const url = req.url
    const log = `[${time}] ${method} ${url} \n`
    fs.appendFile(logFilePath , log, (err) => {
        if (err) throw err

        console.log(log)
    })
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    if (req.url === "/") {
        res.write("<h1>Bem-vindo ao servidor de logs!</h1>")
        res.end()
    } else if (req.url === "/logs") {
        fs.readFile(logFilePath , 'utf8', (err, data) => {
            if (err) {
                res.write("<h1>Erro ao ler os logs</h1>");
                res.end();
                return;
            }


            res.write(`<h1>Bem-vindo a pág de log</h1>
                        <pre>${data}</pre>
                `)
            res.end()
        })
    } else {
        res.write("<h1>Página não encontrada</h1>");
        res.end();
    }
})

server.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'))
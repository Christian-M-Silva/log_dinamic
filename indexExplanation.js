// IMPORTAR OS MODULOS NATIVOS DO NODE
const http = require("http") //PARA CRIAR SERVIDOR
const fs = require('fs') //PARA MANIPULAR ARQUIVO
const path = require('path') //PARA MANIPULAR CAMINHO DO ARQUIVO OU DIRETORIO

const logFilePath = path.join(__dirname, "logs.txt"); // CRIA UM CAMINHO DEFINITIVO PARA SEU ARQUIVO QUE SERÁ RESPEITADO INDEPENDENTE DO SO

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

const server = http.createServer((req, res) => { // CRIAR SERVIDOR COM O createServer
    const time = formatarData()
    const method = req.method
    const url = req.url
    const log = `[${time}] ${method} ${url} \n`

    fs.appendFile(logFilePath , log, (err) => { // O appendFile CRIARÁ SE NÃO EXISTIR O ARQUIVO NO CAMINHO ESPECIFICADO OU ADD AO FINAL DESSE ARQUIVO SE EXISTIR O CONTEUDO DO LOG
        if (err) throw err

        console.log(log)
    })

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }) // CONFIGURAÇÃO DE HEAD DO HTML, A SEMELHANÇA DO QUE JÁ FAZEMOS NO HEAD

    if (req.url === "/") { // COM O req.url VISUALIZAMOS A ROTA ATUAL
        res.write("<h1>Bem-vindo ao servidor de logs!</h1>") //  res.write ESCREVER O CONTEUDO DA PÁG
        res.end() // ENCERRA A REQUISIÇÃO PARA EVITAR DE DEIXAR A PÁG CARREGANDO 
    } else if (req.url === "/logs") {
        fs.readFile(logFilePath , 'utf8', (err, data) => { //LER O ARQUIVO CONVERTENDO PARA utf8 PARA PERMITIR PEGAR OS CARACTERES ESPECIAIS E COM ACENTUAÇÃO
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

server.listen(3000, () => console.log('Servidor rodando em http://localhost:3000')) //ESCUTAR O SERVIDOR CRIADO COM O listen DEFININDO UMA PORTA E UMA FUNÇÃO CALLBACK DE RETORNO
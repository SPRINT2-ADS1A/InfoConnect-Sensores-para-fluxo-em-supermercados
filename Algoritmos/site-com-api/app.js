
// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var usuarioRouter = require("./src/routes/usuarios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// A dashboard do grupo esta na pasta DASH, ao lado de public.
app.use("/DASH", express.static(path.join(__dirname, "DASH")));

app.use(cors());

app.use("/usuarios", usuarioRouter);

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######

    Servidor do seu site já está rodando!
    Acesse: http://${HOST_APP}:${PORTA_APP}

    Ambiente: ${process.env.AMBIENTE_PROCESSO}

    Para alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'
    `);
});

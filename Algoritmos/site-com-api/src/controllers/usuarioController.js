
var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined || email.trim() == "") {
        res.status(400).send("Informe seu e-mail!");

    } else if (senha == undefined || senha == "") {
        res.status(400).send("Informe sua senha!");

    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    res.json(resultado[0]);
                } else {
                    res.status(403).send("E-mail ou senha invalidos!");
                }
            }).catch(function (erro) {
                console.log("Erro ao realizar login:", erro.message);
                res.status(500).send("Erro ao realizar login.");
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    var nomeFantasia = req.body.nomeFantasiaServer;
    var cnpj = req.body.cnpjServer;
    var telefone = req.body.telefoneServer;
    var cep = req.body.cepServer;
    var uf = req.body.ufServer;
    var cidade = req.body.cidadeServer;
    var logradouro = req.body.logradouroServer;
    var numero = req.body.numeroServer;

    if (nome == undefined || String(nome).trim() == "" ||
        email == undefined || String(email).trim() == "" ||
        senha == undefined || senha == "" ||
        nomeFantasia == undefined || String(nomeFantasia).trim() == "" ||
        cidade == undefined || String(cidade).trim() == "" ||
        logradouro == undefined || String(logradouro).trim() == "" ||
        numero == undefined || String(numero).trim() == "") {

        res.status(400).send("Preencha todos os campos!");

    } else if (senha.length < 8 || senha.length > 72) {
        res.status(400).send("A senha deve ter entre 8 e 72 caracteres.");

    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        res.status(400).send("Informe um e-mail valido.");

    } else if (
        cpf == undefined || String(cpf).replace(/\D/g, "").length != 11 ||
        cnpj == undefined || String(cnpj).replace(/\D/g, "").length != 14 ||
        telefone == undefined || String(telefone).replace(/\D/g, "").length < 10 ||
        String(telefone).replace(/\D/g, "").length > 11 ||
        cep == undefined || String(cep).replace(/\D/g, "").length != 8 ||
        uf == undefined || !/^[A-Za-z]{2}$/.test(uf)
    ) {
        res.status(400).send("CPF, CNPJ, telefone, CEP ou UF invalidos.");

    } else if (
        String(nome).length > 100 ||
        String(email).length > 150 ||
        String(nomeFantasia).length > 120 ||
        String(cidade).length > 100 ||
        String(logradouro).length > 200 ||
        String(numero).length > 20
    ) {
        res.status(400).send("Um campo ultrapassa o tamanho permitido.");

    } else {
        cpf = String(cpf).replace(/\D/g, "");
        cnpj = String(cnpj).replace(/\D/g, "");
        telefone = String(telefone).replace(/\D/g, "");
        cep = String(cep).replace(/\D/g, "");
        uf = uf.toUpperCase();

        usuarioModel.cadastrar(
            nome, email, senha, cpf,
            nomeFantasia, cnpj, telefone,
            cep, uf, cidade, logradouro, numero
        )
        .then(function (resultado) {
            res.status(201).json(resultado);

        }).catch(function (erro) {
            console.log("Erro no cadastro:", erro.sqlMessage || erro.message);

            if (erro.code == "ER_DUP_ENTRY") {
                res.status(409).send("E-mail ou CNPJ ja cadastrado.");
            } else {
                res.status(500).send("Erro ao realizar cadastro.");
            }
        });
    }
}

module.exports = {
    autenticar,
    cadastrar
};

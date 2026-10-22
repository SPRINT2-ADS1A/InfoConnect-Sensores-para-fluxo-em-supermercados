
var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined || email == "") {
        res.status(400).send("Seu email nao foi informado!");
    } else if (senha == undefined || senha == "") {
        res.status(400).send("Sua senha nao foi informada!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
               function (resultadoAutenticar) {
                console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);

                if (resultadoAutenticar.length == 1) {
                    // Diferente da AquaTech: retorna o supermercado, nao aquarios.
                    // Nunca devolva a senha ao navegador.
                    res.json({
                        id: resultadoAutenticar[0].id,
                        email: resultadoAutenticar[0].email,
                        nome: resultadoAutenticar[0].nome,
                        supermercadoId: resultadoAutenticar[0].supermercadoId,
                        nomeFantasia: resultadoAutenticar[0].nomeFantasia
                    });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("Email e/ou senha invalido(s)");
                } else {
                    res.status(403).send("Mais de um usuario com o mesmo login!");
                }
            }).catch(function (erro) {
                console.log("Erro ao realizar login: ", erro.message);
                res.status(500).send("Erro ao realizar o login.");
            });
    }
}

function cadastrar(req, res) {
    // EXATAMENTE os nomes terminados em Server enviados pelo fetch do cadastro.html.
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo = req.body.cargoServer;
    var nomeFantasia = req.body.nomeFantasiaServer;
    var cnpj = req.body.cnpjServer;
    var responsavel = req.body.responsavelServer;
    var cpf = req.body.cpfServer;
    var telefone = req.body.telefoneServer;
    var uf = req.body.ufServer;
    var cidade = req.body.cidadeServer;
    var logradouro = req.body.logradouroServer;

    // Mantivemos os if/else do controller da AquaTech.
    if (nome == undefined || nome.trim() == "") {
        res.status(400).send("Seu nome nao foi informado!");
    } else if (email == undefined || email.trim() == "") {
        res.status(400).send("Seu email nao foi informado!");
    } else if (senha == undefined || senha.length < 8 || senha.length > 72) {
        res.status(400).send("A senha precisa ter entre 8 e 72 caracteres!");
    } else if (cargo == undefined || cargo.trim() == "") {
        res.status(400).send("Seu cargo nao foi informado!");
    } else if (nomeFantasia == undefined || nomeFantasia.trim() == "") {
        res.status(400).send("O supermercado nao foi informado!");
    } else if (cnpj == undefined || cnpj.replace(/\D/g, "").length != 14) {
        res.status(400).send("CNPJ invalido!");
    } else if (responsavel == undefined || responsavel.trim() == "") {
        res.status(400).send("Responsavel nao informado!");
    } else if (cpf == undefined || cpf.replace(/\D/g, "").length != 11) {
        res.status(400).send("CPF invalido!");
    } else if (telefone == undefined || telefone.trim() == "") {
        res.status(400).send("Telefone nao informado!");
    } else if (uf == undefined || uf.trim() == "") {
        res.status(400).send("Estado nao informado!");
    } else if (cidade == undefined || cidade.trim() == "") {
        res.status(400).send("Cidade nao informada!");
    } else if (logradouro == undefined || logradouro.trim() == "") {
        res.status(400).send("Logradouro nao informado!");
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        res.status(400).send("Email invalido!");
    } else if (nome.length > 45 || email.length > 45 || cargo.length > 45 ||
               nomeFantasia.length > 50 || responsavel.length > 45 ||
               telefone.length > 45 || uf.length > 45 || cidade.length > 45 ||
               logradouro.length > 45) {
        res.status(400).send("Um ou mais campos excedem o tamanho do banco!");
    } else {
        // O banco do grupo guarda CNPJ pontuado (CHAR(18)) e CPF sem pontuacao.
        cnpj = cnpj.replace(/\D/g, "").replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
        cpf = cpf.replace(/\D/g, "");

        // Mesma chamada ao model; apenas mais variaveis do cadastro do grupo.
        usuarioModel.cadastrar(nome, email, senha, cargo, nomeFantasia, cnpj, responsavel, cpf, telefone, uf, cidade, logradouro)
            .then(function (resultado) {
                res.status(201).json(resultado);
            }).catch(function (erro) {

                // ALTERAÇÃO: mostra o motivo real do erro no terminal.
                console.log("\nERRO NO CADASTRO:");
                console.log("Código:", erro.code);
                console.log("Mensagem:", erro.sqlMessage || erro.message);
                console.log(erro);

                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("CPF ou CNPJ ja cadastrado!");
                } else {
                    res.status(500).send("Erro ao realizar o cadastro.");
                }
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
};

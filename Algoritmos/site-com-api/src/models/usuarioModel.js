
var database = require("../database/config");

function autenticar(email, senha) {
    // Busca o cliente pelo email e senha.
    var instrucaoSql = `
        SELECT idCliente AS id, nome, email
        FROM cliente
        WHERE email = ? AND senha = ?;
    `;

    console.log("Consultando cliente para login.");
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha, cpf, nomeFantasia, cnpj,
                   telefone, cep, uf, cidade, logradouro, numero) {

    // Cadastra endereco, cliente e supermercado.
    return database.executarTransacao(async function (conexao) {

        var resultadoEndereco = await conexao.execute(`
            INSERT INTO endereco (uf, cidade, logradouro, numero, cep)
            VALUES (?, ?, ?, ?, ?);
        `, [uf, cidade, logradouro, numero, cep]);

        var idEndereco = resultadoEndereco[0].insertId;

        var resultadoCliente = await conexao.execute(`
            INSERT INTO cliente (nome, email, senha, cpf)
            VALUES (?, ?, ?, ?);
        `, [nome, email, senha, cpf]);

        var idCliente = resultadoCliente[0].insertId;

        var resultadoSupermercado = await conexao.execute(`
            INSERT INTO supermercado (
                nomeFantasia,
                cnpj,
                telefoneContato,
                fkCliente,
                fkEndereco
            )
            VALUES (?, ?, ?, ?, ?);
        `, [nomeFantasia, cnpj, telefone, idCliente, idEndereco]);

        return {
            id: idCliente,
            supermercadoId: resultadoSupermercado[0].insertId
        };
    });
}

module.exports = {
    autenticar,
    cadastrar
};

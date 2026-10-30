var database = require("../database/config");
var crypto = require("crypto"); // Bibliotaca nativa do Node; nao precisa instalar.

// A tabela Usuario tem senha VARCHAR(100). Este hash usa 97 caracteres.
function criarSenhaProtegida(senha) {
    var salt = crypto.randomBytes(16).toString("hex");
    var hash = crypto.scryptSync(senha, salt, 32).toString("hex");
    return salt + "$" + hash;
}

function conferirSenha(senha, senhaBanco) {
    var partes = String(senhaBanco).split("$");
    if (partes.length != 2 || !/^[0-9a-f]{32}$/.test(partes[0]) ||
        !/^[0-9a-f]{64}$/.test(partes[1])) return false;
    var calculado = crypto.scryptSync(senha, partes[0], 32);
    var esperado = Buffer.from(partes[1], "hex");
    return crypto.timingSafeEqual(calculado, esperado);
}

function autenticar(email, senha) {
    // Busca pelo email e verifica a senha sem colocar texto digitado dentro do SQL.
    var instrucaoSql = `
        SELECT u.idUsuario AS id, u.nome, u.email, u.senha,
               s.idSupermercado AS supermercadoId, s.nomeFantasia
        FROM Usuario u
        JOIN supermercado s ON s.idSupermercado = u.fkSupermercado
        WHERE u.email = ?
    `;
    console.log("Consultando usuario pelo email.");
    return database.executar(instrucaoSql, [email]).then(function (resultados) {
        // O controller da AquaTech espera um array de resultados.
        return resultados.filter(function (usuario) {
            return conferirSenha(senha, usuario.senha);
        });
    });
}

// O nome da funcao cadastrar foi preservado. Foram adicionados os campos do HTML.
function cadastrar(nome, email, senha, cargo, nomeFantasia, cnpj,
                   responsavel, cpf, telefone, uf, cidade, logradouro) {
    console.log("ACESSEI O USUARIO MODEL - cadastrando supermercado.");
    var senhaProtegida = criarSenhaProtegida(senha);

    // Cada novo supermercado exige cliente, endereco, supermercado e Usuario.
    // A transacao permite desfazer tudo se algum INSERT falhar.
    return database.executarTransacao(async function (conexao) {
        var resultadoCliente = await conexao.execute(`
            INSERT INTO cliente (nome, cpf, email, telefone)
            VALUES (?, ?, ?, ?)
        `, [responsavel, cpf, email, telefone]);
        var idCliente = resultadoCliente[0].insertId;

        var resultadoEndereco = await conexao.execute(`
            INSERT INTO endereco (estado, cidade, logradouro)
            VALUES (?, ?, ?)
        `, [uf, cidade, logradouro]);
        var idEndereco = resultadoEndereco[0].insertId;

        var resultadoSupermercado = await conexao.execute(`
            INSERT INTO supermercado (nomeFantasia, cnpj, fkCliente, fkEndereco)
            VALUES (?, ?, ?, ?)
        `, [nomeFantasia, cnpj, idCliente, idEndereco]);
        var idSupermercado = resultadoSupermercado[0].insertId;

        var resultadoUsuario = await conexao.execute(`
            INSERT INTO Usuario (nome, cargo, email, senha, fkSupermercado)
            VALUES (?, ?, ?, ?, ?)
        `, [nome, cargo, email, senhaProtegida, idSupermercado]);

        return { id: resultadoUsuario[0].insertId, supermercadoId: idSupermercado };
    });
}

module.exports = {
    autenticar,
    cadastrar
};

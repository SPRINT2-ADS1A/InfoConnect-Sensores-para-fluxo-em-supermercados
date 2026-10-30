var mysql = require("mysql2");

var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dateStrings: true // Mantem dataHora no horario do MySQL.
};

// Executa os SELECTs e INSERTs da aplicacao.
function executar(instrucao, valores) {
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.query(instrucao, valores || [], function (erro, resultados) {
            conexao.end();
            if (erro) {
                reject(erro);
            } else {
                resolve(resultados);
            }
        });
    });
}

// Mantida do projeto recebido para salvar os tres cadastros juntos.
// Se algum INSERT falhar, os anteriores sao desfeitos.
async function executarTransacao(operacao) {
    var conexao = mysql.createConnection(mySqlConfig).promise();
    try {
        await conexao.beginTransaction();
        var resultado = await operacao(conexao);
        await conexao.commit();
        return resultado;
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        await conexao.end();
    }
}

module.exports = { executar, executarTransacao };

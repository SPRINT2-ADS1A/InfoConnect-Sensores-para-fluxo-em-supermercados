var database = require("../database/config");

function buscarUltimasMedidas(idAquario, limite_linhas) {

    var instrucaoSql = `SELECT distanciaCm AS temperatura, dataHora AS momento,
                        DATE_FORMAT(dataHora,'%H:%i:%s') AS momento_grafico
                    FROM registro
                    WHERE fkSensor = ?
                    ORDER BY dataHora DESC LIMIT ?`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idAquario, Number(limite_linhas)]);
}

function buscarMedidasEmTempoReal(idAquario) {

    var instrucaoSql = `SELECT distanciaCm AS temperatura,
                        DATE_FORMAT(dataHora,'%H:%i:%s') AS momento_grafico,
                        fkSensor AS fk_aquario
                    FROM registro
                    WHERE fkSensor = ?
                    ORDER BY dataHora DESC LIMIT 1`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idAquario]);
}

// Os nomes sensores e senspres sao apelidos SQL. No arquivo do grupo,
// as tabelas se chamam sensor e registro, respectivamente.
function indicadores(idSupermercado, setor, periodo) {
    var filtroSetor = setor && setor != "Todos" ? " AND st.setor = ?" : "";
    var filtroPeriodo = periodo == "2026-09"
        ? " AND senspres.dataHora >= '2026-09-01' AND senspres.dataHora < '2026-10-01'" : "";
    var instrucaoSql = `
        SELECT
            (SELECT COUNT(*) FROM registro senspres
                JOIN sensor sensores ON sensores.idsensor = senspres.fkSensor
                JOIN setor st ON st.idSetor = sensores.fkSetor
                WHERE st.fkSupermercado = ? ${filtroSetor} ${filtroPeriodo}) AS leituras,
            (SELECT COUNT(*) FROM registro senspres
                JOIN sensor sensores ON sensores.idsensor = senspres.fkSensor
                JOIN setor st ON st.idSetor = sensores.fkSetor
                WHERE st.fkSupermercado = ? ${filtroSetor} ${filtroPeriodo}
                AND senspres.aproximacao = 1) AS leiturasAproximacao,
            (SELECT COUNT(*) FROM sensor sensores
                JOIN setor st ON st.idSetor = sensores.fkSetor
                WHERE st.fkSupermercado = ? ${filtroSetor}
                AND sensores.statuss = 'Ativo') AS sensoresAtivos
    `;
    var valores = [idSupermercado];
    if (filtroSetor) valores.push(setor);
    valores.push(idSupermercado);
    if (filtroSetor) valores.push(setor);
    valores.push(idSupermercado);
    if (filtroSetor) valores.push(setor);
    return database.executar(instrucaoSql, valores);
}

function grafico(idSupermercado, setor, periodo) {
    var filtroSetor = setor && setor != "Todos" ? " AND st.setor = ?" : "";
    var filtroPeriodo = periodo == "2026-09"
        ? " AND senspres.dataHora >= '2026-09-01' AND senspres.dataHora < '2026-10-01'" : "";
    var instrucaoSql = `
        SELECT senspres.distanciaCm, senspres.dataHora,
               DATE_FORMAT(senspres.dataHora, '%d/%m %H:%i:%s') AS momento_grafico
        FROM registro senspres
        JOIN sensor sensores ON sensores.idsensor = senspres.fkSensor
        JOIN setor st ON st.idSetor = sensores.fkSetor
        WHERE st.fkSupermercado = ? ${filtroSetor} ${filtroPeriodo}
        ORDER BY senspres.dataHora DESC, senspres.idmonitoramento DESC
        LIMIT 30
    `;
    var valores = [idSupermercado];
    if (filtroSetor) valores.push(setor);
    return database.executar(instrucaoSql, valores).then(function (resultado) {
        return resultado.reverse();
    });
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    indicadores,
    grafico
}

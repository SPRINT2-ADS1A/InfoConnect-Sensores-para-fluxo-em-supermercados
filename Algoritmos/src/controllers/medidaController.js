var medidaModel = require("../models/medidaModel");

function buscarUltimasMedidas(req, res) {

    const limite_linhas = 7;

    var idAquario = req.params.idAquario;

    console.log(`Recuperando as ultimas ${limite_linhas} medidas`);

    medidaModel.buscarUltimasMedidas(idAquario, limite_linhas).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


function buscarMedidasEmTempoReal(req, res) {

    var idAquario = req.params.idAquario;

    console.log(`Recuperando medidas em tempo real`);

    medidaModel.buscarMedidasEmTempoReal(idAquario).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function indicadores(req, res) {
    var idSupermercado = Number(req.params.idSupermercado);
    if (!Number.isInteger(idSupermercado) || idSupermercado < 1) {
        return res.status(400).send("Supermercado invalido!");
    }
    medidaModel.indicadores(idSupermercado, req.query.setor, req.query.periodo).then(function (resultados) {
        res.json(resultados[0]);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).send("Falha ao buscar indicadores.");
    });
}

function grafico(req, res) {
    var idSupermercado = Number(req.params.idSupermercado);
    if (!Number.isInteger(idSupermercado) || idSupermercado < 1) {
        return res.status(400).send("Supermercado invalido!");
    }
    medidaModel.grafico(idSupermercado, req.query.setor, req.query.periodo).then(function (resultados) {
        res.json(resultados);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).send("Falha ao buscar grafico.");
    });
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    indicadores,
    grafico

}
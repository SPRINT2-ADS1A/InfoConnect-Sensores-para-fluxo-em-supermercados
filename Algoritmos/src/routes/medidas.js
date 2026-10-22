var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/ultimas/:idAquario", function (req, res) {
    medidaController.buscarUltimasMedidas(req, res);
});

router.get("/tempo-real/:idAquario", function (req, res) {
    medidaController.buscarMedidasEmTempoReal(req, res);
})

// Indicadores do grupo 01, usando a tabela sensor e a tabela registro.
router.get("/indicadores/:idSupermercado", function (req, res) {
    medidaController.indicadores(req, res);
});

router.get("/grafico/:idSupermercado", function (req, res) {
    medidaController.grafico(req, res);
});

module.exports = router;
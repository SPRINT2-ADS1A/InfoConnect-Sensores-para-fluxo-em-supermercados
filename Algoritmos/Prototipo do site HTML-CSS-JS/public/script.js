// variavel global

let investimento = 0;



// funções para navegar entre as paginas

function irParaServicos() {

    window.location.href = "servicos.html";

}


function irParaSimulador() {

    window.location.href = "simulador.html";

}


function irParaSuporte() {

    window.location.href = "suporte.html";

}


function irParaSobre() {

    window.location.href = "sobre.html";

}


function irParaLogin() {

    window.location.href = "login.html";

}



// LOGIN



// mostra ou esconde a senha

function mostrarSenha() {

    let campoSenha = document.getElementById("input_senha");


    if (campoSenha.type == "password") {

        campoSenha.type = "text";

    } else {

        campoSenha.type = "password";

    }

}



// SUPORTE



// valida os campos do suporte

function enviarSuporte() {

    let nome = document.getElementById("ipt_nome_suporte").value;

    let email = document.getElementById("ipt_email_suporte").value;

    let assunto = document.getElementById("ipt_assunto").value;

    let mensagem = document.getElementById("ipt_mensagem").value;

    let resultado = document.getElementById("div_suporte");


    if (nome != '' && email != '' && assunto != '' && mensagem != '') {

        resultado.innerHTML = `
            <span style="color:green;">
                Mensagem enviada com sucesso.
            </span>
        `;

    } else {

        resultado.innerHTML = `
            <span style="color:red;">
                Preencha todos os campos.
            </span>
        `;

    }

}



// SIMULADOR



// limpa os resultados quando mudar os primeiros valores

function limpar() {

    investimento = 0;


    let implementacao = document.getElementById("div_implementacao");

    let roi = document.getElementById("div_roi");

    let lucro = document.getElementById("div_lucro");


    if (implementacao != null) {

        implementacao.innerHTML = '';

    }


    if (roi != null) {

        roi.innerHTML = '';

    }


    if (lucro != null) {

        lucro.innerHTML = '';

    }

}



// limpa o ROI

function limparRoi() {

    let roi = document.getElementById("div_roi");


    if (roi != null) {

        roi.innerHTML = '';

    }

}



// limpa o lucro

function limparLucro() {

    let lucro = document.getElementById("div_lucro");


    if (lucro != null) {

        lucro.innerHTML = '';

    }

}



// IMPLEMENTACAO



function calcularImplementacao() {


    investimento = 0;


    let campoCorredores = document.getElementById("ipt_corredores");

    let campoMetros = document.getElementById("ipt_metros");

    let resultado = document.getElementById("div_implementacao");


    let corredores = Number(campoCorredores.value);

    let metros = Number(campoMetros.value);

    let precoSensor = 150;

    let instalacaoSensor = 50;


    if (campoCorredores.value != '' &&
        campoMetros.value != '' &&
        corredores > 0 &&
        corredores % 1 == 0 &&
        metros > 0) {


        let sensoresPorCorredor = metros / 4;


        if (sensoresPorCorredor % 1 > 0) {

            sensoresPorCorredor = sensoresPorCorredor - sensoresPorCorredor % 1 + 1;

        }


        let totalSensores = corredores * sensoresPorCorredor;

        let equipamentos = totalSensores * precoSensor;

        let instalacao = totalSensores * instalacaoSensor;

        investimento = equipamentos + instalacao;


        resultado.innerHTML = `
            <div class="resultado_destaque">

                Investimento inicial estimado

                <span class="resultado_valor">
                    R$ ${investimento.toFixed(2)}
                </span>

                ${corredores} corredor(es) de ${metros} m · ${totalSensores} sensores no total.

            </div>


            <div class="resultado_lista">

                <div class="resultado_caixa">

                    Sensores por corredor

                    <b>
                        ${sensoresPorCorredor}
                    </b>

                </div>


                <div class="resultado_caixa">

                    Equipamentos

                    <b>
                        R$ ${equipamentos.toFixed(2)}
                    </b>

                </div>


                <div class="resultado_caixa">

                    Instalação

                    <b>
                        R$ ${instalacao.toFixed(2)}
                    </b>

                </div>

            </div>


            <p class="texto_apoio">

                ${metros} m ÷ 4, arredondado para cima = ${sensoresPorCorredor} sensor(es) por corredor.

                <br>

                ${totalSensores} conjuntos × R$ ${precoSensor.toFixed(2)} + ${totalSensores} instalações × R$ ${instalacaoSensor.toFixed(2)}.

            </p>
        `;

    } else {

        resultado.innerHTML = `
            <p class="erro">

                Informe uma quantidade inteira de corredores maior que zero e um comprimento maior que zero em metros.

            </p>
        `;

    }

}



// ROI



function calcularRoi() {

    calcularImplementacao();


    let campoMeses = document.getElementById("ipt_meses_roi");

    let resultado = document.getElementById("div_roi");


    let meses = Number(campoMeses.value);

    let taxaMensal = 10;


    if (investimento > 0) {


        if (campoMeses.value != '' && meses > 0 && meses % 1 == 0) {


            let ganhoMensal = investimento * taxaMensal / 100;

            let ganhoTotal = ganhoMensal * meses;

            let saldo = ganhoTotal - investimento;

            let roi = saldo / investimento * 100;

            let recuperacao = ganhoTotal / investimento * 100;

            let barra = recuperacao;


            if (barra > 100) {

                barra = 100;

            }


            let titulo = 'Investimento coberto no cenário';

            let mensagem = `Após recuperar R$ ${investimento.toFixed(2)}, sobrariam R$ ${saldo.toFixed(2)} antes das demais despesas.`;


            if (saldo < 0) {

                titulo = 'Ainda falta recuperar parte do investimento';

                mensagem = `Faltariam R$ ${(0 - saldo).toFixed(2)} para cobrir a implementação.`;

            } else if (saldo == 0) {

                titulo = 'Ponto de equilíbrio do cenário';

                mensagem = `O ganho acumulado cobriria exatamente a implementação.`;

            }


            resultado.innerHTML = `
                <div class="resultado_destaque">

                    ROI ilustrativo em ${meses} meses

                    <span class="resultado_valor">
                        ${roi.toFixed(2)}%
                    </span>

                    <h3>
                        ${titulo}
                    </h3>

                    <p>
                        ${mensagem}
                    </p>

                </div>


                <div class="resultado_lista">

                    <div class="resultado_caixa">

                        Investimento inicial

                        <b>
                            R$ ${investimento.toFixed(2)}
                        </b>

                    </div>


                    <div class="resultado_caixa">

                        Ganho acumulado

                        <b>
                            R$ ${ganhoTotal.toFixed(2)}
                        </b>

                    </div>


                    <div class="resultado_caixa">

                        Saldo

                        <b>
                            R$ ${saldo.toFixed(2)}
                        </b>

                    </div>

                </div>


                <h3>
                    Recuperação do investimento inicial
                </h3>


                <div class="barra_roi">

                    <div class="barra_roi_dentro" style="width:${barra}%">

                    </div>

                </div>


                <p class="texto_apoio">

                    O ganho acumulado equivale a

                    <b>
                        ${recuperacao.toFixed(2)}%
                    </b>

                    do investimento inicial.

                </p>
            `;


        } else {

            resultado.innerHTML = `
                <p class="erro">

                    Informe um período inteiro maior que zero.

                </p>
            `;

        }


    } else {

        resultado.innerHTML = `
            <p class="erro">

                Preencha primeiro os dados da implementação.

            </p>
        `;

    }

}



// PRODUTO



function calcularLucro() {

    calcularImplementacao();


    let campoPreco = document.getElementById("ipt_preco");

    let campoCusto = document.getElementById("ipt_custo");

    let campoQuantidade = document.getElementById("ipt_quantidade");

    let resultado = document.getElementById("div_lucro");


    let preco = Number(campoPreco.value);

    let custo = Number(campoCusto.value);

    let quantidade = Number(campoQuantidade.value);


    if (campoPreco.value != '' &&
        campoCusto.value != '' &&
        campoQuantidade.value != '' &&
        preco > 0 &&
        custo >= 0 &&
        quantidade >= 0 &&
        quantidade % 1 == 0) {


        let lucroUnidade = preco - custo;

        let lucroAtual = lucroUnidade * quantidade;


        resultado.innerHTML = `
            <div class="resultado_lista">

                <div class="resultado_caixa">

                    Lucro por unidade

                    <b>
                        R$ ${lucroUnidade.toFixed(2)}
                    </b>

                </div>


                <div class="resultado_caixa">

                    Lucro no mês

                    <b>
                        R$ ${lucroAtual.toFixed(2)}
                    </b>

                </div>

            </div>
        `;


        if (lucroUnidade > 0) {


            let unidadesExtras = 30;

            let ganhoExtra = lucroUnidade * unidadesExtras;

            let lucroCenario = lucroAtual + ganhoExtra;

            let ganhoAnual = ganhoExtra * 12;


            resultado.innerHTML = `
                <div class="resultado_destaque">

                    <h3>

                        Uma venda a mais por dia

                    </h3>


                    <span class="resultado_valor">

                        + R$ ${ganhoAnual.toFixed(2)}

                    </span>


                    de lucro bruto adicional em 12 meses.


                    <p>

                        <b>

                            + R$ ${ganhoExtra.toFixed(2)} a cada 30 dias

                        </b>

                    </p>

                </div>
            ` + resultado.innerHTML;


            resultado.innerHTML += `
                <p class="texto_apoio">

                    Com as 30 vendas extras, o lucro mensal passaria de

                    <b>
                        R$ ${lucroAtual.toFixed(2)}
                    </b>

                    para

                    <b>
                        R$ ${lucroCenario.toFixed(2)}
                    </b>.

                </p>
            `;


            if (investimento > 0) {


                let unidadesNecessarias = investimento / lucroUnidade;


                if (unidadesNecessarias % 1 > 0) {

                    unidadesNecessarias = unidadesNecessarias - unidadesNecessarias % 1 + 1;

                }


                resultado.innerHTML += `
                    <div class="valores_simulacao">

                        <h3>

                            Investimento

                        </h3>


                        <p class="texto_apoio">

                            Seriam necessárias aproximadamente

                            <b>
                                ${unidadesNecessarias} unidades extras
                            </b>

                            para gerar um lucro bruto equivalente ao investimento de

                            <b>
                                R$ ${investimento.toFixed(2)}
                            </b>.

                        </p>

                    </div>
                `;

            }


        } else {

            resultado.innerHTML += `
                <p class="erro">

                    O preço de venda precisa ser maior que o custo do produto.

                </p>
            `;

        }


    } else {

        resultado.innerHTML = `
            <p class="erro">

                Preencha corretamente os dados do produto.

            </p>
        `;

    }

}
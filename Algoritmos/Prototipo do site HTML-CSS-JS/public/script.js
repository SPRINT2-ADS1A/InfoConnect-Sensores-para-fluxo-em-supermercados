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



// função para validar o login

function login() {

    let email = input_email.value;

    let senhaDigitada = input_senha.value;


    if (email != '' && senhaDigitada != '') {

        div_login_bianca.innerHTML = `<span style="color:green;">Login realizado com sucesso.</span>`;

    } else {

        div_login_bianca.innerHTML = `<span style="color:red;">Preencha o e-mail e a senha.</span>`;

    }

}



// RECUPERAR SENHA



// mostra a parte para recuperar a senha

function senha() {

    div_recuperacao_bianca.style.display = "block";

}



// valida o email para recuperar a senha

function recuperarSenha() {

    let email = input_email_recuperar.value;


    if (email != '') {

        div_resultado_recuperacao.innerHTML = `<span style="color:green;">Instruções enviadas para ${email}.</span>`;

    } else {

        div_resultado_recuperacao.innerHTML = `<span style="color:red;">Informe seu e-mail.</span>`;

    }

}



// CADASTRO



// função para mostrar ou esconder as senhas

function mostrarSenhaCadastro() {

    if (ipt_senha.type == "password") {

        ipt_senha.type = "text";

        ipt_confirmar_senha.type = "text";

    } else {

        ipt_senha.type = "password";

        ipt_confirmar_senha.type = "password";

    }

}



// função para validar o cadastro

function cadastrar() {

    let nome = ipt_nome.value;

    let empresa = ipt_empresa.value;

    let email = ipt_email.value;

    let senha = ipt_senha.value;

    let confirmarSenha = ipt_confirmar_senha.value;


    if (nome != '' && empresa != '' && email != '' && senha != '' && confirmarSenha != '') {


        if (senha == confirmarSenha) {

            div_cadastro.innerHTML = `<span style="color:green;">Cadastro realizado com sucesso.</span>`;

        } else {

            div_cadastro.innerHTML = `<span style="color:red;">As senhas estão diferentes.</span>`;

        }


    } else {

        div_cadastro.innerHTML = `<span style="color:red;">Preencha todos os campos.</span>`;

    }

}



// SUPORTE



// função para validar os campos do suporte

function enviarSuporte() {

    let nome = ipt_nome_suporte.value;

    let email = ipt_email_suporte.value;

    let assunto = ipt_assunto.value;

    let mensagem = ipt_mensagem.value;


    if (nome != '' && email != '' && assunto != '' && mensagem != '') {

        div_suporte.innerHTML = `<span style="color:green;">Mensagem enviada com sucesso.</span>`;

    } else {

        div_suporte.innerHTML = `<span style="color:red;">Preencha todos os campos.</span>`;

    }

}



// SIMULADOR



// função para limpar a pagina quando o usuario inserir novas informações

function limpar() {

    investimento = 0;

    div_roi.innerHTML = '';

    div_implementacao.innerHTML = '';

    div_lucro.innerHTML = '';

}



// limpa apenas o resultado do ROI

function limparRoi() {

    div_roi.innerHTML = '';

}



// limpa apenas o resultado do lucro

function limparLucro() {

    div_lucro.innerHTML = '';

}



// IMPLEMENTAÇÃO



function calcularImplementacao() {


    // declara o investimento para 0, para resetar a conta

    investimento = 0;


    // declara as variaveis e os preços fixos

    let corredores = Number(ipt_corredores.value);

    let metros = Number(ipt_metros.value);

    let precoSensor = 150;

    let instalacaoSensor = 50;


    // SE os valores estiverem validos, roda o codigo

    if (ipt_corredores.value != '' && ipt_metros.value != '' && corredores > 0 && corredores % 1 == 0 && metros > 0) {


        // calcula a quantidade de sensores por corredor

        let sensoresPorCorredor = metros / 4;


        if (sensoresPorCorredor % 1 > 0) {

            sensoresPorCorredor = sensoresPorCorredor - sensoresPorCorredor % 1 + 1;

        } // arruma numeros quebrados


        // faz as contas dos sensores, equipamentos e instalação

        let totalSensores = corredores * sensoresPorCorredor;

        let equipamentos = totalSensores * precoSensor;

        let instalacao = totalSensores * instalacaoSensor;

        investimento = equipamentos + instalacao;



        // mostra os resultados

        div_implementacao.innerHTML = `<div class="resultado_destaque">
                Investimento inicial estimado

                <span class="resultado_valor">R$ ${investimento.toFixed(2)}</span>

                ${corredores} corredor(es) de ${metros} m · ${totalSensores} sensores no total.
            </div>

            <div class="resultado_lista">

                <div class="resultado_caixa">
                    Sensores por corredor
                    <b>${sensoresPorCorredor}</b>
                </div>

                <div class="resultado_caixa">
                    Equipamentos
                    <b>R$ ${equipamentos.toFixed(2)}</b>
                </div>

                <div class="resultado_caixa">
                    Instalação
                    <b>R$ ${instalacao.toFixed(2)}</b>
                </div>

            </div>

            <p class="texto_apoio">
                ${metros} m ÷ 4, arredondado para cima = ${sensoresPorCorredor} sensor(es) por corredor.<br>
                ${totalSensores} conjuntos × R$ ${precoSensor.toFixed(2)} + ${totalSensores} instalações × R$ ${instalacaoSensor.toFixed(2)}.
            </p>`;

    } else {

        div_implementacao.innerHTML = `<p class="erro">Informe uma quantidade inteira de corredores maior que zero e um comprimento maior que zero em metros.</p>`;

    }

}



// ROI



function calcularRoi() {

    calcularImplementacao();


    let meses = Number(ipt_meses_roi.value);

    let taxaMensal = 10;


    if (investimento > 0) {


        if (ipt_meses_roi.value != '' && meses > 0 && meses % 1 == 0) {


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

                mensagem = `O ganho acumulado cobriria exatamente a implementação. Ainda não haveria excedente.`;

            }


            div_roi.innerHTML = `<div class="resultado_destaque">

                    ROI ilustrativo em ${meses} meses

                    <span class="resultado_valor">${roi.toFixed(2)}%</span>

                    <h3>${titulo}</h3>

                    <p>${mensagem}</p>

                </div>


                <div class="resultado_lista">

                    <div class="resultado_caixa">
                        Investimento inicial
                        <b>R$ ${investimento.toFixed(2)}</b>
                    </div>

                    <div class="resultado_caixa">
                        Ganho hipotético acumulado
                        <b>R$ ${ganhoTotal.toFixed(2)}</b>
                    </div>

                    <div class="resultado_caixa">
                        Saldo depois da implementação
                        <b>R$ ${saldo.toFixed(2)}</b>
                    </div>

                </div>


                <h3>Recuperação do investimento inicial</h3>


                <div class="barra_roi">

                    <div class="barra_roi_dentro" style="width:${barra}%;"></div>

                </div>


                <p class="texto_apoio">
                    O ganho acumulado equivale a <b>${recuperacao.toFixed(2)}%</b> do custo inicial.
                    Recuperar 100% do custo significa <b>ROI de 0%</b>.
                </p>


                <div class="valores_simulacao">

                    <h3>Entenda a conta</h3>

                    <p class="texto_apoio">
                        Ganho mensal hipotético:
                        R$ ${investimento.toFixed(2)} × ${taxaMensal}% =
                        <b>R$ ${ganhoMensal.toFixed(2)}</b>.
                    </p>

                    <p class="texto_apoio">
                        Ganho em ${meses} meses:
                        R$ ${ganhoMensal.toFixed(2)} × ${meses} =
                        <b>R$ ${ganhoTotal.toFixed(2)}</b>.
                    </p>

                    <p class="texto_apoio">
                        ROI:
                        (R$ ${ganhoTotal.toFixed(2)} − R$ ${investimento.toFixed(2)})
                        ÷ R$ ${investimento.toFixed(2)} × 100 =
                        <b>${roi.toFixed(2)}%</b>.
                    </p>

                </div>`;

        } else {

            div_roi.innerHTML = `<p class="erro">Informe um período inteiro maior que zero.</p>`;

        }


    } else {

        div_roi.innerHTML = `<p class="erro">Preencha a quantidade e o comprimento dos corredores no módulo de implementação.</p>`;

    }

}



// PRODUTO



function calcularLucro() {

    calcularImplementacao();


    let preco = Number(ipt_preco.value);

    let custo = Number(ipt_custo.value);

    let quantidade = Number(ipt_quantidade.value);


    if (ipt_preco.value != '' && ipt_custo.value != '' && ipt_quantidade.value != '' && preco > 0 && custo >= 0 && quantidade >= 0 && quantidade % 1 == 0) {


        let lucroUnidade = preco - custo;

        let lucroAtual = lucroUnidade * quantidade;


        div_lucro.innerHTML = `<div class="resultado_lista">

                <div class="resultado_caixa">
                    Lucro bruto simplificado por unidade
                    <b>R$ ${lucroUnidade.toFixed(2)}</b>
                </div>

                <div class="resultado_caixa">
                    Lucro bruto simplificado no mês informado
                    <b>R$ ${lucroAtual.toFixed(2)}</b>
                </div>

            </div>`;



        if (lucroUnidade > 0) {


            let unidadesExtras = 30;

            let ganhoExtra = lucroUnidade * unidadesExtras;

            let lucroCenario = lucroAtual + ganhoExtra;

            let ganhoAnual = ganhoExtra * 12;


            div_lucro.innerHTML = `<div class="resultado_destaque">

                    <h3>Uma venda a mais por dia. Veja o acumulado em 12 meses.</h3>

                    <span class="resultado_valor">+ R$ ${ganhoAnual.toFixed(2)}</span>

                    de lucro bruto adicional no cenário de 12 meses.

                    <p>
                        <b>+ R$ ${ganhoExtra.toFixed(2)} a cada 30 dias</b>
                    </p>

                    <p class="texto_apoio">
                        Hipótese: 1 unidade extra por dia, em 12 meses de 30 dias,
                        com o mesmo preço e custo. Antes da implementação,
                        impostos e demais despesas. Não é uma promessa de resultado.
                    </p>

                </div>` + div_lucro.innerHTML;


            div_lucro.innerHTML += `<p class="texto_apoio">
                    Com as 30 vendas extras, o lucro bruto simplificado mensal
                    passaria de <b>R$ ${lucroAtual.toFixed(2)}</b>
                    para <b>R$ ${lucroCenario.toFixed(2)}</b>.
                </p>`;


            if (investimento > 0) {


                let unidadesNecessarias = investimento / lucroUnidade;


                if (unidadesNecessarias % 1 > 0) {

                    unidadesNecessarias = unidadesNecessarias - unidadesNecessarias % 1 + 1;

                }


                div_lucro.innerHTML += `<div class="valores_simulacao">

                        <h3>Colocando o investimento em perspectiva</h3>

                        <p class="texto_apoio">
                            <b>${unidadesNecessarias} unidades extras</b>
                            desse produto gerariam um lucro bruto simplificado
                            equivalente aos <b>R$ ${investimento.toFixed(2)}</b>
                            da implementação.
                        </p>

                        <p class="texto_apoio">
                            Essa equivalência não é prazo de retorno nem lucro líquido:
                            impostos, taxas, despesas adicionais e possíveis mensalidades
                            aumentam o valor necessário.
                        </p>

                    </div>`;

            } else {

                div_lucro.innerHTML += `<p class="texto_apoio">Complete o módulo de implementação para comparar o investimento com o lucro por unidade.</p>`;

            }


        } else {

            div_lucro.innerHTML += `<p class="erro">O preço de venda não supera o custo de compra. Vender mais nessas condições não gera lucro bruto adicional positivo.</p>`;

        }


    } else {

        div_lucro.innerHTML = `<p class="erro">Informe preço de venda positivo, custo não negativo e quantidade mensal inteira igual ou maior que zero. Use valores da mesma unidade do produto.</p>`;

    }

}
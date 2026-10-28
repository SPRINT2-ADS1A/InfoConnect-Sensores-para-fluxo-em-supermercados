// Mesma base demonstrativa do arquivo original, agora com valores da semana anterior.
const dados = {
    semana:[1000,1100,1200,1300,1400,1500,1500],
    anterior:[900,1000,1100,1200,1250,1250,1300],
    dias:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
    faixas:['08h – 12h','12h – 16h','16h – 20h'],
    horarios:[2700,3600,2700], horariosAntes:[2400,2800,2800],
    referenciaDiaria:1200, referenciaFaixa:3000,
    referenciaProlongada:45, referenciaMedia:35,
    pontos:[
        {id:'A',nome:'Bebidas',aproximacoes:1796,antes:1600,prolongada:49,media:42,taxaAntes:46,mediaAntes:40,referenciaDia:250},
        {id:'B',nome:'Mercearia',aproximacoes:1386,antes:1260,prolongada:46.9,media:39,taxaAntes:44,mediaAntes:37,referenciaDia:200},
        {id:'C',nome:'Limpeza',aproximacoes:1053,antes:1170,prolongada:42.7,media:35,taxaAntes:44,mediaAntes:34,referenciaDia:160},
        {id:'D',nome:'Hortifruti',aproximacoes:725,antes:800,prolongada:34.5,media:31,taxaAntes:36,mediaAntes:30,referenciaDia:110}
    ]
};
let grafico1, grafico2;
let modelo1, modelo2;
const numero = (n,casas=0) => n.toLocaleString('pt-BR',{minimumFractionDigits:casas,maximumFractionDigits:casas});
const soma = valores => valores.reduce((s,v)=>s+v,0);
const texto = valor => String(valor).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function distribuir(total,pesos) {
    let acumulado=0,anterior=0;
    return pesos.map(peso=>{
        acumulado+=peso;
        const atual=Math.round(total*acumulado/soma(pesos));
        const valor=atual-anterior;
        anterior=atual;
        return valor;
    });
}
function variacao(atual,anterior,maiorMelhor=true) {
    if(anterior===0) return {classe:'neutra',frase:atual===0?'— Sem alteração (0 nas duas semanas)':'Sem base para comparação percentual'};
    const valor=(atual-anterior)/anterior*100;
    if(Math.abs(valor)<0.05) return {classe:'neutra',frase:'— 0% vs. semana anterior'};
    const boa=maiorMelhor ? valor>0 : valor<0;
    return {classe:boa?'positiva':'negativa',frase:`${valor>0?'▲':'▼'} ${numero(Math.abs(valor),1)}% vs. semana anterior`};
}
function mostrarVariacao(id,atual,anterior,maiorMelhor=true) {
    const resultado=variacao(atual,anterior,maiorMelhor);
    const elemento=document.getElementById(id);
    elemento.textContent=resultado.frase;
    elemento.className='destaque '+resultado.classe;
}
function recorte() {
    const id=document.getElementById('setor').value;
    const ponto=dados.pontos.find(p=>p.id===id);
    if(!ponto) return {...dados,pontos:dados.pontos,total:soma(dados.semana),totalAntes:soma(dados.anterior),geral:true};
    return {...dados,
        semana:distribuir(ponto.aproximacoes,dados.semana),
        anterior:distribuir(ponto.antes,dados.anterior),
        horarios:distribuir(ponto.aproximacoes,dados.horarios),
        horariosAntes:distribuir(ponto.antes,dados.horariosAntes),
        referenciaDiaria:ponto.referenciaDia,
        referenciaFaixa:Math.round(ponto.referenciaDia*7/3),
        pontos:[ponto],total:ponto.aproximacoes,totalAntes:ponto.antes,geral:false
    };
}
function barra(valor,maximo,referencia,descricao) {
    return `<div class="barra" role="meter" aria-label="${texto(descricao)}" aria-valuenow="${valor}" aria-valuemin="0" aria-valuemax="${maximo}"><span class="preenchimento ${valor>=referencia?'boa':'atencao'}" style="width:${Math.min(valor/maximo*100,100)}%"></span><span class="marcador" style="left:${referencia/maximo*100}%" title="Referência: ${referencia}"></span></div>`;
}
function desenharPontos(d) {
    document.getElementById('pontos').innerHTML=d.pontos.map(p=>{
        const falhas=Number(p.prolongada<dados.referenciaProlongada)+Number(p.media<dados.referenciaMedia);
        const status=falhas===0?'Acima das referências':falhas===1?'Ponto de atenção':'Abaixo das referências';
        const comp=variacao(p.aproximacoes,p.antes);
        return `<article class="ponto ${d.pontos.length===1?'ponto-unico':''}"><h3>Ponto ${p.id} · ${p.nome}</h3><span class="status ${falhas===0?'boa':falhas===1?'atencao':'ruim'}">${status}</span><div class="metrica"><span>Permanências ≥ 3 s</span><b>${numero(p.prolongada,1)}%</b></div>${barra(p.prolongada,60,45,'Percentual de permanências de pelo menos 3 segundos')}<div class="metrica"><span>Permanência média</span><b>${p.media} s</b></div>${barra(p.media,60,35,'Permanência média em segundos')}<p class="comparacao ${comp.classe}">Aproximações: <b>${comp.frase}</b></p></article>`;
    }).join('');
}

function atualizar() {
    const d=recorte();
    const pico=d.horarios.indexOf(Math.max(...d.horarios));
    const diasAbaixo=d.semana.filter(v=>v<d.referenciaDiaria).length;
    const diasAntes=d.anterior.filter(v=>v<d.referenciaDiaria).length;
    const pontosAbaixo=d.pontos.filter(p=>p.prolongada<45||p.media<35);
    const pontosAntes=d.pontos.filter(p=>p.taxaAntes<45||p.mediaAntes<35).length;
    document.getElementById('contexto').textContent=d.geral?'Entenda as aproximações e identifique oportunidades de análise.':`Ponto ${d.pontos[0].id} · ${d.pontos[0].nome} — comparação com a semana anterior.`;
    document.getElementById('kpi-total').textContent=numero(d.total);
    mostrarVariacao('kpi-variacao',d.total,d.totalAntes);
    const meta=d.referenciaDiaria*7;
    document.getElementById('meta-total').innerHTML=`Meta: ${numero(meta)} · <b class="${d.total>=meta?'positiva':'negativa'}">${d.total>=meta?'atingida':'abaixo da meta'}</b>`;
    document.getElementById('kpi-pico').textContent=d.faixas[pico].replace(' – ',' às ');
    mostrarVariacao('kpi-pico-comparacao',d.horarios[pico],d.horariosAntes[pico]);
    document.getElementById('kpi-pico-detalhe').textContent=`${numero(d.horarios[pico])} aproximações (${numero(d.horarios[pico]/d.total*100)}%). Comparação da mesma faixa.`;
    document.getElementById('kpi-dias').textContent=`${diasAbaixo} de 7 dias`;
    mostrarVariacao('kpi-dias-comparacao',diasAbaixo,diasAntes,false);
    document.getElementById('kpi-dias-detalhe').innerHTML=`Referência: ${numero(d.referenciaDiaria)}/dia · <b class="${diasAbaixo?'negativa':'positiva'}">${diasAbaixo?'investigar quedas':'referência atingida'}</b>`;
    document.getElementById('kpi-pontos').textContent=`${pontosAbaixo.length} de ${d.pontos.length}`;
    mostrarVariacao('kpi-pontos-comparacao',pontosAbaixo.length,pontosAntes,false);
    document.getElementById('kpi-pontos-detalhe').textContent=pontosAbaixo.length?pontosAbaixo.map(p=>`Ponto ${p.id} · ${p.nome}`).join(' e '):'Todos os pontos dentro das referências.';
    desenharPontos(d);
    prepararPrincipal(d);
    prepararPizza(d);
    desenharSVGPrincipal(modelo1);
    desenharSVGPizza(modelo2);
    iniciarGraficos();
}

function prepararPrincipal(d) {
    modelo1={labels:d.dias,valores:d.semana,alvo:d.referenciaDiaria,unidade:'aproximações'};
    const titulo='Como o movimento variou na semana?';
    document.getElementById('titulo-principal').textContent=titulo;
    document.getElementById('descricao-principal').textContent='Quantas aproximações foram registradas por dia da semana?';
    document.getElementById('ajuda-principal').textContent='A linha pontilhada mostra a referência diária. Compare as barras para identificar dias de menor movimento e planejar a reposição.';
    document.getElementById('legenda-principal').innerHTML=`<span></span>Referência gerencial: ${numero(d.referenciaDiaria)} aproximações/dia`;
    document.getElementById('insight-principal').textContent='Avaliar reposição nos dias de maior movimento.';
    document.getElementById('myChart1').setAttribute('aria-label',titulo+'. '+d.dias.map((dia,i)=>`${dia}: ${numero(d.semana[i])}`).join('; '));
}
function prepararPizza(d) {
    modelo2={labels:d.faixas,valores:d.horarios,cores:['#0086ff','#318b2f','#88c9ff']};
    const pico=d.horarios.indexOf(Math.max(...d.horarios));
    document.getElementById('titulo-pizza').textContent='Quando as aproximações se concentram?';
    document.getElementById('descricao-pizza').textContent='Em quais faixas de horário ocorrem mais aproximações?';
    document.getElementById('ajuda-pizza').textContent='Cada fatia mostra a participação de uma faixa de horário no total semanal. Use o maior movimento para planejar reposição e promoções.';
    document.getElementById('referencia-pizza').textContent=`Referência de atenção: ${numero(d.referenciaFaixa)} aproximações/faixa.`;
    const situacao=document.getElementById('situacao-pizza');
    situacao.textContent=`${d.faixas[pico]}: ${d.horarios[pico]>=d.referenciaFaixa?'acima da referência':'abaixo da referência'}.`;
    situacao.className=d.horarios[pico]>=d.referenciaFaixa?'positiva':'negativa';
    document.getElementById('insight-pizza').textContent=`Entre ${d.faixas[pico]}, avaliar o planejamento da reposição.`;
    document.getElementById('legenda-pizza').innerHTML=d.faixas.map((f,i)=>`<li><span class="bolinha" style="background:${modelo2.cores[i]}"></span><b>${f}</b><span>${numero(d.horarios[i])} aproximações (${numero(d.horarios[i]/d.total*100)}%)</span></li>`).join('');
    document.getElementById('myChart2').setAttribute('aria-label',d.faixas.map((f,i)=>`${f}: ${numero(d.horarios[i])} aproximações`).join('; '));
}

// Mantidos os SVG de apoio do original: os dados aparecem mesmo sem internet.
function maximoEixo(m) {
    const maior=Math.max(m.alvo,...m.valores)*1.06;
    const passo=maior>2000?500:maior>800?200:maior>200?50:20;
    return Math.ceil(maior/passo)*passo;
}
function desenharSVGPrincipal(m) {
    const max=maximoEixo(m);
    const y=v=>196-v/max*165;
    const espaco=630/m.valores.length;
    const x=i=>60+espaco*(i+.5);
    let desenho='';
    for(let i=0;i<=4;i++) {
        const v=max*i/4;
        desenho+=`<line x1="48" x2="695" y1="${y(v)}" y2="${y(v)}" stroke="#edf0f5"/><text x="38" y="${y(v)+4}" text-anchor="end">${numero(v)}</text>`;
    }
    m.valores.forEach((v,i)=>{
        const largura=espaco*.55;
        desenho+=`<rect x="${x(i)-largura/2}" y="${y(v)}" width="${largura}" height="${196-y(v)}" fill="#0086ff"><title>${texto(m.labels[i])}: ${numero(v)} aproximações</title></rect><text x="${x(i)}" y="${y(v)-9}" fill="#0086ff" text-anchor="middle" font-weight="bold">${numero(v)}</text><text x="${x(i)}" y="218" text-anchor="middle">${texto(m.labels[i])}</text>`;
    });
    desenho+=`<line x1="48" x2="695" y1="${y(m.alvo)}" y2="${y(m.alvo)}" stroke="#d98000" stroke-width="2" stroke-dasharray="7 4"/>`;
    document.getElementById('fallback-semana').innerHTML=`<svg viewBox="0 0 710 230" role="img" aria-label="${texto(m.labels.map((l,i)=>l+': '+numero(m.valores[i])).join('; '))}"><g font-family="Arial,sans-serif" font-size="12" fill="#6377ae">${desenho}</g></svg>`;
}
function desenharSVGPizza(m) {
    let angulo=-Math.PI/2,desenho='';
    const total=soma(m.valores);
    m.valores.forEach((n,i)=>{
        const a=angulo,b=a+n/total*Math.PI*2,meio=(a+b)/2;
        desenho+=`<path d="M120,120 L${120+110*Math.cos(a)},${120+110*Math.sin(a)} A110,110 0 ${b-a>Math.PI?1:0},1 ${120+110*Math.cos(b)},${120+110*Math.sin(b)} Z" fill="${m.cores[i]}" stroke="white"><title>${m.labels[i]}: ${numero(n)}</title></path><text x="${120+66*Math.cos(meio)}" y="${125+66*Math.sin(meio)}" fill="${i===2?'#071957':'white'}" font-size="16" font-weight="bold" text-anchor="middle">${numero(n/total*100)}%</text>`;
        angulo=b;
    });
    document.getElementById('fallback-pizza').innerHTML=`<svg viewBox="0 0 240 240" role="img" aria-label="${texto(m.labels.map((l,i)=>l+': '+numero(m.valores[i])).join('; '))}">${desenho}</svg>`;
}

// Chart.js: dois gráficos fixos; apenas linha de referência e valores.
function iniciarGraficos() {
    if(typeof Chart==='undefined'||!modelo1) return;
    if(grafico1) grafico1.destroy();
    if(grafico2) grafico2.destroy();
    const m=modelo1, p=modelo2;
    Chart.defaults.font.family='Arial, sans-serif';
    Chart.defaults.color='#6377ae';
    const referencias={id:'referencias',afterDatasetsDraw(chart){
        const {ctx,chartArea,scales}=chart;
        const y=scales.y.getPixelForValue(m.alvo);
        ctx.save();ctx.strokeStyle='#d98000';ctx.lineWidth=2;ctx.setLineDash([7,4]);ctx.beginPath();
        ctx.moveTo(chartArea.left,y);ctx.lineTo(chartArea.right,y);ctx.stroke();
        ctx.setLineDash([]);ctx.font='bold 11px Arial';ctx.fillStyle='#0086ff';ctx.textAlign='center';
        chart.getDatasetMeta(0).data.forEach((el,i)=>ctx.fillText(numero(m.valores[i]),el.x,el.y-10));
        ctx.restore();
    }};
    const rotulosPizza={id:'rotulosPizza',afterDatasetsDraw(chart){const {ctx}=chart;ctx.save();ctx.font='bold 12px Arial';ctx.textAlign='center';chart.getDatasetMeta(0).data.forEach((el,i)=>{const pos=el.tooltipPosition();ctx.fillStyle=i===2?'#071957':'white';ctx.fillText(numero(p.valores[i]/soma(p.valores)*100)+'%',pos.x,pos.y+4);});ctx.restore();}};
    document.querySelectorAll('.chart-canvas').forEach(el=>el.hidden=false);
    document.getElementById('fallback-semana').hidden=true;
    document.getElementById('fallback-pizza').hidden=true;
    try {
        const eixoValor={beginAtZero:true,max:maximoEixo(m),ticks:{stepSize:maximoEixo(m)/4,callback:v=>numero(v)}};
        const eixoRotulo={grid:{display:false}};
        grafico1=new Chart(document.getElementById('myChart1'),{type:'bar',data:{labels:m.labels,datasets:[{label:m.unidade,data:m.valores,backgroundColor:'#0086ff',barPercentage:.65,categoryPercentage:.8}]},plugins:[referencias],options:{animation:false,responsive:true,maintainAspectRatio:false,layout:{padding:{top:22,right:0}},plugins:{legend:{display:false}},scales:{x:eixoRotulo,y:eixoValor}}});
        grafico2=new Chart(document.getElementById('myChart2'),{type:'pie',data:{labels:p.labels,datasets:[{data:p.valores,backgroundColor:p.cores,borderColor:'white',borderWidth:1}]},plugins:[rotulosPizza],options:{animation:false,responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${numero(c.raw)} (${numero(c.raw/soma(p.valores)*100,1)}%)`}}}}});
    } catch(erro) {
        if(grafico1) grafico1.destroy();
        if(grafico2) grafico2.destroy();
        document.querySelectorAll('.chart-canvas').forEach(el=>el.hidden=true);
        document.getElementById('fallback-semana').hidden=false;
        document.getElementById('fallback-pizza').hidden=false;
        console.warn('Exibindo os gráficos de apoio.',erro);
    }
}

document.getElementById('setor').insertAdjacentHTML('beforeend',dados.pontos.map(p=>`<option value="${p.id}">${p.nome}</option>`).join(''));
document.getElementById('setor').addEventListener('change',atualizar);
document.querySelectorAll('.ajuda button').forEach(botao=>{
    botao.addEventListener('click',()=>{
        const aberto=botao.getAttribute('aria-expanded')!=='true';
        botao.setAttribute('aria-expanded',String(aberto));
        botao.parentElement.classList.toggle('aberta',aberto);
        botao.parentElement.classList.toggle('fechada',!aberto);
    });
    botao.addEventListener('blur',()=>{botao.setAttribute('aria-expanded','false');botao.parentElement.classList.remove('aberta','fechada');});
    botao.addEventListener('keydown',e=>{if(e.key==='Escape'){botao.setAttribute('aria-expanded','false');botao.parentElement.classList.remove('aberta');botao.parentElement.classList.add('fechada');}});
});
atualizar();

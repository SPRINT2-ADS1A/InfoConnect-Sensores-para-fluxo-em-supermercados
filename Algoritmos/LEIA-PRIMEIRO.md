# InfoConnect — adaptacoes MINIMAS sobre Algoritmos.rar

## Como iniciar
1. Execute `src/database/script-tabelas.sql` no MySQL Workbench **somente se ainda nao tiver criado o banco**. O arquivo `DataBase_Grupo01.sql` eh uma copia do original. O arquivo `script-tabelas.sql` preserva as mesmas 7 tabelas e dados, com correcoes minimas: case de `supermercado`, email unico de Usuario, `CREATE DATABASE IF NOT EXISTS`. Nao execute duas vezes sem limpar/rever os dados.
2. Preencha `.env.dev` com suas credenciais LOCAIS do MySQL. O arquivo do ZIP nao tem senha.
3. `npm install` e `npm start`.
4. Cadastro: http://localhost:3333/site/login%20e%20cadastro/cadastro.html
5. Login: http://localhost:3333/site/login%20e%20cadastro/login.html
6. Dashboard: http://localhost:3333/DASH/dashboard.html

## Nomes das tabelas
- O SQL enviado cria `cliente`, `endereco`, `supermercado`, `setor`, `sensor`, `registro`, `Usuario`.
- Voce mencionou `sensores` e `senspres`, mas eles NAO sao tabelas desse SQL.
- Nas consultas da dashboard usei os aliases `sensor sensores` e `registro senspres` (apelidos de consulta), SEM inventar novas tabelas. **`senspres` representa as linhas de registro, nao individuos unicos**.
- Se `senspres` era uma tabela diferente que seu grupo criou depois, sera necessario fornecer o SQL dessa tabela.

## O que mudei
- `app.js`: +1 `app.use()` para servir a pasta DASH como estah, sem mover arquivos.
- `src/routes/index.js`: redireciona `/` para o HTML existente, evitando `res.render` sem view engine.
- `src/routes/usuarios.js`: INTACTO.
- `src/controllers/usuarioController.js`: variaveis do HTML e login pela tabela Usuario, sem aquarios, sessao.js ou tokens.
- `src/models/usuarioModel.js`: SELECT/INSERT com nomes reais; CPF/cliente, endereco, supermercado, Usuario; hash de senha com Node crypto (sem biblioteca extra).
- `src/database/config.js`: executar agora aceita parametros SQL e foi acrescentada uma transacao pequena para impedir cadastro parcial.
- `src/database/script-tabelas.sql`: troca tabelas de aquario pelas 7 tabelas do Grupo 01, corrigindo nomes com diferenca de maiusculas no MySQL/Linux e email unico de Usuario. Copia original intacta em `DataBase_Grupo01.sql`.
- `public/site/login e cadastro/cadastro.html`: adicionado so input CPF e campos relacionados no fetch. **CSS intacto.**
- `public/site/login e cadastro/login.html`: troca login fixo por fetch `/usuarios/autenticar`. **CSS intacto.**
- `DASH/dashboard.html`: conservado layout existente, acrescidos indicadores e grafico Chart.js com dados reais.
- `src/routes/medidas.js`, `src/controllers/medidaController.js`, `src/models/medidaModel.js`: +endpoints do painel; nomes reais `sensor` e `registro`.

## Limites do prototipo
- A coleta real do HC-SR04 NAO foi implementada: os graficos usam o conteudo que ja existe em `registro`.
- `sessionStorage` no HTML eh somente identificacao local para escolher o supermercado; nao autentica nem protege a rota no servidor. Nao existe `sessao.js`, token ou outro mecanismo de autenticacao nesta versao, como solicitado. Nao exponha a API em producao sem autenticacao de verdade.
- Validacao de CPF/CNPJ verifica formato e quantidade de digitos, nao digitos verificadores.
- O indicador `leiturasAproximacao` conta linhas com `aproximacao=1`, NAO pessoas unicas.

- Os filtros do dashboard (setor e setembro/2026 ou todos) estao conectados as consultas. A contagem de sensores ativos considera o estado atual dos sensores, nao o periodo.

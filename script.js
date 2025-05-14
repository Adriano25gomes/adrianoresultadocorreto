// Funções de configuração
function salvarConfiguracoes() {
    // Obter valores dos campos
    const apiKeyInput = document.getElementById('api-key').value;
    const limiarDecisao = parseFloat(document.getElementById('limiar-decisao').value);
    const pesoFormaRecente = parseFloat(document.getElementById('peso-form-recente').value);
    const pesoConfrontos = parseFloat(document.getElementById('peso-confrontos').value);
    const estrategiaStake = document.getElementById('estrategia-stake').value;
    
    // Validar campos
    if (apiKeyInput) {
        apiKey = apiKeyInput;
        localStorage.setItem('football-api-key', apiKey);
    }
    
    // Salvar configurações do modelo
    modeloConfiguracoes = {
        limiarDecisao,
        pesoFormaRecente,
        pesoConfrontos,
        estrategiaStake
    };
    
    localStorage.setItem('model-config', JSON.stringify(modeloConfiguracoes));
    
    mostrarAlerta('Configurações salvas com sucesso!', 'success');
    
    // Verificar o plano da API se houver chave
    if (apiKey) {
        verificarPlanoAPI();
    }
}

function carregarConfiguracoes() {
    // Carregar API key
    apiKey = localStorage.getItem('football-api-key') || '';
    document.getElementById('api-key').value = apiKey;
    
    // Carregar configurações do modelo
    const configSalvas = localStorage.getItem('model-config');
    if (configSalvas) {
        modeloConfiguracoes = JSON.parse(configSalvas);
        
        // Aplicar aos campos
        document.getElementById('limiar-decisao').value = modeloConfiguracoes.limiarDecisao;
        document.getElementById('peso-form-recente').value = modeloConfiguracoes.pesoFormaRecente;
        document.getElementById('peso-confrontos').value = modeloConfiguracoes.pesoConfrontos;
        document.getElementById('estrategia-stake').value = modeloConfiguracoes.estrategiaStake;
    }
}

// Verificar plano da API
async function verificarPlanoAPI() {
    if (!apiKey) return;
    
    try {
        const response = await fetch('https://simulador-final.onrender.com/api/competitions', {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        
        // Verificar rate limits nos headers
        const planoAPISelect = document.getElementById('plano-api');
        
        if (response.headers.get('X-Requests-Available-Minute')) {
            const requestsLimit = parseInt(response.headers.get('X-Requests-Available-Minute'));
            
            if (requestsLimit <= 10) {
                planoAPISelect.value = 'free';
            } else if (requestsLimit <= 50) {
                planoAPISelect.value = 'tier1';
            } else {
                planoAPISelect.value = 'tier2';
            }
            
            mostrarAlerta(`Plano da API detectado: ${requestsLimit} chamadas/minuto`, 'info');
        }
    } catch (error) {
        console.error('Erro ao verificar plano da API:', error);
    }
}

// Adicionar utilidades CSS dinâmicas para estilização
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar estilos CSS para os elementos de UI
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .alerta {
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 15px;
            display: none;
        }
        
        .alerta-info {
            background-color: #e3f2fd;
            color: #0d47a1;
            border: 1px solid #bbdefb;
        }
        
        .alerta-success {
            background-color: #e8f5e9;
            color: #1b5e20;
            border: 1px solid #c8e6c9;
        }
        
        .alerta-warning {
            background-color: #fff8e1;
            color: #ff6f00;
            border: 1px solid #ffecb3;
        }
        
        .alerta-error {
            background-color: #ffebee;
            color: #b71c1c;
            border: 1px solid #ffcdd2;
        }
        
        .tabela-jogos {
            width: 100%;
            border-collapse: collapse;
        }
        
        .tabela-jogos th, .tabela-jogos td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
        }
        
        .tabela-jogos th {
            background-color: #f2f2f2;
        }
        
        .vitoria {
            color: green;
            font-weight: bold;
        }
        
        .derrota {
            color: red;
        }
        
        .empate {
            color: orange;
        }
        
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            display: none;
            margin: 15px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .prob-container {
            margin-top: 15px;
        }
        
        .prob-bar {
            display: flex;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .prob-casa {
            background-color: #4caf50;
            height: 100%;
        }
        
        .prob-fora {
            background-color: #2196f3;
            height: 100%;
        }
        
        .prob-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            font-size: 12px;
        }
        
        .resultado-header {
            margin-bottom: 15px;
        }
        
        .recomendacao {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        .explicacao {
            margin-bottom: 10px;
            color: #555;
        }
        
        .stake-recom {
            margin-top: 10px;
            font-weight: bold;
        }
        
        .favorece-casa {
            color: #4caf50;
        }
        
        .favorece-fora {
            color: #2196f3;
        }
        
        .neutro {
            color: #ff9800;
        }
        
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .status-badge.success {
            background-color: #4caf50;
            color: white;
        }
        
        .status-badge.error {
            background-color: #f44336;
            color: white;
        }
        
        .status-badge.loading {
            background-color: #ff9800;
            color: white;
        }
        
        .code-container {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .code-container pre {
            margin: 0;
            white-space: pre-wrap;
        }
        
        .api-status {
            margin: 15px 0;
        }
        
        .rate-limit-info {
            margin-top: 5px;
            font-size: 12px;
            color: #666;
        }
    `;
    
    document.head.appendChild(styleElement);
});// Variáveis globais
let apiKey = '';
let dadosHistorico = [];
let modeloConfiguracoes = {
    limiarDecisao: 0.20,
    pesoFormaRecente: 1.00,
    pesoConfrontos: 0.70,
    estrategiaStake: 'fixo'
};

// Funções de inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar configurações salvas do localStorage
    carregarConfiguracoes();
    
    // Inicializar tabela de histórico
    carregarHistorico();
    
    // Verificar se o API key está configurado
    verificarAPIKey();
});

// Função para abrir abas
function openTab(evt, tabName) {
    // Esconder todas as abas
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remover a classe "active" de todos os botões
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Mostrar a aba atual e adicionar a classe "active" ao botão
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Função para verificar se o API key está configurado
function verificarAPIKey() {
    if (!apiKey) {
        const apiKeyInput = document.getElementById('api-key');
        apiKey = localStorage.getItem('football-api-key') || '';
        apiKeyInput.value = apiKey;
        
        if (!apiKey) {
            mostrarAlerta('API key não configurada. Configure na aba "Configurações" para usar dados reais.', 'warning');
        }
    }
}

// Função para mostrar alertas
function mostrarAlerta(mensagem, tipo = 'info') {
    // Criar elemento de alerta se não existir
    let alertaDiv = document.getElementById('alerta-sistema');
    if (!alertaDiv) {
        alertaDiv = document.createElement('div');
        alertaDiv.id = 'alerta-sistema';
        alertaDiv.className = 'alerta';
        document.querySelector('.container').prepend(alertaDiv);
    }
    
    // Definir classe baseada no tipo
    alertaDiv.className = `alerta alerta-${tipo}`;
    alertaDiv.innerHTML = mensagem;
    
    // Mostrar alerta
    alertaDiv.style.display = 'block';
    
    // Esconder automaticamente após 5 segundos
    setTimeout(() => {
        alertaDiv.style.display = 'none';
    }, 5000);
}

// Função para carregar times da API
async function carregarTimesAPI() {
    if (!apiKey) {
        mostrarAlerta('API key não configurada. Configure na aba "Configurações".', 'error');
        return;
    }
    
    const liga = document.getElementById('liga').value;
    const selectCasa = document.getElementById('time-casa');
    const selectFora = document.getElementById('time-fora');
    
    // Limpar selects
    selectCasa.innerHTML = '<option value="">Carregando times...</option>';
    selectFora.innerHTML = '<option value="">Carregando times...</option>';
    
    // Mostrar loader
    document.getElementById('loader').style.display = 'block';
    
    try {
        const response = await fetch(`https://simulador-final.onrender.com/api/competitions/${liga}/teams`, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Preencher selects com os times
        selectCasa.innerHTML = '<option value="">Selecione o time da casa</option>';
        selectFora.innerHTML = '<option value="">Selecione o time visitante</option>';
        
        data.teams.forEach(team => {
            const optionCasa = document.createElement('option');
            optionCasa.value = team.id;
            optionCasa.textContent = team.name;
            selectCasa.appendChild(optionCasa);
            
            const optionFora = document.createElement('option');
            optionFora.value = team.id;
            optionFora.textContent = team.name;
            selectFora.appendChild(optionFora);
        });
        
        mostrarAlerta(`${data.teams.length} times carregados com sucesso!`, 'success');
    } catch (error) {
        console.error('Erro ao carregar times:', error);
        mostrarAlerta(`Erro ao carregar times: ${error.message}`, 'error');
        
        // Restaurar selects
        selectCasa.innerHTML = '<option value="">Erro ao carregar times</option>';
        selectFora.innerHTML = '<option value="">Erro ao carregar times</option>';
    } finally {
        // Esconder loader
        document.getElementById('loader').style.display = 'none';
    }
}

// Função para carregar últimos jogos
async function carregarUltimosJogos(tipo) {
    if (!apiKey) {
        mostrarAlerta('API key não configurada.', 'error');
        return;
    }
    
    const timeId = document.getElementById(`time-${tipo}`).value;
    if (!timeId) {
        mostrarAlerta(`Selecione um time ${tipo === 'casa' ? 'da casa' : 'visitante'} primeiro.`, 'warning');
        return;
    }
    
    // Mostrar loader
    document.getElementById('loader').style.display = 'block';
    
    try {
        const response = await fetch(`https://simulador-final.onrender.com/api/teams/${timeId}/matches?limit=5&status=FINISHED`, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Formatar e exibir os últimos jogos
        const containerJogos = document.getElementById(`ultimos-jogos-${tipo}`);
        containerJogos.innerHTML = '';
        
        if (data.matches && data.matches.length > 0) {
            const tabelaJogos = document.createElement('table');
            tabelaJogos.className = 'tabela-jogos';
            
            // Cabeçalho
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Data</th>
                    <th>Partida</th>
                    <th>Resultado</th>
                </tr>
            `;
            tabelaJogos.appendChild(thead);
            
            // Corpo
            const tbody = document.createElement('tbody');
            
            data.matches.slice(0, 5).forEach(match => {
                const row = document.createElement('tr');
                
                // Determinar se o time selecionado venceu, perdeu ou empatou
                const timeNaCasa = match.homeTeam.id == timeId;
                const golsTime = timeNaCasa ? match.score.fullTime.home : match.score.fullTime.away;
                const golsAdversario = timeNaCasa ? match.score.fullTime.away : match.score.fullTime.home;
                
                let resultado = '';
                let resultadoClass = '';
                
                if (golsTime > golsAdversario) {
                    resultado = 'V';
                    resultadoClass = 'vitoria';
                } else if (golsTime < golsAdversario) {
                    resultado = 'D';
                    resultadoClass = 'derrota';
                } else {
                    resultado = 'E';
                    resultadoClass = 'empate';
                }
                
                // Formatar a data
                const data = new Date(match.utcDate);
                const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`;
                
                row.innerHTML = `
                    <td>${dataFormatada}</td>
                    <td>${match.homeTeam.shortName || match.homeTeam.name} ${match.score.fullTime.home} x ${match.score.fullTime.away} ${match.awayTeam.shortName || match.awayTeam.name}</td>
                    <td class="${resultadoClass}">${resultado}</td>
                `;
                
                tbody.appendChild(row);
            });
            
            tabelaJogos.appendChild(tbody);
            containerJogos.appendChild(tabelaJogos);
        } else {
            containerJogos.textContent = 'Nenhum jogo recente encontrado.';
        }
        
        mostrarAlerta('Jogos recentes carregados!', 'success');
    } catch (error) {
        console.error(`Erro ao carregar jogos do time ${tipo}:`, error);
        mostrarAlerta(`Erro ao carregar jogos: ${error.message}`, 'error');
        document.getElementById(`ultimos-jogos-${tipo}`).textContent = 'Erro ao carregar jogos.';
    } finally {
        // Esconder loader
        document.getElementById('loader').style.display = 'none';
    }
}

// Função para carregar confrontos diretos
async function carregarConfrontosAPI() {
    if (!apiKey) {
        mostrarAlerta('API key não configurada.', 'error');
        return;
    }
    
    const timeIdCasa = document.getElementById('time-casa').value;
    const timeIdFora = document.getElementById('time-fora').value;
    
    if (!timeIdCasa || !timeIdFora) {
        mostrarAlerta('Selecione ambos os times primeiro.', 'warning');
        return;
    }
    
    // Mostrar loader
    document.getElementById('loader').style.display = 'block';
    
    try {
        const response = await fetch(`https://simulador-final.onrender.com/api/teams/${timeIdCasa}/matches?limit=100`, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filtrar apenas os jogos entre os dois times
        const confrontos = data.matches.filter(match => 
            (match.homeTeam.id == timeIdCasa && match.awayTeam.id == timeIdFora) || 
            (match.homeTeam.id == timeIdFora && match.awayTeam.id == timeIdCasa)
        );
        
        // Formatar e exibir os confrontos
        const containerConfrontos = document.getElementById('historico-confrontos');
        containerConfrontos.innerHTML = '';
        
        if (confrontos && confrontos.length > 0) {
            const tabelaConfrontos = document.createElement('table');
            tabelaConfrontos.className = 'tabela-jogos';
            
            // Cabeçalho
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Data</th>
                    <th>Competição</th>
                    <th>Partida</th>
                    <th>Resultado</th>
                </tr>
            `;
            tabelaConfrontos.appendChild(thead);
            
            // Corpo
            const tbody = document.createElement('tbody');
            
            confrontos.forEach(match => {
                // Verificar se o jogo já foi finalizado
                if (match.status !== 'FINISHED') return;
                
                const row = document.createElement('tr');
                
                // Formatar a data
                const data = new Date(match.utcDate);
                const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
                
                // Determinar o resultado para o time da casa (neste contexto do confronto)
                const casaVenceu = match.score.winner === 'HOME_TEAM';
                const foraVenceu = match.score.winner === 'AWAY_TEAM';
                const empate = match.score.winner === 'DRAW';
                
                let resultado = '';
                let resultadoClass = '';
                
                if (match.homeTeam.id == timeIdCasa) {
                    // Time da casa é o time casa no confronto
                    if (casaVenceu) {
                        resultado = 'V';
                        resultadoClass = 'vitoria';
                    } else if (foraVenceu) {
                        resultado = 'D';
                        resultadoClass = 'derrota';
                    } else {
                        resultado = 'E';
                        resultadoClass = 'empate';
                    }
                } else {
                    // Time da casa é o time fora no confronto
                    if (foraVenceu) {
                        resultado = 'V';
                        resultadoClass = 'vitoria';
                    } else if (casaVenceu) {
                        resultado = 'D';
                        resultadoClass = 'derrota';
                    } else {
                        resultado = 'E';
                        resultadoClass = 'empate';
                    }
                }
                
                row.innerHTML = `
                    <td>${dataFormatada}</td>
                    <td>${match.competition.name}</td>
                    <td>${match.homeTeam.shortName || match.homeTeam.name} ${match.score.fullTime.home} x ${match.score.fullTime.away} ${match.awayTeam.shortName || match.awayTeam.name}</td>
                    <td class="${resultadoClass}">${resultado}</td>
                `;
                
                tbody.appendChild(row);
            });
            
            tabelaConfrontos.appendChild(tbody);
            
            if (tbody.children.length > 0) {
                containerConfrontos.appendChild(tabelaConfrontos);
            } else {
                containerConfrontos.textContent = 'Nenhum confronto direto encontrado.';
            }
        } else {
            containerConfrontos.textContent = 'Nenhum confronto direto encontrado.';
        }
        
        mostrarAlerta('Histórico de confrontos carregado!', 'success');
    } catch (error) {
        console.error('Erro ao carregar confrontos:', error);
        mostrarAlerta(`Erro ao carregar confrontos: ${error.message}`, 'error');
        document.getElementById('historico-confrontos').textContent = 'Erro ao carregar confrontos.';
    } finally {
        // Esconder loader
        document.getElementById('loader').style.display = 'none';
    }
}

// Função para consultar API geral (aba dados da API)
async function consultarAPI() {
    if (!apiKey) {
        mostrarAlerta('API key não configurada.', 'error');
        return;
    }
    
    const endpoint = document.getElementById('api-endpoint').value;
    const liga = document.getElementById('api-liga').value;
    const statusIndicator = document.getElementById('status-indicator');
    const apiJson = document.getElementById('api-json');
    
    // Atualizar status
    statusIndicator.textContent = 'Consultando...';
    statusIndicator.className = 'status-badge loading';
    apiJson.textContent = 'Aguarde, consultando API...';
    
    let url = '';
    
    switch (endpoint) {
        case 'teams':
            url = `https://simulador-final.onrender.com/api/competitions/${liga}/teams`;
            break;
        case 'matches':
            url = `https://simulador-final.onrender.com/api/competitions/${liga}/matches?limit=10`;
            break;
        case 'standings':
            url = `https://simulador-final.onrender.com/api/competitions/${liga}/standings`;
            break;
        case 'matches/head2head':
            // Para este caso, precisamos de dois times
            // Poderíamos melhorar depois com seleção de times
            url = `https://simulador-final.onrender.com/api/competitions/${liga}/matches`;
            break;
    }
    
    try {
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        
        // Verificar headers com informações de rate limit
        const rateLimit = {
            remaining: response.headers.get('X-Requests-Available-Minute'),
            reset: response.headers.get('X-RequestCounter-Reset')
        };
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Formatar JSON com indentação
        apiJson.textContent = JSON.stringify(data, null, 2);
        
        // Atualizar status
        statusIndicator.textContent = 'Sucesso';
        statusIndicator.className = 'status-badge success';
        
        // Adicionar informação de rate limit
        if (rateLimit.remaining) {
            const rateLimitInfo = document.createElement('div');
            rateLimitInfo.className = 'rate-limit-info';
            rateLimitInfo.innerHTML = `Requisições disponíveis: ${rateLimit.remaining} | Reset em: ${rateLimit.reset}s`;
            document.getElementById('api-status').appendChild(rateLimitInfo);
        }
    } catch (error) {
        console.error('Erro na consulta à API:', error);
        apiJson.textContent = `Erro: ${error.message}`;
        
        // Atualizar status
        statusIndicator.textContent = 'Erro';
        statusIndicator.className = 'status-badge error';
    }
}

// Função para fazer a previsão do Handicap Asiático
function fazerPrevisao() {
    const timeCasa = document.getElementById('time-casa');
    const timeFora = document.getElementById('time-fora');
    const handicap = parseFloat(document.getElementById('handicap').value);
    const oddsCasa = parseFloat(document.getElementById('odds-casa').value);
    const oddsFora = parseFloat(document.getElementById('odds-fora').value);
    const valorAposta = parseFloat(document.getElementById('valor-aposta').value || 0);
    
    // Validar dados
    if (!timeCasa.value || !timeFora.value) {
        mostrarAlerta('Selecione ambos os times.', 'warning');
        return;
    }
    
    if (isNaN(handicap) || isNaN(oddsCasa) || isNaN(oddsFora)) {
        mostrarAlerta('Verifique os valores de handicap e odds.', 'warning');
        return;
    }
    
    // Mostrar loader
    document.getElementById('loader').style.display = 'block';
    
    // Timeout para simular processamento (em uma implementação real, isso seria um cálculo complexo)
    setTimeout(() => {
        try {
            // Simular uma análise e previsão
            // Em um sistema real, isso envolveria um modelo mais complexo baseado nos dados da API
            const nomeTimeCasa = timeCasa.options[timeCasa.selectedIndex].text;
            const nomeTimeFora = timeFora.options[timeFora.selectedIndex].text;
            
            // Criar fatores aleatórios para simular a análise
            // No sistema real, esses dados viriam dos cálculos baseados nos dados da API
            const fatores = [
                { fator: 'Forma recente', casa: getRandomScore(), fora: getRandomScore() },
                { fator: 'Força do ataque', casa: getRandomScore(), fora: getRandomScore() },
                { fator: 'Solidez defensiva', casa: getRandomScore(), fora: getRandomScore() },
                { fator: 'Fator casa', casa: 0.8, fora: 0.3 },
                { fator: 'Confrontos diretos', casa: getRandomScore(), fora: getRandomScore() }
            ];
            
            // Calcular média ponderada para cada time
            let pontosTimeCasa = 0;
            let pontosTimeFora = 0;
            
            fatores.forEach(item => {
                pontosTimeCasa += item.casa;
                pontosTimeFora += item.fora;
            });
            
            pontosTimeCasa = pontosTimeCasa / fatores.length;
            pontosTimeFora = pontosTimeFora / fatores.length;
            
            // Ajustar pela linha de handicap
            const pontosAjustados = pontosTimeCasa - pontosTimeFora - (handicap * 0.5);
            
            // Calcular probabilidades
            const probCasa = Math.max(0.1, Math.min(0.9, 0.5 + (pontosAjustados * 0.2)));
            const probFora = 1 - probCasa;
            
            // Calcular valor esperado
            const evCasa = (probCasa * oddsCasa) - 1;
            const evFora = (probFora * oddsFora) - 1;
            
            // Determinar a recomendação
            let recomendacao, explicacao, valorRecomendado;
            
            if (evCasa > evFora && evCasa > modeloConfiguracoes.limiarDecisao) {
                recomendacao = `Apostar no ${nomeTimeCasa} com handicap ${handicap}`;
                explicacao = `Valor esperado positivo de ${(evCasa * 100).toFixed(1)}% favorecendo o time da casa.`;
                valorRecomendado = valorAposta;
                
                if (modeloConfiguracoes.estrategiaStake === 'kelly') {
                    // Cálculo simplificado do critério de Kelly
                    const kellyFraction = (oddsCasa * probCasa - 1) / (oddsCasa - 1);
                    valorRecomendado = Math.max(0, Math.min(1, kellyFraction)) * valorAposta;
                } else if (modeloConfiguracoes.estrategiaStake === 'kelly-fracionario') {
                    // Kelly fracionário (50%)
                    const kellyFraction = (oddsCasa * probCasa - 1) / (oddsCasa - 1);
                    valorRecomendado = Math.max(0, Math.min(1, kellyFraction * 0.5)) * valorAposta;
                }
            } else if (evFora > evCasa && evFora > modeloConfiguracoes.limiarDecisao) {
                recomendacao = `Apostar no ${nomeTimeFora} com handicap ${-handicap}`;
                explicacao = `Valor esperado positivo de ${(evFora * 100).toFixed(1)}% favorecendo o time visitante.`;
                valorRecomendado = valorAposta;
                
                if (modeloConfiguracoes.estrategiaStake === 'kelly') {
                    // Cálculo simplificado do critério de Kelly
                    const kellyFraction = (oddsFora * probFora - 1) / (oddsFora - 1);
                    valorRecomendado = Math.max(0, Math.min(1, kellyFraction)) * valorAposta;
                } else if (modeloConfiguracoes.estrategiaStake === 'kelly-fracionario') {
                    // Kelly fracionário (50%)
                    const kellyFraction = (oddsFora * probFora - 1) / (oddsFora - 1);
                    valorRecomendado = Math.max(0, Math.min(1, kellyFraction * 0.5)) * valorAposta;
                }
            } else {
                recomendacao = 'Sem aposta recomendada';
                explicacao = 'Valor esperado insuficiente para justificar uma aposta.';
                valorRecomendado = 0;
            }
            
            // Mostrar resultado
            document.getElementById('resultado-previsao').style.display = 'block';
            
            const resultadoContainer = document.getElementById('resultado-container');
            resultadoContainer.innerHTML = `
                <div class="resultado-header">
                    <h3>${nomeTimeCasa} vs ${nomeTimeFora}</h3>
                    <p>Handicap Asiático: ${handicap > 0 ? '+' + handicap : handicap} (Casa)</p>
                </div>
                <div class="recomendacao">
                    <strong>Recomendação:</strong> ${recomendacao}
                </div>
                <div class="explicacao">
                    ${explicacao}
                </div>
                ${valorRecomendado > 0 ? `
                <div class="stake-recom">
                    <strong>Stake recomendado:</strong> ${valorRecomendado.toFixed(2)}
                </div>` : ''}
                <div class="prob-container">
                    <div class="prob-bar">
                        <div class="prob-casa" style="width: ${probCasa * 100}%"></div>
                        <div class="prob-fora" style="width: ${probFora * 100}%"></div>
                    </div>
                    <div class="prob-labels">
                        <span>${nomeTimeCasa}: ${(probCasa * 100).toFixed(1)}%</span>
                        <span>${nomeTimeFora}: ${(probFora * 100).toFixed(1)}%</span>
                    </div>
                </div>
            `;
            
            // Preencher tabela de detalhes
            const tabelaDetalhes = document.getElementById('tabela-detalhes');
            tabelaDetalhes.innerHTML = '';
            
            fatores.forEach(item => {
                const row = document.createElement('tr');
                
                // Determinar qual time tem vantagem neste fator
                let impacto = '';
                let className = '';
                
                if (item.casa > item.fora + 0.1) {
                    impacto = 'Favorece Casa';
                    className = 'favorece-casa';
                } else if (item.fora > item.casa + 0.1) {
                    impacto = 'Favorece Visitante';
                    className = 'favorece-fora';
                } else {
                    impacto = 'Neutro';
                    className = 'neutro';
                }
                
                row.innerHTML = `
                    <td>${item.fator}</td>
                    <td>${item.casa.toFixed(2)}</td>
                    <td>${item.fora.toFixed(2)}</td>
                    <td class="${className}">${impacto}</td>
                `;
                
                tabelaDetalhes.appendChild(row);
            });
            
            // Salvar previsão no histórico
            salvarPrevisaoHistorico(nomeTimeCasa, nomeTimeFora, handicap, recomendacao);
            
        } catch (error) {
            console.error('Erro ao fazer previsão:', error);
            mostrarAlerta('Erro ao fazer a previsão: ' + error.message, 'error');
        } finally {
            // Esconder loader
            document.getElementById('loader').style.display = 'none';
        }
    }, 1000);
}

// Função auxiliar para gerar valores aleatórios para simulação
function getRandomScore() {
    return Math.random() * 0.5 + 0.25; // Valores entre 0.25 e 0.75
}

// Funções para lidar com histórico de previsões
function salvarPrevisaoHistorico(timeCasa, timeFora, handicap, recomendacao) {
    // Em um sistema real, isso seria persistido no localStorage ou em um banco de dados
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getDate().toString().padStart(2, '0')}/${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}/${dataAtual.getFullYear()}`;
    
    // Adicionar ao array de histórico
    dadosHistorico.push({
        data: dataFormatada,
        partida: `${timeCasa} vs ${timeFora}`,
        handicap: handicap,
        previsao: recomendacao,
        resultado: 'Pendente',
        retorno: 0
    });
    
    // Salvar no localStorage
    localStorage.setItem('historico-previsoes', JSON.stringify(dadosHistorico));
    
    // Atualizar exibição do histórico
    carregarHistorico();
}

function carregarHistorico() {
    // Carregar do localStorage
    const historico = localStorage.getItem('historico-previsoes');
    dadosHistorico = historico ? JSON.parse(historico) : [];
    
    // Preencher tabela
    const tabelaHistorico = document.getElementById('tabela-historico').getElementsByTagName('tbody')[0];
    tabelaHistorico.innerHTML = '';
    
    dadosHistorico.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.data}</td>
            <td>${item.partida}</td>
            <td>${item.handicap}</td>
            <td>${item.previsao}</td>
            <td>${item.resultado}</td>
            <td>${item.retorno > 0 ? '+' + item.retorno.toFixed(2) : item.retorno.toFixed(2)}</td>
        `;
        tabelaHistorico.appendChild(row);
    });
    
    // Atualizar gráfico se existir dados
    if (dadosHistorico.length > 0 && typeof Chart !== 'undefined') {
        atualizarGraficoDesempenho();
    }
}

function atualizarGraficoDesempenho() {
    const ctx = document.getElementById('grafico-desempenho').getContext('2d');
    
    // Limpar gráfico existente
    if (window.graficoDesempenho) {
        window.graficoDesempenho.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = dadosHistorico.map(item => item.data);
    const retornos = dadosHistorico.map(item => item.retorno);
    
    // Calcular retorno acumulado
    const retornoAcumulado = [];
    let acumulado = 0;
    
    retornos.forEach(valor => {
        acumulado += valor;
        retornoAcumulado.push(acumulado);
    });
    
    // Criar gráfico
    window.graficoDesempenho = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Retorno Acumulado',
                data: retornoAcumulado,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Desempenho Acumulado das Previsões'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Retorno: ${context.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

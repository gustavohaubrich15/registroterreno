const storedData = sessionStorage.getItem('caput');
const data = storedData ? JSON.parse(storedData) : null;

function calcularTotal(derivacoes) {
    let totalDerivacoes = 0;
    derivacoes.forEach(item => {
        totalDerivacoes += parseFloat(item.tamanhoTerreno);
        if (item.derivacoes && item.derivacoes.length > 0) {
            totalDerivacoes += calcularTotal(item.derivacoes);
        }
    });
    return totalDerivacoes;
}

function gerarTotalizadores(proprietario, filtro) {
    const container = document.getElementById('totalizadores');
    const totalDerivacoes = calcularTotal(proprietario.derivacoes);
    const terrenoProprio = parseFloat(proprietario.tamanhoTerreno);
    const porcentagemSobreCaput = (proprietario.tamanhoTerreno / data.tamanhoTerreno) * 100;

    const proprietarioDiv = document.createElement('div');
    proprietarioDiv.classList.add('proprietario');

    const infoProprietario = `
        ${proprietario.numeroRegistro ? `<div class="info"><strong>R.</strong> ${proprietario.numeroRegistro}</div>` : '<strong>CAPUT</strong>'}
        <div class="info"><strong>Proprietário:</strong> ${proprietario.proprietario}</div>
        <div class="info"><strong>Tamanho do Terreno:</strong> ${terrenoProprio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Hectáres</div>
        <div class="info"><strong>Total de Derivações:</strong> ${totalDerivacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Hectáres</div>
        ${proprietario.numeroRegistro ? `<div class="info">📊 <strong>Percentual sobre caput:</strong> ${porcentagemSobreCaput.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div>` : ''}
        `;

    proprietarioDiv.innerHTML = infoProprietario;

    let filtroCondicao = false;

    if (totalDerivacoes > terrenoProprio) {
        proprietarioDiv.innerHTML += `<div class="info highlight-falta">⚠️ Falta de terreno: Derivações excedem em ${(totalDerivacoes - terrenoProprio).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Hectáres</div>`;
        filtroCondicao = filtro === 'falta' || filtro === 'todos';
    } else if (totalDerivacoes < terrenoProprio && totalDerivacoes > 0) {
        proprietarioDiv.innerHTML += `<div class="info highlight-sobra">✅ Sobra de terreno: Terreno não completamente utilizado, sobram ${(terrenoProprio - totalDerivacoes).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Hectáres</div>`;
        filtroCondicao = filtro === 'sobras' || filtro === 'todos';
    } else {
        proprietarioDiv.innerHTML += `<div class="info">✅ Terreno perfeitamente distribuído.</div>`;
        filtroCondicao = filtro === 'perfeito' || filtro === 'todos';
    }
    

    if (filtroCondicao) {
        container.appendChild(proprietarioDiv);
    }

    if (proprietario.derivacoes && proprietario.derivacoes.length > 0) {
        proprietario.derivacoes.forEach(derivacao => {
            gerarTotalizadores(derivacao, filtro);
        });
    }
}

if (data) {
    gerarTotalizadores(data, 'todos');
} else {
    document.getElementById('totalizadores').innerHTML = '<p>Nenhum dado cadastrado.</p>';
}

document.getElementById('filter').addEventListener('change', function() {
    const filtroSelecionado = this.value;
    const container = document.getElementById('totalizadores');
    container.innerHTML = ''; 
    gerarTotalizadores(data, filtroSelecionado);
});

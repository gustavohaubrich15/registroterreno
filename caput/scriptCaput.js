function loadCaputData() {
    const storedCaput = sessionStorage.getItem('caput');
    if (storedCaput) {
        const caputData = JSON.parse(storedCaput);
        document.getElementById('matricula').value = caputData.matricula || '';
        document.getElementById('proprietario').value = caputData.proprietario || '';
        document.getElementById('tamanho').value = caputData.tamanhoTerreno || '';
        
        if (caputData.sexo == 'homem') {
            document.getElementById('homem').checked = true;
        } else if (caputData.sexo == 'mulher') {
            document.getElementById('mulher').checked = true;
        }
    }
}

window.onload = function() {
    loadCaputData();
};

document.getElementById('caputForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Obter os valores dos campos do formulário
    const matricula = document.getElementById('matricula').value;
    const proprietario = document.getElementById('proprietario').value;
    const tamanhoTerreno = document.getElementById('tamanho').value;
    const sexo = document.querySelector('input[name="sexo"]:checked').value;

    const caputData = {
        matricula,
        proprietario,
        tamanhoTerreno,
        sexo,
        derivacoes: []
    };

    sessionStorage.setItem('caput', JSON.stringify(caputData));
    sessionStorage.removeItem('treeHTML', JSON.stringify(caputData));
    alert('Dados salvos com sucesso do caput!');
})
function loadCaputData() {
    const storedCaput = sessionStorage.getItem('caput');
    if (storedCaput) {
        const caputData = JSON.parse(storedCaput);
        document.getElementById('matricula').value = caputData.matricula || '';
        document.getElementById('proprietario').value = caputData.proprietario || '';
        document.getElementById('tamanho').value = caputData.tamanhoTerreno || '';
    }
}

window.onload = function() {
    loadCaputData();
};

document.getElementById('caputForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const matricula = document.getElementById('matricula').value;
    const proprietario = document.getElementById('proprietario').value;
    const tamanhoTerreno = document.getElementById('tamanho').value;

    const caputData = {
        matricula,
        proprietario,
        tamanhoTerreno,
        derivacoes: []
    };

    sessionStorage.setItem('caput', JSON.stringify(caputData));
    sessionStorage.removeItem('treeHTML', JSON.stringify(caputData));
    Toastify({
        text: "Dados salvos com sucesso!!   ",
        duration: 1000,
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "#28a745",
        },
        onClick: function(){} 
      }).showToast();
})
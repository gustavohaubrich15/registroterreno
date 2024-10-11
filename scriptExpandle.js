document.querySelector('.expand-btn').addEventListener('click', function() {
    const content = document.querySelector('.expand-content');
    const button = document.querySelector('.expand-btn');
    const img = document.querySelector('.expand-img');
    content.classList.toggle('show');
    if (content.classList.contains('show')) {
        button.innerHTML = 'Minimizar tipos de exibição <img class="expand-img" src="../img/expand-down.png" alt="Minimizar">';
    } else {
        button.innerHTML = 'Expandir tipos de exibição <img class="expand-img" src="../img/expand-up.png" alt="Expandir">';
    }
});



function handleRadioChange(event) {
    const selectedValue = event.target.value;

    if (selectedValue === '1') {
        window.location.href = '../caput/caput.html'; // Caminho relativo para voltar um nível e acessar a subpasta caput
    } else if (selectedValue === '2') {
        window.location.href = '../arvore/arvoreTerritorio.html'; // Caminho relativo para voltar um nível e acessar a subpasta arvore
    } else if (selectedValue === '3') {
        window.location.href = '../totalizadores/totalizadores.html'; // Exemplo para outra subpasta
    }
}


const radioButtons = document.querySelectorAll('input[name="option"]');

radioButtons.forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
});

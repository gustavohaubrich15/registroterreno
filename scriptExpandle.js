document.querySelector('.expand-btn').addEventListener('click', function() {
    const content = document.querySelector('.expand-content');
    const button = document.querySelector('.expand-btn');
    const img = document.querySelector('.expand-img');
    content.classList.toggle('show');
    if (content.classList.contains('show')) {
        button.innerHTML = 'Minimizar tipos de exibição <img class="expand-img" src="../img/expand-down.svg" alt="Minimizar">';
    } else {
        button.innerHTML = 'Expandir tipos de exibição <img class="expand-img" src="../img/expand-up.svg" alt="Expandir">';
    }
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function aguardar() {
    console.log("Aguardando 1 segundo...");
    await wait(500);
}


async function handleRadioChange(event) {
    await aguardar()
    const selectedValue = event.target.value;

    if (selectedValue === '1') {
        window.location.href = '../caput/caput.html';
    } else if (selectedValue === '2') {
        window.location.href = '../arvore/arvoreTerritorio.html';
    } else if (selectedValue === '3') {
        window.location.href = '../totalizadores/totalizadores.html';
    }
}


const radioButtons = document.querySelectorAll('input[name="option"]');

radioButtons.forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
});

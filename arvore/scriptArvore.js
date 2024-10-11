let idFatherTreeElement = '';
let caputObject = {};

const generateUniqueId = (proprietario) => {
    return `${proprietario}${Date.now()}`;
};

function saveToSessionStorage() {
    sessionStorage.setItem('caput', JSON.stringify(caputObject));
    const treeContainer = document.getElementById('tree-container').innerHTML;
    sessionStorage.setItem('treeHTML', treeContainer);
}

function loadHTMLFromSessionStorage() {
    const storedHTML = sessionStorage.getItem('treeHTML');
    if (storedHTML) {
        document.getElementById('tree-container').innerHTML = storedHTML;
        reattachEvents(); 
    }
}

function reattachEvents() {
    const storedData = sessionStorage.getItem('caput');
    if (storedData) {
        const caputData = JSON.parse(storedData);
        const uniqueId = caputData.uniqueId;

        document.getElementById(`${uniqueId}`).addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            idFatherTreeElement = event.currentTarget.id;
            showModal(caputData, event.currentTarget.id);
        });

        caputData.derivacoes.forEach(derivacao => {
            document.getElementById(derivacao.uniqueId).addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                idFatherTreeElement = event.currentTarget.id;
                showModal(derivacao, event.currentTarget.id, true);
            });
        });
    }
}

function addDerivationToTree(fatherId, newDerivation) {
    function findNodeAndAdd(node) {
        if (node.uniqueId === fatherId) {
            node.derivacoes.push(newDerivation);
        } else {
            node.derivacoes.forEach(findNodeAndAdd); 
        }
    }
    findNodeAndAdd(caputObject); 
    saveToSessionStorage()
}

function deleteNode(uniqueId) {
    function findAndRemove(node, parent) {
        if (node.uniqueId === uniqueId) {
            const index = parent.derivacoes.indexOf(node);
            parent.derivacoes.splice(index, 1); 
            return true; 
        } else {
            for (let i = 0; i < node.derivacoes.length; i++) {
                if (findAndRemove(node.derivacoes[i], node)) {
                    return true;  
                }
            }
        }
        return false;
    }

    if (caputObject.uniqueId === uniqueId) {
        caputObject = {}; 
        sessionStorage.removeItem('caput');
        document.getElementById('tree-container').innerHTML = `
            <div style="color: red; font-size: 18px;">
                <strong>Atenção:</strong> CAPUT removido.
                <br>Por favor, cadastre o CAPUT primeiro.
            </div>
        `;
        sessionStorage.setItem('caput', JSON.stringify(caputObject));
    } else {
        findAndRemove(caputObject, caputObject);
        document.getElementById(uniqueId).remove();
    }
    saveToSessionStorage()
}

function calculateTreeLevel(elementId) {
    let level = 0;
    let currentElement = document.getElementById(elementId);
    while (currentElement && currentElement.parentElement) {
        currentElement = currentElement.closest('li').parentElement.closest('li');
        if (currentElement) {
            level++;
        }
    }
    return level;
}

function createTree(caputData) {
    const treeContainer = document.getElementById('tree-container');
    const uniqueId = generateUniqueId(caputData.proprietario);
    caputObject = { ...caputData, derivacoes: [], uniqueId: uniqueId };
    const treeHTML = `
        <ul id="caput">
            <li>
                <a href="#">
                    <div> Número da matrícula <strong>${caputData.matricula}</strong></div>
                </a>
                <ul>
                    <li id="${uniqueId}">
                        <a href="#">
                            <div class="emoji">${caputData.sexo == "homem" ? "👨" : "👩"}</div>
                            <div> Proprietário - <strong>${caputData.proprietario}</strong></div>
                            <span>${caputData.tamanhoTerreno} Hectáres 📐</span>
                        </a>
                        <ul></ul>
                    </li>
                </ul>
            </li>
        </ul>
    `;
    treeContainer.innerHTML = treeHTML;

    document.getElementById(`${uniqueId}`).addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation(); 
        idFatherTreeElement = event.currentTarget.id;
        showModal(caputData, event.currentTarget.id);
    });

    saveToSessionStorage()
}

const storedData = sessionStorage.getItem('caput');
const storedHTML = sessionStorage.getItem('treeHTML');

if (storedHTML) {
    caputObject = JSON.parse(storedData);
    loadHTMLFromSessionStorage()
}
else if (storedData) {
    const caputData = JSON.parse(storedData);
    createTree(caputData);
} else {
    const treeContainer = document.getElementById('tree-container');
    treeContainer.innerHTML = ` <div style="color: red; font-size: 18px;">
            <strong>Atenção:</strong> Não foram encontrados dados do CAPUT.
            <br>Por favor, cadastre o CAPUT primeiro.
        </div>
    `;
}

document.getElementById('newDerivationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation(); 

    if (idFatherTreeElement) {
        const fatherTree = document.getElementById(idFatherTreeElement);
        const nextUl = fatherTree.querySelector('ul');
        const proprietario = document.getElementById('proprietario').value;
        const tamanhoTerreno = document.getElementById('tamanhoTerreno').value;
        const sexo = document.querySelector('input[name="sexo"]:checked').value;
        const uniqueIdDerivation = generateUniqueId(proprietario);
        const level = calculateTreeLevel(idFatherTreeElement);
        const newLi = document.createElement('li');
        newLi.setAttribute('id', uniqueIdDerivation);
        newLi.innerHTML = `
            <a href="#">
                <div class="emoji">${sexo === "homem" ? "👨" : "👩"}</div>
                <div> Proprietário - <strong>${proprietario}</strong></div>
                <div>Derivação de ${level}</div>
                <span>${tamanhoTerreno} Hectáres 📐</span>
            </a>
            <ul></ul>
        `;

        nextUl.appendChild(newLi);

        newLi.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); 
            idFatherTreeElement = event.currentTarget.id;
            showModal({
                proprietario,
                tamanhoTerreno,
                sexo
            },event.currentTarget.id, true);
        });

        addDerivationToTree(idFatherTreeElement, {
            proprietario,
            tamanhoTerreno,
            sexo,
            uniqueId: uniqueIdDerivation,
            derivacoes: []
        });

    }

    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
});

function showModal(data,uniqueId, derivacao = false) {
    
    console.log(caputObject)
    const modal = document.getElementById('myModal');
    const modalInfo = document.getElementById('modal-info');

    modalInfo.innerHTML = `
        ${derivacao ? '' : `<p><strong>Número da Matrícula:</strong> ${data.matricula}</p>`}
        <p><strong>Proprietário:</strong> ${data.proprietario}</p>
        <p><strong>Tamanho do Terreno:</strong> ${data.tamanhoTerreno} Hectáres</p>
        <p><strong>Sexo:</strong> ${data.sexo === 'homem' ? '👨 Homem' : '👩 Mulher'}</p>
        <button class="delete-btn" data-id="${uniqueId}">Excluir Registro</button>
    `;

    modal.style.display = 'block';

    const span = document.getElementsByClassName('close')[0];
    span.onclick = function () {
        modal.style.display = 'none';
    };

    document.querySelector(`.delete-btn[data-id="${uniqueId}"]`).addEventListener('click', function () {
        deleteNode(uniqueId);
        modal.style.display = 'none';
    });
}

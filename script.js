// Dati iniziali di esempio
let datiLista = [
    {
        nome: "Marlboro Red",
        codice: "MAR001",
        prezzo: 6.00,
        marca: "Marlboro",
        tipoPacchetto: "duro",
        sezione: "Sigarette"
    },
    {
        nome: "Marlboro Gold",
        codice: "MAR002",
        prezzo: 6.00,
        marca: "Marlboro",
        tipoPacchetto: "duro",
        sezione: "Sigarette"
    },
    {
        nome: "Camel Blue",
        codice: "CAM001",
        prezzo: 5.80,
        marca: "Camel",
        tipoPacchetto: "morbido",
        sezione: "Sigarette"
    },
    {
        nome: "Lucky Strike Red",
        codice: "LUC001",
        prezzo: 5.50,
        marca: "Lucky Strike",
        tipoPacchetto: "duro",
        sezione: "Sigarette"
    },
    {
        nome: "Chesterfield Blue",
        codice: "CHE001",
        prezzo: 5.20,
        marca: "Chesterfield",
        tipoPacchetto: "morbido",
        sezione: "Sigarette"
    },
    {
        nome: "Tabacco Pueblo",
        codice: "PUE001",
        prezzo: 8.50,
        marca: "Pueblo",
        tipoPacchetto: "morbido",
        sezione: "Tabacchi"
    },
    {
        nome: "Tabacco Drum",
        codice: "DRU001",
        prezzo: 7.80,
        marca: "Drum",
        tipoPacchetto: "morbido",
        sezione: "Tabacchi"
    },
    {
        nome: "Cartine Rizla",
        codice: "RIZ001",
        prezzo: 0.80,
        marca: "Rizla",
        tipoPacchetto: "duro",
        sezione: "Accessori"
    },
    {
        nome: "Filtri Smoking",
        codice: "SMO001",
        prezzo: 1.20,
        marca: "Smoking",
        tipoPacchetto: "duro",
        sezione: "Accessori"
    },
    {
        nome: "Accendino Clipper",
        codice: "CLI001",
        prezzo: 2.50,
        marca: "Clipper",
        tipoPacchetto: "duro",
        sezione: "Accessori"
    }
];

// Opzioni di visualizzazione
let opzioniVisualizzazione = {
    nome: true,
    codice: true,
    prezzo: true,
    marca: true,
    tipoPacchetto: true,
    sezione: true
};

// Opzioni di copia
let opzioniCopia = {
    nome: true,
    codice: true,
    prezzo: true,
    marca: true,
    tipoPacchetto: true,
    sezione: true
};

// Selezioni correnti
let selezioni = new Set();

// Filtri correnti
let filtriCorrente = {
    marca: "",
    tipoPacchetto: ""
};

// Carica dati dal localStorage
function caricaDati() {
    const datiSalvati = localStorage.getItem('cigaretteListData');
    if (datiSalvati) {
        datiLista = JSON.parse(datiSalvati);
    }
    
    const opzioniVisSalvate = localStorage.getItem('displayOptions');
    if (opzioniVisSalvate) {
        opzioniVisualizzazione = JSON.parse(opzioniVisSalvate);
    }
    
    const opzioniCopiaSalvate = localStorage.getItem('copyOptions');
    if (opzioniCopiaSalvate) {
        opzioniCopia = JSON.parse(opzioniCopiaSalvate);
    }
}

// Salva dati nel localStorage
function salvaDati() {
    localStorage.setItem('cigaretteListData', JSON.stringify(datiLista));
    localStorage.setItem('displayOptions', JSON.stringify(opzioniVisualizzazione));
    localStorage.setItem('copyOptions', JSON.stringify(opzioniCopia));
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    caricaDati();
    inizializzaEventListeners();
    aggiornaFiltroMarche();
    renderizzaLista();
    applicaOpzioniVisualizzazione();
});

// Event Listeners
function inizializzaEventListeners() {
    // Filtri
    document.getElementById('filterMarca').addEventListener('change', applicaFiltri);
    document.getElementById('filterTipoPacchetto').addEventListener('change', applicaFiltri);
    document.getElementById('btnPulisciFiltro').addEventListener('click', pulisciFiltri);
    
    // Pulsanti azione superiori
    document.getElementById('btnModificaLista').addEventListener('click', apriModalModifica);
    document.getElementById('btnEsportaLista').addEventListener('click', esportaLista);
    document.getElementById('btnImportaLista').addEventListener('click', importaLista);
    document.getElementById('btnOpzioniVisualizzazione').addEventListener('click', apriModalVisualizzazione);
    
    // Pulsanti azione inferiori
    document.getElementById('btnInvertiSelezione').addEventListener('click', invertiSelezione);
    document.getElementById('btnOpzioniCopia').addEventListener('click', apriModalCopia);
    document.getElementById('btnCopia').addEventListener('click', copiaSelezionati);
    
    // Modal chiusura
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Chiudi modal cliccando fuori
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Form elemento
    document.getElementById('formElemento').addEventListener('submit', salvaElemento);
    
    // Applicazione opzioni
    document.getElementById('btnApplicaVisualizzazione').addEventListener('click', salvaOpzioniVisualizzazione);
    document.getElementById('btnApplicaCopia').addEventListener('click', salvaOpzioniCopia);
    
    // File input per importazione
    document.getElementById('fileInput').addEventListener('change', gestisciImportFile);
}

// Renderizza la lista
function renderizzaLista() {
    const container = document.getElementById('listaContainer');
    container.innerHTML = '';
    
    // Raggruppa per sezione
    const sezioni = {};
    datiLista.forEach((item, index) => {
        if (!sezioni[item.sezione]) {
            sezioni[item.sezione] = [];
        }
        sezioni[item.sezione].push({ ...item, originalIndex: index });
    });
    
    // Applica filtri
    const datiFiltrati = applicaFiltriAiDati(sezioni);
    
    // Renderizza ogni sezione
    Object.keys(datiFiltrati).sort().forEach(nomeSezione => {
        const sezioneDiv = document.createElement('div');
        sezioneDiv.className = 'sezione';
        
        // Header sezione
        const headerDiv = document.createElement('div');
        headerDiv.className = 'sezione-header';
        
        const titoloH2 = document.createElement('h2');
        titoloH2.textContent = nomeSezione;
        
        const btnSelezionaTutti = document.createElement('button');
        btnSelezionaTutti.className = 'btn btn-small btn-secondary';
        btnSelezionaTutti.textContent = 'Seleziona Tutti';
        btnSelezionaTutti.addEventListener('click', () => selezionaTuttiSezione(nomeSezione, true));
        
        const btnDeselezionaTutti = document.createElement('button');
        btnDeselezionaTutti.className = 'btn btn-small btn-secondary';
        btnDeselezionaTutti.textContent = 'Deseleziona Tutti';
        btnDeselezionaTutti.addEventListener('click', () => selezionaTuttiSezione(nomeSezione, false));
        
        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '10px';
        btnGroup.appendChild(btnSelezionaTutti);
        btnGroup.appendChild(btnDeselezionaTutti);
        
        headerDiv.appendChild(titoloH2);
        headerDiv.appendChild(btnGroup);
        
        // Items sezione
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'sezione-items';
        
        datiFiltrati[nomeSezione].forEach(item => {
            const itemDiv = creaElementoItem(item);
            itemsDiv.appendChild(itemDiv);
        });
        
        sezioneDiv.appendChild(headerDiv);
        sezioneDiv.appendChild(itemsDiv);
        container.appendChild(sezioneDiv);
    });
}

// Crea elemento item
function creaElementoItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.dataset.index = item.originalIndex;
    
    if (selezioni.has(item.originalIndex)) {
        itemDiv.classList.add('selected');
    }
    
    // Checkbox
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'item-checkbox';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selezioni.has(item.originalIndex);
    checkbox.addEventListener('change', function() {
        toggleSelezione(item.originalIndex);
    });
    checkboxDiv.appendChild(checkbox);
    
    // Top: Nome e Codice
    const topDiv = document.createElement('div');
    topDiv.className = 'item-top';
    
    if (opzioniVisualizzazione.nome) {
        const nomeSpan = document.createElement('span');
        nomeSpan.className = 'item-nome';
        nomeSpan.textContent = item.nome;
        topDiv.appendChild(nomeSpan);
    }
    
    if (opzioniVisualizzazione.codice) {
        const codiceSpan = document.createElement('span');
        codiceSpan.className = 'item-codice';
        codiceSpan.textContent = item.codice;
        topDiv.appendChild(codiceSpan);
    }
    
    // Bottom: Marca, Tipo Pacchetto, Sezione
    const bottomDiv = document.createElement('div');
    bottomDiv.className = 'item-bottom';
    
    if (opzioniVisualizzazione.marca) {
        const marcaDiv = document.createElement('div');
        marcaDiv.className = 'item-detail';
        const marcaLabel = document.createElement('span');
        marcaLabel.className = 'item-detail-label';
        marcaLabel.textContent = 'Marca:';
        const marcaValue = document.createElement('span');
        marcaValue.textContent = item.marca;
        marcaDiv.appendChild(marcaLabel);
        marcaDiv.appendChild(marcaValue);
        bottomDiv.appendChild(marcaDiv);
    }
    
    if (opzioniVisualizzazione.tipoPacchetto) {
        const tipoDiv = document.createElement('div');
        tipoDiv.className = 'item-detail';
        const tipoLabel = document.createElement('span');
        tipoLabel.className = 'item-detail-label';
        tipoLabel.textContent = 'Tipo:';
        const tipoValue = document.createElement('span');
        tipoValue.textContent = item.tipoPacchetto.charAt(0).toUpperCase() + item.tipoPacchetto.slice(1);
        tipoDiv.appendChild(tipoLabel);
        tipoDiv.appendChild(tipoValue);
        bottomDiv.appendChild(tipoDiv);
    }
    
    if (opzioniVisualizzazione.sezione) {
        const sezioneDiv = document.createElement('div');
        sezioneDiv.className = 'item-detail';
        const sezioneLabel = document.createElement('span');
        sezioneLabel.className = 'item-detail-label';
        sezioneLabel.textContent = 'Sezione:';
        const sezioneValue = document.createElement('span');
        sezioneValue.textContent = item.sezione;
        sezioneDiv.appendChild(sezioneLabel);
        sezioneDiv.appendChild(sezioneValue);
        bottomDiv.appendChild(sezioneDiv);
    }
    
    // Prezzo
    const prezzoDiv = document.createElement('div');
    prezzoDiv.className = 'item-prezzo';
    if (opzioniVisualizzazione.prezzo) {
        prezzoDiv.textContent = '€ ' + item.prezzo.toFixed(2);
    }
    
    itemDiv.appendChild(checkboxDiv);
    itemDiv.appendChild(topDiv);
    itemDiv.appendChild(bottomDiv);
    itemDiv.appendChild(prezzoDiv);
    
    return itemDiv;
}

// Toggle selezione
function toggleSelezione(index) {
    if (selezioni.has(index)) {
        selezioni.delete(index);
    } else {
        selezioni.add(index);
    }
    renderizzaLista();
}

// Seleziona/Deseleziona tutti in una sezione
function selezionaTuttiSezione(nomeSezione, seleziona) {
    datiLista.forEach((item, index) => {
        if (item.sezione === nomeSezione) {
            // Verifica se l'item passa i filtri
            if (passaFiltri(item)) {
                if (seleziona) {
                    selezioni.add(index);
                } else {
                    selezioni.delete(index);
                }
            }
        }
    });
    renderizzaLista();
}

// Inverti selezione
function invertiSelezione() {
    const nuoveSelezioni = new Set();
    datiLista.forEach((item, index) => {
        if (passaFiltri(item)) {
            if (!selezioni.has(index)) {
                nuoveSelezioni.add(index);
            }
        }
    });
    selezioni = nuoveSelezioni;
    renderizzaLista();
}

// Verifica se un item passa i filtri
function passaFiltri(item) {
    if (filtriCorrente.marca && item.marca !== filtriCorrente.marca) {
        return false;
    }
    if (filtriCorrente.tipoPacchetto && item.tipoPacchetto !== filtriCorrente.tipoPacchetto) {
        return false;
    }
    return true;
}

// Applica filtri ai dati
function applicaFiltriAiDati(sezioni) {
    const risultato = {};
    
    Object.keys(sezioni).forEach(nomeSezione => {
        const itemsFiltrati = sezioni[nomeSezione].filter(item => passaFiltri(item));
        if (itemsFiltrati.length > 0) {
            risultato[nomeSezione] = itemsFiltrati;
        }
    });
    
    return risultato;
}

// Applica filtri
function applicaFiltri() {
    filtriCorrente.marca = document.getElementById('filterMarca').value;
    filtriCorrente.tipoPacchetto = document.getElementById('filterTipoPacchetto').value;
    renderizzaLista();
}

// Pulisci filtri
function pulisciFiltri() {
    document.getElementById('filterMarca').value = '';
    document.getElementById('filterTipoPacchetto').value = '';
    filtriCorrente.marca = '';
    filtriCorrente.tipoPacchetto = '';
    renderizzaLista();
}

// Aggiorna filtro marche
function aggiornaFiltroMarche() {
    const selectMarca = document.getElementById('filterMarca');
    const marcheUniche = [...new Set(datiLista.map(item => item.marca))].sort();
    
    selectMarca.innerHTML = '<option value="">Tutte</option>';
    marcheUniche.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        selectMarca.appendChild(option);
    });
}

// Modal Modifica Lista
function apriModalModifica() {
    document.getElementById('modalModifica').style.display = 'block';
    renderizzaListaModifica();
}

function renderizzaListaModifica() {
    const container = document.getElementById('listaModifica');
    container.innerHTML = '';
    
    datiLista.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'modifica-item';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'modifica-item-info';
        
        const nomeSpan = document.createElement('div');
        nomeSpan.className = 'modifica-item-nome';
        nomeSpan.textContent = item.nome;
        
        const codiceSpan = document.createElement('div');
        codiceSpan.className = 'modifica-item-codice';
        codiceSpan.textContent = `${item.codice} - €${item.prezzo.toFixed(2)} - ${item.marca}`;
        
        infoDiv.appendChild(nomeSpan);
        infoDiv.appendChild(codiceSpan);
        
        // Controlli di spostamento
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'modifica-item-controls';
        
        const btnSu = document.createElement('button');
        btnSu.className = 'btn-move';
        btnSu.textContent = '▲';
        btnSu.disabled = index === 0;
        btnSu.addEventListener('click', () => spostaElemento(index, -1));
        
        const btnGiu = document.createElement('button');
        btnGiu.className = 'btn-move';
        btnGiu.textContent = '▼';
        btnGiu.disabled = index === datiLista.length - 1;
        btnGiu.addEventListener('click', () => spostaElemento(index, 1));
        
        controlsDiv.appendChild(btnSu);
        controlsDiv.appendChild(btnGiu);
        
        // Azioni
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'modifica-item-actions';
        
        const btnModifica = document.createElement('button');
        btnModifica.className = 'btn btn-small btn-primary';
        btnModifica.textContent = 'Modifica';
        btnModifica.addEventListener('click', () => modificaElemento(index));
        
        const btnElimina = document.createElement('button');
        btnElimina.className = 'btn btn-small btn-danger';
        btnElimina.textContent = 'Elimina';
        btnElimina.addEventListener('click', () => eliminaElemento(index));
        
        actionsDiv.appendChild(btnModifica);
        actionsDiv.appendChild(btnElimina);
        
        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(controlsDiv);
        itemDiv.appendChild(actionsDiv);
        
        container.appendChild(itemDiv);
    });
}

function spostaElemento(index, direzione) {
    const nuovoIndex = index + direzione;
    if (nuovoIndex < 0 || nuovoIndex >= datiLista.length) return;
    
    [datiLista[index], datiLista[nuovoIndex]] = [datiLista[nuovoIndex], datiLista[index]];
    
    // Aggiorna selezioni
    const nuoveSelezioni = new Set();
    selezioni.forEach(selIndex => {
        if (selIndex === index) {
            nuoveSelezioni.add(nuovoIndex);
        } else if (selIndex === nuovoIndex) {
            nuoveSelezioni.add(index);
        } else {
            nuoveSelezioni.add(selIndex);
        }
    });
    selezioni = nuoveSelezioni;
    
    salvaDati();
    renderizzaListaModifica();
    renderizzaLista();
    aggiornaFiltroMarche();
}

function modificaElemento(index) {
    const item = datiLista[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('inputNome').value = item.nome;
    document.getElementById('inputCodice').value = item.codice;
    document.getElementById('inputPrezzo').value = item.prezzo;
    document.getElementById('inputMarca').value = item.marca;
    document.getElementById('inputTipoPacchetto').value = item.tipoPacchetto;
    document.getElementById('inputSezione').value = item.sezione;
    
    document.querySelector('#formElemento button[type="submit"]').textContent = 'Aggiorna Elemento';
}

function eliminaElemento(index) {
    if (confirm('Sei sicuro di voler eliminare questo elemento?')) {
        datiLista.splice(index, 1);
        
        // Aggiorna selezioni
        const nuoveSelezioni = new Set();
        selezioni.forEach(selIndex => {
            if (selIndex < index) {
                nuoveSelezioni.add(selIndex);
            } else if (selIndex > index) {
                nuoveSelezioni.add(selIndex - 1);
            }
        });
        selezioni = nuoveSelezioni;
        
        salvaDati();
        renderizzaListaModifica();
        renderizzaLista();
        aggiornaFiltroMarche();
    }
}

function salvaElemento(e) {
    e.preventDefault();
    
    const editIndex = document.getElementById('editIndex').value;
    const elemento = {
        nome: document.getElementById('inputNome').value,
        codice: document.getElementById('inputCodice').value,
        prezzo: parseFloat(document.getElementById('inputPrezzo').value),
        marca: document.getElementById('inputMarca').value,
        tipoPacchetto: document.getElementById('inputTipoPacchetto').value,
        sezione: document.getElementById('inputSezione').value
    };
    
    if (editIndex === '') {
        // Nuovo elemento
        datiLista.push(elemento);
    } else {
        // Modifica elemento esistente
        datiLista[parseInt(editIndex)] = elemento;
    }
    
    salvaDati();
    renderizzaListaModifica();
    renderizzaLista();
    aggiornaFiltroMarche();
    
    // Reset form
    document.getElementById('formElemento').reset();
    document.getElementById('editIndex').value = '';
    document.querySelector('#formElemento button[type="submit"]').textContent = 'Salva Elemento';
}

// Esporta Lista
function esportaLista() {
    const dataStr = JSON.stringify(datiLista, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lista-sigarette.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Importa Lista
function importaLista() {
    document.getElementById('fileInput').click();
}

function gestisciImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const datiImportati = JSON.parse(event.target.result);
            if (Array.isArray(datiImportati)) {
                if (confirm('Vuoi sostituire la lista corrente con quella importata?')) {
                    datiLista = datiImportati;
                    selezioni.clear();
                    salvaDati();
                    renderizzaLista();
                    aggiornaFiltroMarche();
                    alert('Lista importata con successo!');
                }
            } else {
                alert('Formato file non valido!');
            }
        } catch (error) {
            alert('Errore durante l\'importazione del file!');
        }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
}

// Modal Opzioni Visualizzazione
function apriModalVisualizzazione() {
    document.getElementById('modalVisualizzazione').style.display = 'block';
    
    // Imposta checkbox in base alle opzioni correnti
    document.getElementById('showNome').checked = opzioniVisualizzazione.nome;
    document.getElementById('showCodice').checked = opzioniVisualizzazione.codice;
    document.getElementById('showPrezzo').checked = opzioniVisualizzazione.prezzo;
    document.getElementById('showMarca').checked = opzioniVisualizzazione.marca;
    document.getElementById('showTipoPacchetto').checked = opzioniVisualizzazione.tipoPacchetto;
    document.getElementById('showSezione').checked = opzioniVisualizzazione.sezione;
}

function salvaOpzioniVisualizzazione() {
    opzioniVisualizzazione.nome = document.getElementById('showNome').checked;
    opzioniVisualizzazione.codice = document.getElementById('showCodice').checked;
    opzioniVisualizzazione.prezzo = document.getElementById('showPrezzo').checked;
    opzioniVisualizzazione.marca = document.getElementById('showMarca').checked;
    opzioniVisualizzazione.tipoPacchetto = document.getElementById('showTipoPacchetto').checked;
    opzioniVisualizzazione.sezione = document.getElementById('showSezione').checked;
    
    salvaDati();
    applicaOpzioniVisualizzazione();
    renderizzaLista();
    document.getElementById('modalVisualizzazione').style.display = 'none';
}

function applicaOpzioniVisualizzazione() {
    // Le opzioni vengono applicate durante il rendering
}

// Modal Opzioni Copia
function apriModalCopia() {
    document.getElementById('modalCopia').style.display = 'block';
    
    // Imposta checkbox in base alle opzioni correnti
    document.getElementById('copyNome').checked = opzioniCopia.nome;
    document.getElementById('copyCodice').checked = opzioniCopia.codice;
    document.getElementById('copyPrezzo').checked = opzioniCopia.prezzo;
    document.getElementById('copyMarca').checked = opzioniCopia.marca;
    document.getElementById('copyTipoPacchetto').checked = opzioniCopia.tipoPacchetto;
    document.getElementById('copySezione').checked = opzioniCopia.sezione;
}

function salvaOpzioniCopia() {
    opzioniCopia.nome = document.getElementById('copyNome').checked;
    opzioniCopia.codice = document.getElementById('copyCodice').checked;
    opzioniCopia.prezzo = document.getElementById('copyPrezzo').checked;
    opzioniCopia.marca = document.getElementById('copyMarca').checked;
    opzioniCopia.tipoPacchetto = document.getElementById('copyTipoPacchetto').checked;
    opzioniCopia.sezione = document.getElementById('copySezione').checked;
    
    salvaDati();
    document.getElementById('modalCopia').style.display = 'none';
}

// Copia elementi selezionati
function copiaSelezionati() {
    if (selezioni.size === 0) {
        alert('Nessun elemento selezionato!');
        return;
    }
    
    let testoCopiato = '';
    const indiciSelezionati = Array.from(selezioni).sort((a, b) => a - b);
    
    indiciSelezionati.forEach(index => {
        const item = datiLista[index];
        const parti = [];
        
        if (opzioniCopia.nome) parti.push(`Nome: ${item.nome}`);
        if (opzioniCopia.codice) parti.push(`Codice: ${item.codice}`);
        if (opzioniCopia.prezzo) parti.push(`Prezzo: €${item.prezzo.toFixed(2)}`);
        if (opzioniCopia.marca) parti.push(`Marca: ${item.marca}`);
        if (opzioniCopia.tipoPacchetto) parti.push(`Tipo Pacchetto: ${item.tipoPacchetto}`);
        if (opzioniCopia.sezione) parti.push(`Sezione: ${item.sezione}`);
        
        testoCopiato += parti.join(' | ') + '\n';
    });
    
    // Copia nella clipboard
    navigator.clipboard.writeText(testoCopiato).then(() => {
        alert(`${selezioni.size} elemento/i copiato/i nella clipboard!`);
    }).catch(err => {
        alert('Errore durante la copia: ' + err);
    });
}

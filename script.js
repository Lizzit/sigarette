// STATO DELL'APPLICAZIONE
let appData = {
    sections: [],
    items: [],
    displayOptions: {
        showName: true,
        showCode: true,
        showPrice: true,
        showBrand: true,
        showPackage: true,
        showSection: true
    },
    copyOptions: {
        copyName: true,
        copyCode: true,
        copyPrice: true,
        copyBrand: true,
        copyPackage: true,
        copySection: true,
        includeLabels: true
    },
    filters: {
        brand: '',
        package: ''
    }
};

// INIZIALIZZAZIONE
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadSettings();
    initializeEventListeners();
    renderItems();
    updateBrandFilter();
});

// CARICAMENTO DATI DA LOCALSTORAGE
function loadData() {
    const savedData = localStorage.getItem('cigaretteListData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        appData.sections = parsed.sections || [];
        appData.items = parsed.items || [];
    } else {
        // Dati di esempio
        appData.sections = [
            { id: 1, name: 'Sigarette', order: 0 },
            { id: 2, name: 'Tabacchi', order: 1 },
            { id: 3, name: 'Accessori', order: 2 }
        ];
        appData.items = [
            { id: 1, name: 'Marlboro Red', code: 'MAR001', price: 6.00, brand: 'Marlboro', package: 'duro', sectionId: 1, order: 0 },
            { id: 2, name: 'Marlboro Gold', code: 'MAR002', price: 6.00, brand: 'Marlboro', package: 'duro', sectionId: 1, order: 1 },
            { id: 3, name: 'Camel Blue', code: 'CAM001', price: 5.80, brand: 'Camel', package: 'morbido', sectionId: 1, order: 2 },
            { id: 4, name: 'Lucky Strike Red', code: 'LUC001', price: 5.50, brand: 'Lucky Strike', package: 'duro', sectionId: 1, order: 3 },
            { id: 5, name: 'Tabacco Virginia', code: 'TAB001', price: 12.00, brand: 'Golden Virginia', package: 'morbido', sectionId: 2, order: 0 },
            { id: 6, name: 'Accendino Zippo', code: 'ACC001', price: 25.00, brand: 'Zippo', package: 'duro', sectionId: 3, order: 0 }
        ];
        saveData();
    }
}

// CARICAMENTO IMPOSTAZIONI DA LOCALSTORAGE
function loadSettings() {
    const savedSettings = localStorage.getItem('cigaretteListSettings');
    if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        appData.displayOptions = parsed.displayOptions || appData.displayOptions;
        appData.copyOptions = parsed.copyOptions || appData.copyOptions;
    }
    applyDisplayOptions();
}

// SALVATAGGIO DATI
function saveData() {
    localStorage.setItem('cigaretteListData', JSON.stringify({
        sections: appData.sections,
        items: appData.items
    }));
}

// SALVATAGGIO IMPOSTAZIONI
function saveSettings() {
    localStorage.setItem('cigaretteListSettings', JSON.stringify({
        displayOptions: appData.displayOptions,
        copyOptions: appData.copyOptions
    }));
}

// INIZIALIZZAZIONE EVENT LISTENERS
function initializeEventListeners() {
    // Filtri
    document.getElementById('filter-brand').addEventListener('change', (e) => {
        appData.filters.brand = e.target.value;
        renderItems();
    });

    document.getElementById('filter-package').addEventListener('change', (e) => {
        appData.filters.package = e.target.value;
        renderItems();
    });

    document.getElementById('clear-filters').addEventListener('click', () => {
        appData.filters.brand = '';
        appData.filters.package = '';
        document.getElementById('filter-brand').value = '';
        document.getElementById('filter-package').value = '';
        renderItems();
    });

    // Pulsanti azione
    document.getElementById('edit-list').addEventListener('click', openEditModal);
    document.getElementById('export-list').addEventListener('click', exportList);
    document.getElementById('import-list').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });
    document.getElementById('export-settings').addEventListener('click', exportSettings);
    document.getElementById('import-settings').addEventListener('click', () => {
        document.getElementById('import-settings-input').click();
    });
    document.getElementById('display-options').addEventListener('click', openDisplayModal);

    // Pulsanti inferiori
    document.getElementById('invert-selection').addEventListener('click', invertSelection);
    document.getElementById('copy-options').addEventListener('click', openCopyOptionsModal);
    document.getElementById('copy-btn').addEventListener('click', copySelected);

    // Import files
    document.getElementById('import-file-input').addEventListener('change', importList);
    document.getElementById('import-settings-input').addEventListener('change', importSettings);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Click fuori dal modal per chiudere
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// RENDERING DEGLI ELEMENTI
function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    // Ordina sezioni
    const sortedSections = [...appData.sections].sort((a, b) => a.order - b.order);

    sortedSections.forEach(section => {
        // Filtra elementi per sezione
        let sectionItems = appData.items.filter(item => item.sectionId === section.id);
        
        // Applica filtri
        if (appData.filters.brand) {
            sectionItems = sectionItems.filter(item => item.brand === appData.filters.brand);
        }
        if (appData.filters.package) {
            sectionItems = sectionItems.filter(item => item.package === appData.filters.package);
        }

        // Ordina elementi
        sectionItems.sort((a, b) => a.order - b.order);

        if (sectionItems.length === 0) return;

        // Crea sezione
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.dataset.sectionId = section.id;

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';

        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = section.name;

        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'section-select-all';
        selectAllBtn.textContent = 'Seleziona tutti';
        selectAllBtn.addEventListener('click', () => toggleSectionSelection(section.id));

        sectionHeader.appendChild(sectionTitle);
        sectionHeader.appendChild(selectAllBtn);

        const sectionItemsDiv = document.createElement('div');
        sectionItemsDiv.className = 'section-items';

        sectionItems.forEach(item => {
            const itemDiv = createItemElement(item, section);
            sectionItemsDiv.appendChild(itemDiv);
        });

        sectionDiv.appendChild(sectionHeader);
        sectionDiv.appendChild(sectionItemsDiv);
        container.appendChild(sectionDiv);
    });
}

// CREA ELEMENTO ITEM
function createItemElement(item, section) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.dataset.itemId = item.id;

    // Checkbox
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'item-checkbox';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.itemId = item.id;
    checkboxDiv.appendChild(checkbox);

    // Top (nome e codice)
    const topDiv = document.createElement('div');
    topDiv.className = 'item-top';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.textContent = item.name;

    const codeSpan = document.createElement('span');
    codeSpan.className = 'item-code';
    codeSpan.textContent = item.code;

    topDiv.appendChild(nameSpan);
    topDiv.appendChild(codeSpan);

    // Bottom (marca, tipo pacchetto, sezione)
    const bottomDiv = document.createElement('div');
    bottomDiv.className = 'item-bottom';

    const brandSpan = document.createElement('span');
    brandSpan.className = 'item-brand';
    brandSpan.textContent = item.brand;

    const packageSpan = document.createElement('span');
    packageSpan.className = 'item-package';
    packageSpan.textContent = item.package;

    const sectionSpan = document.createElement('span');
    sectionSpan.className = 'item-section';
    sectionSpan.textContent = section.name;

    bottomDiv.appendChild(brandSpan);
    bottomDiv.appendChild(packageSpan);
    bottomDiv.appendChild(sectionSpan);

    // Prezzo
    const priceDiv = document.createElement('div');
    priceDiv.className = 'item-price';
    priceDiv.textContent = `€ ${item.price.toFixed(2)}`;

    itemDiv.appendChild(checkboxDiv);
    itemDiv.appendChild(topDiv);
    itemDiv.appendChild(bottomDiv);
    itemDiv.appendChild(priceDiv);

    return itemDiv;
}

// TOGGLE SELEZIONE SEZIONE
function toggleSectionSelection(sectionId) {
    const sectionDiv = document.querySelector(`[data-section-id="${sectionId}"]`);
    const checkboxes = sectionDiv.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });
}

// INVERTI SELEZIONE
function invertSelection() {
    const checkboxes = document.querySelectorAll('.item-checkbox input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = !cb.checked;
    });
}

// COPIA ELEMENTI SELEZIONATI
function copySelected() {
    const checkboxes = document.querySelectorAll('.item-checkbox input[type="checkbox"]:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.itemId));
    const selectedItems = appData.items.filter(item => selectedIds.includes(item.id));

    if (selectedItems.length === 0) {
        alert('Nessun elemento selezionato');
        return;
    }

    let copyText = '';
    selectedItems.forEach((item, index) => {
        const section = appData.sections.find(s => s.id === item.sectionId);
        const parts = [];

        if (appData.copyOptions.copyName) {
            parts.push(appData.copyOptions.includeLabels ? `Nome: ${item.name}` : item.name);
        }
        if (appData.copyOptions.copyCode) {
            parts.push(appData.copyOptions.includeLabels ? `Codice: ${item.code}` : item.code);
        }
        if (appData.copyOptions.copyPrice) {
            parts.push(appData.copyOptions.includeLabels ? `Prezzo: € ${item.price.toFixed(2)}` : `€ ${item.price.toFixed(2)}`);
        }
        if (appData.copyOptions.copyBrand) {
            parts.push(appData.copyOptions.includeLabels ? `Marca: ${item.brand}` : item.brand);
        }
        if (appData.copyOptions.copyPackage) {
            parts.push(appData.copyOptions.includeLabels ? `Tipo pacchetto: ${item.package}` : item.package);
        }
        if (appData.copyOptions.copySection && section) {
            parts.push(appData.copyOptions.includeLabels ? `Sezione: ${section.name}` : section.name);
        }

        copyText += parts.join(' | ') + '\n';
    });

    navigator.clipboard.writeText(copyText).then(() => {
        alert(`${selectedItems.length} elementi copiati negli appunti`);
    }).catch(err => {
        alert('Errore durante la copia: ' + err);
    });
}

// MODAL MODIFICA LISTA
function openEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block';
    renderEditSections();
    renderEditItems();

    // Event listeners per i pulsanti del modal
    document.getElementById('add-section').onclick = addSection;
    document.getElementById('add-item').onclick = addItem;
    document.getElementById('save-changes').onclick = () => {
        modal.style.display = 'none';
        saveData();
        renderItems();
        updateBrandFilter();
    };
}

// RENDER SEZIONI IN EDIT MODE
function renderEditSections() {
    const container = document.getElementById('sections-list');
    container.innerHTML = '';

    const sortedSections = [...appData.sections].sort((a, b) => a.order - b.order);

    sortedSections.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-edit-item';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Nome sezione:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = section.name;
        nameInput.addEventListener('change', (e) => {
            section.name = e.target.value;
        });

        const controls = document.createElement('div');
        controls.className = 'edit-controls';

        if (index > 0) {
            const moveUpBtn = document.createElement('button');
            moveUpBtn.className = 'move-btn';
            moveUpBtn.textContent = '↑ Su';
            moveUpBtn.addEventListener('click', () => {
                const prevSection = sortedSections[index - 1];
                const tempOrder = section.order;
                section.order = prevSection.order;
                prevSection.order = tempOrder;
                renderEditSections();
            });
            controls.appendChild(moveUpBtn);
        }

        if (index < sortedSections.length - 1) {
            const moveDownBtn = document.createElement('button');
            moveDownBtn.className = 'move-btn';
            moveDownBtn.textContent = '↓ Giù';
            moveDownBtn.addEventListener('click', () => {
                const nextSection = sortedSections[index + 1];
                const tempOrder = section.order;
                section.order = nextSection.order;
                nextSection.order = tempOrder;
                renderEditSections();
            });
            controls.appendChild(moveDownBtn);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Elimina';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Eliminare la sezione "${section.name}"? Tutti gli elementi in questa sezione verranno eliminati.`)) {
                appData.items = appData.items.filter(item => item.sectionId !== section.id);
                appData.sections = appData.sections.filter(s => s.id !== section.id);
                renderEditSections();
                renderEditItems();
            }
        });
        controls.appendChild(deleteBtn);

        sectionDiv.appendChild(nameLabel);
        sectionDiv.appendChild(nameInput);
        sectionDiv.appendChild(controls);
        container.appendChild(sectionDiv);
    });
}

// RENDER ELEMENTI IN EDIT MODE
function renderEditItems() {
    const container = document.getElementById('edit-items-list');
    container.innerHTML = '';

    const sortedItems = [...appData.items].sort((a, b) => {
        if (a.sectionId !== b.sectionId) {
            const sectionA = appData.sections.find(s => s.id === a.sectionId);
            const sectionB = appData.sections.find(s => s.id === b.sectionId);
            return (sectionA?.order || 0) - (sectionB?.order || 0);
        }
        return a.order - b.order;
    });

    sortedItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-edit-item';

        const fields = [
            { label: 'Nome:', key: 'name', type: 'text' },
            { label: 'Codice:', key: 'code', type: 'text' },
            { label: 'Prezzo (€):', key: 'price', type: 'number' },
            { label: 'Marca:', key: 'brand', type: 'text' }
        ];

        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;
            const input = document.createElement('input');
            input.type = field.type;
            input.value = item[field.key];
            if (field.type === 'number') {
                input.step = '0.01';
            }
            input.addEventListener('change', (e) => {
                item[field.key] = field.type === 'number' ? parseFloat(e.target.value) : e.target.value;
            });
            itemDiv.appendChild(label);
            itemDiv.appendChild(input);
        });

        // Tipo pacchetto
        const packageLabel = document.createElement('label');
        packageLabel.textContent = 'Tipo pacchetto:';
        const packageSelect = document.createElement('select');
        ['morbido', 'duro'].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            option.selected = item.package === type;
            packageSelect.appendChild(option);
        });
        packageSelect.addEventListener('change', (e) => {
            item.package = e.target.value;
        });
        itemDiv.appendChild(packageLabel);
        itemDiv.appendChild(packageSelect);

        // Sezione
        const sectionLabel = document.createElement('label');
        sectionLabel.textContent = 'Sezione:';
        const sectionSelect = document.createElement('select');
        appData.sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section.id;
            option.textContent = section.name;
            option.selected = item.sectionId === section.id;
            sectionSelect.appendChild(option);
        });
        sectionSelect.addEventListener('change', (e) => {
            item.sectionId = parseInt(e.target.value);
        });
        itemDiv.appendChild(sectionLabel);
        itemDiv.appendChild(sectionSelect);

        // Controlli
        const controls = document.createElement('div');
        controls.className = 'edit-controls';

        // Trova elementi nella stessa sezione
        const sectionItems = sortedItems.filter(i => i.sectionId === item.sectionId);
        const indexInSection = sectionItems.findIndex(i => i.id === item.id);

        if (indexInSection > 0) {
            const moveUpBtn = document.createElement('button');
            moveUpBtn.className = 'move-btn';
            moveUpBtn.textContent = '↑ Su';
            moveUpBtn.addEventListener('click', () => {
                const prevItem = sectionItems[indexInSection - 1];
                const tempOrder = item.order;
                item.order = prevItem.order;
                prevItem.order = tempOrder;
                renderEditItems();
            });
            controls.appendChild(moveUpBtn);
        }

        if (indexInSection < sectionItems.length - 1) {
            const moveDownBtn = document.createElement('button');
            moveDownBtn.className = 'move-btn';
            moveDownBtn.textContent = '↓ Giù';
            moveDownBtn.addEventListener('click', () => {
                const nextItem = sectionItems[indexInSection + 1];
                const tempOrder = item.order;
                item.order = nextItem.order;
                nextItem.order = tempOrder;
                renderEditItems();
            });
            controls.appendChild(moveDownBtn);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Elimina';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Eliminare "${item.name}"?`)) {
                appData.items = appData.items.filter(i => i.id !== item.id);
                renderEditItems();
            }
        });
        controls.appendChild(deleteBtn);

        itemDiv.appendChild(controls);
        container.appendChild(itemDiv);
    });
}

// AGGIUNGI SEZIONE
function addSection() {
    const name = prompt('Nome della nuova sezione:');
    if (!name) return;

    const newSection = {
        id: Date.now(),
        name: name,
        order: appData.sections.length
    };

    appData.sections.push(newSection);
    renderEditSections();
}

// AGGIUNGI ELEMENTO
function addItem() {
    if (appData.sections.length === 0) {
        alert('Crea prima una sezione');
        return;
    }

    const firstSection = appData.sections[0];
    const sectionItems = appData.items.filter(i => i.sectionId === firstSection.id);

    const newItem = {
        id: Date.now(),
        name: 'Nuovo elemento',
        code: 'NEW' + Date.now(),
        price: 0,
        brand: 'Marca',
        package: 'duro',
        sectionId: firstSection.id,
        order: sectionItems.length
    };

    appData.items.push(newItem);
    renderEditItems();
}

// MODAL OPZIONI VISUALIZZAZIONE
function openDisplayModal() {
    const modal = document.getElementById('display-modal');
    modal.style.display = 'block';

    // Imposta valori attuali
    document.getElementById('show-name').checked = appData.displayOptions.showName;
    document.getElementById('show-code').checked = appData.displayOptions.showCode;
    document.getElementById('show-price').checked = appData.displayOptions.showPrice;
    document.getElementById('show-brand').checked = appData.displayOptions.showBrand;
    document.getElementById('show-package').checked = appData.displayOptions.showPackage;
    document.getElementById('show-section').checked = appData.displayOptions.showSection;

    document.getElementById('save-display-options').onclick = () => {
        appData.displayOptions.showName = document.getElementById('show-name').checked;
        appData.displayOptions.showCode = document.getElementById('show-code').checked;
        appData.displayOptions.showPrice = document.getElementById('show-price').checked;
        appData.displayOptions.showBrand = document.getElementById('show-brand').checked;
        appData.displayOptions.showPackage = document.getElementById('show-package').checked;
        appData.displayOptions.showSection = document.getElementById('show-section').checked;

        saveSettings();
        applyDisplayOptions();
        modal.style.display = 'none';
    };
}

// APPLICA OPZIONI VISUALIZZAZIONE
function applyDisplayOptions() {
    const container = document.getElementById('items-container');
    
    container.classList.toggle('hide-name', !appData.displayOptions.showName);
    container.classList.toggle('hide-code', !appData.displayOptions.showCode);
    container.classList.toggle('hide-price', !appData.displayOptions.showPrice);
    container.classList.toggle('hide-brand', !appData.displayOptions.showBrand);
    container.classList.toggle('hide-package', !appData.displayOptions.showPackage);
    container.classList.toggle('hide-section', !appData.displayOptions.showSection);
}

// MODAL OPZIONI COPIA
function openCopyOptionsModal() {
    const modal = document.getElementById('copy-options-modal');
    modal.style.display = 'block';

    // Imposta valori attuali
    document.getElementById('copy-name').checked = appData.copyOptions.copyName;
    document.getElementById('copy-code').checked = appData.copyOptions.copyCode;
    document.getElementById('copy-price').checked = appData.copyOptions.copyPrice;
    document.getElementById('copy-brand').checked = appData.copyOptions.copyBrand;
    document.getElementById('copy-package').checked = appData.copyOptions.copyPackage;
    document.getElementById('copy-section').checked = appData.copyOptions.copySection;
    document.getElementById('copy-include-labels').checked = appData.copyOptions.includeLabels;

    document.getElementById('save-copy-options').onclick = () => {
        appData.copyOptions.copyName = document.getElementById('copy-name').checked;
        appData.copyOptions.copyCode = document.getElementById('copy-code').checked;
        appData.copyOptions.copyPrice = document.getElementById('copy-price').checked;
        appData.copyOptions.copyBrand = document.getElementById('copy-brand').checked;
        appData.copyOptions.copyPackage = document.getElementById('copy-package').checked;
        appData.copyOptions.copySection = document.getElementById('copy-section').checked;
        appData.copyOptions.includeLabels = document.getElementById('copy-include-labels').checked;

        saveSettings();
        modal.style.display = 'none';
    };
}

// ESPORTA LISTA
function exportList() {
    const dataStr = JSON.stringify({
        sections: appData.sections,
        items: appData.items
    }, null, 2);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lista_sigarette.json';
    link.click();
    URL.revokeObjectURL(url);
}

// IMPORTA LISTA
function importList(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.sections && data.items) {
                appData.sections = data.sections;
                appData.items = data.items;
                saveData();
                renderItems();
                updateBrandFilter();
                alert('Lista importata con successo');
            } else {
                alert('Formato file non valido');
            }
        } catch (err) {
            alert('Errore durante l\'importazione: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ESPORTA IMPOSTAZIONI
function exportSettings() {
    const dataStr = JSON.stringify({
        displayOptions: appData.displayOptions,
        copyOptions: appData.copyOptions
    }, null, 2);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'impostazioni_lista.json';
    link.click();
    URL.revokeObjectURL(url);
}

// IMPORTA IMPOSTAZIONI
function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.displayOptions && data.copyOptions) {
                appData.displayOptions = data.displayOptions;
                appData.copyOptions = data.copyOptions;
                saveSettings();
                applyDisplayOptions();
                alert('Impostazioni importate con successo');
            } else {
                alert('Formato file non valido');
            }
        } catch (err) {
            alert('Errore durante l\'importazione: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// AGGIORNA FILTRO MARCA
function updateBrandFilter() {
    const select = document.getElementById('filter-brand');
    const currentValue = select.value;
    
    // Ottieni tutte le marche uniche
    const brands = [...new Set(appData.items.map(item => item.brand))].sort();
    
    select.innerHTML = '<option value="">Tutte</option>';
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}


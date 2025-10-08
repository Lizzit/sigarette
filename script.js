
// --- DATI DEMO E STRUTTURA BASE ---
const DEFAULT_LIST = [
	{
		section: "Sigarette",
		items: [
			{ nome: "Marlboro Rosse", codice: "001", prezzo: 6.00, marca: "Marlboro", pacchetto: "duro", selected: false },
			{ nome: "Camel Blue", codice: "002", prezzo: 5.80, marca: "Camel", pacchetto: "morbido", selected: false },
		]
	},
	{
		section: "Tabacchi",
		items: [
			{ nome: "Drum Blu", codice: "101", prezzo: 9.50, marca: "Drum", pacchetto: "duro", selected: false },
		]
	},
	{
		section: "Accessori",
		items: [
			{ nome: "Cartine Rizla", codice: "201", prezzo: 1.20, marca: "Rizla", pacchetto: "duro", selected: false },
		]
	}
];

const STORAGE_KEY_LIST = "sigarette-list";
const STORAGE_KEY_OPTIONS = "sigarette-options";

let lista = loadList();
let options = loadOptions();

// --- RENDERING LISTA E SEZIONI ---
function renderSections() {
	const container = document.getElementById("sections-container");
	container.innerHTML = "";
	lista.forEach((sezione, idx) => {
		const sectionDiv = document.createElement("div");
		sectionDiv.className = "section";

		// Header sezione
		const header = document.createElement("div");
		header.className = "section-header";
		header.innerHTML = `<span class="section-title">${sezione.section}</span>`;
		const selectBtn = document.createElement("button");
		selectBtn.className = "section-select-btn";
		selectBtn.textContent = "Seleziona/Deseleziona tutti";
		selectBtn.onclick = () => toggleSectionSelection(idx);
		header.appendChild(selectBtn);
		sectionDiv.appendChild(header);

		// Lista elementi
		sezione.items.forEach((item, itemIdx) => {
			if (!filterItem(item)) return;
			const itemDiv = document.createElement("div");
			itemDiv.className = "item";

			// Checkbox
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.className = "item-checkbox";
			checkbox.checked = !!item.selected;
			checkbox.onchange = () => {
				item.selected = checkbox.checked;
				saveList();
			};
			itemDiv.appendChild(checkbox);

			// Dettagli
			const detailsDiv = document.createElement("div");
			detailsDiv.className = "item-details";
			detailsDiv.innerHTML = `
				<div class="item-row1">
					<span class="item-name">${item.nome}</span>
					<span class="item-code">${item.codice}</span>
				</div>
				<div class="item-row2">
					<span class="item-brand">${item.marca}</span>
					<span class="item-package">${item.pacchetto}</span>
					<span class="item-section">${sezione.section}</span>
				</div>
			`;
			itemDiv.appendChild(detailsDiv);

			// Prezzo
			const priceDiv = document.createElement("div");
			priceDiv.className = "item-price";
			priceDiv.textContent = item.prezzo.toFixed(2) + "€";
			itemDiv.appendChild(priceDiv);

			sectionDiv.appendChild(itemDiv);
		});
		container.appendChild(sectionDiv);
	});
}

// --- FILTRI ---
function filterItem(item) {
	const brand = document.getElementById("filter-brand").value;
	const pack = document.getElementById("filter-package").value;
	if (brand && item.marca !== brand) return false;
	if (pack && item.pacchetto !== pack) return false;
	return true;
}

function populateBrandFilter() {
	const select = document.getElementById("filter-brand");
	const brands = Array.from(new Set(lista.flatMap(s => s.items.map(i => i.marca))));
	select.innerHTML = '<option value="">Marca</option>' + brands.map(b => `<option value="${b}">${b}</option>`).join("");
}

// --- SELEZIONE SEZIONE ---
function toggleSectionSelection(idx) {
	const items = lista[idx].items;
	const allSelected = items.every(i => i.selected);
	items.forEach(i => i.selected = !allSelected);
	saveList();
	renderSections();
}

// --- INVERTI SELEZIONE ---
document.getElementById("invert-selection").onclick = () => {
	lista.forEach(sez => sez.items.forEach(i => i.selected = !i.selected));
	saveList();
	renderSections();
};

// --- FILTRI EVENTI ---
document.getElementById("filter-brand").onchange = renderSections;
document.getElementById("filter-package").onchange = renderSections;
document.getElementById("clear-filter").onclick = () => {
	document.getElementById("filter-brand").value = "";
	document.getElementById("filter-package").value = "";
	renderSections();
};

// --- SALVATAGGIO E CARICAMENTO ---
function saveList() {
	localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(lista));
}
function loadList() {
	const data = localStorage.getItem(STORAGE_KEY_LIST);
	if (data) return JSON.parse(data);
	return JSON.parse(JSON.stringify(DEFAULT_LIST));
}
function saveOptions() {
	localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(options));
}
function loadOptions() {
	const data = localStorage.getItem(STORAGE_KEY_OPTIONS);
	if (data) return JSON.parse(data);
	return { copy: {}, view: {} };
}

// --- INIZIALIZZAZIONE ---
window.onload = () => {
	populateBrandFilter();
	renderSections();
};

// --- STUB PULSANTI (da implementare) ---
document.getElementById("edit-list").onclick = () => alert("Modifica lista: da implementare");
document.getElementById("export-list").onclick = () => alert("Esporta lista: da implementare");
document.getElementById("import-list").onclick = () => alert("Importa lista: da implementare");
document.getElementById("export-settings").onclick = () => alert("Esporta impostazioni: da implementare");
document.getElementById("import-settings").onclick = () => alert("Importa impostazioni: da implementare");
document.getElementById("view-options").onclick = () => alert("Opzioni visualizzazione: da implementare");
document.getElementById("copy-options").onclick = () => alert("Opzioni copia: da implementare");
document.getElementById("copy-list").onclick = () => alert("Copia: da implementare");

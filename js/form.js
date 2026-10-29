/* Form.js */

/* Import Functions */
import { showAlertBox } from '/js/script.js';
import { addRecord, deleteRecord, getRecord, getAllRecords, gettingUpdateRecords, renderRecordsList } from '/js/firestore-db.js';

/* New Fuel-Up Form */
export const fuelUpForm = document.getElementById('fuel-up-form');
const dropdownInputs = document.querySelectorAll('.dropdown-input');
const closeModalBtn = document.getElementById('close-modal-btn');
const resetFormBtn = document.getElementById('reset-form-btn');
const duplicateFormBtn = document.getElementById('duplicate-record-form-btn');
const doneFormBtn = document.getElementById('done-form-btn');
const formTitle = fuelUpForm.querySelector('.modal-title');
const formSubtitle = fuelUpForm.querySelector('.modal-subtitle');
const currentIndexOfTotalInfo = fuelUpForm.querySelector('.current-index-info');
const currentRecordIndexSpan = document.getElementById('current-record-index');
const totalRecordsCountSpan = document.getElementById('total-records-count');

/* Initial Form Datas */
export const initialFormData = {
    date: new Date().toISOString().split('T')[0],
    sequence: "",
    fillingType: "Partial",
    fuelType: "92 Ron",
    odometer: "",
    price: "",
    cost: "",
    fuelVolume: "",
    station: "",
    notes: ""
};

/* Global Variables */
const historyListContainer = document.getElementById('fuel-records-container');

export async function fuelUpFormFunc() {
    
    /* Save Form Button */
    doneFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = getFormDatas();
        const recordData = {};
        const keys = Object.keys(data);
        keys.forEach(key => {
            const value = data[key];
            recordData[key] = value;
        });
        addRecord(data);
        closeAllForms();
        closeAllModals();
        renderRecordsList();
    });
    
    /* Reset Form Button */
    resetFormBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fillFormDatas(initialFormData);
    });
    
    /* Close Form Button */
    closeModalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFuelForm();
    });
    
    /* Input Clear Buttons */
    const inputResetBtns = fuelUpForm.querySelectorAll('.input-reset-btn');
    inputResetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parentInputField = e.target.closest('.input-field');
            const relInput = parentInputField.querySelector('input');
            relInput.value = "";
            relInput.focus();
        });
    });
    
    /* Inputs တွေရဲ့အပြင်ဘက်ကို Click လိုက်ရင် Input ရဲ့ Focus State တွေဖြုတ်မယ် */
    document.addEventListener('click', (event) => {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT') {
            if (!activeElement.contains(event.target)) {
                activeElement.blur();
            };
        };
    });
    
    /* Searchable Dropdowns */
    dropdownInputs.forEach(dd => {
        dd.addEventListener('focus', (event) => {
            event.stopPropagation();
            const parentField = event.target.closest('.input-field');
            const ddItems = parentField.querySelectorAll('.dropdown-list-item');
            dd.addEventListener('input', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const filter = e.target.value.toLowerCase();
                ddItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    };
                });
            });
        });
    });
    
    /* Dropdown List Item ကိုရွေးချယ်မယ် */
    const ddItems = fuelUpForm.querySelectorAll('.dropdown-list-item');
    ddItems.forEach(item => {
        item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const parentField = e.target.closest('.input-field');
            const relInput = parentField.querySelector('input');
            relInput.value = item.textContent;
        })
    });
    
    /* Price and Cost Calculation */
    const priceInput = document.getElementById('price-input');
    const fuelVolumeInput = document.getElementById('fuelVolume-input');
    const costInput = document.getElementById('cost-input');
    
    function calculateFuelVolume() {
        const price = Number(priceInput.value);
        const cost = Number(costInput.value);
        if (price > 0) {
            return (cost / price).toFixed(2);
        };
    }
    
    priceInput.addEventListener('input', (e) => {
        e.stopPropagation();
        fuelVolumeInput.value = calculateFuelVolume();
    });
    
    costInput.addEventListener('input', (e) => {
        e.stopPropagation();
        fuelVolumeInput.value = calculateFuelVolume();
    });
    
} // End Of Form Main Function

/* ===================================== */

/* Collect Form Data */
function getFormDatas() {
    const formInputs = fuelUpForm.querySelectorAll('.input-input');
    let formValues = {};
    formInputs.forEach(input => {
        const key = input.id.replace('-input', '');
        const value = input.value;
        formValues[key] = value;
    });
    return formValues;
}

// Filling Form Inputs Values
export async function fillFormDatas(data) {
    if (fuelUpForm.dataset.mode === 'new-form') {
        formTitle.textContent = 'New Fuel-Up';
    } else {
        formTitle.textContent = 'Edit Fuel Record';
    }
    fuelUpForm.dataset.docid = data.id;
    fuelUpForm.dataset.index = data.index;
    const formInputs = fuelUpForm.querySelectorAll('.input-input');
    formInputs.forEach(input => {
        const key = input.id.replace('-input', '');
        const valueToSet = data[key];
        input.value = valueToSet;
        if (key === 'fillingType' || key === 'fuelType') {
            const targetRadio = fuelUpForm.querySelector(`input[name=${key}-radio][value="${valueToSet}"]`);
            if (targetRadio) {
                targetRadio.checked = true;
                const changeEvent = new Event('change', { bubbles: true });
                targetRadio.dispatchEvent(changeEvent);
            };
        };
    });
    
    updateCurrentFormIndexInfo(data.index);
}

/* Open Form */
async function updateCurrentFormIndexInfo(currentIndex) {
    const allDatas = await gettingUpdateRecords();
    const totalNumOfRecords = allDatas.length;
    currentRecordIndexSpan.textContent = currentIndex + 1;
    totalRecordsCountSpan.textContent = totalNumOfRecords;
}

/* Open Form */
export function openFuelForm() {
    fuelUpForm.classList.add('show');
}

/* Close Form */
export async function closeFuelForm() {
    const formMode = fuelUpForm.dataset.mode;
    const formIndex = fuelUpForm.dataset.index;
    const cards = historyListContainer.querySelectorAll('.record-card');
    const currentCard = cards[formIndex];
    const allDatas = await gettingUpdateRecords();
    const currentRecordData = allDatas[formIndex];
    switch (formMode) {
        case 'new-form':
            fuelUpForm.classList.remove('show');
            break;
        case 'edit-form':
            fuelUpForm.classList.remove('show');
            currentCard.classList.remove('selecting');
            break;
    };
}

/* Close All Forms */
function closeAllForms() {
    document.querySelectorAll('.form-modal').forEach(modal => modal.classList.remove('show'));
}

/* Close All Modals */
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
}




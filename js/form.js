/* Form.js */

/* Import Functions */
import { showAlertBox } from '/js/script.js';
import { addRecord, deleteRecord, getRecord, getAllRecords, gettingUpdateRecords, renderRecordsList } from '/js/firestore-db.js';

/* New Fuel-Up Form */
export const fuelUpForm = document.getElementById('fuel-up-form');
const dropdownInputs = document.querySelectorAll('.dropdown-input');
const closeFormBtn = document.getElementById('close-fuelup-form-btn');
const resetFormBtn = document.getElementById('reset-fuelup-form-btn');
const cancelFormBtn = document.getElementById('cancel-record-form-btn');
const saveFormBtn = document.getElementById('save-record-form-btn');

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

export async function fuelUpFormFunc() {
    /* Save Form Button */
    saveFormBtn.addEventListener('click', (e) => {
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
    
    /* Cancel Form Button */
    cancelFormBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFuelForm();
    });
    
    /* Close Form Button */
    closeFormBtn.addEventListener('click', (e) => {
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

/* Set Fuel Form Data Values */
export function fillFormDatas(data) {
    fuelUpForm.dataset.docid = data.id;
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
            }
        }
    })
}

/* Open Form */
export function openFuelForm() {
    fuelUpForm.classList.add('show');
}

/* Close Form */
function closeFuelForm() {
    fuelUpForm.classList.remove('show');
}

/* Close All Forms */
function closeAllForms() {
    document.querySelectorAll('.form-modal').forEach(modal => modal.classList.remove('show'));
}

/* Close All Modals */
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
}




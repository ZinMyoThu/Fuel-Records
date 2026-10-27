import { navbarFunction, selectNavBtn, selectPage } from '/js/navbar.js';
import { renderHistoryPage, renderRecordsList, getRecord, getAllRecords, addRecord, updateRecord, deleteRecord, deleteAllRecords } from '/js/firestore-db.js';
import { historyPage } from '/js/page-history.js';
import { fuelUpFormFunc } from '/js/form.js';

document.addEventListener('DOMContentLoaded', async (e) => {
    navbarFunction();
    await renderRecordsList();
    historyPage();
    renderHistoryPage();
    
    fuelUpFormFunc();
})

/* Alert Box */
const alertBox = document.getElementById('alert-box');

export function showAlertBox(title, message, buttons, verticalButtons) {
    console.log(`showAlertBox(title, message, buttons, verticalButtons);\ntitle: String,\nmessage: String,\nbuttons: Array,\nverticalButtons: Boolean`);
    alertBox.querySelector('.alert-title').textContent = title;
    alertBox.querySelector('.alert-message').textContent = message;
    const alertBtnsRow = alertBox.querySelector('.alert-btns-row');
    alertBtnsRow.innerHTML = "";
    if (verticalButtons) {
        alertBtnsRow.classList.add('v');
    };
    buttons.forEach(text => {
        const button = document.createElement('button');
        button.className = 'alert-btn';
        const hasAttr = text.includes('|');
        if (hasAttr) {
            const label = text.split('|')[0];
            const attr = text.split('|')[1];
            button.textContent = label;
            button.classList.add(attr);
        } else {
            button.textContent = text;
        };
        alertBtnsRow.appendChild(button);
    });
    alertBox.classList.add('show');
}

/* Demo Alert */
const alertTitle = 'Demo Alert Title';
const alertMessage = 'This is example alert box.';
const alertBtns = ["Yes", "No|danger", "Done|primary"];
const direction = 'v';
// showAlertBox(alertTitle, alertMessage, alertBtns, direction);
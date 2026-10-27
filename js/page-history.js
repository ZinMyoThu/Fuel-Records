// import { renderRecordsList, addRecord, getRecord, getAllRecords, deleteRecord } from '/js/firestore-db.js';
import { openFuelForm, fillFormDatas } from '/js/form.js';

const historyListContainer = document.getElementById('fuel-records-container');
const cardDetailScreen = document.getElementById('card-detail-screen');
const cardDetailModal = document.getElementById('card-detail-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// const newFuelUpBtn = document.getElementById('opem-new-fuelup-form-btn');
const fuelUpForm = document.getElementById('fuel-up-form');
const closeFuelUpFormBtn = document.getElementById('close-fuelup-form-btn');

export async function historyPage() {
    const page = document.getElementById('history-page');
    const pageContent = page.querySelector('.page-content');
    
    /* Create Page Action Button - Add New Record Button */
    const actionBtn = document.createElement('button');
    actionBtn.className = 'page-float-action-btn';
    actionBtn.id = 'new-fuelup-action-btn';
    
} // End Of historyPage()




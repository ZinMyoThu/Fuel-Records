import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, writeBatch, query, where, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { fuelUpForm, openFuelForm, fillFormDatas } from '/js/form.js';

const firebaseConfig = {
    apiKey: "AIzaSyApU9iUEDYefT_OeS2TmrpEXmhQjJEAqOo",
    authDomain: "yangon-taxi-fuel-up-app.firebaseapp.com",
    projectId: "yangon-taxi-fuel-up-app",
    storageBucket: "yangon-taxi-fuel-up-app.firebasestorage.app",
    messagingSenderId: "326372927316",
    appId: "1:326372927316:web:9ea6c686cad3c90339cac1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dbName = "fuel_records";

/* Add Data */
export async function addRecord(recordData) {
    try {
        const docRef = await addDoc(collection(db, dbName), recordData);
        console.log(`Record Id: ${docRef.id} အား အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။`);
        return true;
    } catch (e) {
        console.error("Record သိမ်းဆည်းရာတွင်း Error ဖြစ်နေသည်!", e);
        return false;
    };
};

/* Get Data */
export async function getRecord(recordId) {
    try {
        const docRef = doc(db, dbName, recordId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap;
            console.log('Record data: ', docSnap.data());
        } else {
            console.log('Record not found!');
        };
    } catch (e) {
        console.error('Error loading datas!');
    };
}

/* Get All Datas */
export async function getAllRecords() {
    try {
        const querySnapshot = await getDocs(collection(db, dbName));
        const records = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return records;
    } catch (e) {
        console.error('Fuel Records များရယူရာတွက် Error ဖြစ်နေသည်။', e);
        // return false;
    };
};

/* Update/Edit Data */
export async function updateRecord(recordId, newData) {
    const recordRef = doc(db, dbName, recordId);
    await updateDoc(recordRef, newData);
    console.log('Record updated!');
};

/* Delete Data */
export async function deleteRecord(recordId) {
    try {
        const docRef = doc(db, dbName, recordId);
        await deleteDoc(docRef);
        console.log(`Reocrd Id: ${docRef.id} အား ဖျက်ပြီးပါပြီ။`);
        return true;
    } catch (e) {
        console.error(`Record အားဖျက်ရာတွင်း Error ဖြစ်နေသည်! - ${e}`);
        return false;
    };
    
};

/* Delete All Records */
export async function deleteAllRecords(list) {
    try {
        const batch = writeBatch(db);
        list.forEach((record) => {
            const docRef = doc(db, dbName, record.id);
            batch.delete(docRef);
        });
        
        await batch.commit();
        
        console.log('Record များအားလုံး အောင်မြင်စွာ ဖျက်ပြီးပါပြီ။');
    } catch (e) {
        console.error('Record များဖျက်ရာတွင် Error ဖြစ်နေသည်။', e);
    };
};

/* Filtering, Searching and Ordering Datas */
export async function queryRecords(filterKey, filterValue, orderKey, orderDirection, limit) {
    try {
        const q = query(collection(db, dbName), where(filterKey, '==', filterValue), orderBy(orderKey, orderDirection), limit());
        const querySnapshot = await getDocs(q);
        const recordsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`"${filterKey}" = "${filterValue}" ဖြစ်သော Fuel Record များကို "${orderKey}" Column ၏ ${orderDirection == "asec" ? "ငယ်စဉ်ကြီးလိုက်": "ကြီးစဉ်ငယ်လိုက်"} စီထားသော စာရင်း - `, recordsArray);
        return recordsArray;
    } catch (e) {
        console.error('စာရင်းထုတ်ယူရာတွင် Error ဖြစ်နေသည်။', e);
        console.error('queryRecords(filterKey, filterValue, orderKey, orderDirection, limit)');
    };
};

export async function gettingUpdateRecords() {
    return await getAllRecords();
    // console.log(recordsList);
    // return recordsList;
    /* recordsList.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
        console.log(new Date(b.date) - new Date(a.date));
    });*/
}

/* DOM Generator */
const historyListContainer = document.getElementById('fuel-records-container');
const historyPageSubtitle = document.getElementById('history-page-subtitle');

let allRecords = [];
let currentIndex = 0;
export async function renderRecordsList() {
    /* historyListContainer.addEventListener('click', (e) => {
        const allItems = historyListContainer.querySelectorAll('.record-card');
        const allCards = historyListContainer.querySelectorAll('.list-card');
        const clickedCard = e.target.closest('.list-card');
        if (clickedCard) {
            const recordCard = clickedCard.parentElement;
            const isExpend = clickedCard.parentElement.classList.contains('expend');
            allItems.forEach(item => item.classList.remove('expend'));
            
            if (isExpend) {
                recordCard.classList.remove('expend');
            } else {
                recordCard.classList.add('expend');
            };
            
            const index = clickedCard.parentElement.dataset.index;
            const editBtn = clickedCard.parentElement.querySelector('.edit-record-btn');
            if (index !== undefined) {
                currentIndex = parseInt(index);
                editBtn.addEventListener('click', () => {
                    showFormWithData(currentIndex);
                });
            };
        };
    }) */
    historyListContainer.innerHTML = "Loading...";
    
    try {
        allRecords = await gettingUpdateRecords();
        
        allRecords.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        historyListContainer.innerHTML = "";
        historyPageSubtitle.textContent = allRecords.length + ' record' + (allRecords.length > 1 ? 's' : '');
        
        /* Database မှာ data မရှိရင် ရပ်မယ် */
        if (allRecords.length === 0) {
            historyListContainer.innerHTML = "Data မရှိသေးပါ!";
            return;
        }
        
        /* တခုချင်းစီ DOM Element တည်ဆောက်မယ် */
        allRecords.forEach((record, index) => {
            record.index = index;
            const itemEl = document.createElement('div');
            itemEl.className = 'record-card';
            itemEl.dataset.id = record.id;
            itemEl.dataset.index = index;
            
            const headerEl = document.createElement('div');
            headerEl.className = 'list-card';
            headerEl.innerHTML = `
                <div class="top-row stack h">
                    <div class="record-station stack h">
                        <i class="icon fa-regular fa-location"></i>
                        <p class="station-name">${record.station}</p>
                    </div>
                </div>
                <div class="mid-row stack h">
                    <p class="record-date">${record.date}</p>
                    <p class="record-cost">${record.cost}<span class="unit">MMK</span></p>
                </div>
                <div class="bot-row stack h">
                    <p class="record-sequence">${record.sequence}</p>
                    <p class="record-price">${record.price}<span class="unit">MMK/L</span></p>
                    <span>&times;</span>
                    <p class="record-fuelVolume">${record.fuelVolume}<span class="unit">L</span></p>
                </div>
            `;
            
            /* Click လိုက်ရင် Expend / Collapse ဖြစ်ရန် */
            /* headerEl.addEventListener('click', (e) => {
                e.preventDefault();
                historyListContainer.querySelectorAll('.record-card').forEach(item => {
                    if (item === itemEl) {
                        if (item.classList.contains('expend')) {
                            item.classList.remove('expend');
                        } else {
                            item.classList.add('expend');
                        };
                    } else {
                        item.classList.remove('expend');
                    };
                });
                itemEl.classList.toggle('expend');
            }); */
            
            itemEl.appendChild(headerEl);
            
            const detailEl = document.createElement('div');
            detailEl.className = 'card-detail';
            detailEl.innerHTML = `
                <div class="detail-row"><label for="detail-filling">Filling</label><input type="text" id="detail-filling" class="detail-input" value="${record.fillingType}" disabled /></div>
                <div class="detail-row"><label for="detail-fuelType">Fuel Type</label><input type="text" id="detail-fuelType" class="detail-input" value="${record.fuelType}" disabled /></div>
                <div class="detail-row"><label for="detail-odometer">Odometer</label><input type="text" id="detail-odometer" class="detail-input" value="${record.odometer}" disabled /><span class="detail-unit">km</span></div>
                <div class="detail-row"><label for="detail-station">Station</label><input type="text" id="detail-station" class="detail-input" value="${record.station}" disabled /></div>
                <div class="detail-row"><label for="detail-notes">Notes</label><input type="text" id="detail-notes" class="detail-input" value="${record.notes}" disabled /></div>
                <div class="btns-row">
                    <button class="record-card-btn edit-record-btn">Edit</button>
                    <button class="record-card-btn delete-record-btn">Delete</button>
                </div>
            `;
            
            /* Edit Record Button */
            /* const editBtn = detailEl.querySelector('.edit-record-btn');
            editBtn.addEventListener('click', async (e) => {
                currentIndex = index;
                showFormWithData(currentIndex);
            });*/
            
            /* Delete Record Button */
            const deleteBtn = detailEl.querySelector('.delete-record-btn');
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                const idToDelete = itemEl.dataset.id;
                await deleteRecord(idToDelete);
                await renderRecordsList();
            });
            
            itemEl.appendChild(detailEl);
            
            historyListContainer.appendChild(itemEl);
        });
    } catch (e) {
        console.error('Loading Data Error!', e);
    }
    
}

function showFormWithData(index) {
    const currentRecord = allRecords[index];
    if (!currentRecord) return;
    console.log(currentRecord)
    fillFormDatas(currentRecord);
    fuelUpForm.style.transition = "none";
    fuelUpForm.dataset.mode = 'edit-form';
    setTimeout(() => {
        fuelUpForm.style.transition = "";
        openFuelForm();
    }, 50);
    updateFormButtonStates();
}

/* Prev Form Button */
const prevFormBtn = document.getElementById('prev-record-form-btn');
prevFormBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        showFormWithData(currentIndex);
    };
});

/* Next Form Button */
const nextFormBtn = document.getElementById('next-record-form-btn');
nextFormBtn.addEventListener('click', () => {
    if (currentIndex < allRecords.length) {
        currentIndex++;
        showFormWithData(currentIndex);
    };
});

/* Update Buttons State depend on index */
function updateFormButtonStates() {
    prevFormBtn.disabled = currentIndex === 0;
    nextFormBtn.disabled = currentIndex === allRecords.length - 1;
}

export async function renderHistoryPage() {
    const recordItems = historyListContainer.querySelectorAll('.record-card');
    historyListContainer.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.list-card');
        if (clickedCard) {
            const clickedItem = clickedCard.parentElement;
            recordItems.forEach(item => {
                if (item !== clickedItem) item.classList.remove('expend');
            });
            clickedItem.classList.toggle('expend');
        };
    })
}
import { fuelUpForm, openFuelForm, fillFormDatas, initialFormData } from '/js/form.js';
import { getAllRecords } from '/js/firestore-db.js';

const pages = document.querySelectorAll('.page');
const navbar = document.getElementById('bottom-navbar');
const navbtns = navbar.querySelectorAll('.navbtn');
const navIndicator = document.getElementById('navbar-indicator');

const activedNavBtnId = 'history';
let activedNavBtn = document.getElementById(activedNavBtnId + '-navbtn');
let activedPage = document.getElementById(activedNavBtnId + '-page');

export function navbarFunction() {
    /* Add Float Action Button */
    actionButton();
    
    /* Initial State Update */
    navIndicator.style.transition = 'none';
    selectNavBtn(activedNavBtn);
    selectPage(activedPage);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            navIndicator.style.transition = '';
        })
    })
    
    /* Navbtns Function */
    navbtns.forEach(navbtn => {
        navbtn.addEventListener('click', () => {
            activedNavBtn = navbtn;
            activedPage = document.getElementById(navbtn.id.replace('navbtn', 'page'));
            selectNavBtn(activedNavBtn);
            selectPage(activedPage);
        });
    })
}

export function selectNavBtn(targetNavBtn) {
    navbtns.forEach(btn => btn.classList.remove('actived'));
    targetNavBtn.classList.add('actived');
    navIndicator.style.left = targetNavBtn.offsetLeft + 'px';
    navIndicator.style.width = targetNavBtn.clientWidth + 'px';
}

export function selectPage(targetPage) {
    pages.forEach(pg => pg.classList.remove('actived'));
    targetPage.classList.add('actived');
}


async function actionButton() {
    const allDatas = await getAllRecords();

    const actionBtn = document.createElement('button');
    actionBtn.className = 'navbar-float-action-btn';
    actionBtn.id = 'navbarFloatActionBtn';
    navbar.appendChild(actionBtn);
    
    actionBtn.addEventListener('click', (e) => {
        fuelUpForm.style.transition = 'none';
        fuelUpForm.dataset.mode = 'new-form';
        fuelUpForm.dataset.index = allDatas.length + 1;
        
        fillFormDatas(initialFormData);
        setTimeout(() => {
            fuelUpForm.style.transition = '';
            openFuelForm();
        }, 10);
    })
}
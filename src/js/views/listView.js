import { elements } from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
};



export const renderNewItemInputs = () => {
    const markup = `
        <li id="shopping__item--new" class="shopping__newItem">
            <div class="shopping__count">
                <input type="number" value="" step="" id="shopping__count-value">
                <input type="string" value="" id="shopping__unit">
            </div>
            <input type="string" value="" id="shopping__description">
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteNewItemInputs = () => {
    elements.shopping.removeChild(document.querySelector('#shopping__item--new'));
};

export const getInput = () => {
    const newItem = {
        count: document.querySelector('#shopping__count-value').value,
        unit: document.querySelector('#shopping__unit').value,
        ingredient: document.querySelector('#shopping__description').value
    }
    return newItem;
};




export const renderAddItemBtn = () => {
    const markup = `
    <div class="shopping__list--addItem">
        <input type="button" id='btn__addItem' class="btn1 btn1--orange" value="+ Add Ingredient +">
    </div>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteAddItemBtn = () => {
    elements.shopping.removeChild(document.querySelector('.shopping__list--addItem'));
};


export const renderSubmitInputsBtn = () => {
    const markup = `
    <div class="shopping__list--submitInputs">
        <input type="button" id='btn__submitInputs' class="btn1 btn1--orange" value="Add">
    </div>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const DeleteSubmitInputsBtn = () => {
    elements.shopping.removeChild(document.querySelector('.shopping__list--submitInputs'));
};



export const renderDeleteItemsBtn = () => {
    const markup = `
    <div class="shopping__list--deleteAll">
        <input type="button" id='btn__deleteAll' class="btn1 btn1--orange" value="Delete all items">
    </div>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const removeDeleteItemsBtn = () => {
    elements.shopping.removeChild(document.querySelector('.shopping__list--deleteAll'));
};
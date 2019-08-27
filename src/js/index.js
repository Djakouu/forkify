import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/** 
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
};
 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

    // render add item btn and remove the previous one if existent
    if (document.querySelector('#btn__addItem'))
    listView.deleteAddItemBtn();

    listView.renderAddItemBtn();

    // render delete all items btn and remove the previous one if existent
    if (document.querySelector('#btn__deleteAll'))
    listView.removeDeleteItemsBtn();

    listView.renderDeleteItemsBtn();
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    // Handle Delete all items btn
    if (e.target.matches('#btn__deleteAll')) {
        const limit = document.querySelectorAll('.shopping__item').length;
        for (let i = limit - 1; i >= 0; i--){
            let id = document.querySelectorAll('.shopping__item')[i].dataset.itemid;
            if(id) {
                state.list.deleteItem(id);
                listView.deleteItem(id);
            }
        }
    listView.removeDeleteItemsBtn();
    }

    // Handle Add Item Btn
    else if (e.target.matches('#btn__addItem')){
        // Remove addItemBtn and DeleteAllItemsBtn
        listView.deleteAddItemBtn();
        if (document.querySelector('#btn__deleteAll')) 
        listView.removeDeleteItemsBtn();

        // Render new ingredient inputs and SubmitBtn
        listView.renderNewItemInputs();
        listView.renderSubmitInputsBtn();
        // Read and render new data
            document.querySelector('#btn__submitInputs').addEventListener('click', ()=> {
                renderNewInputs();
            });
            const renderNewInputs = () => {
            const newItem = listView.getInput();
                if (newItem.ingredient !== '') {
                // Create a new list IF there is none yet
                if (!state.list) state.list = new List();

                // Add inputs to the list and UI
                const item = state.list.addItem(newItem.count, newItem.unit, newItem.ingredient);
                    listView.DeleteSubmitInputsBtn();
                    listView.deleteNewItemInputs();
                    listView.renderItem(item);
                    listView.renderAddItemBtn();

                    let listLength = document.querySelectorAll('.shopping__item').length;
                    if (listLength > 1)
                    listView.renderDeleteItemsBtn();
                    }
                else {
                    // Render back addItemBtn and DeleteAllItemsBtn
                    listView.DeleteSubmitInputsBtn();
                    listView.deleteNewItemInputs();
                    listView.renderAddItemBtn();
                    
                    let listLength = document.querySelectorAll('.shopping__item').length;
                    console.log(listLength);
                    if (listLength > 1)
                    listView.renderDeleteItemsBtn();
                }   
            }
    }
    else if (e.target.matches('.shopping__delete, .shopping__delete *') || 
             e.target.matches('.shopping__count-value')) {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Remove delete all items btn if list.lenght < 2 
        let listLength = document.querySelectorAll('.shopping__item').length;
        if (listLength === 1)
            listView.removeDeleteItemsBtn();
    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
}
});

/** 
 * LIKE CONTROLLER
 */

const controlUnlike = () => {
    let input = prompt('Are you sure you want to delete all the list ? Type "yes" for confirmation');

    if (input === 'yes') {
    // Remove like from the state
    for (let i = 0; i < state.likes.likes.length; i++) {
        let id = state.likes.likes[i].id;
        state.likes.deleteLike(id);
    
        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(id);
        }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    } 
};
elements.unlikeBtn.addEventListener('click', e => {
if (e.target.matches('.likes__unlike--icon')) controlUnlike();
});

const controlLike = () => {
    console.log(state.likes.likes.length);

    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Restore shopping list on page load
window.addEventListener('load', () => {
    state.list = new List();
    
    // Restore likes
    state.list.readStorage();

    // Render the existing items
    state.list.items.forEach(item => listView.renderItem(item));

    // Rneder addItemBtn and deleteAllItemsBtn
    listView.renderAddItemBtn();
    if (state.list.items.length > 1)
        listView.renderDeleteItemsBtn();
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }

});


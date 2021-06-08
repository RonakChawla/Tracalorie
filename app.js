const StorageCtrl = (function(){
    return {
        storeItem: function(newItem){
            let items;
            
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(newItem);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(newItem);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemsFromLocalStorage: function(){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(item.id === updatedItem.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(item.id === id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        removeAllItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        // items: [
        //     // { id: 0, name: 'Steak Dinner', calories: 1200},
        //     // { id: 1, name: 'Cookie', calories: 400},
        //     // { id: 2, name: 'Eggs', calories: 300}
        // ],

        items: StorageCtrl.getItemsFromLocalStorage(),

        currentItem: null,
        totalCalories: 0
    }

    return{
        getItems: function(){
            return data.items;
        },

        addItem: function(name, calories){
            let ID;

            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else{
                ID = 0;
            }

            calories = parseInt(calories);

            newItem = new Item(ID, name, calories);

            data.items.push(newItem);

            return newItem;
        },

        logData: function(){
            return data;
        },

        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(item => {
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        },

        getItemById: function(id){
            let found = null;

            data.items.forEach(item => {
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },

        setCurrentItem: function(itemToEdit){
            data.currentItem = itemToEdit;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        updateItem: function(name, calories){
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id){
            const ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);

            data.items.splice(index, 1);
        },

        clearAllItems: function(){
            data.items = [];
        }
    }
})();

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        deleteBtn: '.delete-btn',
        updateBtn: '.update-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn'
    };

    return{
        populateItemList: function(items){
            let html = '';

            items.forEach(element => {
                html += `
                <li class="collection-item" id="item-${element.id}">
                    <strong>${element.name}: </strong><em>${element.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getSelectors: function(){
            return UISelectors;
        },

        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value, 
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';

            const li = document.createElement('li');

            li.className = 'collection-item';
            li.id = `item-${item.id}`;

            li.innerHTML = `
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },

        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const ItemId = listItem.getAttribute('id');

                if(ItemId ===  `item-${item.id}`){
                    document.querySelector(`#${ItemId}`).innerHTML = `
                        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            }); 
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;

            const item = document.querySelector(itemID);

            item.remove();

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearEditState();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node List into an array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                listItem.remove();
            }); 
        }
    }
})();

const App = (function(ItemCtrl, UICtrl, StorageCtrl){
    const loadEventListeners = function(){
        UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        document.querySelector(UISelectors.backBtn).addEventListener('click', backButtonHandler);

        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            StorageCtrl.storeItem(newItem);

            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentNode.parentNode.id;

            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){
        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        const items = ItemCtrl.getItems();

        if(items.length === 0){
            UICtrl.hideList();
        }

        e.preventDefault();
    }

    const clearAllItemsClick = function(e){
        ItemCtrl.clearAllItems();

        UICtrl.removeItems();

        StorageCtrl.removeAllItemsFromStorage();

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.hideList();

        e.preventDefault();
    }

    const backButtonHandler = function(e){
        UICtrl.clearEditState();

        e.preventDefault();
    }

    return{
        init: function(){
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            } else{
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
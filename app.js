// querying our css properties
//What is document.querySelector()?
/*
    The Document method querySelector() 
    returns the first Element within the document
    that matches the specified selector.
*/
//What is document.querySelectorAll()?
/*
    The Document method querySelectorAll()
    returns a static (not live) NodeList representing a list 
    of the document's elements that match the specified group of selectors.
*/
const taskInput = document.querySelector('.task-input input'),
filters = document.querySelectorAll('.filters span'),
clearAll = document.querySelector('.clear-btn'),
taskBox = document.querySelector('.task-box');

// Initializing our variables
let editId,
isEditTask = false;

// Getting our local storage data using JSON.parse and localStorage.getItem()
/*
    The getItem() method of the Storage interface,
    when passed a key name, will return that key's value,
    or null if the key does not exist, in the given Storage object.
*/
todos = JSON.parse(localStorage.getItem('todo-list'));

// filters.forEach() Performs the specified action for each node in an list.
// The callback function accepts up to three arguments. Which are,
//forEach() calls the callback function one time for each element in the list.
//addEventListener() method attaches an event handler to the specified element.
//classList.remove() method removes a specified class from an element.
//classList.add() method adds one or more class names to an element.

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active');
        btn.classList.add('active');
        showTodo(btn.id);

    })
})

//showTodo() function is used to show the todo list and filter the todo list with the help of filter parameter.
//Returns all element descendants of node that match selectors.
//clearAll.classList.remove() method removes a specified class from an element.
//clearAll.classList.add() method adds one or more class names to an element.
//taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow") is a ternary operator.
//The ternary operator is used to assign a value to a variable based on a condition.
//The ternary operator is often used as a shortcut for the if statement.


function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == 'completed' ? 'completed' : '';
            if (filter == todo.status || filter == 'all') {
                liTag += `
                <li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'> <i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'> <i class="uil uil-trash"></i>Delete</li>
                       </ul>
                    </div>
                </li>
                `;
            }

        })
    }
    taskBox.innerHTML = liTag || `<span> You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll('.task');
    !checkTask.length ? clearAll.classList.remove('active') : clearAll.classList.add('active');
    taskBox.offsetHeight >= 300 ? taskBox.classList.add('overflow') : taskBox.classList.remove('overflow');
}
showTodo('all');

// showMenu() function is used to show the menu of the todo list.
// the e.target.tagName != "I" || e.target != selectedTask is used to check the condition and remove the menu.
// selectedTask.parentElement.lastElementChild is used to select the last child of the selectedTask.
// what is lastElementChild?
// The lastElementChild property returns the last child node of an element, as a Node object.
// The last child node can be an element node, a text node, or a comment node.
// The lastElementChild property returns null if the element has no child elements.
// what is parentElement?
// The parentElement property returns the parent element of the specified element, as a Node object.

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add('show');
    document.addEventListener('click', e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove('show');
        }

    })
}

// updateStatus() function is used to update the status of the todo list.
// what is localStorage.setItem()?
/*
    The setItem() method of the Storage interface, when passed a key name and value,
    will add that key to the given Storage object, or update that key's value if it already exists.
*/
// What's JSON.stringify()?
/*
    JSON.stringify() method converts a JavaScript object or value to a JSON string,
    optionally replacing values if a replacer function is specified or 
    optionally including only the specified properties if a replacer array is specified.
*/
// what is selectedTask.checked?
// The checked property sets or returns the state, in Boolean format, of a check box.
// what is selectedTask.id?
// The id property sets or returns the value of the id attribute of an element.

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add('checked');
        todos[selectedTask.id].status = 'completed';
    } else {
        taskName.classList.remove('checked');
        todos[selectedTask.id].status = 'pending';

    }
    localStorage.setItem('todo-list', JSON.stringify(todos));
}

// editTask() function is used to edit the todo list.
// what is taskInput.value?
// The value property sets or returns the value of the value attribute of a text field.
// what is taskInput.focus()?
// The focus() method sets focus to an element.
// The focus() method is most often used to set focus to a text field, after the page has loaded.



function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add('active');

}

// deleteTask() function is used to delete the todo list.
// what is todos.splice()?
/*
    The splice() method changes the contents of an array by removing
    or replacing existing elements and/or adding new elements in place.
*/
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo(filter);
}

// clearAllTask() function is used to clear all the todo list.
// what is clearAll.addEventListener()?
// The addEventListener() method attaches an event handler to the specified element.

clearAll.addEventListener('click', () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo();
})

// filterTask() function is used to filter the todo list.

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: 'pending'};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = '';
        localStorage.setItem('todo-list', JSON.stringify(todos));
        showTodo(document.querySelector('span.active').id);

    }
});
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
    const taskCard = document.createElement("p");
    taskCard.classList.add("task");
    taskCard.setAttribute("draggable", "true");
    taskCard.innerText = task.content;

    // Add drag event listeners to the task card
    addDragEvents(taskCard);

    return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    const todoLane = document.getElementById("todo-lane");
    todoLane.innerHTML = ""; // Clear existing tasks

    taskList.forEach((task) => {
        const taskCard = createTaskCard(task);
        todoLane.appendChild(taskCard);
    });

    makeTasksDraggable();
}

// Add drag events to each task
function addDragEvents(task) {
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
    });
}

// Make tasks draggable across swim lanes
function makeTasksDraggable() {
    const draggable = document.querySelectorAll(".task");
    const droppable = document.querySelectorAll(".swim-lane");

    draggable.forEach((task) => {
        addDragEvents(task);
    });

    droppable.forEach((zone) => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();

            const bottomTask = insertAboveTask(zone, e.clientY);
            const curTask = document.querySelector(".is-dragging");

            if (!bottomTask) {
                zone.appendChild(curTask);
            } else {
                zone.insertBefore(curTask, bottomTask);
            }
        });
    });
}

// Helper function to find the correct position to drop a task
function insertAboveTask(zone, mouseY) {
    const els = zone.querySelectorAll(".task:not(.is-dragging)");
    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const input = document.getElementById("todo-input");
    const value = input.value;

    if (!value) return;

    const newTask = {
        id: generateTaskId(),
        content: value
    };

    taskList.push(newTask);
    renderTaskList();
    input.value = "";

    // Save tasks and nextId to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    // Implementation goes here
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Implementation goes here
}

// Initialize the application when the page loads
$(document).ready(function () {
    renderTaskList();

    const form = document.getElementById("todo-form");
    form.addEventListener("submit", handleAddTask);

    // Additional initialization like making lanes droppable and date picker
});

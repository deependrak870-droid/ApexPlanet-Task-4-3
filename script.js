
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompleted = document.getElementById("clearCompleted");

const STORAGE_KEY = "todoTasks";

// Load saved tasks from localStorage
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Unable to load tasks:", error);
    return [];
  }
}

let tasks = loadTasks();
let currentFilter = "all";

// Save tasks in browser storage
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Unable to save tasks:", error);
    alert("Tasks could not be saved in this browser.");
  }
}

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    id: crypto.randomUUID(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}

// Delete task
function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
  }
}

// Edit task
function editTask(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  const updatedText = prompt("Edit your task:", task.text);

  if (updatedText === null) return;

  const cleanText = updatedText.trim();

  if (cleanText === "") {
    alert("Task cannot be empty!");
    return;
  }

  task.text = cleanText.slice(0, 150);

  saveTasks();
  renderTasks();
}

// Mark task as completed or pending
function toggleTask(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  task.completed = !task.completed;

  saveTasks();
  renderTasks();
}

// Update task statistics
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
}

// Display tasks on screen
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  emptyMessage.style.display =
    filteredTasks.length === 0 ? "block" : "none";

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.className = task.completed
      ? "task-item completed"
      : "task-item";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    // Task text
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // Actions container
    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      editTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, span, actions);
    taskList.appendChild(li);
  });

  updateStats();
}

// Add button event
addBtn.addEventListener("click", addTask);

// Enter key event
taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Filter buttons
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    renderTasks();
  });
});

// Clear completed tasks
clearCompleted.addEventListener("click", () => {
  const hasCompleted = tasks.some(task => task.completed);

  if (!hasCompleted) {
    alert("No completed tasks to clear!");
    return;
  }

  if (confirm("Remove all completed tasks?")) {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
  }
});

// Show saved tasks when page loads
renderTasks();

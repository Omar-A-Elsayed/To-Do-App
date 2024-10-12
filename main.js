const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-button");
const taskList = document.querySelector(".task-list");
const remainingCount = document.getElementById("remaining-count").parentElement;
const completedCount = document.getElementById("completed-count").parentElement;
const totalCount = document.getElementById("total-count").parentElement;

let totalTasks = 0;
let remainingTasks = 0;
let completedTasks = 0;

let currentFilter = "all";

function saveTasks() {
  const tasks = Array.from(document.querySelectorAll(".task-item")).map(
    (taskItem) => {
      return {
        text: taskItem.querySelector(".task-text").textContent,
        completed: taskItem.querySelector(".task-checkbox").checked,
      };
    }
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => createTaskItem(task.text, task.completed));
  updateCounters();
}

function updateCounters() {
  document.getElementById("total-count").textContent = totalTasks;
  document.getElementById("remaining-count").textContent = remainingTasks;
  document.getElementById("completed-count").textContent = completedTasks;
}

function createTaskItem(taskText, isCompleted) {
  const newTaskItem = document.createElement("li");
  newTaskItem.classList.add("task-item");

  const leftDiv = document.createElement("div");
  leftDiv.classList.add("left");

  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.classList.add("task-checkbox");
  taskCheckbox.checked = isCompleted;

  const taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");
  taskTextSpan.textContent = taskText;

  leftDiv.appendChild(taskCheckbox);
  leftDiv.appendChild(taskTextSpan);

  const rightDiv = document.createElement("div");
  rightDiv.classList.add("right");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "/images/trash-icon.svg";
  deleteIcon.alt = "Delete";
  deleteButton.appendChild(deleteIcon);

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  const editIcon = document.createElement("img");
  editIcon.src = "/images/edit-icon.svg";
  editIcon.alt = "Edit";
  editButton.appendChild(editIcon);

  rightDiv.appendChild(deleteButton);
  rightDiv.appendChild(editButton);

  const taskDetailsDiv = document.createElement("div");
  taskDetailsDiv.classList.add("task-details");
  taskDetailsDiv.appendChild(leftDiv);
  taskDetailsDiv.appendChild(rightDiv);

  newTaskItem.appendChild(taskDetailsDiv);

  taskList.appendChild(newTaskItem);

  // Update counters
  totalTasks++;
  if (isCompleted) {
    completedTasks++;
  } else {
    remainingTasks++;
  }
  updateCounters();

  // Delete Task
  deleteButton.addEventListener("click", function () {
    taskList.removeChild(newTaskItem);
    totalTasks--;
    if (!taskCheckbox.checked) {
      remainingTasks--;
    } else {
      completedTasks--;
    }
    updateCounters();
    filterTasks(currentFilter);
    saveTasks();
  });

  // Edit Task
  editButton.addEventListener("click", function () {
    editTask(taskTextSpan, newTaskItem);
  });

  // Complete Task
  taskCheckbox.addEventListener("click", function () {
    if (taskCheckbox.checked) {
      remainingTasks--;
      completedTasks++;
    } else {
      remainingTasks++;
      completedTasks--;
    }
    updateCounters();
    filterTasks(currentFilter);
    saveTasks();
  });
}

function addTask() {
  const taskText = taskInput.value;
  if (taskText !== "") {
    createTaskItem(taskText);
    taskInput.value = "";
    saveTasks();
  }
}

function editTask(taskTextSpan, taskItem) {
  const currentText = taskTextSpan.textContent;
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = currentText;
  editInput.classList.add("edit-input");

  taskTextSpan.replaceWith(editInput);
  editInput.focus();

  editInput.addEventListener("blur", function () {
    const newText = editInput.value;

    if (newText === "") {
      taskList.removeChild(taskItem);
      totalTasks--;
      if (!taskItem.querySelector(".task-checkbox").checked) {
        remainingTasks--;
      } else {
        completedTasks--;
      }
      updateCounters();
    } else {
      taskTextSpan.textContent = newText;
      editInput.replaceWith(taskTextSpan);
    }
  });

  editInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      editInput.blur();
      saveTasks();
    }
  });
}

function filterTasks(filter) {
  const tasks = document.querySelectorAll(".task-item");

  tasks.forEach((task) => {
    const checkbox = task.querySelector(".task-checkbox");
    if (filter === "remaining") {
      task.style.display = checkbox.checked ? "none" : "";
    } else if (filter === "completed") {
      task.style.display = checkbox.checked ? "" : "none";
    } else {
      task.style.display = "";
    }
  });
}

remainingCount.addEventListener("click", function () {
  currentFilter = "remaining";
  filterTasks("remaining");
});

completedCount.addEventListener("click", function () {
  currentFilter = "completed";
  filterTasks("completed");
});

totalCount.addEventListener("click", function () {
  currentFilter = "all";
  filterTasks("all");
});

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

window.addEventListener("load", loadTasks);

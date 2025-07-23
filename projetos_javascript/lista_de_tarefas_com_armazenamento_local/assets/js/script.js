// Referências iniciais
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

// Função ao carregar a janela
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

// Função para exibir as tarefas
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  // Limpa as tarefas
  tasksDiv.innerHTML = "";

  // Busca todas as chaves no localStorage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    // Obtém todos os valores
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    // O localStorage armazena boolean como string, então convertemos de volta
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

  // Tarefas completas
  tasks = document.querySelectorAll(".task");
  tasks.forEach((element, index) => {
    element.onclick = () => {
      // Atualiza o localStorage
      if (element.classList.contains("completed")) {
        updateStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText, true);
      }
    };
  });

  // Editar tarefas
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      // Impede a propagação para elementos externos
      e.stopPropagation();
      // Desativa outros botões de edição quando uma tarefa está sendo editada
      disableButtons(true);
      // Atualiza o valor do input e remove a div
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      // Define updateNote para a tarefa que está sendo editada
      updateNote = parent.id;
      // Remove a tarefa
      parent.remove();
    });
  });

  // Deletar tarefas
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      // Remove do localStorage e remove a div
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};

// Desativar botão de edição
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Remove tarefa do localStorage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

// Adiciona tarefas ao localStorage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

// Função para adicionar nova tarefa
document.querySelector("#push").addEventListener("click", () => {
  // Ativa o botão de edição
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Por favor, digite uma tarefa.");
  } else {
    // Armazena localmente e exibe do localStorage
    if (updateNote == "") {
      // Nova tarefa
      updateStorage(count, newTaskInput.value, false);
    } else {
      // Atualiza tarefa existente
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});

// Função para exportar tarefas
document.getElementById("export-tasks").addEventListener("click", () => {
  const tasks = Object.keys(localStorage)
    .sort()
    .map(key => {
      const taskName = key.split("_")[1];
      const isCompleted = JSON.parse(localStorage.getItem(key));
      return `${isCompleted ? "[✓]" : "[ ]"} ${taskName}`;
    });

  if (tasks.length === 0) {
    alert("Nenhuma tarefa para exportar!");
    return;
  }

  const blob = new Blob([tasks.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tarefas-uftm_${new Date().toLocaleString('pt-BR').replace(/[/:, ]/g, '-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
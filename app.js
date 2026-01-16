const screens = {
    welcome: document.getElementById("welcome"),
    home: document.getElementById("home"),
    subject: document.getElementById("subject"),
};

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const addBtn = document.getElementById("addBtn");

const subjectTitle = document.getElementById("subjectTitle");
const taskList = document.getElementById("taskList");
const razKidsBtn = document.getElementById("razKidsBtn");

let taskBySubject = {
    Math: [],
    Science: [],
    Social: [],
    LA: [],
};

let currentSubject = "";

function loadTasks() {
    const saved = localStorage.getItem("tasksBySubject");
    if (saved) taskBySubject = JSON.parse(saved);
}

function saveTasks() {
    localStorage.setItem("tasksBySubject", JSON.stringify(taskBySubject));
}

loadTasks();

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
}

function renderTasks(subject) {
    taskList.innerHTML = "";

    taskBySubject[subject].forEach((task, index) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        const label = document.createElement("span");
        label.textContent = task.text;

        const deleteBtn = document.createElement("img");
        deleteBtn.src = "assets/delete.png"
        deleteBtn.classList.add("delete-btn")

        if (task.done) li.classList.add("done");

        checkbox.addEventListener("change", () => {
            taskBySubject[subject][index].done = checkbox.checked;
            li.classList.toggle("done", checkbox.checked);
            saveTasks();
        });

        label.addEventListener("click", () => {
            checkbox.checked = !checkbox.checked;
            taskBySubject[subject][index].done = checkbox.checked;
            li.classList.toggle("done", checkbox.checked);
            saveTasks();
        });

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            taskBySubject[subject].splice(index, 1)
            saveTasks();
            renderTasks(subject);
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

const composer = document.getElementById("composer");

function openTaskComposer() {
    if (!currentSubject) return;

    composer.innerHTML = "";

    const row = document.createElement("div");
    row.classList.add("task-input-row");

    const check = document.createElement("input");
    check.type = "checkbox";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add task here...";

    row.appendChild(check);
    row.appendChild(input);
    composer.appendChild(row);

    input.focus();

    let commited = false;

    function commit() {
        if (commited) return;
        commited = true;

        const text = input.value.trim();

        if (text === "") { //if they didnt type anything
            composer.innerHTML = "";
            return;
        }

        taskBySubject[currentSubject].push({ 
            text, 
            done: check.checked
        });
        
        saveTasks();
        composer.innerHTML = "";
        renderTasks(currentSubject);
    }

    //autosave when enters pressed

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") composer.innerHTML = "";
    });

    input.addEventListener("blur", commit);
}

addBtn.addEventListener("click", openTaskComposer);

//welcome page
showScreen("welcome");

// start to home
startBtn.addEventListener("click", () => {
    showScreen("home");
});

//home to subject
document.querySelectorAll(".icon").forEach(btn => {
    btn.addEventListener("click", () => {
        currentSubject = btn.dataset.subject;
        subjectTitle.textContent = currentSubject;
        razKidsBtn.style.display = (currentSubject === "LA") ? "inline-block" : "none";

        renderTasks(currentSubject);
        showScreen("subject");
    });
});

//back to home 
backBtn.addEventListener("click", () => {
    showScreen("home");
});



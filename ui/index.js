let STATE = [];
let imgSTATE = [];

const addbtn = document.getElementById("add");
const notbtn = document.getElementById("not");
const donebtn = document.getElementById("done");
const container = document.getElementById("content");
const mainForm = document.getElementById("mainForm");

const addForm = document.getElementById("addForm");
const addFormCancel = document.getElementById("addform-cancel");
const addFormSave = document.getElementById("addform-save");
const addFormTitle = document.getElementById("addform-title");
const addFormBody = document.getElementById("addform-body");
const addFormImgBtn = document.getElementById("addform-img-btn");
const addFormImg = document.getElementById("addform-img-display");

const modal = document.getElementById("modal");
const modalBack = document.getElementById("modal-back");
const modalDelete = document.getElementById("modal-delete");
const modalEdit = document.getElementById("modal-edit");
const modalSave = document.getElementById("modal-save");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalImgBtn = document.getElementById("modal-img-btn");
const modalImg = document.getElementById("modal-img-display");

const searchForm = document.getElementById("searchForm");
const searchContent = document.getElementById("search-content");
const searchExit = document.getElementById("search-exit");
const searchBtn = document.getElementById("search-btn");
const searchQuery = document.getElementById("search-query");

//initializes the page
window.onload = initialize();

searchExit.onclick = () => {
  if (searchForm.attributes.name.value == "add") {
    searchForm.style.display = "none";
    addForm.style.display = "flex";
  }
  if (searchForm.attributes.name.value == "modal") {
    searchForm.style.display = "none";
    modal.style.display = "flex";
  }
};

searchBtn.onclick = () => {
  if (!searchQuery.value) alert("Please fill out search field!");
  getSearch(searchQuery.value);
};

addbtn.onclick = () => {
  mainForm.style.display = "none";
  addForm.style.display = "flex";
};

addFormImgBtn.onclick = () => {
  searchForm.setAttribute("name", "add");
  searchForm.style.display = "block";
  addForm.style.display = "none";
};

addFormCancel.onclick = () => {
  if (confirm("This action will discard all changes. Are you sure to exit?")) {
    mainForm.style.display = "block";
    addForm.style.display = "none";
    addFormTitle.value = "";
    addFormBody.value = "";
  }
};

addFormSave.onclick = () => {
  if (!addFormTitle.value) {
    alert("Title is required!");
    return;
  }
  const data = {
    title: addFormTitle.value,
    body: addFormBody.value,
    img: JSON.parse(addFormImg.attributes.name.value),
    done: false,
  };
  fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (STATE[0].id == 0) {
        STATE = [data];
      } else {
        STATE.push(data);
      }
      alert("Saved!");

      mainForm.style.display = "block";
      addForm.style.display = "none";
      addFormTitle.value = "";
      addFormBody.value = "";
      container.innerHTML = "";
      loadCards();
    })
    .catch((ex) => console.log(ex));
};

notbtn.onclick = () => {
  donebtn.className = "";
  notbtn.className = "activeChoice";
  container.innerHTML = "";
  STATE.forEach((e) => {
    if (!e.done) addCard(e);
  });
};

donebtn.onclick = () => {
  notbtn.className = "";
  donebtn.className = "activeChoice";
  container.innerHTML = "";
  STATE.forEach((e) => {
    if (e.done) addCard(e);
  });
};

modalImgBtn.onclick = () => {
  searchForm.setAttribute("name", "modal");
  modal.style.display = "none";
  searchForm.style.display = "block";
};

modalBack.onclick = () => {
  if (!modalTitle.readOnly) {
    if (!confirm("Changes will not be saved. Exit anyway?")) {
      return;
    }
  }
  modal.style.display = "none";
  mainForm.style.display = "block";
};

modalEdit.onclick = () => {
  modalTitle.readOnly = false;
  modalBody.readOnly = false;
  modalSave.disabled = false;
  modalEdit.disabled = true;
  modalImgBtn.disabled = false;
};

modalSave.onclick = () => {
  //save the changes to database
  const index = STATE.findIndex((i) => i.id == modalTitle.name);
  const data = STATE[index];
  data.title = modalTitle.value;
  data.body = modalBody.value;
  data.img = JSON.parse(modalImg.attributes.name.value);
  fetch(`/api/todos/${modalTitle.name}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      STATE[index] = data;
      alert("Saved!");
      container.innerHTML = "";
      loadCards();
    })
    .catch((ex) => console.log(ex));

  //refresh form state
  modalTitle.readOnly = true;
  modalBody.readOnly = true;
  modalEdit.disabled = false;
  modalSave.disabled = true;
};

modalDelete.onclick = () => {
  if (confirm("Are you sure you want to delete this entry?")) {
    //delete from database
    const index = STATE.findIndex((i) => i.id == modalTitle.name);
    fetch(`/api/todos/${modalTitle.name}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        STATE.splice(index, 1);
        alert("Deleted!");
        container.innerHTML = "";
        if (STATE.length == 0)
          STATE.push({ id: 0, title: "No entries found." });
        loadCards();
      })
      .catch((ex) => console.log(ex));

    //reload all cards

    modal.style.display = "none";
    mainForm.style.display = "block";
  }
};

function getSearch(param) {
  fetch(`/api/imgs/${param}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      imgSTATE = data;
      searchContent.innerHTML = "";
      imgSTATE.forEach((e) => {
        addImgCard(e);
      });
    })
    .catch((ex) => console.log(ex));
}

function initialize() {
  fetch("/api/todos", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      STATE = data;
      loadCards();
    })
    .catch((ex) => console.log(ex));
}

function loadCards() {
  STATE.forEach((e) => {
    if (notbtn.className === "activeChoice") {
      if (!e.done) addCard(e);
    } else {
      if (e.done) addCard(e);
    }
  });
}

function addCard(input) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = input.id;
  card.value = input.id;
  card.onclick = (e) => {
    if (e.target.className === "checkbox") return;
    const id = e.currentTarget.value;
    if (id === 0) return;
    const index = STATE.findIndex((i) => i.id === id);
    console.log(id);
    console.log(index);

    mainForm.style.display = "none";
    modal.style.display = "flex";

    modalTitle.value = STATE[index].title;
    modalTitle.name = STATE[index].id;
    modalBody.value = STATE[index].body;

    modalImg.setAttribute("src", STATE[index].img.url);
    modalTitle.setAttribute("readonly", "readonly");
    modalBody.setAttribute("readonly", "readonly");
    modalImgBtn.disabled = true;
    modalSave.disabled = true;
  };

  const check = document.createElement("input");
  check.setAttribute("type", "checkbox");
  check.setAttribute("id", input.id);
  check.setAttribute("class", "checkbox");
  check.checked = input.done;
  check.onclick = (e) => {
    //update the database
    const index = STATE.findIndex((i) => i.id == e.target.id);
    const data = STATE[index];
    data.done = !data.done;
    fetch(`/api/todos/${e.target.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        STATE[index] = data;
        container.innerHTML = "";
        loadCards();
      })
      .catch((ex) => console.log(ex));
    //transfer to completed or incomplete
    container.innerHTML = "";
    loadCards();
  };

  const span = document.createElement("span");
  span.className = "card-title";
  span.innerHTML = input.title;

  if (input.id !== 0) card.appendChild(check);
  card.appendChild(span);
  container.appendChild(card);
}

function addImgCard(input) {
  const div = document.createElement("div");
  div.setAttribute("class", "card search-card");
  div.setAttribute("id", JSON.stringify(input));
  div.onclick = (e) => {
    const id = e.currentTarget.id;
    if (searchForm.attributes.name.value == "add") {
      addFormImg.name = id;
      addFormImg.setAttribute("src", JSON.parse(id).url);
      searchForm.style.display = "none";
      addForm.style.display = "flex";
    }
    if (searchForm.attributes.name.value == "modal") {
      modalImg.name = id;
      modalImg.setAttribute("src", JSON.parse(id).url);
      searchForm.style.display = "none";
      modal.style.display = "flex";
    }
  };

  const img = document.createElement("img");
  img.setAttribute("src", input.url);
  img.setAttribute("class", "card-img");
  img.setAttribute("alt", input.snippet);
  const span = document.createElement("span");
  span.setAttribute("class", "card-title search-card-title");
  span.innerHTML = input.snippet;
  div.appendChild(img);
  div.appendChild(span);
  searchContent.appendChild(div);
}

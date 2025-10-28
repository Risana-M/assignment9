//URL of a mock api
const apiURL = "https://jsonplaceholder.typicode.com/users";

//DOM Elements
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("search");
const contactsDiv = document.getElementById("contacts");
const viewAllBtn = document.getElementById("viewAllBtn");


let contacts = []; // store all contacts locally


//fetch contact

function fetchContacts() {
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      // limit for demo
      contacts = data.slice(0, 5).map(item => ({
        id: item.id,
        name: item.name,
        phone: item.phone || "000-000-0000"
      }));
      displayContacts(contacts);
    })
    .catch(error => {
      alert("Error fetching contacts: " + error);
    });
}


//display contact
function displayContacts(list) {
  contactsDiv.innerHTML = "";

  if (list.length === 0) {
    contactsDiv.innerHTML = "<p>No contacts found</p>";
    return;
  }

  list.forEach(contact => {
    const div = document.createElement("div");
    div.className = "contact";

    div.innerHTML = `
  <div class="contact-info">
    <span class="contact-name">${contact.name}</span>
    <span class="contact-phone">${contact.phone}</span>
  </div>
  <div class="contact-actions">
    <button class="editBtn">Edit</button>
    <button class="deleteBtn">Delete</button>
  </div>
`;

    //delete button
    const deleteBtn = div.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", function () {
      deleteContact(contact.id);
    });

    //edit button
    const editBtn = div.querySelector(".editBtn");
    editBtn.addEventListener("click", function () {
      editContact(contact.id);
    });

    contactsDiv.appendChild(div);
  });
}

//add contact 
addBtn.addEventListener("click", function () {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (name === "" || phone === "") {
    alert("Please fill name & number fields.");
    return;
  }

  const newContact = { name, phone };

  fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newContact)
  })
    .then(response => response.json())
    .then(data => {
      data.id = Math.floor(Math.random() * 10000); // fake ID for demo
      contacts.push(data);
      displayContacts(contacts);
      nameInput.value = "";
      phoneInput.value = "";
    })
    .catch(() => alert("Failed to add contact."));
});

// DELETE CONTACT (DELETE Request)
function deleteContact(id) {
  fetch(`${apiURL}/${id}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) throw new Error("Delete failed");
      contacts = contacts.filter(c => c.id !== id);
      displayContacts(contacts);
    })
    .catch(() => alert("Error deleting contact"));
}


// EDIT CONTACT (PUT Request)

function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;

  const newName = prompt("Enter new name:", contact.name);
  const newPhone = prompt("Enter new phone number:", contact.phone);

  if (!newName || !newPhone) {
    alert("Fields cannot be empty!");
    return;
  }

  const updatedData = { name: newName, phone: newPhone };

  fetch(`${apiURL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData)
  })
    .then(res => res.json())
    .then(() => {
      contact.name = newName;
      contact.phone = newPhone;
      displayContacts(contacts);
    })
    .catch(() => alert("Failed to update contact"));
}


// SEARCH CONTACT

searchInput.addEventListener("input", function (e) {
  const value = e.target.value.toLowerCase();
  const filtered = contacts.filter(
    c =>
      c.name.toLowerCase().includes(value) ||
      c.phone.toLowerCase().includes(value)
  );
  displayContacts(filtered);
})

// VIEW ALL CONTACTS BUTTON

viewAllBtn.addEventListener("click", function () {
  displayContacts(contacts);
  searchInput.value = "";
});


// INITIAL LOAD

fetchContacts();

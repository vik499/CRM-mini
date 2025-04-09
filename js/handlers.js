"use strict";

// =========================
// handlers.js
// =========================

import {
  searchInput,
  addClientBtn,
  clientModal,
  clientForm,
  cancelBtn,
  deleteClientBtn,
  deleteConfirmModal,
  confirmDeleteBtn,
  cancelDeleteBtn,
  deleteModalClose,
  contactsList,
  addContactBtn,
  modalClose,
  contactsContainer,
  formTitle,
  clientSurnameInput,
  clientFirstNameInput,
  clientPatronymicInput,
  contactRowTemplate,
} from "./dom-elements.js";

import {
  dummyClients,
  currentClients,
  state, // вместо editClientId
  currentSort,
  filterClients,
  fetchClients,
  fetchClientById,
  processResponse,
} from "./data.js";

import {
  renderClients,
  sortClientsArray,
  updateSortIcons,
} from "./render.js";

/* =========================
   УТИЛИТАРНЫЕ ФУНКЦИИ
========================= */

/**
 * Очищает сообщения об ошибках в форме
 */
function clearModalErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => error.remove());
  const inputs = clientForm.querySelectorAll(".input-error");
  inputs.forEach((input) => input.classList.remove("input-error"));
}

/**
 * Показывает текст ошибки под конкретным полем
 */
function showError(input, message) {
  const row = input.closest(".contact-row");
  let errorElem = row?.nextElementSibling;
  if (!errorElem || !errorElem.classList.contains("error-message")) {
    errorElem = document.createElement("div");
    errorElem.classList.add("error-message");
    errorElem.style.color = "red";
    errorElem.style.fontSize = "0.9em";
    row?.parentElement.insertBefore(errorElem, row.nextSibling);
  }
  errorElem.textContent = message;
  input.classList.add("input-error");
}

/**
 * Удаляет сообщение об ошибке для конкретного поля
 */
function clearError(input) {
  const row = input.closest(".contact-row");
  if (row?.nextElementSibling && row.nextElementSibling.classList.contains("error-message")) {
    row.nextElementSibling.remove();
  }
  input.classList.remove("input-error");
}

/**
 * Показывать/скрывать кнопку удаления контакта в зависимости от заполненности
 */
function toggleDeleteButtonVisibility(input, deleteBtn) {
  if (input.value.trim()) {
    deleteBtn.style.display = "inline-block";
  } else {
    deleteBtn.style.display = "none";
  }
}

/**
 * Обновляет видимость кнопки "Добавить контакт" (макс 10)
 */
function updateAddContactBtnVisibility() {
  const contactRows = contactsList.querySelectorAll(".contact-row");
  addContactBtn.style.display = contactRows.length >= 10 ? "none" : "block";
}

/**
 * Открывает модальное окно
 * @param {boolean} isEdit - если true, режим редактирования
 */
function openClientModal(isEdit = false) {
  clearModalErrors();
  if (isEdit) {
    formTitle.textContent = "Изменить данные";
    let idDisplay = document.getElementById("client-id-display");
    if (!idDisplay) {
      idDisplay = document.createElement("span");
      idDisplay.id = "client-id-display";
      idDisplay.classList.add("client-id-display");
      formTitle.append(idDisplay);
    }
    contactsContainer.innerHTML = "";
    contactsContainer.append(contactsList, addContactBtn);
    deleteClientBtn.style.display = "inline-block";
    cancelBtn.style.display = "none";
  } else {
    formTitle.textContent = "Новый клиент";
    const idDisplay = document.getElementById("client-id-display");
    if (idDisplay) idDisplay.remove();

    contactsContainer.innerHTML = "";
    contactsContainer.append(addContactBtn, contactsList);
    deleteClientBtn.style.display = "none";
    cancelBtn.style.display = "inline-block";
  }
  updateAddContactBtnVisibility();
  clientModal.style.display = "block";
}

/* =========================
   ОБРАБОТЧИКИ
========================= */

// 1) Поиск
function handleSearch() {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    const filtered = filterClients(dummyClients, query);
    renderClients(filtered);
  });
}

// 2) Кнопка "Добавить клиента"
function handleAddClient() {
  addClientBtn.addEventListener("click", () => {
    // обнуляем editClientId
    state.editClientId = null;

    // Очищаем поля формы
    clientSurnameInput.value = "";
    clientFirstNameInput.value = "";
    clientPatronymicInput.value = "";
    contactsList.innerHTML = "";

    openClientModal(false);
  });
}

// 3) Кнопка "Отмена" в модальном окне
function handleCancelBtn() {
  cancelBtn.addEventListener("click", () => {
    clientModal.style.display = "none";
    clearModalErrors();
  });
}

// 4) Крестик закрытия
function handleModalClose() {
  modalClose.addEventListener("click", () => {
    clientModal.style.display = "none";
    clearModalErrors();
  });
}

// 5) Клик вне модалки
function handleClickOutsideModal() {
  window.addEventListener("click", (event) => {
    if (event.target === clientModal) {
      clientModal.style.display = "none";
      clearModalErrors();
    }
    if (event.target === deleteConfirmModal) {
      deleteConfirmModal.style.display = "none";
    }
  });
}

// 6) "Добавить контакт"
function handleAddContact() {
  addContactBtn.addEventListener("click", () => {
    const currentContacts = contactsList.querySelectorAll(".contact-row").length;
    if (currentContacts >= 10) {
      addContactBtn.style.display = "none";
      return;
    }
    // Клонируем шаблон
    const clone = document.importNode(contactRowTemplate.content, true);
    const contactRow = clone.querySelector(".contact-row");
    const deleteContactBtn = clone.querySelector(".delete-contact-btn");
    deleteContactBtn.style.display = "none";

    const contactTypeSelect = clone.querySelector(".contact-type");
    const contactValueInput = clone.querySelector(".contact-value");

    function applyPhoneMask() {
      if (contactTypeSelect.value === "phone") {
        contactValueInput.value = contactValueInput.value.replace(/[^+\d()\- ]/g, "");
      }
    }

    contactValueInput.addEventListener("input", () => {
      applyPhoneMask();
      toggleDeleteButtonVisibility(contactValueInput, deleteContactBtn);
    });

    contactTypeSelect.addEventListener("change", () => {
      if (contactTypeSelect.value === "phone") {
        contactValueInput.value = contactValueInput.value.replace(/[^+\d()\- ]/g, "");
      }
      toggleDeleteButtonVisibility(contactValueInput, deleteContactBtn);
    });

    deleteContactBtn.addEventListener("click", () => {
      contactRow.remove();
      updateAddContactBtnVisibility();
    });

    contactsList.append(clone);
    updateAddContactBtnVisibility();
  });
}

// 7) Сабмит формы
function handleFormSubmit() {
  clientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const surname = clientSurnameInput.value.trim();
    const name = clientFirstNameInput.value.trim();
    const lastName = clientPatronymicInput.value.trim();

    const contacts = [];
    let valid = true;

    // Собираем контакты
    contactsList.querySelectorAll(".contact-row").forEach((row) => {
      const type = row.querySelector(".contact-type").value;
      const valueInput = row.querySelector(".contact-value");
      const value = valueInput.value.trim();

      clearError(valueInput);
      if (value) {
        if (type === "phone") {
          if (!/^[+\d()\- ]+$/.test(value)) {
            valid = false;
            showError(valueInput, "Номер телефона содержит недопустимые символы.");
          }
        } else if (type === "email") {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            valid = false;
            showError(valueInput, "Некорректный формат email адреса.");
          }
        }
        contacts.push({ type, value });
      }
    });

    if (!valid) return;

    // Собираем данные клиента
    const clientData = { surname, name, lastName, contacts };

    try {
      if (state.editClientId) {
        // Редактирование - ищем клиента и обновляем данные
        const client = dummyClients.find(c => c.id === state.editClientId);
        if (client) {
          client.surname = surname;
          client.name = name;
          client.lastName = lastName;
          client.contacts = contacts;
          client.updatedAt = new Date().toISOString();
        }
      } else {
        // Создание нового клиента
        const newClient = {
          id: String(dummyClients.length + 1),
          surname,
          name,
          lastName,
          contacts,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        dummyClients.push(newClient);
      }
      clearModalErrors();
      await fetchClients();
      renderClients(currentClients);
      clientModal.style.display = "none";
    } catch (error) {
      console.error("Ошибка при сохранении клиента:", error);
    }
  });
}

// 8) "Удалить клиента" (кнопка в форме)
function handleDeleteClientBtn() {
  deleteClientBtn.addEventListener("click", () => {
    deleteConfirmModal.style.display = "block";
  });
}

// 9) Подтверждение удаления
function handleConfirmDelete() {
  confirmDeleteBtn.addEventListener("click", async () => {
    if (state.editClientId) {
      try {
        const index = dummyClients.findIndex(c => c.id === state.editClientId);
        if (index !== -1) {
          dummyClients.splice(index, 1);
        }
        await fetchClients();
        renderClients(currentClients);
        clientModal.style.display = "none";
        deleteConfirmModal.style.display = "none";
      } catch (error) {
        console.error("Ошибка при удалении клиента:", error);
      }
    }
  });
}

// 10) Отмена удаления
function handleCancelDelete() {
  cancelDeleteBtn.addEventListener("click", () => {
    deleteConfirmModal.style.display = "none";
  });
  deleteModalClose.addEventListener("click", () => {
    deleteConfirmModal.style.display = "none";
  });
}

// 11) Клик по таблице (Редактировать / Удалить)
function handleTableClicks() {
  document.getElementById("clients-table-body").addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
      const id = editBtn.getAttribute("data-id");
      try {
        const client = await fetchClientById(id);
        if (client) {
          state.editClientId = client.id;
          // Заполняем форму
          clientSurnameInput.value = client.surname || "";
          clientFirstNameInput.value = client.name || "";
          clientPatronymicInput.value = client.lastName || "";
          contactsList.innerHTML = "";

          // Заполняем контакты
          client.contacts.forEach(contact => {
            const clone = document.importNode(contactRowTemplate.content, true);
            const row = clone.querySelector(".contact-row");

            let type = contact.type;
            if (!["phone", "email", "vk", "fb"].includes(type)) {
              type = "other";
            }

            const contactTypeSelect = row.querySelector(".contact-type");
            const contactValueInput = row.querySelector(".contact-value");
            const deleteBtn = row.querySelector(".delete-contact-btn");

            contactTypeSelect.value = type;
            contactValueInput.value = contact.value;
            toggleDeleteButtonVisibility(contactValueInput, deleteBtn);

            function applyPhoneMask() {
              if (contactTypeSelect.value === "phone") {
                contactValueInput.value = contactValueInput.value.replace(/[^+\d()\- ]/g, "");
              }
            }
            contactValueInput.addEventListener("input", () => {
              applyPhoneMask();
              toggleDeleteButtonVisibility(contactValueInput, deleteBtn);
            });
            contactTypeSelect.addEventListener("change", () => {
              if (contactTypeSelect.value === "phone") {
                contactValueInput.value = contactValueInput.value.replace(/[^+\d()\- ]/g, "");
              }
              toggleDeleteButtonVisibility(contactValueInput, deleteBtn);
            });
            deleteBtn.addEventListener("click", () => {
              row.remove();
              updateAddContactBtnVisibility();
            });

            contactsList.append(clone);
          });

          openClientModal(true);
          let idDisplay = document.getElementById("client-id-display");
          if (idDisplay) {
            idDisplay.textContent = "ID: " + client.id;
          }
        }
      } catch (error) {
        console.error("Ошибка получения данных клиента:", error);
      }
      return;
    }

    // Кнопка "Удалить" из таблицы
    const delBtn = e.target.closest(".delete-btn");
    if (delBtn) {
      state.editClientId = delBtn.getAttribute("data-id");
      deleteConfirmModal.style.display = "block";
    }
  });
}

// 12) Сортировка колонок
function handleTableSort() {
  document.querySelectorAll("th.sortable").forEach(header => {
    header.addEventListener("click", () => {
      const sortKey = header.getAttribute("data-sort-key");
      if (!sortKey) return;
      if (currentSort.key === sortKey) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort.key = sortKey;
        currentSort.ascending = true;
      }
      const sorted = sortClientsArray(currentClients, currentSort.key, currentSort.ascending);
      renderClients(sorted);
      updateSortIcons();
    });
  });
}

/* =========================
   ИНИЦИАЛИЗАЦИЯ
========================= */
export function initHandlers() {
  handleSearch();
  handleAddClient();
  handleCancelBtn();
  handleModalClose();
  handleClickOutsideModal();
  handleAddContact();
  handleFormSubmit();
  handleDeleteClientBtn();
  handleConfirmDelete();
  handleCancelDelete();
  handleTableClicks();
  handleTableSort();
}



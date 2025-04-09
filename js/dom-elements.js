"use strict";

// =========================
// dom-elements.js
// =========================

// Все основные ссылки на DOM-элементы

export const clientsTableBody = document.getElementById("clients-table-body");
export const searchInput = document.getElementById("search-input");
export const addClientBtn = document.getElementById("add-client-btn");

export const clientModal = document.getElementById("client-modal");
export const clientForm = document.getElementById("client-form");
export const formTitle = document.getElementById("form-title");

// Поля ввода ФИО
export const clientSurnameInput = document.getElementById("client-surname");
export const clientFirstNameInput = document.getElementById("client-firstname");
export const clientPatronymicInput = document.getElementById("client-patronymic");

// Контейнер для контактов
export const contactsContainer = document.getElementById("contacts-container");
contactsContainer.classList.add(
  "d-flex",
  "align-items-center",
  "justify-content-center",
  "flex-column"
);

// Список контактов и кнопка "Добавить контакт"
export const contactsList = document.createElement("div");
contactsList.id = "contacts-list";
contactsList.classList.add("order-1", "w-100");

export const addContactBtn = document.createElement("button");
addContactBtn.type = "button";
addContactBtn.id = "add-contact-btn";
addContactBtn.classList.add("add-contact-btn", "order-2");
addContactBtn.textContent = "Добавить контакт";

// Очищаем контейнер и вставляем
contactsContainer.innerHTML = "";
contactsContainer.append(addContactBtn, contactsList);

// Кнопки управления формой
export const cancelBtn = document.getElementById("cancel-btn");
export const deleteClientBtn = document.getElementById("delete-client-btn");

// Модальное окно подтверждения удаления
export const deleteConfirmModal = document.getElementById("delete-confirm-modal");
export const deleteModalClose = document.getElementById("delete-modal-close");
export const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
export const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

// Шаблон строки контакта
export const contactRowTemplate = document.getElementById("contact-row-template");

// Спиннер
export const loadingSpinner = document.getElementById("loading-spinner");
export function showLoadingSpinner() {
  loadingSpinner.style.display = "block";
}
export function hideLoadingSpinner() {
  loadingSpinner.style.display = "none";
}

// Крестик закрытия
export const modalClose = document.getElementById("modal-close");

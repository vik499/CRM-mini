"use strict";

// =========================
// render.js
// =========================

import { clientsTableBody } from "./dom-elements.js";
import { currentSort } from "./data.js";

/**  
 * SVG иконки для стрелок сортировки (вверх/вниз)
 */
const arrowUpSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 8L6 14H18L12 8Z" fill="#9873FF"/>
</svg>`;
const arrowDownSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 16L18 10H6L12 16Z" fill="#9873FF"/>
</svg>`;

/**
 * Возвращает HTML-строку иконки контакта
 */
function getContactIcon(contact) {
  let iconClass = contact.type;
  let href, tooltip;
  switch (contact.type) {
    case "email":
      href = `mailto:${contact.value}`;
      tooltip = `Email: ${contact.value}`;
      break;
    case "phone":
      href = `tel:${contact.value}`;
      tooltip = `Телефон: ${contact.value}`;
      break;
    case "vk":
      href = contact.value;
      tooltip = `Vk: ${contact.value}`;
      break;
    case "fb":
      href = contact.value;
      tooltip = `Facebook: ${contact.value}`;
      break;
    default:
      href = contact.value;
      tooltip = `${contact.type}: ${contact.value}`;
      iconClass = "default";
      break;
  }
  // Оборачиваем иконку в ссылку, чтобы при клике происходил переход
  return `<a href="${href}" target="_blank" class="contact-icon ${iconClass}" data-tooltip="${tooltip}"></a>`;
}

/**
 * Создаёт DOM-элемент, содержащий иконки контактов
 */
export function renderContacts(contactsArray) {
  const container = document.createElement("div");
  container.classList.add("contact-list");

  if (contactsArray.length <= 5) {
    // просто выводим все
    contactsArray.forEach(contact => {
      const tmp = document.createElement("div");
      tmp.innerHTML = getContactIcon(contact);
      container.append(tmp.firstElementChild);
    });
  } else {
    // если >5, показываем только 4 и иконку "+N"
    for (let i = 0; i < 4; i++) {
      const tmp = document.createElement("div");
      tmp.innerHTML = getContactIcon(contactsArray[i]);
      container.append(tmp.firstElementChild);
    }
    const hiddenCount = contactsArray.length - 4;
    const moreIcon = document.createElement("span");
    moreIcon.classList.add("hidden-contacts-icon");

    const svgCircle = `<svg width="16" height="16" ...>...</svg>`;
    moreIcon.innerHTML = svgCircle;

    const countSpan = document.createElement("span");
    countSpan.textContent = `+${hiddenCount}`;
    countSpan.style.cssText = "position:relative; top:2px; right: 13px; font-size:8px; color: black;";
    moreIcon.style.position = "relative";
    moreIcon.append(countSpan);
    moreIcon.style.cursor = "pointer";

    moreIcon.addEventListener("click", () => {
      for (let i = 4; i < contactsArray.length; i++) {
        const tmp = document.createElement("div");
        tmp.innerHTML = getContactIcon(contactsArray[i]);
        container.append(tmp.firstElementChild);
      }
      moreIcon.remove();
    });
    container.append(moreIcon);
  }

  return container;
}

/**
 * Отрисовывает список клиентов (clientsArray) в таблице
 */
export function renderClients(clientsArray) {
  clientsTableBody.innerHTML = "";
  const template = document.getElementById("client-row-template").content;

  clientsArray.forEach(client => {
    const clone = document.importNode(template, true);

    clone.querySelector(".client-id").textContent = client.id;
    clone.querySelector(".client-name").textContent =
      client.surname + " " + client.name + (client.lastName ? " " + client.lastName : "");
    clone.querySelector(".client-createdAt").textContent =
      new Date(client.createdAt).toLocaleString();
    clone.querySelector(".client-updatedAt").textContent =
      new Date(client.updatedAt).toLocaleString();

    // Контакты
    const contactsElem = renderContacts(client.contacts);
    const clientContactsContainer = clone.querySelector(".client-contacts");
    clientContactsContainer.innerHTML = "";
    clientContactsContainer.append(contactsElem);

    // Проставляем data-id на кнопки
    clone.querySelector(".edit-btn").setAttribute("data-id", client.id);
    clone.querySelector(".delete-btn").setAttribute("data-id", client.id);

    clientsTableBody.append(clone);
  });

  updateSortIcons();
}

/**
 * Сортирует массив клиентов
 */
export function sortClientsArray(clientsArray, key, ascending) {
  return clientsArray.slice().sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];

    if (key === "fullName") {
      aValue = `${a.surname} ${a.name} ${a.lastName || ""}`.trim();
      bValue = `${b.surname} ${b.name} ${b.lastName || ""}`.trim();
    }
    if (aValue < bValue) return ascending ? -1 : 1;
    if (aValue > bValue) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Обновляет иконки сортировки
 */
export function updateSortIcons() {
  document.querySelectorAll("th.sortable").forEach(header => {
    if (!header.dataset.originalText) {
      header.dataset.originalText = header.textContent.trim();
    }
    const originalText = header.dataset.originalText;
    const sortKey = header.getAttribute("data-sort-key");
    const icon = (sortKey === currentSort.key)
      ? (currentSort.ascending ? arrowUpSVG : arrowDownSVG)
      : arrowUpSVG;
    header.innerHTML = `${originalText} ${icon}`;
  });

  // Восстанавливаем исходный заголовок для тех, у кого нет сортировки
  document.querySelectorAll("th.t-title").forEach(header => {
    if (!header.classList.contains("sortable")) {
      // Здесь у нас уже data-original-text есть (Контакты, Действия)
      header.innerHTML = header.dataset.originalText;
    }
  });
}

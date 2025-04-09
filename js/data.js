"use strict";

// =========================
// data.js
// =========================

// Храним текущих клиентов
export let currentClients = [];

// Фиктивные клиенты
export const dummyClients = [
  {
    id: "1",
    surname: "Иванов",
    name: "Иван",
    lastName: "Иванович",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contacts: [
      { type: "phone", value: "+7 (999) 123-45-67" },
      { type: "email", value: "ivanov@example.com" },
    ],
  },
  {
    id: "2",
    surname: "Петров",
    name: "Петр",
    lastName: "Петрович",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contacts: [
      { type: "vk", value: "https://vk.com/petrov" },
      { type: "fb", value: "https://facebook.com/petrov" },
    ],
  },
];

// ID редактируемого клиента (если мы в режиме редактирования)
export const state = {
  editClientId: null,
};

// Текущая сортировка
export let currentSort = {
  key: null,      // "id", "fullName", "createdAt", "updatedAt"
  ascending: true // true = по возрастанию
};

/**
 * Фильтрует массив клиентов по поисковому запросу
 */
export function filterClients(clients, query) {
  if (!query) return clients;
  const lower = query.toLowerCase();
  return clients.filter(client => {
    const fullName = `${client.surname} ${client.name} ${client.lastName || ""}`.toLowerCase();
    return fullName.includes(lower);
  });
}

/**
 * Имитируем загрузку клиентов
 */
export async function fetchClients(searchQuery = "") {
  currentClients = filterClients(dummyClients, searchQuery);
  return currentClients;
}

/**
 * Имитирует получение одного клиента по id
 */
export async function fetchClientById(id) {
  const found = dummyClients.find(c => c.id === id);
  return found || null;
}

/**
 * Обработка ответа сервера (закомментировано, если нет реального сервера)
 */
export async function processResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

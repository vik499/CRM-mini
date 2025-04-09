"use strict";

// =========================
// main.js (точка входа)
// =========================

import { fetchClients, currentClients } from "./data.js";
import { renderClients, updateSortIcons } from "./render.js";
import { initHandlers } from "./handlers.js";

// Дожидаемся готовности DOM
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Загружаем (фиктивных) клиентов
  await fetchClients();

  // 2) Отрисовываем их
  renderClients(currentClients);

  // 3) Обновляем иконки сортировки
  updateSortIcons();

  // 4) Подключаем все обработчики событий
  initHandlers();
});

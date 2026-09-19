import { beforeEach } from "vitest";

import "@testing-library/jest-dom/vitest";

beforeEach(() => {
  window.localStorage.clear();
  document.cookie = "spin-wallet-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
});
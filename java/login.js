(() => {
  "use strict";

  window.lucide?.createIcons();

  const form = document.getElementById("loginForm");
  const identity = document.getElementById("identity");
  const password = document.getElementById("password");
  const toggle = document.getElementById("togglePassword");
  const status = document.getElementById("loginStatus");
  const identityError = document.getElementById("identityError");
  const passwordError = document.getElementById("passwordError");

  toggle?.addEventListener("click", () => {
    const isVisible = password.type === "text";
    password.type = isVisible ? "password" : "text";
    toggle.setAttribute(
      "aria-label",
      isVisible ? "Mostrar contraseña" : "Ocultar contraseña"
    );
    toggle.innerHTML = `<i data-lucide="${isVisible ? "eye" : "eye-off"}"></i>`;
    window.lucide?.createIcons();
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();

    identityError.textContent = "";
    passwordError.textContent = "";
    status.textContent = "";

    let valid = true;

    if (!identity.value.trim()) {
      identityError.textContent = "Ingresa tu usuario o correo electrónico.";
      valid = false;
    }

    if (!password.value) {
      passwordError.textContent = "Ingresa tu contraseña.";
      valid = false;
    }

    if (!valid) return;

    status.textContent = "Interfaz lista para conectarse con la autenticación del sistema.";
  });
})();

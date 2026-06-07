// --- NAVEGACIÓN ---
function navigateTo(screenId) {
    // Ocultar todas las pantallas dentro del contenedor
    const screens = document.querySelectorAll('.main-container > div');
    screens.forEach(s => s.classList.add('hidden'));
    
    // Mostrar la seleccionada
    document.getElementById(screenId).classList.remove('hidden');
    
    // Limpiar mensajes y formularios
    const msgs = document.querySelectorAll('.msg');
    msgs.forEach(m => { m.classList.add('hidden'); m.innerText = ''; });
    
    // Resetear iconos de ojo a 'cerrado' y passwords a tipo 'password'
    document.querySelectorAll('.toggle-password').forEach(i => i.classList.replace('fa-eye-slash', 'fa-eye'));
    
    // Asegurar que vuelven a ser password fields si se cambiaron
    document.getElementById('reg-password').type = 'password';
    document.getElementById('login-password').type = 'password';
    document.getElementById('forgot-new-password').type = 'password';
}

// --- MOSTRAR/OCULTAR CONTRASEÑA ---
function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        iconElement.classList.replace('fa-eye', 'fa-eye-slash'); // Icono ojo tachado
    } else {
        input.type = "password";
        iconElement.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Helper para mostrar mensajes
function showMessage(divId, text, type) {
    const div = document.getElementById(divId);
    div.innerText = text;
    div.className = `msg ${type}`; // quita 'hidden' y pone error/success
}

// --- LÓGICA DE REGISTRO ---
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    // Validación básica
    if(localStorage.getItem(username)) {
        showMessage('register-msg', 'Ese usuario ya existe. Prueba otro.', 'error');
        return;
    }

    const userData = { name, username, password };
    localStorage.setItem(username, JSON.stringify(userData));

    showMessage('register-msg', `¡Registro éxito, ${name}! Redirigiendo...`, 'success');
    document.getElementById('register-form').reset();

    setTimeout(() => navigateTo('screen-login'), 2000);
}

// --- LÓGICA DE LOGIN ---
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const storedUser = localStorage.getItem(username);

    if (!storedUser) {
        showMessage('login-msg', 'Usuario no encontrado. Regístrate primero.', 'error');
        return;
    }

    const userData = JSON.parse(storedUser);

    if (userData.password === password) {
        document.getElementById('welcome-user-text').innerText = `¡Hola de nuevo, ${userData.name}!`;
        document.getElementById('login-form').reset();
        navigateTo('screen-dashboard');
    } else {
        showMessage('login-msg', 'Contraseña incorrecta. ¿La has olvidado? Intenta recuperarla abajo.', 'error');
    }
}

// --- LÓGICA RECUPERAR CONTRASEÑA ---
function handleResetPassword(event) {
    event.preventDefault();
    const username = document.getElementById('forgot-username').value.trim().toLowerCase();
    const newPassword = document.getElementById('forgot-new-password').value;

    const storedUser = localStorage.getItem(username);

    if (!storedUser) {
        showMessage('forgot-msg', 'El usuario no existe.', 'error');
        return;
    }

    // Si existe, actualizamos
    const userData = JSON.parse(storedUser);
    userData.password = newPassword; // Actualizamos contraseña en el objeto
    localStorage.setItem(username, JSON.stringify(userData)); // Guardamos de nuevo

    showMessage('forgot-msg', '¡Contraseña actualizada! Ya puedes iniciar sesión.', 'success');
    document.getElementById('forgot-form').reset();

    setTimeout(() => navigateTo('screen-login'), 2500);
}

function logout() {
    navigateTo('screen-welcome');
}
// Sistema simplificado para mostrar contraseña en navegación dinámica
(function() {
    'use strict';
    
    let inicializado = false;

    function initMostrarContrasena() {
        const passwordInput = document.getElementById("inputPassword");
        const showPasswordCheckbox = document.getElementById("inputRememberPassword");
        
        if (!passwordInput || !showPasswordCheckbox || showPasswordCheckbox.dataset.init === 'true') {
            return false;
        }

        function togglePassword() {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                passwordInput.style.fontSize = "1rem";
                passwordInput.style.letterSpacing = "0.1em";
            } else {
                passwordInput.type = "password";
                passwordInput.style.fontSize = "";
                passwordInput.style.letterSpacing = "";
            }
        }

        // Limpiar eventos previos y agregar nuevo
        const newCheckbox = showPasswordCheckbox.cloneNode(true);
        showPasswordCheckbox.parentNode.replaceChild(newCheckbox, showPasswordCheckbox);
        newCheckbox.addEventListener("change", togglePassword);
        newCheckbox.dataset.init = 'true';
        
        return true;
    }

    function tryInit() {
        // Intento inmediato
        if (initMostrarContrasena()) return;
        
        // Si no funciona, esperar un poco más
        setTimeout(() => {
            if (initMostrarContrasena()) return;
            
            // Último intento después de más tiempo
            setTimeout(initMostrarContrasena, 300);
        }, 100);
    }

    // Funciones globales
    window.setupMostrarContrasenaParaLogin = tryInit;
    window.debugMostrarContrasena = function() {
        console.log('🔍 Debug mostrar contraseña:', {
            passwordInput: !!document.getElementById("inputPassword"),
            checkbox: !!document.getElementById("inputRememberPassword"),
            inicializado: document.getElementById("inputRememberPassword")?.dataset.init === 'true'
        });
    };

    // Auto-inicialización
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", tryInit);
    } else {
        tryInit();
    }
})();

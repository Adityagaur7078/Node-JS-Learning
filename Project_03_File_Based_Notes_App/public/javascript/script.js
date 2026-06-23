const successMessage = document.getElementById("success-message");

if (successMessage) {
    setTimeout(() => {
        successMessage.style.display = "none";
        window.history.replaceState({}, "", "/");
    }, 3000);
}
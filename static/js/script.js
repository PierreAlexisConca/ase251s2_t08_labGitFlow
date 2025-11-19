document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const response = await fetch('/send-email', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${name}&email=${email}&message=${message}`
    });

    const result = await response.json();
    alert(result.message);
});

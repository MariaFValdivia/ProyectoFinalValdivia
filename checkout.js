document.addEventListener("DOMContentLoaded", function () {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const resumenCarrito = document.getElementById('resumen-carrito');
    const totalCheckout = document.getElementById('total-checkout');

    function mostrarResumenCarrito() {
        if (carrito.length === 0) {
            resumenCarrito.innerHTML = '<p class="text-center">El carrito está vacío.</p>';
            totalCheckout.textContent = '0';
            return;
        }

        let total = 0;
        resumenCarrito.innerHTML = '';

        carrito.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');
            card.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${producto.imagen}" class="img-fluid rounded-start" alt="${producto.titulo}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.titulo}</h5>
                            <p class="card-text">Talla: ${producto.talla} - $${producto.precio}</p>
                        </div>
                    </div>
                </div>
            `;
            resumenCarrito.appendChild(card);
            total += producto.precio;
        });

        totalCheckout.textContent = total;
    }

 
    mostrarResumenCarrito();


    const formularioEnvio = document.getElementById('formulario-envio');
    formularioEnvio.addEventListener('submit', function (event) {
        event.preventDefault(); 

        // Validar el formulario
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const region = document.getElementById('region').value.trim();
        const codigoPostal = document.getElementById('codigo-postal').value.trim();

        if (!nombre || !email || !direccion || !ciudad || !region || !codigoPostal) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Simular el envío de la compra
        alert('¡Compra realizada con éxito!');
        localStorage.removeItem('carrito'); 
        window.location.href = 'index.html';
    });
});
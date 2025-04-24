document.addEventListener("DOMContentLoaded", function () {
    // Variables globales
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carroItems = document.getElementById('items-carrito');
    const contadorElementosCarrito = document.getElementById('contador-carrito');
    const contenedorCards = document.querySelector('.contenedorCards'); // Referencia al contenedor de productos

    // Función para actualizar el carrito
    function actualizarCarrito() {
        console.log("Actualizando el carrito...");
        carroItems.innerHTML = ''; // Limpiar el contenido del carrito

        if (carrito.length === 0) {
            carroItems.innerHTML = `
                <li><p class="dropdown-item-text text-center">El carrito está vacío.</p></li>
            `;
            contadorElementosCarrito.textContent = '0';
        } else {
            carrito.forEach((producto, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('dropdown-item', 'd-flex', 'justify-content-between', 'align-items-center');
                listItem.innerHTML = `
                    <div>
                        <strong>${producto.titulo}</strong> - Talla: ${producto.talla} - $${producto.precio}
                    </div>
                    <button class="btn btn-danger btn-sm eliminar-producto" data-index="${index}">Eliminar</button>
                `;
                carroItems.appendChild(listItem);
            });

            // Calcular el total del carrito
            const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
            contadorElementosCarrito.textContent = carrito.length;

            // Mostrar el total
            const totalItem = document.createElement('li');
            totalItem.classList.add('dropdown-item-text', 'text-end', 'fw-bold');
            totalItem.innerHTML = `Total: $<span id="valor-total">${total}</span>`;
            carroItems.appendChild(totalItem);

            // Botón para vaciar el carrito
            const vaciarBtn = document.createElement('li');
            vaciarBtn.classList.add('dropdown-item', 'text-center');
            vaciarBtn.innerHTML = `<button class="btn btn-outline-danger btn-sm" id="vaciar-carrito">Vaciar carrito</button>`;
            carroItems.appendChild(vaciarBtn);

            // Agregar eventos a los botones "Eliminar" y "Vaciar carrito"
            document.querySelectorAll('.eliminar-producto').forEach(boton => {
                boton.addEventListener('click', function () {
                    const index = parseInt(this.getAttribute('data-index'));
                    eliminarProductoDelCarrito(index);
                });
            });

            document.getElementById('vaciar-carrito')?.addEventListener('click', vaciarCarrito);
        }
        
        const pagarBtn = document.createElement('li');
        pagarBtn.classList.add('dropdown-item', 'text-center');
        pagarBtn.innerHTML = `
            <button class="btn btn-success w-100" id="pagar-carrito">Pagar</button>
        `;
        carroItems.appendChild(pagarBtn);
        
        // Event listener para el botón de pagar
        document.getElementById('pagar-carrito')?.addEventListener('click', function () {
            if (carrito.length === 0) {
                alert('El carrito está vacío. Agrega productos antes de pagar.');
                return;
            }
            // Redirigir a la página de checkout
            window.location.href = 'compra.html';
        });

        // Guardar el carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Función para eliminar un producto del carrito
    function eliminarProductoDelCarrito(index) {
        carrito.splice(index, 1); // Eliminar el producto del array
        actualizarCarrito(); // Actualizar la interfaz
    }

    // Función para vaciar el carrito
    function vaciarCarrito() {
        if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
            carrito.length = 0; // Vaciar el carrito
            actualizarCarrito(); // Actualizar la interfaz
        }
    }

    // Función para cargar productos desde el archivo JSON
    async function mostrarProductos() {
        try {
            const response = await fetch('products.json'); // Cargar el archivo JSON
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            const productosArray = await response.json();

            contenedorCards.innerHTML = ''; // Limpiar el contenido del contenedor

            // Crear las tarjetas de productos
            productosArray.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3', 'col-md-4'); // Clases de Bootstrap
                card.style.width = '18rem'; // Ancho fijo
                card.innerHTML = `
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.titulo}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p><strong>Precio: $${producto.precio}</strong></p>
                        <div>
                            <label for="talla-${producto.id}">Selecciona una talla:</label>
                            <select id="talla-${producto.id}" class="form-select mb-2">
                                ${producto.tallasDisponibles.map(talla => `
                                    <option value="${talla}">${talla}</option>
                                `).join('')}
                            </select>
                        </div>
                        <button class="btn btn-primary agregar-al-carrito" data-id="${producto.id}">¡Lo quiero!</button>
                    </div>
                `;
                contenedorCards.appendChild(card);
            });

            // Event listener para agregar productos al carrito
            document.querySelectorAll('.agregar-al-carrito').forEach(boton => {
                boton.addEventListener('click', function () {
                    const productoId = parseInt(this.getAttribute('data-id'));
                    const producto = productosArray.find(p => p.id === productoId);
                    const selectTalla = document.getElementById(`talla-${producto.id}`);
                    const tallaSeleccionada = selectTalla.value;

                    if (!tallaSeleccionada) {
                        alert('Por favor, selecciona una talla.');
                        return;
                    }

                    const productoConTalla = {
                        ...producto,
                        talla: tallaSeleccionada
                    };

                    const existeEnCarrito = carrito.some(item => item.id === producto.id && item.talla === tallaSeleccionada);
                    if (!existeEnCarrito) {
                        carrito.push(productoConTalla);
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                        alert(`Producto "${producto.titulo}" (talla ${tallaSeleccionada}) agregado al carrito.`);
                        actualizarCarrito();
                    } else {
                        alert(`El producto "${producto.titulo}" (talla ${tallaSeleccionada}) ya está en el carrito.`);
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            contenedorCards.innerHTML = '<p>Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }

    // Llamar a las funciones iniciales
    mostrarProductos(); // Mostrar los productos en el contenedor
    actualizarCarrito(); // Mostrar el carrito si hay datos guardados
});
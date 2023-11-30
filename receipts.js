//Cargar Facturas
let selectedDate = '';

function loadReceipts(selectDate) {
    clearMain();
    const mainContent = document.getElementById('main-content');
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': id,
        }
    }

    fetch(`http://127.0.0.1:5200/user/${id}/receipt`, requestOptions)
        .then(
            resp => { return resp.json() }
        )
        .then(resp => {
            // Filtrar las facturas por la fecha seleccionada
            const filteredReceipts = selectedDate
                ? resp.filter(receipt => {
                    // Formatear la fecha de la factura al formato ISO
                    const formattedDate = new Date(receipt.date).toISOString().split('T')[0];
                    return formattedDate === selectedDate;
                })
                : resp;

            if (filteredReceipts.length >= 0) {
                filteredReceipts.forEach(receipt => {
                    showReceipt(receipt);
                });
            } else {
                alert('Tiempo Expirado');
                window.location.href = 'login.html';
            }
        }
        );

    // Agregar botón para crear una nueva Factura
    const createReceiptButton = document.createElement('button');
    createReceiptButton.textContent = 'Crear Nueva Factura';
    createReceiptButton.classList.add('btn', 'btn-primary', 'mb-3'); 
    createReceiptButton.addEventListener('click', () => openCreateReceiptModal());
    createReceiptButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    mainContent.appendChild(createReceiptButton);

    // Crear el desplegable de fechas
    const dateFilter = document.createElement('input');
    dateFilter.type = 'date';
    dateFilter.id = 'dateFilter';
    dateFilter.classList.add('form-control'); 

    // Crear el botón de filtro
    const filterButton = document.createElement('button');
    filterButton.textContent = selectedDate ? 'Mostrar Todas / Filtrar por Fecha' : 'Filtrar por Fecha';
    filterButton.classList.add('btn', 'btn-primary', 'mb-3'); 
    filterButton.addEventListener('click', () => {
        const newDate = dateFilter.value;
        if (newDate !== selectedDate) {
            selectedDate = newDate;
            filterReceiptsByDate();
        }
    });

    mainContent.appendChild(dateFilter);
    mainContent.appendChild(filterButton);
}

function filterReceiptsByDate() {
    let selectedDate = document.getElementById('dateFilter').value;
    loadReceipts(selectedDate);
}


function showReceipt(receipt) {
    const mainContent = document.getElementById('main-content');

    const receiptContainer = document.createElement('div');
    receiptContainer.className = 'col-md-3 mb-4'; 
    receiptContainer.style.border = '1px solid #ddd'; 
    receiptContainer.style.padding = '15px'; 

    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const receiptDate = document.createElement('h4');
    receiptDate.className = 'card-title';
    const formattedDate = new Date(receipt.date).toLocaleDateString('es-ES', {
        timeZone: 'UTC',
    });
    receiptDate.textContent = `Fecha: ${formattedDate}`;

    const receiptCode = document.createElement('p');
    receiptCode.className = 'card-text';
    receiptCode.textContent = `Código: ${receipt.code}`;

    // Información del Cliente
    const customerInfo = document.createElement('div');
    customerInfo.className = 'customer-info';

    const receiptSurnameClient = document.createElement('p');
    receiptSurnameClient.className = 'card-text';
    receiptSurnameClient.textContent = `Apellido: ${receipt.surname_client}`;

    const receiptNameClient = document.createElement('p');
    receiptNameClient.className = 'card-text';
    receiptNameClient.textContent = `Nombre: ${receipt.name_client}`;

    customerInfo.appendChild(receiptSurnameClient);
    customerInfo.appendChild(receiptNameClient);

    cardBody.appendChild(receiptDate);
    cardBody.appendChild(receiptCode);
    cardBody.appendChild(customerInfo); // Agregar la sección de información del cliente

    // Línea divisoria entre la información del cliente y los detalles de productos
    const dividerLine1 = document.createElement('hr');
    cardBody.appendChild(dividerLine1);

    // Botón "Ver Detalles" con icono de flecha hacia abajo
    const detailsButton = document.createElement('button');
    detailsButton.className = 'btn btn-secondary mb-3 btn-sm';
    detailsButton.style.float = 'right'; // Utiliza el estilo float para posicionar a la derecha
    detailsButton.innerHTML = '<i class="fas fa-chevron-down"></i>'; // Icono de flecha hacia abajo
    detailsButton.addEventListener('click', () => toggleDetailsVisibility(receiptDetails));

   
    // Contenedor para los detalles de la factura
    const detailsContainer = document.createElement('div');
    detailsContainer.appendChild(detailsButton);
   
    const receiptDetails = document.createElement('div');
    receiptDetails.className = 'receipt-details';
    receiptDetails.style.display = 'none';

    receipt.details.forEach(detail => {
        const detailContainer = document.createElement('div');
        detailContainer.className = 'detail-container';

        const detailName = document.createElement('p');
        detailName.className = 'card-text';
        detailName.textContent = `Nombre: ${detail.name}`;

        const detailQuantity = document.createElement('p');
        detailQuantity.className = 'card-text';
        detailQuantity.textContent = `Cantidad: ${detail.quantity}`;

        const detailType = document.createElement('p');
        detailType.className = 'card-text';
        detailType.textContent = `Tipo: ${detail.type}`;

        const detailUnitPrice = document.createElement('p');
        detailUnitPrice.className = 'card-text';
        detailUnitPrice.textContent = `Precio Unitario: ${parseFloat(detail.unit_price).toFixed(2)}`;

        const detailTotal = document.createElement('p');
        const totalAmount = detail.quantity * parseFloat(detail.unit_price);
        detailTotal.className = 'card-text mb-3';
        detailTotal.textContent = `Subtotal: ${totalAmount.toFixed(2)}`;

        detailContainer.appendChild(detailName);
        detailContainer.appendChild(detailQuantity);
        detailContainer.appendChild(detailType);
        detailContainer.appendChild(detailUnitPrice);
        detailContainer.appendChild(detailTotal);

        receiptDetails.appendChild(detailContainer);

        // Línea divisoria entre los detalles de productos
        const dividerLine2 = document.createElement('hr');
        receiptDetails.appendChild(dividerLine2);
    });


    const totalAmount = receipt.details.reduce((total, detail) => {
        return total + detail.quantity * parseFloat(detail.unit_price);
    }, 0);

    const receiptTotal = document.createElement('p');
    receiptTotal.className = 'card-text';
    receiptTotal.style.fontWeight = 'bold'; // Hacer que el total sea más destacado
    receiptTotal.textContent = `Total Factura: ${totalAmount.toFixed(2)}`;

    detailsContainer.appendChild(receiptDetails);
    cardBody.appendChild(detailsContainer);
    cardBody.appendChild(receiptTotal);

    card.appendChild(cardBody);
    receiptContainer.appendChild(card);
    mainContent.appendChild(receiptContainer);
}

function toggleDetailsVisibility(detailsElement) {
    detailsElement.style.display = (detailsElement.style.display === 'none' || !detailsElement.style.display) ? 'block' : 'none';

    // Cambiar el icono de flecha hacia arriba o hacia abajo según el estado
    const detailsButton = detailsElement.parentElement.querySelector('.btn');
    if (detailsElement.style.display === 'none') {
        detailsButton.innerHTML = '<i class="fas fa-chevron-down"></i>'; // Icono de flecha hacia abajo
    } else {
        detailsButton.innerHTML = '<i class="fas fa-chevron-up"></i>'; // Icono de flecha hacia arriba
    }
}


function openCreateReceiptModal() {

    loadClientsAndProducts();
    const modal = document.getElementById('createReceiptModal');
    const form = document.getElementById('createReceiptForm');
    form.reset();
    modal.style.display = 'block';
    document.addEventListener('click', outsideCreateReceiptModalClick);
}


function outsideCreateReceiptModalClick(event) {
    const modalContent = document.querySelector('.modal-content');
    const createReceiptForm = document.getElementById('createReceiptForm');
    if (!modalContent.contains(event.target) && !createReceiptForm.contains(event.target)) {
        closeCreateReceiptModal();
    }
}


function closeCreateReceiptModal() {
    const modal = document.getElementById('createReceiptModal');
    document.removeEventListener('click', outsideCreateReceiptModalClick);
    modal.style.display = 'none';

    productsInReceipt.length = 0;
    const addedProductsDiv = document.getElementById('addedProducts');
    addedProductsDiv.innerHTML = '';
}


// Lista para almacenar los productos en la factura
const productsInReceipt = [];

// Función para cargar clientes y productos al cargar el modal
function loadClientsAndProducts() {
    const createReceiptClientSelect = document.getElementById('createReceiptClient');
    const createReceiptProductSelect = document.getElementById('createReceiptProduct');

    // Limpia las opciones existentes
    createReceiptClientSelect.innerHTML = '';
    createReceiptProductSelect.innerHTML = '';

    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': id,
        }
    }

    fetch(`http://127.0.0.1:5200/user/${id}/client`, requestOptions)
        .then(
            resp => { return resp.json() }
        )
        .then(
            resp => {
                if (resp.length >= 0) {
                    resp.forEach(client => {
                        const option = document.createElement('option');
                        option.value = client.dni; 
                        option.text = `${client.name} ${client.surname}`;
                        createReceiptClientSelect.add(option);
                    });
                }
                else {
                    alert('Tiempo Expirado');
                    window.location.href = 'login.html';
                }
            }
        )

        .catch(error => console.error('Error loading clients:', error));


    fetch(`http://127.0.0.1:5200/user/${id}/product_service`, requestOptions)
        .then(
            resp => { return resp.json() }
        )
        .then(
            resp => {
                if (resp.length >= 0) {
                    resp.forEach(product_service => {
                        const option = document.createElement('option');
                        option.value = product_service.name;  
                        option.text = product_service.name;
                        createReceiptProductSelect.add(option);
                    });
                }
                else {
                    alert('Tiempo Expirado');
                    window.location.href = 'login.html';
                }
            }
        )
        .catch(error => console.error('Error loading products:', error));
}



// Al agregar un producto a la lista
function addProductToReceipt() {
    const selectedProductName = document.getElementById('createReceiptProduct').value;
    const quantity = parseInt(document.getElementById('createReceiptQuantity').value, 10);

    // Validar si algún campo está vacío
    if (isNaN(quantity)) {
        alert('Por favor, completa el campo Cantidad.');
        return;
    }

    const product = {
        name: selectedProductName,
        quantity: quantity,
    };

    productsInReceipt.push(product);

    // Mostrar los productos agregados en un div
    const addedProductsDiv = document.getElementById('addedProducts');
    addedProductsDiv.innerHTML += `<p>${quantity} ${selectedProductName}</p>`;
}

//Guardar la factura
function saveReceipt() {
    const selectedClientDNI = document.getElementById('createReceiptClient').value;
    const code = document.getElementById('createReceiptCode').value;
    const date = document.getElementById('createReceiptDate').value;

    const receiptData = {
        code: code,
        date: date,
        dni_client: selectedClientDNI,
        receipt_detail: productsInReceipt,
    };

    // Validar si algún campo está vacío
    if (!selectedClientDNI || !code || !date) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    console.log(receiptData);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': id,
        },
        body: JSON.stringify(receiptData),
    };

    fetch(`http://127.0.0.1:5200/user/${id}/receipt`, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 400) {
                return response.json().then(errorData => {
                    throw new Error(`Bad Request: ${errorData.error}`);
                });
            } else if (response.status === 404) {
                return response.json().then(errorData => {
                    throw new Error(`Not Found: ${errorData.error}`);
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(resp => {
            console.log('Factura guardada exitosamente:', resp);
            alert('Éxito al guardar la factura');
            // Limpiar la lista de productos
            productsInReceipt.length = 0;
            // Cerrar el modal
            closeCreateReceiptModal();
            // Recargar las facturas
            loadReceipts();
        })
        .catch(error => {
            console.error('Error al guardar factura:', error.message);
            
            if (error.message.includes('Bad Request')) {
                // Manejar el error 400 específico
                alert('Error 400: ' + error.message);
            } else if (error.message.includes('401')) {
                // Manejar el error 401 (No autorizado)
                alert('Error 401: Tiempo de sesión expirado. Vuelve a iniciar sesión.');
                // Redirigir al formulario de inicio de sesión u otra acción apropiada
                window.location.href = 'login.html';
            } else if (error.message.includes('Not Found')) {
                // Manejar el error 404 (No encontrado)
                alert('Error 404: ' + error.message);
            } else {
                // Manejar otros errores
                alert('Error al guardar factura: ' + error.message);
            }
        });
}
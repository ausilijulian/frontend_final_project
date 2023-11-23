//Cargar Facturas

function loadReceipts() {
    clearMain();

    const mainContent = document.getElementById('main-content');
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'x-access-token' : token,
            'user-id': id,
        }
    }

    fetch(`http://127.0.0.1:5200/user/${id}/receipt`, requestOptions)
    .then(
        resp => {return resp.json()}
    )
    .then(
        resp => {
            if (resp.length >= 0){
                resp.forEach(receipt => {
                    showReceipt(receipt);
                });
            }
            else {
                alert('Tiempo Expirado');
                window.location.href = 'login.html';
            }
        }
    );

    // Agregar botón para crear un nuevo cliente
    const createReceiptButton = document.createElement('button');
    createReceiptButton.textContent = 'Crear Nueva Factura';
    createReceiptButton.classList.add('btn', 'btn-primary', 'mb-3'); // Agregar clases de Bootstrap
    createReceiptButton.addEventListener('click', () => openCreateReceiptModal());
    createReceiptButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    mainContent.appendChild(createReceiptButton);
}



function showReceipt(receipt) {
    const mainContent = document.getElementById('main-content');

    const receiptContainer = document.createElement('div');
    receiptContainer.className = 'col-md-4 mb-3'; // Dividir en 3 columnas en pantallas medianas y grandes

    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const receiptDate = document.createElement('h2');
    receiptDate.className = 'card-title';
    receiptDate.textContent = `Fecha: ${new Date(receipt.date).toLocaleDateString()}`;

    const receiptCode = document.createElement('p');
    receiptCode.className = 'card-text';
    receiptCode.textContent = `Código: ${receipt.code}`;

    const receiptSurnameClient = document.createElement('p');
    receiptSurnameClient.className = 'card-text';
    receiptSurnameClient.textContent = `Apellido: ${receipt.surname_client}`;

    const receiptNameClient = document.createElement('p');
    receiptNameClient.className = 'card-text';
    receiptNameClient.textContent = `Nombre: ${receipt.name_client}`;

    const receiptDetails = document.createElement('div');
    receiptDetails.className = 'receipt-details';

    // Agrega detalles de productos o servicios
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
        detailTotal.className = 'card-text';
        detailTotal.textContent = `Subtotal: ${totalAmount.toFixed(2)}`;

        detailContainer.appendChild(detailName);
        detailContainer.appendChild(detailQuantity);
        detailContainer.appendChild(detailType);
        detailContainer.appendChild(detailUnitPrice);
        detailContainer.appendChild(detailTotal);

        receiptDetails.appendChild(detailContainer);
    });

    // Calcula el total general sumando los totales de cada detalle
    const totalAmount = receipt.details.reduce((total, detail) => {
        return total + detail.quantity * parseFloat(detail.unit_price);
    }, 0);

    const receiptTotal = document.createElement('p');
    receiptTotal.className = 'card-text';
    receiptTotal.textContent = `Total Factura: ${totalAmount.toFixed(2)}`;

    cardBody.appendChild(receiptDate);
    cardBody.appendChild(receiptCode);
    cardBody.appendChild(receiptNameClient);
    cardBody.appendChild(receiptSurnameClient);
    cardBody.appendChild(receiptDetails);
    cardBody.appendChild(receiptTotal);

    card.appendChild(cardBody);
    receiptContainer.appendChild(card);
    mainContent.appendChild(receiptContainer);
}






function openCreateReceiptModal() {
    if (!clientsAndProductsLoaded) {
        loadClientsAndProducts();
        clientsAndProductsLoaded = true;
    }
    

    const modal = document.getElementById('createReceiptModal');
    const form = document.getElementById('createReceiptForm');
    
    form.reset();
    // Llenar dinámicamente las opciones de clientes y productos

    modal.style.display = 'block';

    document.addEventListener('click', outsideCreateReceiptModalClick);
}


// function outsideCreateReceiptModalClick(event) {
//     const modal = document.getElementById('createReceiptModal');
//     const isClickedInsideModal = modal.contains(event.target);

//     if (!isClickedInsideModal) {
//         closeCreateReceiptModal();
//     }
// }


function outsideCreateReceiptModalClick(event) {
    const modalContent = document.querySelector('.modal-content');
    const createReceiptForm = document.getElementById('createReceiptForm');
    
    // Verifica si se hizo clic fuera del formulario
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
let clientsAndProductsLoaded = false;
// Función para cargar clientes y productos al cargar el modal
function loadClientsAndProducts() {
    const createReceiptClientSelect = document.getElementById('createReceiptClient');
    const createReceiptProductSelect = document.getElementById('createReceiptProduct');

    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'x-access-token' : token,
            'user-id': id,
        }
    }

    fetch(`http://127.0.0.1:5200/user/${id}/client`, requestOptions)
    .then(
        resp => {return resp.json()}
    )
    .then(
        resp => {
            if (resp.length >= 0){
                resp.forEach(client => {
                const option = document.createElement('option');
                option.value = client.dni; // Suponiendo que el DNI es único para cada cliente
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
        resp => {return resp.json()}
    )
    .then(
        resp => {
            if (resp.length >= 0){
                resp.forEach(product_service => {
                    const option = document.createElement('option');
                    option.value = product_service.name; // Suponiendo que el nombre es único para cada producto
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

// Al guardar la factura
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
        // Manejar diferentes tipos de errores
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
//CARGAR PRODUCTOS y SERVICIOS

function loadProductService(orderBy) {
    clearMain();

    const mainContent = document.getElementById('main-content');
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

     // Crear el desplegable
     const orderSelect = document.createElement('select');
     orderSelect.classList.add('form-select', 'mb-3');
     orderSelect.addEventListener('change', () => {
         const selectedOrder = orderSelect.value;
         loadProductService(selectedOrder);
     });
 
     const defaultOption = document.createElement('option');
     defaultOption.value = '';
     defaultOption.text = 'Ordenar por';
     defaultOption.disabled = true;
     defaultOption.selected = true;
 
     const ascendingOption = document.createElement('option');
     ascendingOption.value = 'asc';
     ascendingOption.text = 'Stock ascendente';
 
     const descendingOption = document.createElement('option');
     descendingOption.value = 'desc';
     descendingOption.text = 'Stock descendente';
 
     orderSelect.add(defaultOption);
     orderSelect.add(ascendingOption);
     orderSelect.add(descendingOption);
 
     mainContent.appendChild(orderSelect);
     
     const apiUrl = `http://127.0.0.1:5200/user/${id}/product_service${orderBy ? `?order_by=${orderBy}` : ''}`;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'x-access-token' : token,
            'user-id': id,
        }
    }

    fetch(apiUrl, requestOptions)
    .then(
        resp => {return resp.json()}
    )
    .then(
        resp => {
            if (resp.length >= 0){
                // Ordenar el array por el campo 'stock' ascendente o descendente
                resp.sort((a, b) => (orderBy === 'asc') ? a.stock - b.stock : b.stock - a.stock);

                resp.forEach(product_service => {
                    if (!orderBy || (orderBy && product_service.type !== 'Servicio')) {
                        showProductService(product_service);
                    }
                });
            }
            else {
                alert('Tiempo Expirado');
                window.location.href = 'login.html';
            }
        }
    );

    // Agregar botón para crear un nuevo ProductService
    const createProductServiceButton = document.createElement('button');
    createProductServiceButton.textContent = 'Crear Nuevo Producto o Servicio';
    createProductServiceButton.classList.add('btn', 'btn-primary', 'mb-3'); 
    createProductServiceButton.addEventListener('click', () => openCreateProductServiceModal());
    createProductServiceButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    mainContent.appendChild(createProductServiceButton);
}


//MOSTRAR PRODUCTOS Y SERVICIOS
function showProductService(product_service) {
    const mainContent = document.getElementById('main-content');

    const productServiceContainer = document.createElement('div');
    productServiceContainer.className = 'col-md-4 mb-3'; 

    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const productServiceName = document.createElement('h2');
    productServiceName.className = 'card-title';
    productServiceName.textContent = `${product_service.name}`;

    const productServiceStock = document.createElement('p');
    productServiceStock.className = 'card-text';
    productServiceStock.textContent = `Stock: ${parseInt(product_service.stock)}`;

    // Verificar si el tipo es "Servicio" para ocultar el elemento stock
    if (product_service.type === 'Servicio') {
        productServiceStock.style.display = 'none';
    }

    const productServicePrice = document.createElement('p');
    productServicePrice.className = 'card-text';
    productServicePrice.textContent = `Precio: ${parseFloat(product_service.price).toFixed(2)}`;

    const productServiceDescription = document.createElement('p');
    productServiceDescription.className = 'card-text';
    productServiceDescription.textContent = `${product_service.description}`;

    const productServiceImg = document.createElement('p');
    productServiceImg.className = 'card-text';
    productServiceImg.textContent = `${product_service.img}`;

    const productServiceType = document.createElement('p');
    productServiceType.className = 'card-text';
    productServiceType.textContent = `${product_service.type}`;

    // Botón de edición
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-primary me-2';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => openEditProductServiceModal(product_service));
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deleteProductService(product_service));

    cardBody.appendChild(productServiceName);
    cardBody.appendChild(productServiceStock);
    cardBody.appendChild(productServicePrice);
    cardBody.appendChild(productServiceDescription);
    cardBody.appendChild(productServiceImg);
    cardBody.appendChild(productServiceType);
    cardBody.appendChild(editButton);
    cardBody.appendChild(deleteButton);

    card.appendChild(cardBody);
    productServiceContainer.appendChild(card);
    mainContent.appendChild(productServiceContainer);
}

//ELIMINAR PRODUCTO Y SERVICIO
function deleteProductService(product_service){

    id = localStorage.getItem('id')
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
            'user-id': localStorage.getItem('id'),
        },
    };

    fetch(`http://127.0.0.1:5200/user/${id}/product_service/${product_service.id}`, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 400) {
                return response.json().then(errorData => {
                    throw new Error(`Bad Request: ${errorData.error}`);
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(resp => {
            console.log('Cambios guardados exitosamente:', resp);
            alert('Exito al borrar el Producto o Servicio');
            loadProductService();
        })
        .catch(error => {
            console.error('Error al guardar cambios:', error.message);
            
            if (error.message.includes('Bad Request')) {
                // Manejar el error 400 específico
                alert('Error 400: ' + error.message);
            } 
            else if (error.message.includes('401')) {
                // Manejar el error 401 (No autorizado)
                alert('Error 401: Tiempo de sesión expirado. Vuelve a iniciar sesión.');
                // Redirigir al formulario de inicio de sesión u otra acción apropiada
                window.location.href = 'login.html';
            }
            else {
                // Manejar otros errores
                alert('Error al guardar cambios: ' + error.message);
            }
        });
    loadClientsAndProducts();
}


//  MODAL PARA CREAR PRODUCTOS Y SERVICIOS

function openCreateProductServiceModal() {
    const modal = document.getElementById('createProductServiceModal');
    const form = document.getElementById('createProductServiceForm');
    form.reset();

    
    modal.style.display = 'block';

    document.addEventListener('click', outsideCreateProductServiceModalClick);

   
    console.log('Abriendo modal para crear un nuevo ProductService');
}


function outsideCreateProductServiceModalClick(event) {
    const modalContent = document.querySelector('.modal-content');
    const createProductServiceForm = document.getElementById('createProductServiceForm');
    
    // Verifica si se hizo clic fuera del formulario
    if (!modalContent.contains(event.target) && !createProductServiceForm.contains(event.target)) {
        closeCreateProductServiceModal();
    }
}


function closeCreateProductServiceModal() {
    console.log('Cerrando modal de creación de ProductService');
    const modal = document.getElementById('createProductServiceModal');
    document.removeEventListener('click', outsideCreateProductServiceModalClick);
    modal.style.display = 'none';
    const stockInput = document.getElementById('createProductServiceStock');
    stockInput.disabled = false;
}


function saveChangesCreateProductService() {
    const modal = document.getElementById('createProductServiceModal');
    id = localStorage.getItem('id')

    const formData = new FormData(document.getElementById('createProductServiceForm'));
    const data = {};    
   
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const typeSelect = document.getElementById('createProductServiceType');   

    // Si es un servicio, establece el stock a 1 y deshabilita el campo
    if (typeSelect.value === 'Servicio') {
        if (!formData.get('name') || !formData.get('price') || !formData.get('description') || !formData.get('img') || !formData.get('type')) {
            alert('Por favor, completa todos los campos.');
            return;  
        }
    }
    else{
        if (!formData.get('name') || !formData.get('stock') || !formData.get('price') || !formData.get('description') || !formData.get('img') || !formData.get('type')) {
            alert('Por favor, completa todos los campos.');
            return; 
        }
    }
    
    data.stock = parseInt(formData.get('stock'));
    data.price = parseFloat(formData.get('price'));   
 

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
            'user-id': localStorage.getItem('id'),
        },
        body: JSON.stringify(data),
    };

    fetch(`http://127.0.0.1:5200/user/${id}/product_service`, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 400) {
                return response.json().then(errorData => {
                    throw new Error(`Bad Request: ${errorData.error}`);
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(resp => {
            console.log('Cambios guardados exitosamente:', resp);
            alert('Exito al guardar los cambios');
            loadProductService();
            closeCreateProductServiceModal();
        })
        .catch(error => {
            console.error('Error al guardar cambios:', error.message);
            
            if (error.message.includes('Bad Request')) {
                // Manejar el error 400 específico
                alert('Error 400: ' + error.message);
            } 
            
            else if (error.message.includes('401')) {
                // Manejar el error 401 (No autorizado)
                alert('Error 401: Tiempo de sesión expirado. Vuelve a iniciar sesión.');
                // Redirigir al formulario de inicio de sesión u otra acción apropiada
                window.location.href = 'login.html';
            }
            else {
                // Manejar otros errores
                alert('Error al guardar cambios: ' + error.message);
            }
        });
    loadClientsAndProducts();
}


function handleCreateProductServiceTypeChange() {
    const typeSelect = document.getElementById('createProductServiceType');
    const stockInput = document.getElementById('createProductServiceStock');
    stockInput.disabled = typeSelect.value === 'Servicio';
}

// // MODAL PARA EDITAR PRODUCTOS Y SERVICIOS

let currentProductServiceId = null;

function openEditProductServiceModal(product_service) {
    const modal = document.getElementById('editProductServiceModal');
    const form = document.getElementById('editProductServiceForm');
    
    currentProductServiceId = product_service.id;
    // Cargar datos actuales del PRODUCTO O SERVICIO en el formulario
    document.getElementById('editProductServiceName').value = product_service.name;
    document.getElementById('editProductServiceStock').value = product_service.stock;
    document.getElementById('editProductServicePrice').value = product_service.price;
    document.getElementById('editProductServiceDescription').value = product_service.description;
    document.getElementById('editProductServiceImg').value = product_service.img;
    document.getElementById('editProductServiceType').value = product_service.type;
    document.getElementById('editProductServiceType').disabled = true;


    // Deshabilitar el campo de stock solo si el tipo es "Servicio"
    if (product_service.type === 'Servicio') {
        document.getElementById('editProductServiceStock').disabled = true;
    } else {
        // Habilitar el campo de stock para "Producto"
        document.getElementById('editProductServiceStock').disabled = false;    }

    modal.style.display = 'block';
    document.addEventListener('click', outsideEditProductServiceModalClick); 
}


function closeEditProductServiceModal() {
    const modal = document.getElementById('editProductServiceModal');
    document.removeEventListener('click', outsideEditProductServiceModalClick);
    modal.style.display = 'none';
    currentProductServiceId = null;
}


function saveChangesEditProductService() {
    
    const modal = document.getElementById('editProductServiceModal');
    id = localStorage.getItem('id')

    if (currentProductServiceId !== null) {
        id_product_service = currentProductServiceId
    }

    const originalForm = document.getElementById('editProductServiceForm');
    
    // Clonar el formulario para acceder temporalmente a los campos deshabilitados
    const clonedForm = originalForm.cloneNode(true);

    // Habilitar temporalmente los campos deshabilitados en el formulario clonado
    clonedForm.querySelectorAll('[disabled]').forEach((element) => {
        element.removeAttribute('disabled');
    });

    const formData = new FormData(clonedForm);
    const data = {};

     // Verifica si los campos requeridos tienen algún valor
    if (!formData.get('name') || !formData.get('stock') || !formData.get('price') || !formData.get('description')|| !formData.get('img')|| !formData.get('type')) {
        alert('Por favor, completa todos los campos.');
        return;  // Detiene la función si algún campo está vacío
    }

    formData.forEach((value, key) => {
        data[key] = value;
    });

    data.stock = parseInt(formData.get('stock'));
    data.price = parseFloat(formData.get('price'));

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
            'user-id': localStorage.getItem('id'),
        },
        body: JSON.stringify(data),
    };

    fetch(`http://127.0.0.1:5200/user/${id}/product_service/${id_product_service}`, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 400) {
                return response.json().then(errorData => {
                    throw new Error(`Bad Request: ${errorData.error}`);
                });
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(resp => {
            console.log('Cambios guardados exitosamente:', resp);
            alert('Exito al guardar los cambios');
            loadProductService();
            closeEditProductServiceModal();
        })
        .catch(error => {
            console.error('Error al guardar cambios:', error.message);
            if (error.message.includes('Bad Request')) {
                // Manejar el error 400 específico
                alert('Error 400: ' + error.message);
            } 
            else if (error.message.includes('401')) {
                // Manejar el error 401 (No autorizado)
                alert('Error 401: Tiempo de sesión expirado. Vuelve a iniciar sesión.');
                // Redirigir al formulario de inicio de sesión u otra acción apropiada
                window.location.href = 'login.html';
            }
            
            else {
                // Manejar otros errores
                alert('Error al guardar cambios: ' + error.message);
            }
        });  
    loadClientsAndProducts();
        
}


function outsideEditProductServiceModalClick(event) {
    const modalContent = document.querySelector('.modal-content');
    const editProductServiceForm = document.getElementById('editProductServiceForm');
    
    if (!modalContent.contains(event.target) && !editProductServiceForm.contains(event.target)) {
        closeEditProductServiceModal();
    }
}
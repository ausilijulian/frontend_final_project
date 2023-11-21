//CARGAR PRODUCTOS y SERVICIOS

function loadProductService() {
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

    fetch(`http://127.0.0.1:5200/user/${id}/product_service`, requestOptions)
    .then(
        resp => {return resp.json()}
    )
    .then(
        resp => {
            if (resp.length > 0){
                resp.forEach(product_service => {
                    showProductService(product_service);
                });
            }
            else {
                console.log('tiempo expirado');
                window.location.href = 'login.html';
            }
        }
    );

    // Agregar botón para crear un nuevo ProductService
    const createProductServiceButton = document.createElement('button');
    createProductServiceButton.textContent = 'Crear Nuevo Producto o Servicio';
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
    productServiceContainer.className = 'product-service-container';

    const productServiceName = document.createElement('h2');
    productServiceName.textContent = `${product_service.name}`;

    const productServiceStock = document.createElement('p');
    productServiceStock.textContent = `Stock: ${parseInt(product_service.stock)}`;

     // Verificar si el tipo es "Servicio" para ocultar el elemento
    if (product_service.type === 'Servicio') {
        productServiceStock.style.display = 'none';
    }


    const productServicePrice = document.createElement('p');
    productServicePrice.textContent = `Precio: ${parseFloat(product_service.price).toFixed(2)}`;

    const productServiceDescription = document.createElement('p');
    productServiceDescription.textContent = `${product_service.description}`;

    const productServiceImg = document.createElement('p');
    productServiceImg.textContent = `${product_service.img}`;

    const productServiceType = document.createElement('p');
    productServiceType.textContent = `${product_service.type}`;

    // Botón de edición
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => openEditProductServiceModal(product_service));
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deleteProductService(product_service));
  

    productServiceContainer.appendChild(productServiceName);
    productServiceContainer.appendChild(productServiceStock);
    productServiceContainer.appendChild(productServicePrice);
    productServiceContainer.appendChild(productServiceDescription);
    productServiceContainer.appendChild(productServiceImg);
    productServiceContainer.appendChild(productServiceType);


    productServiceContainer.appendChild(editButton);
    productServiceContainer.appendChild(deleteButton);
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
            // Aquí puedes manejar diferentes tipos de errores
            if (error.message.includes('Bad Request')) {
                // Manejar el error 400 específico
                alert('Error 400: ' + error.message);
            } else {
                // Manejar otros errores
                alert('Error al guardar cambios: ' + error.message);
            }
        });
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

// Nueva función para cerrar el modal si se hace clic fuera de él
function outsideCreateProductServiceModalClick(event) {
    const modal = document.getElementById('createProductServiceModal');
    const isClickedInsideModal = modal.contains(event.target);

    if (!isClickedInsideModal) {
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
            return;  // Detiene la función si algún campo está vacío
        }
    }
    else{
        if (!formData.get('name') || !formData.get('stock') || !formData.get('price') || !formData.get('description') || !formData.get('img') || !formData.get('type')) {
            alert('Por favor, completa todos los campos.');
            return;  // Detiene la función si algún campo está vacío
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
            // Aquí puedes manejar diferentes tipos de errores
            if (error.message.includes('Bad Request')) {
                // Manejar el error 400 específico
                alert('Error 400: ' + error.message);
            } else {
                // Manejar otros errores
                alert('Error al guardar cambios: ' + error.message);
            }
        });
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
        // Habilitar el campo de stock para otros tipos (como "Producto")
        document.getElementById('editProductServiceStock').disabled = false;
    }

    modal.style.display = 'block';

    // Agrega eventos al documento y al formulario para prevenir el cierre si se hace clic dentro del modal
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
    // const formData = new FormData(document.getElementById('editProductServiceForm'));
    const data = {};

    console.log(data);
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
            // Aquí puedes manejar diferentes tipos de errores
            if (error.message.includes('Bad Request')) {
                // Manejar el error 400 específico
                alert('Error 400: ' + error.message);
            } else {
                // Manejar otros errores
                alert('Error al guardar cambios: ' + error.message);
            }
        });  
}


// Nueva función para cerrar el modal si se hace clic fuera de él
function outsideEditProductServiceModalClick(event) {
    const modal = document.getElementById('editProductServiceModal');
    const isClickedInsideModal = modal.contains(event.target);

    if (!isClickedInsideModal) {
        closeEditProductServiceModal();
    }
}
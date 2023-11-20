//CARGAR CLIENTES

function loadClients() {
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

    fetch(`http://127.0.0.1:5200/user/${id}/client`, requestOptions)
    .then(
        resp => {return resp.json()}
    )
    .then(
        resp => {
            if (resp.length > 0){
                resp.forEach(client => {
                    showClient(client);
                });
            }
            else {
                console.log('tiempo expirado');
                window.location.href = 'login.html';
            }
        }
    );

    // Agregar botón para crear un nuevo cliente
    const createClientButton = document.createElement('button');
    createClientButton.textContent = 'Crear Nuevo Cliente';
    createClientButton.addEventListener('click', () => openCreateModal());
    createClientButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    mainContent.appendChild(createClientButton);
}


//MOSTRAR CLIENTES
function showClient(client) {
    const mainContent = document.getElementById('main-content');

    const clientContainer = document.createElement('div');
    clientContainer.className = 'client-container';

    const clientName = document.createElement('h2');
    clientName.textContent = `${client.name} ${client.surname}`;

    const clientDNI = document.createElement('p');
    clientDNI.textContent = `DNI: ${client.dni}`;
    // clientDNI.textContent = `DNI: ${parseInt(client.dni)}`;

    const clientEmail = document.createElement('p');
    clientEmail.textContent = `Email: ${client.email}`;

    // Botón de edición
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => openEditModal(client));
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deleteClient(client));
  

    clientContainer.appendChild(clientName);
    clientContainer.appendChild(clientDNI);
    clientContainer.appendChild(clientEmail);
    clientContainer.appendChild(editButton);
    clientContainer.appendChild(deleteButton);
    mainContent.appendChild(clientContainer);
}




//ELIMINAR CLIENTE
function deleteClient(client){

    id = localStorage.getItem('id')
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
            'user-id': localStorage.getItem('id'),
        },
    };

    fetch(`http://127.0.0.1:5200/user/${id}/client/${client.id}`, requestOptions)
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
            alert('Exito al borrar el cliente');
            loadClients();
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


//  MODAL PARA CREAR CLIENTES

function openCreateModal() {
    const modal = document.getElementById('createModal');
    const form = document.getElementById('createForm');
    form.reset();

    modal.style.display = 'block';

    document.addEventListener('click', outsideCreateModalClick);

    // Aquí puedes implementar la lógica para abrir el modal de creación de cliente
    // Puedes mostrar otro modal, redirigir a una página de creación, etc.
    console.log('Abriendo modal para crear un nuevo cliente');
}

// Nueva función para cerrar el modal si se hace clic fuera de él
function outsideCreateModalClick(event) {
    const modal = document.getElementById('createModal');
    const isClickedInsideModal = modal.contains(event.target);

    if (!isClickedInsideModal) {
        closeCreateModal();
    }
}


function closeCreateModal() {
    console.log('Cerrando modal de creación de cliente');
    const modal = document.getElementById('createModal');
    document.removeEventListener('click', outsideCreateModalClick);
    modal.style.display = 'none';
}


function saveChangesCreate() {
    const modal = document.getElementById('createModal');
    id = localStorage.getItem('id')

    const formData = new FormData(document.getElementById('createForm'));
    const data = {};

     // Verifica si los campos requeridos tienen algún valor
    if (!formData.get('name') || !formData.get('surname') || !formData.get('email') || !formData.get('dni')) {
        alert('Por favor, completa todos los campos.');
        return;  // Detiene la función si algún campo está vacío
    }

    formData.forEach((value, key) => {
        data[key] = value;
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
            'user-id': localStorage.getItem('id'),
        },
        body: JSON.stringify(data),
    };

    fetch(`http://127.0.0.1:5200/user/${id}/client`, requestOptions)
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
            loadClients();
            closeCreateModal();
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


// MODAL PARA EDITAR CLIENTES

let currentClientId = null;

function openEditModal(client) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');
    
    currentClientId = client.id;
    // Cargar datos actuales del cliente en el formulario
    document.getElementById('editName').value = client.name;
    document.getElementById('editSurname').value = client.surname;
    document.getElementById('editEmail').value = client.email;
    document.getElementById('editDNI').value = client.dni;

    modal.style.display = 'block';

    // Agrega eventos al documento y al formulario para prevenir el cierre si se hace clic dentro del modal
    document.addEventListener('click', outsideEditModalClick); 
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    document.removeEventListener('click', outsideEditModalClick);
    modal.style.display = 'none';
    currentClientId = null;
}


function saveChangesEdit() {
    
    const modal = document.getElementById('editModal');
    id = localStorage.getItem('id')

    if (currentClientId !== null) {
        id_client = currentClientId
    }

    const formData = new FormData(document.getElementById('editForm'));
    const data = {};

     // Verifica si los campos requeridos tienen algún valor
    if (!formData.get('name') || !formData.get('surname') || !formData.get('email') || !formData.get('dni')) {
        alert('Por favor, completa todos los campos.');
        return;  // Detiene la función si algún campo está vacío
    }

    formData.forEach((value, key) => {
        data[key] = value;
    });


    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
            'user-id': localStorage.getItem('id'),
        },
        body: JSON.stringify(data),
    };

    fetch(`http://127.0.0.1:5200/user/${id}/client/${id_client}`, requestOptions)
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
            loadClients();
            closeEditModal();
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
function outsideEditModalClick(event) {
    const modal = document.getElementById('editModal');
    const isClickedInsideModal = modal.contains(event.target);

    if (!isClickedInsideModal) {
        closeEditModal();
    }
}





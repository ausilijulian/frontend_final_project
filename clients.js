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
            if (resp.length >= 0){
                resp.forEach(client => {
                    showClient(client);
                });
            }
            else {
                alert('Tiempo Expirado');
                window.location.href = 'login.html';
            }
        }
    );

    // Agregar botón para crear un nuevo cliente
    const createClientButton = document.createElement('button');
    createClientButton.textContent = 'Crear Nuevo Cliente';
    createClientButton.addEventListener('click', () => openCreateClientModal());
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
    editButton.addEventListener('click', () => openEditClientModal(client));
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
}


//  MODAL PARA CREAR CLIENTES

function openCreateClientModal() {
    const modal = document.getElementById('createClientModal');
    const form = document.getElementById('createClientForm');
    form.reset();

    modal.style.display = 'block';

    document.addEventListener('click', outsideCreateClientModalClick);

    // Aquí puedes implementar la lógica para abrir el modal de creación de cliente
    // Puedes mostrar otro modal, redirigir a una página de creación, etc.
    console.log('Abriendo modal para crear un nuevo cliente');
}

// Nueva función para cerrar el modal si se hace clic fuera de él
function outsideCreateClientModalClick(event) {
    const modal = document.getElementById('createClientModal');
    const isClickedInsideModal = modal.contains(event.target);

    if (!isClickedInsideModal) {
        closeCreateClientModal();
    }
}


function closeCreateClientModal() {
    console.log('Cerrando modal de creación de cliente');
    const modal = document.getElementById('createClientModal');
    document.removeEventListener('click', outsideCreateClientModalClick);
    modal.style.display = 'none';
}


function saveChangesCreateClient() {
    const modal = document.getElementById('createClientModal');
    id = localStorage.getItem('id')

    const formData = new FormData(document.getElementById('createClientForm'));
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
            closeCreateClientModal();
        })
        .catch(error => {
            console.error('Error al guardar cambios:', error.message);
            // Aquí puedes manejar diferentes tipos de errores
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
}


// MODAL PARA EDITAR CLIENTES

let currentClientId = null;

function openEditClientModal(client) {
    const modal = document.getElementById('editClientModal');
    const form = document.getElementById('editClientForm');
    
    currentClientId = client.id;
    // Cargar datos actuales del cliente en el formulario
    document.getElementById('editClientName').value = client.name;
    document.getElementById('editClientSurname').value = client.surname;
    document.getElementById('editClientEmail').value = client.email;
    document.getElementById('editClientDNI').value = client.dni;

    modal.style.display = 'block';

    // Agrega eventos al documento y al formulario para prevenir el cierre si se hace clic dentro del modal
    document.addEventListener('click', outsideEditClientModalClick); 
}

function closeEditClientModal() {
    const modal = document.getElementById('editClientModal');
    document.removeEventListener('click', outsideEditClientModalClick);
    modal.style.display = 'none';
    currentClientId = null;
}


function saveChangesEditClient() {
    
    const modal = document.getElementById('editClientModal');
    id = localStorage.getItem('id')

    if (currentClientId !== null) {
        id_client = currentClientId
    }

    const formData = new FormData(document.getElementById('editClientForm'));
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
            closeEditClientModal();
        })
        .catch(error => {
            console.error('Error al guardar cambios:', error.message);
            // Aquí puedes manejar diferentes tipos de errores
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
}


// Nueva función para cerrar el modal si se hace clic fuera de él
function outsideEditClientModalClick(event) {
    const modal = document.getElementById('editClientModal');
    const isClickedInsideModal = modal.contains(event.target);

    if (!isClickedInsideModal) {
        closeEditClientModal();
    }
}





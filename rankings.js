function loadClientRanking(ranking) {
    // Crear contenedor principal con Bootstrap
    const clientRankingContainer = document.createElement('div');
    clientRankingContainer.classList.add('container', 'mt-4');

    // Crear título con Bootstrap
    const titleElement = document.createElement('h3');
    titleElement.classList.add('mb-4');
    titleElement.textContent = 'Ranking de Clientes';
    clientRankingContainer.appendChild(titleElement);

    ranking.forEach(client => {
        // Crear tarjeta Bootstrap para cada cliente
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'mb-3');

        // Contenido de la tarjeta
        const cardBodyElement = document.createElement('div');
        cardBodyElement.classList.add('card-body');

        // Datos del cliente en la tarjeta
        const clientInfoElement = document.createElement('p');
        clientInfoElement.classList.add('card-text', 'mb-0');
        clientInfoElement.textContent = `${client.name} ${client.surname} - ${client.total_receipts} compras`;

        cardBodyElement.appendChild(clientInfoElement);
        cardElement.appendChild(cardBodyElement);

        // Agregar la tarjeta al contenedor principal
        clientRankingContainer.appendChild(cardElement);
    });

    // Agregar el contenedor al elemento con id 'main-content'
    document.getElementById('main-content').appendChild(clientRankingContainer);
}


function loadProductRanking(ranking) {
    // Crear contenedor principal con Bootstrap
    const mainContent = document.getElementById('main-content');
    const rankingContainer = document.createElement('div');
    rankingContainer.classList.add('container', 'mt-4');

    // Iterar sobre las categorías (productos y servicios)
    for (const category in ranking) {
        if (ranking.hasOwnProperty(category)) {
            // Crear tarjeta Bootstrap para cada categoría
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'mb-3');

            // Contenido de la tarjeta
            const cardBodyElement = document.createElement('div');
            cardBodyElement.classList.add('card-body');

            // Título de la tarjeta con el nombre de la categoría
            const categoryTitleElement = document.createElement('h5');
            categoryTitleElement.classList.add('card-title');
            
            // Cambiar el título según la categoría
            if (category === 'products') {
                categoryTitleElement.textContent = 'Ranking Productos';
            } else if (category === 'services') {
                categoryTitleElement.textContent = 'Ranking Servicios';
            }
            
            cardBodyElement.appendChild(categoryTitleElement);

            // Ordenar los elementos por cantidad descendente
            const sortedItems = Object.entries(ranking[category])
                .sort((a, b) => b[1] - a[1]);

            // Iterar sobre los elementos ordenados y mostrar la información
            for (const [item, quantity] of sortedItems) {
                const itemContainer = document.createElement('p');
                itemContainer.classList.add('card-text', 'mb-0');
                itemContainer.textContent = `${item}: Cantidad - ${quantity}`;
                cardBodyElement.appendChild(itemContainer);
            }

            // Agregar la tarjeta al contenedor principal
            cardElement.appendChild(cardBodyElement);
            rankingContainer.appendChild(cardElement);
        }
    }

    // Agregar el contenedor al elemento con id 'main-content'
    mainContent.appendChild(rankingContainer);
}

function loadRankings() {
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

    fetch(`http://127.0.0.1:5200/user/${id}/receiptClientRanking`, requestOptions)
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        if (resp.length >= 0) {
            loadClientRanking(resp);
        } else {
            alert('Tiempo Expirado');
            window.location.href = 'login.html';
        }
    });

    fetch(`http://127.0.0.1:5200/user/${id}/receiptProductRanking`, requestOptions)
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        if (resp && (Object.keys(resp.products).length >= 0 || Object.keys(resp.services).length >= 0)) {
            loadProductRanking(resp);
        } else {
            alert('Tiempo Expirado');
            window.location.href = 'login.html';
            
        }
    });
}


function loadClientRanking(ranking) {
    // Crear contenedor principal
    const clientRankingContainer = document.createElement('div');
    clientRankingContainer.classList.add('container', 'mt-4');

    // Crear título 
    const titleElement = document.createElement('h3');
    titleElement.classList.add('mb-4');
    titleElement.textContent = 'Ranking de Clientes';
    clientRankingContainer.appendChild(titleElement);

    // Obtener solo los primeros 25 clientes
    const topClients = ranking.slice(0, 25);

    // Declarar la variable chart fuera del ámbito de la función toggleChart
    let chart;

    topClients.forEach(client => {
        // Crear tarjeta para cada cliente
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

    // Crear un div para centrar el botón
    const centerButtonDiv = document.createElement('div');
    centerButtonDiv.style.textAlign = 'center';

    // Crear el botón para mostrar/ocultar el gráfico
    const toggleChartButton = document.createElement('button');
    toggleChartButton.textContent = 'Ver Gráfico';
    toggleChartButton.classList.add('btn', 'btn-primary', 'my-4');

    toggleChartButton.addEventListener('click', () => {
        // Llamar a la función toggleChart y pasar la variable chart
        toggleChart(clientRankingContainer, ranking, toggleChartButton, chart);
    });

    // Agregar el botón al div centrado
    centerButtonDiv.appendChild(toggleChartButton);

    // Agregar el div centrado al contenedor principal
    clientRankingContainer.appendChild(centerButtonDiv);

    // Agregar el contenedor al main
    document.getElementById('main-content').appendChild(clientRankingContainer);
}

function toggleChart(container, ranking, button, chart) {
    // Buscar el contenedor del gráfico en el contenedor principal
    const chartContainer = container.querySelector('.chart-container');

    // Si el contenedor del gráfico existe, se oculta y se cambia el texto del botón; de lo contrario, se crea y muestra el gráfico
    if (chartContainer) {
        container.removeChild(chartContainer);
        button.textContent = 'Ver Gráfico';
    } else {
        // Crear un contenedor para el gráfico
        const newChartContainer = document.createElement('div');
        newChartContainer.classList.add('chart-container');
        container.appendChild(newChartContainer);

        // Crear un canvas para el gráfico dentro del contenedor
        const chartCanvas = document.createElement('canvas');
        chartCanvas.classList.add('my-4');
        newChartContainer.appendChild(chartCanvas);

        // Obtener los nombres de los clientes y las cantidades de compras
        const clientNames = ranking.map(client => `${client.name} ${client.surname}`);
        const totalReceipts = ranking.map(client => client.total_receipts);

        // Configurar el contexto del gráfico
        const ctx = chartCanvas.getContext('2d');

        // Crear el gráfico de rosquilla
        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: clientNames,
                datasets: [{
                    data: totalReceipts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                aspectRatio: 3, // Ajustar el aspect ratio según tus necesidades
                responsive: true, // Activar la respuesta para ajustar el tamaño del contenedor
                plugins: {
                    legend: {
                        display: false // Ocultar la leyenda predeterminada
                    }
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            return `${data.labels[tooltipItem.index]}: ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}`;
                        }
                    }
                }
            }
        });

        // Cambiar el texto del botón
        button.textContent = 'Ocultar Gráfico';
    }
}


function loadProductRanking(ranking) {
    // Crear contenedor principal 
    const mainContent = document.getElementById('main-content');
    const rankingContainer = document.createElement('div');
    rankingContainer.classList.add('container', 'mt-4');

    // Iterar sobre las categorías (productos y servicios)
    for (const category in ranking) {
        if (ranking.hasOwnProperty(category)) {
            // Crear tarjeta para cada categoría
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
                .sort((a, b) => b[1] - a[1])
                .slice(0, 25); // Obtener solo los primeros 25 elementos

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

            // Crear un contenedor para el gráfico
            const chartContainer = document.createElement('div');
            chartContainer.classList.add('chart-container');
            cardBodyElement.appendChild(chartContainer);

            // Crear un canvas para el gráfico dentro del contenedor
            const chartCanvas = document.createElement('canvas');
            chartCanvas.classList.add('my-4');
            chartContainer.appendChild(chartCanvas);

            // Obtener los nombres de los elementos y las cantidades
            const itemNames = sortedItems.map(([item]) => item);
            const itemQuantities = sortedItems.map(([_, quantity]) => quantity);

            // Configurar el contexto del gráfico
            const ctx = chartCanvas.getContext('2d');

            // Establecer colores basados en la categoría
            const backgroundColor = category === 'products' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(75, 192, 192, 0.5)';
            const borderColor = category === 'products' ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)';

            // Crear el gráfico de barras
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: itemNames,
                    datasets: [{
                        label: 'Cantidad',
                        data: itemQuantities,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    aspectRatio: 4, // Ajustar el aspect ratio según tus necesidades
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Agregar el contenedor al main
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
            'Content-Type': 'application/json',
            'x-access-token': token,
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


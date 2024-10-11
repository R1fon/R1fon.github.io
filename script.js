let unitPrice = 0;
        const selectedNumbers = new Set();
        let availableNumbers = [];
        const reservedNumbers = new Set();
        const reservedByUser = new Map(); // Armazena os números reservados e quem os reservou
        
        let currentUser = "Usuário Logado"; // Nome do usuário logado

        async function fetchNumbers() {
            try {
                const response = await fetch('https://sheetdb.io/api/v1/sdqbrsofxzfpu');
                const data = await response.json();
                
                unitPrice = data[0].valor_rifa;
                document.getElementById('rifaValue').textContent = unitPrice;

                availableNumbers = data.map(item => parseInt(item.numeros));
                data.forEach(item => {
                    if (item.reservado) {
                        reservedNumbers.add(parseInt(item.numeros));
                        reservedByUser.set(parseInt(item.numeros), item.usuario); // Armazena quem reservou o número
                    }
                });
                populateGrid();
            } catch (error) {
                console.error("Erro ao buscar números da API", error);
            }
        }

        function populateGrid() {
            const gridContainer = document.querySelector('.grid-container');
            gridContainer.innerHTML = '';

            availableNumbers.forEach(number => {
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');

                if (reservedNumbers.has(number)) {
                    if (reservedByUser.get(number) === currentUser) {
                        gridItem.classList.add('reserved-by-user'); // Se o usuário atual reservou, exibir na cor azul
                    } else {
                        gridItem.classList.add('reserved'); // Se não, exibir na cor laranja
                    }
                } else {
                    gridItem.onclick = () => toggleNumber(number);
                }

                gridItem.textContent = number;
                gridContainer.appendChild(gridItem);
            });
        }

        function toggleNumber(number) {
            if (selectedNumbers.has(number)) {
                selectedNumbers.delete(number);
            } else {
                selectedNumbers.add(number);
            }
            updateTotal();
            updateGrid();
            updateConfirmButton();
        }

        function updateTotal() {
            const total = selectedNumbers.size * unitPrice;
            document.getElementById('totalValue').textContent = `Total: R$${total}`;
        }

        function updateGrid() {
            const gridItems = document.querySelectorAll('.grid-item');
            gridItems.forEach(item => {
                const number = parseInt(item.textContent);
                if (selectedNumbers.has(number)) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }

        function updateConfirmButton() {
            const confirmButton = document.querySelector('.confirm-button');
            if (selectedNumbers.size > 0) {
                confirmButton.disabled = false;
            } else {
                confirmButton.disabled = true;
            }
        }

        function confirmSelection() {
    const selectedArray = Array.from(selectedNumbers);
    const brindeNumbers = selectedArray.map(num => `${num - 1}, ${num + 1}`).join(', ');
    const totalPayment = selectedArray.length * unitPrice;

    const whatsappMessage = `*RIFA PIX PREMIADO*%0A%0A_Números Escolhidos:_%0A${selectedArray.join(', ')}%0A%0A_Números de Brinde:_%0A${brindeNumbers}%0A%0A_Valor por número:_ R$${unitPrice}%0A*Total: R$${totalPayment}*%0A%0A_•ENVIE ESSA MENSAGEM SEM ALTERA-LÁ!•_`;
    const whatsappLink = `https://wa.me/5582999124044?text=${whatsappMessage}`;
    
    window.open(whatsappLink, '_blank');
}


        window.onload = () => {
            fetchNumbers(); // Carregar os números da API
        };
const gotyTableau = [];

function afficherGoty() {
    const gotyContainer = document.querySelector('.goty');
    gotyContainer.innerHTML = '';

    for (let i = 0; i < gotyTableau.length; i++) {
        const goty = gotyTableau[i];
        const sideClass = goty.year % 2 === 0 ? 'goty-left' : 'goty-right';

        gotyContainer.innerHTML += `
            <div class="${sideClass}">
                <h3>${goty.year}</h3>
                <img src="${goty.image}" alt="${goty.name}">
                <p>${goty.name}</p>
            </div>`;
    }
}

function chargerGoty() {
    return fetch('goty.json')
        .then(response => response.json())
        .then(data => {
            gotyTableau.length = 0;
            data.forEach(goty => {
                gotyTableau.push(goty);
            });
        });
}

export { gotyTableau, afficherGoty, chargerGoty };

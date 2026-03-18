const gotyTableau = [];

fetch('goty.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(goty => {
      gotyTableau.push(goty);
    });
    afficherGoty();
  })
  .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));

function afficherGoty() {
    const gotyContainer = document.querySelector('.goty');
    for (let i = 0; i < gotyTableau.length; i++) {
        //afficher les goty, si l'année est pair, on affiche le goty à gauche, les année impair, c'est à droite
        if (gotyTableau[i].year % 2 === 0 ) {
            gotyContainer.innerHTML += `
            <div class="goty-left">
                <h3>${gotyTableau[i].year}</h3>
                <img src="${gotyTableau[i].image}" alt="${gotyTableau[i].name}">
                <p>${gotyTableau[i].name}</p>
            </div>`;
        } else {
            gotyContainer.innerHTML += `
            <div class="goty-right">
                <h3>${gotyTableau[i].year}</h3>
                <img src="${gotyTableau[i].image}" alt="${gotyTableau[i].name}">
                <p>${gotyTableau[i].name}</p>
            </div>`;
        }
    }
}
export { gotyTableau, afficherGoty };
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

function createBarre() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    gsap.registerPlugin(ScrollTrigger);

    const lineWrapper = document.getElementById('line-wrapper');
    lineWrapper.innerHTML = '';

    // Calculate line container height based on the goty container to make a physical line that scrolls
    // If the user meant a fixed line, we can respect the CSS but add it dynamically
    const barre = document.createElement('div');
    barre.classList.add('barre');
    lineWrapper.appendChild(barre);

    // Let's create segments for the fixed line spanning the screen
    const segmentHeight = 30;
    const Math = window.Math;
    const totalHeight = window.innerHeight;
    const numSegments = Math.floor(totalHeight / segmentHeight);

    for (let i = 0; i < numSegments; i++) {
        const segment = document.createElement('div');
        segment.classList.add('barre-segment');
        // Alternating gaps or just placing them end-to-end? The CSS says height: 30px.
        // If we want small segments with gaps, we position them manually.
        segment.style.top = `${i * (segmentHeight + 10)}px`;
        barre.appendChild(segment);
    }

    const segments = document.querySelectorAll('.barre-segment');

    gsap.to(segments, {
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.goty',
            start: "top center",
            end: "bottom center",
            scrub: true,
        }
    });
}

export { gotyTableau, afficherGoty, chargerGoty, createBarre };

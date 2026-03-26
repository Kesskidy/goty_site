const gotyTableau = [];

function afficherGoty() {
    const gotyContainer = document.querySelector('.goty');
    gotyContainer.innerHTML = '';

    for (let i = 0; i < gotyTableau.length; i++) {
        const goty = gotyTableau[i];
        const sideClass = goty.year % 2 === 0 ? 'goty-left' : 'goty-right';

        let nomineesHtml = '';
        if (goty.nominees && goty.nominees.length > 0) {
            nomineesHtml = '<ul><li>' + goty.nominees.join('</li><li>') + '</li></ul>';
        }

        gotyContainer.innerHTML += `
            <div class="${sideClass} goty-item">
                <div class="goty-content">
                    <h3>${goty.year}</h3>
                    <img src="${goty.image}" alt="${goty.name}" class="goty-img-clickable" style="cursor: pointer;">
                    <p class="goty-title">${goty.name}</p>
                </div>
                <div class="goty-details" style="opacity: 0; pointer-events: none;">
                    <p class="goty-desc">${goty.description || ''}</p>
                    ${nomineesHtml ? `<h4 style="margin-top:15px; margin-bottom: 5px;">Nominés :</h4>${nomineesHtml}` : ''}
                </div>
            </div>`;
    }

    setupInteractivity();
}

function setupInteractivity() {
    const gsap = window.gsap;
    const items = document.querySelectorAll('.goty-item');

    items.forEach(item => {
        const img = item.querySelector('.goty-img-clickable');
        const details = item.querySelector('.goty-details');
        const content = item.querySelector('.goty-content');
        
        let isOpen = false;

        img.addEventListener('click', () => {
            isOpen = !isOpen;
            
            const isLeft = item.classList.contains('goty-left');
            const isMobile = window.innerWidth <= 768;
            
            // Determine movement. On mobile, slide image up or fade text over. 
            // For simplicity, we just slide horizontally by 105% on desktop.
            const xVal = isMobile ? 0 : (isLeft ? "110%" : "-110%");
            const yVal = isMobile ? (isOpen ? "150px" : 0) : 0; 
            
            if (isOpen) {
                gsap.to(content, { x: xVal, y: yVal, duration: 0.6, ease: "power3.out" });
                gsap.to(details, { opacity: 1, duration: 0.5, delay: 0.3, ease: "power2.out" });
                details.style.pointerEvents = 'auto';
            } else {
                gsap.to(content, { x: 0, y: 0, duration: 0.6, ease: "power3.inOut" });
                gsap.to(details, { opacity: 0, duration: 0.3, ease: "power2.in" });
                details.style.pointerEvents = 'none';
            }
        });
    });
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

    const gotyContainer = document.querySelector('.goty');
    const images = Array.from(gotyContainer.querySelectorAll('img'));

    Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
        });
    })).then(() => {
        const lineWrapper = document.getElementById('line-wrapper');
        lineWrapper.innerHTML = '';

        const barre = document.createElement('div');
        barre.classList.add('barre');
        lineWrapper.appendChild(barre);

        const firstGoty = gotyContainer.querySelector('div');
        const Math = window.Math;

        if (!firstGoty) return;

        const startY = firstGoty.offsetTop;
        const absoluteStartY = firstGoty.getBoundingClientRect().top + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const totalHeight = documentHeight - absoluteStartY;

        barre.style.top = `${startY}px`;
        barre.style.height = `${totalHeight}px`;

        const segmentHeight = 30;
        const gap = 10;
        const numSegments = Math.floor(totalHeight / (segmentHeight + gap));

        for (let i = 0; i < numSegments; i++) {
            const segment = document.createElement('div');
            segment.classList.add('barre-segment');
            segment.style.top = `${i * (segmentHeight + gap)}px`;
            segment.style.height = `${segmentHeight}px`;
            const offsetX = i % 2 === 0 ? -100 : 100;
            gsap.set(segment, { x: offsetX, opacity: 0 });
            barre.appendChild(segment);
        }

        const segments = document.querySelectorAll('.barre-segment');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: firstGoty,
                start: "top center",
                endTrigger: "body",
                end: "bottom bottom",
                scrub: true,
            }
        });

        tl.to(segments, {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.5
        }, 0);

        // AJOUT : Création et animation des lignes diagonales connectrices parfaitement synchronisées
        const lineWrapperRect = lineWrapper.getBoundingClientRect();
        const barreRect = barre.getBoundingClientRect();
        const gotyItems = document.querySelectorAll('.goty-item');

        gotyItems.forEach(item => {
            const img = item.querySelector('.goty-img-clickable');
            const imgRect = img.getBoundingClientRect();
            const isLeft = item.classList.contains('goty-left');

            // Cible horizontale relative (bord de l'image par rapport à line-wrapper)
            const targetX_viewport = isLeft ? imgRect.right : imgRect.left;
            const targetX = targetX_viewport - lineWrapperRect.left; 

            // Cible verticale relative par rapport au `top` de la barre (qui commence au premier GOTY)
            const imgTopInBarre = imgRect.top - barreRect.top;
            const targetY = imgTopInBarre + (imgRect.height / 2);

            // Souhait : partir plus haut (ex: 120px)
            const desiredStartY = targetY - 120;
            
            // On calcule l'indice du segment le plus proche
            const step = segmentHeight + gap;
            let segmentIndex = Math.round(desiredStartY / step);
            if (segmentIndex < 0) segmentIndex = 0;
            if (segmentIndex >= numSegments) segmentIndex = numSegments - 1;

            // Le point de départ réel : pil poil au centre de ce segment
            const startY = (segmentIndex * step) + (segmentHeight / 2);

            // Calcul géométrique de base
            const deltaX = targetX - 1; // 1px est le bord gauche de la ligne (qui fait 2px total)
            const deltaY = targetY - startY;
            const distance = Math.hypot(deltaX, deltaY);
            const angle = Math.atan2(deltaY, deltaX);

            // Création de l'élément connecteur
            const connector = document.createElement('div');
            connector.classList.add('connector-line');
            connector.style.top = `${startY}px`;
            connector.style.width = `${distance}px`;
            connector.style.transform = `rotate(${angle}rad)`;
            
            // On l'ajoute directement à la `barre` pour utiliser les mêmes repères verticaux que les segments
            barre.appendChild(connector);

            // On lance son l'animation *exactement* en même temps que son segment parent !
            // L'animation des segments commence avec un stagger de 0.1s
            const startTime = segmentIndex * 0.1;
            tl.fromTo(connector, 
                { scaleX: 0 }, 
                { scaleX: 1, duration: 0.5, ease: "none" }, 
                startTime
            );
        });

        ScrollTrigger.refresh();
    });
}

export { gotyTableau, afficherGoty, chargerGoty, createBarre };

const gotyTableau = [];
const GOTY_VOTES_KEY = 'gotyVotes';
const GOTY_VOTE_COUNTS_KEY = 'gotyVoteCounts';
const LIKELY_GAMES_KEY = 'likelyGames';

function getVotedGame(year) {
    const votes = JSON.parse(localStorage.getItem(GOTY_VOTES_KEY) || '{}');
    return votes[year];
}

function getVoteCounts(year) {
    const counts = JSON.parse(localStorage.getItem(GOTY_VOTE_COUNTS_KEY) || '{}');
    return counts[year] || {};
}

function saveVote(year, gameName) {
    const votes = JSON.parse(localStorage.getItem('gotyVotes') || '{}');
    votes[year] = gameName;
    localStorage.setItem('gotyVotes', JSON.stringify(votes));

    // Increment count
    const counts = JSON.parse(localStorage.getItem('gotyVoteCounts') || '{}');
    if (!counts[year]) counts[year] = {};
    counts[year][gameName] = (counts[year][gameName] || 0) + 1;
    localStorage.setItem(GOTY_VOTE_COUNTS_KEY, JSON.stringify(counts));
}

function loadLikelyGames() {
    const raw = localStorage.getItem(LIKELY_GAMES_KEY);
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            likelyGames.length = 0;
            parsed.forEach(game => {
                if (game && typeof game.name === 'string' && typeof game.votes === 'number') {
                    likelyGames.push(game);
                }
            });
            likelyGames.sort((a, b) => b.votes - a.votes);
        }
    } catch (err) {
        console.warn('Impossible de charger likelyGames depuis localStorage', err);
    }
}

function saveLikelyGames() {
    localStorage.setItem(LIKELY_GAMES_KEY, JSON.stringify(likelyGames));
}

function afficherGoty() {
    const gotyContainer = document.querySelector('.goty');
    gotyContainer.innerHTML = '';

    for (let i = 0; i < gotyTableau.length; i++) {
        const goty = gotyTableau[i];
        const sideClass = goty.year % 2 === 0 ? 'goty-left' : 'goty-right';

        const votedGame = getVotedGame(goty.year);
        const voteCounts = getVoteCounts(goty.year);
        const displayGame = votedGame ? goty.nominees.find(n => n.name === votedGame) : {name: goty.name, image: goty.image};
        const gotyAccordingText = votedGame ? '<span class="goty-badge">GOTY selon vous</span>' : '';

        let nomineesHtml = '';
        if (goty.nominees && goty.nominees.length > 0) {
            nomineesHtml = `<form class="voting-form" role="radiogroup" aria-labelledby="vote-heading-${goty.year}">`;
            goty.nominees.forEach(nominee => {
                const count = voteCounts[nominee.name] || 0;
                const isChecked = votedGame === nominee.name ? 'checked' : '';
            nomineesHtml += `
                    <label class="nominee-radio" aria-describedby="vote-count-${goty.year}-${nominee.name.replace(/\s+/g, '-')}">
                        <input type="radio" name="vote-${goty.year}" value="${nominee.name}" aria-label="Voter pour ${nominee.name}, actuellement ${count} votes" ${isChecked}>
                        <div class="nominee-content">
                            <img src="${nominee.image}" alt="Image du jeu ${nominee.name}" class="nominee-img">
                            <p class="nominee-content-name">${nominee.name}</p>
                            <span id="vote-count-${goty.year}-${nominee.name.replace(/\s+/g, '-')}" class="vote-count" aria-live="polite">${count} votes</span>
                        </div>
                    </label>`;
            });
            nomineesHtml += '</form>';
        }

        gotyContainer.innerHTML += `
            <div class="${sideClass} goty-item" data-year="${goty.year}">
                <div class="goty-content">
                    <h3>${goty.year}</h3>
                    ${gotyAccordingText}
                    <button class="goty-img-button" aria-label="Cliquez pour voir les détails et voter pour ${goty.year}">
                        <img src="${displayGame.image}" alt="${displayGame.name}" class="goty-img-clickable">
                    </button>
                    <p class="goty-title">${displayGame.name}</p>
                </div>
                <div class="goty-details" style="opacity: 0; pointer-events: none;">
                    <p class="goty-desc">${goty.description || ''}</p>
                    ${nomineesHtml ? `<h4 id="vote-heading-${goty.year}" style="margin-top:15px; margin-bottom: 5px;">Votez pour votre GOTY :</h4><p class="sr-only">Utilisez les boutons radio pour sélectionner votre jeu préféré parmi les nominés de ${goty.year}. Chaque bouton affiche le nom du jeu, son image et le nombre actuel de votes.</p>${nomineesHtml}` : ''}
                </div>
            </div>`;
    }

    setupInteractivity();
}

function setupInteractivity() {
    const gsap = window.gsap;
    const items = document.querySelectorAll('.goty-item');
    let currentOpenItem = null;

    items.forEach(item => {
        const button = item.querySelector('.goty-img-button');
        const details = item.querySelector('.goty-details');
        const content = item.querySelector('.goty-content');
        
        let isOpen = false;

        button.addEventListener('click', () => {
            isOpen = !isOpen;
            
            const isMobile = window.innerWidth <= 768;
            const isLeft = item.classList.contains('goty-left');
            
            if (isOpen) {
                // Close any previously open item
                if (currentOpenItem && currentOpenItem !== item) {
                    const prevButton = currentOpenItem.querySelector('.goty-img-button');
                    prevButton.click();
                }
                currentOpenItem = item;

                // Blur other items (except on mobile)
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.add('blurred');
                    }
                });
                item.classList.add('active');
                
                if (isMobile) {
                    // Mobile: modal behavior with fixed positioning
                    gsap.to(details, { 
                        opacity: 1, 
                        duration: 0.4, 
                        ease: "power2.out" 
                    });
                } else {
                    // Desktop: slide animation
                    const xVal = isLeft ? "110%" : "-110%";
                    gsap.to(content, { x: xVal, duration: 0.6, ease: "power3.out" });
                    gsap.to(details, { opacity: 1, duration: 0.5, delay: 0.3, ease: "power2.out" });
                }
                details.style.pointerEvents = 'auto';
            } else {
                // Remove blur
                items.forEach(otherItem => {
                    otherItem.classList.remove('blurred');
                });
                item.classList.remove('active');
                currentOpenItem = null;
                
                if (isMobile) {
                    // Mobile: fade out
                    gsap.to(details, { 
                        opacity: 0, 
                        duration: 0.3, 
                        ease: "power2.in" 
                    });
                } else {
                    // Desktop: slide back
                    gsap.to(content, { x: 0, duration: 0.6, ease: "power3.inOut" });
                    gsap.to(details, { opacity: 0, duration: 0.3, ease: "power2.in" });
                }
                details.style.pointerEvents = 'none';
            }
        });

        // Close when clicking outside (on any element that's blurred or on backdrop)
        document.addEventListener('click', (e) => {
            if (isOpen && !item.contains(e.target) && e.target !== button) {
                button.click();
            }
        });

        // Prevent closing when clicking inside the details panel
        details.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const votingForm = item.querySelector('.voting-form');
        if (votingForm) {
            votingForm.addEventListener('change', (e) => {
                if (e.target.type === 'radio') {
                    const year = Number(item.dataset.year);
                    const gameName = e.target.value;
                    saveVote(year, gameName);
                    
                    // Update vote counts only in the current item without closing or rebuilding everything
                    updateItemVotes(item, year);
                }
            });
        }
    });
}

function updateItemVotes(item, year) {
    const voteCounts = getVoteCounts(year);
    const voteCountElements = item.querySelectorAll('.vote-count');
    
    voteCountElements.forEach(el => {
        const id = el.id; // Format: vote-count-{year}-{game-name}
        const gameName = id.replace(`vote-count-${year}-`, '').replace(/-/g, ' ');
        const count = voteCounts[gameName] || 0;
        el.textContent = `${count} votes`;
        el.setAttribute('aria-live', 'polite');
    });

    // Update the main image display if this was the only voted game
    const votedGame = getVotedGame(year);
    const goty = gotyTableau.find(g => g.year === year);
    if (goty && votedGame) {
        const displayGame = goty.nominees.find(n => n.name === votedGame);
        if (displayGame) {
            const img = item.querySelector('.goty-img-clickable');
            const title = item.querySelector('.goty-title');
            const badge = item.querySelector('.goty-badge');
            
            img.src = displayGame.image;
            img.alt = displayGame.name;
            title.textContent = displayGame.name;
            
            // Add badge if not already present
            if (!badge && votedGame) {
                const badgeEl = document.createElement('span');
                badgeEl.classList.add('goty-badge');
                badgeEl.textContent = 'GOTY selon vous';
                const h3 = item.querySelector('.goty-content h3');
                h3.parentNode.insertBefore(badgeEl, h3.nextSibling);
            }
        }
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

    const gotyContainer = document.querySelector('.goty');
    const images = Array.from(gotyContainer.querySelectorAll('img'));
    
    // Skip line animation on mobile
    if (window.innerWidth <= 768) {
        return;
    }

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

        const segmentHeight = window.innerWidth <= 1024 ? 20 : 30;
        const gap = 10;
        const numSegments = Math.floor(totalHeight / (segmentHeight + gap)) - 11;

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

        // Création et animation des lignes diagonales de liaison parfaitement synchronisées
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

            const desiredStartY = targetY - 120;
            
            // On calcule l'indice du segment le plus proche
            const step = segmentHeight + gap;
            let segmentIndex = Math.round(desiredStartY / step);
            if (segmentIndex < 0) segmentIndex = 0;
            if (segmentIndex >= numSegments) segmentIndex = numSegments - 1;

            // Le point de départ réel : en bas de ce segment
            const startY = (segmentIndex * step) + segmentHeight -1;

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

const likelyGames = [];

/*Lorsque quelqu'un like un jeu, le vote est enregistré dans le tableau likelyGames. 
Si le jeu n'est pas déjà dans le tableau, il est ajouté avec un compteur de votes initialisé à 1. 
Si le jeu est déjà présent, son compteur de votes est incrémenté. 
Ensuite, le tableau likelyGames est trié en fonction du nombre de votes pour que les jeux les plus populaires soient affichés en premier. 
Enfin, la fonction updateLikelyGamesUI() est appelée pour mettre à jour l'affichage des jeux les plus susceptibles d'être votés comme GOTY.*/

function likeGame(gameName) {
    const game = likelyGames.find(g => g.name === gameName);
    if (game) {
        game.votes++;
    } else {
        likelyGames.push({ name: gameName, votes: 1 });
    }
    likelyGames.sort((a, b) => b.votes - a.votes);
    saveLikelyGames();
    updateLikelyGamesUI();
}

// initialisation de likelyGames depuis localStorage
loadLikelyGames();

function updateLikelyGamesUI() {
    const likelyContainer = document.querySelector('.likely-games');
    if (!likelyContainer) return;
    likelyContainer.innerHTML = '';

    likelyGames.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.classList.add('likely-game');
        gameElement.innerHTML = `<h3>${game.name}</h3><p>Votes: ${game.votes}</p>`;

        likelyContainer.appendChild(gameElement);
    });
}

export { gotyTableau, afficherGoty, chargerGoty, createBarre, likeGame };

function createBarre(){
    const existing = document.querySelector('.barre');
    if (existing) return;

    const gotyContainer = document.querySelector('.goty');
    const firstGoty = document.querySelector('.goty > div');
    if (!gotyContainer || !firstGoty) return;

    // On s'assure que le conteneur parent a une position relative
    if (getComputedStyle(gotyContainer).position === 'static') {
        gotyContainer.style.position = 'relative';
    }

    const segmentSize = 30;
    const topOffset = firstGoty.offsetTop;
    const availableHeight = Math.max(gotyContainer.offsetHeight - topOffset, segmentSize);
    const totaleSegments = Math.ceil(availableHeight / segmentSize);

    const barre = document.createElement('div');
    barre.className = 'barre';
    barre.style.position = 'absolute';
    barre.style.left = '50%';
    barre.style.transform = 'translateX(-50%)';
    barre.style.top = `${topOffset}px`;
    barre.style.height = `${availableHeight}px`;
    barre.style.width = '2px';

    for (let i = 0; i < totaleSegments; i++) {
        const segment = document.createElement('div');
        segment.className = 'barre-segment';
        segment.style.top = `${i * segmentSize}px`;
        barre.appendChild(segment);
    }

    gotyContainer.appendChild(barre);

    const gsapLib = window.gsap;
    if (!gsapLib) {
        console.warn('GSAP non trouvé : animation CSS en fallback');
        barre.classList.add('barre-no-gsap');
        return;
    }

    const segments = Array.from(barre.children);

    segments.forEach((segment, index) => {
        const fromY = index % 2 === 0 ? -topOffset : topOffset;
        gsapLib.fromTo(segment,
            { y: fromY, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                ease: 'power3.out',
                delay: index * 0.03
            }
        );
    });
}

export { createBarre };
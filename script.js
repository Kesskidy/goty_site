import { chargerGoty, afficherGoty, createBarre } from './goty.js';

let resizeTimeout;
let lastScreenSize = window.innerWidth > 768 ? 'desktop' : 'mobile';

const run = async () => {
    try {
        await chargerGoty();
        afficherGoty();
        createBarre();
    } catch (error) {
        console.error('Erreur lors de l initialisation :', error);
    }
};

// Handle responsive resize
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const currentScreenSize = window.innerWidth > 768 ? 'desktop' : 'mobile';
        
        // Reinitialize if breakpoint changed
        if (lastScreenSize !== currentScreenSize) {
            lastScreenSize = currentScreenSize;
            run();
        } else {
            // Just recreate barre on resize within same breakpoint
            createBarre();
        }
    }, 250);
});

run();
import { chargerGoty, afficherGoty } from './goty.js';
import { createBarre } from './goty_animation.js';

const run = async () => {
    try {
        await chargerGoty();
        afficherGoty();
        createBarre();
    } catch (error) {
        console.error('Erreur lors de l initialisation :', error);
    }
};

run();
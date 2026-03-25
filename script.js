import { chargerGoty, afficherGoty, createBarre } from './goty.js';

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
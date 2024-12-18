import { LOG_LEVEL, SESSION_ID_KEY } from "./consts.js";
import { generateId } from "./utils.js";

/**
 * TODO : récupérer les messages du journal de la persistance locale et configurer l'objet
 * @param {Object} storageManager gestionnaire de persistance
 */
export default class Logger {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.logs = [];
        this.loadFromStorage();
    }

    /**
     * Ajouter un message dans le journal avec un texte, un niveau de gravité et un identifiant de session.
     * Faire persister le journal dans le stockage
     *
     * @param {string} text le texte du message
     * @param {string} level le niveau de gravité du message (voir la constante LOG_LEVEL)
     * @param {string} sessionId l'identifiant de session en cours
     * @returns {void}
     */
    add(text, level = LOG_LEVEL.INFO, sessionId = '') {
        // Créer un nouvel objet Log
        const log = {
            id: generateId(),
            text: text,
            level: level,
            date: new Date().toISOString(), // Enregistrer la date au format ISO 8601
            session: sessionId
        };

        this.logs.push(log);

        this.storageManager.saveLogs(this.logs);
    }

    /**
    * Récupérer les messages du journal de la persistance locale
    */
    loadFromStorage() {
        const storedLogs = this.storageManager.getLogs(); 
        this.logs = storedLogs; 
    }

    get length() {
        return this.logs.length;
    }

    /**
     * TODO : Ajouter d'autres méthodes ou attributs si nécessaire
    */
    resetLogs() {
        this.storageManager.clearLogs(); 
        this.logs = []; 
    }

    // Ajouter un log
    addLog(log) {
        this.logs.push(log);
        this.storageManager.saveLogs(this.logs); 
    }

    // get the log list
    getLogs() {
        return this.logs;
    }
    
    // delete a single log
    deleteLog(id) {
        const updatedLogs = this.logs.filter(log => log.id !== id);

        this.storageManager.saveLogs(updatedLogs);

        this.logs = updatedLogs; 
    }


}

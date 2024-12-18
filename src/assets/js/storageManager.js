/**
 * @typedef {Object} Log
 * @property {string} id identifiant du message
 * @property {string} text texte du message
 * @property {string} level niveau du message
 * @property {string} date date de création du message
 * @property {string} session identifiant de session
 */

export default class StorageManager {
    constructor() {
        this.STORAGE_KEY_LOGGERS = "log2440-logs";
    }

    /**
     * Récupérer la liste des messages enregistrés
     * @returns {Log[]} liste des messages enregistrés. Tableau vide si aucun message enregistré
     */
    getLogs() {
        const logs = localStorage.getItem(this.STORAGE_KEY_LOGGERS);
        return logs ? JSON.parse(logs) : []; 
    }

    /**
     * Récupérer un message par son identifiant
     * @param {string} id identifiant du message
     * @returns {Log | undefined} un message ou `undefined` si aucun message ne correspond à l'identifiant
     */
    getLogById(id) {
        const logs = this.getLogs(); 
        return logs.find(log => log.id === id); 
    }

    /**
     * Persister les messages dans le stockage local
     * @param {Log[]} logs liste des messages à enregistrer
     */
    saveLogs(logs) {
        localStorage.setItem(this.STORAGE_KEY_LOGGERS, JSON.stringify(logs)); 
    }

    /**
     * Vider le stockage local des messages
     */
    clearLogs() {
        localStorage.removeItem(this.STORAGE_KEY_LOGGERS);
    }

}

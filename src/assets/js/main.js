import Logger from "./logger.js";
import DEFAULT_DATA from './defaultData.js';
import StorageManager from './storageManager.js';
import { formatDate } from "./utils.js";
import { SESSION_ID_KEY } from "./consts.js";

export default class MainPageController {
    /**
     * TODO : Configurer le contrôleur avec un gestionnaire de messages
     * @param {Logger} logger gestionnaire de messages
     */
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * TODO : Initialiser le contrôleur de la page
     */
    init() { 
        this.bindEvents(); 
        this.loadLogs();
    }

    /**
     * TODO : Ajouter des gestionnaires d'événements pour les boutons et le formulaire de la page
     */
    bindEvents() {
        document.getElementById('log-form').addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche le rechargement de la page
            const logInput = document.getElementById('log-input').value;
            const logLevel = document.getElementById('log-level').value;
            const sessionId = this.handleSession(); // Récupérer l'identifiant de session

            this.logger.add(logInput, logLevel, sessionId); 
            document.getElementById('log-input').value = ''; 
            this.loadLogs(); 
        });

        document.getElementById('default-logger-btn').addEventListener('click', () => {
            this.loadDefaultData(); 
        });

        document.getElementById('reset-logger-btn').addEventListener('click', () => {
            this.resetLogger(); 
        });
    }

    /**
     * TODO : construire un élément de la liste de messages selon le format :
     * `[AAAA-MM-JJ HH:MM:SS] - [Niveau] - Texte du message`
     * @param {string} log texte du message
     * @returns {HTMLLIElement} élément de liste de message
     */
    buildLogItem(log) {
        const logItem = document.createElement('li');
        logItem.textContent = `[${formatDate(log.date)}] - [${log.level.toUpperCase()}] - ${log.text}`;
        return logItem;
    }

    /**
     * TODO : Charger les messages du journal dans la liste de messages
     */
    loadLogs() {
        const logList = document.getElementById('log-list');
        logList.innerHTML = "";

        this.logger.logs.forEach(log => {
            const logItem = this.buildLogItem(log); 
            logList.appendChild(logItem); 
        });

        this.updateUI(); 
    }

    /**
     * TODO : Mettre à jour l'interface utilisateur en fonction de l'état du journal
    */
    updateUI() {
        const emptyWarning = document.getElementById('empty-warning');
        const resetButton = document.getElementById('reset-logger-btn');

        if (this.logger.length === 0) {
            emptyWarning.style.display = 'block'; 
            resetButton.style.display = 'none'; 
        } else {
            emptyWarning.style.display = 'none'; 
            resetButton.style.display = 'block'; 
        }
    }

    /**
     * TODO : Récupérer l'identifiant de session en cours ou en générer un nouveau
     */
    handleSession() {
        let sessionId = sessionStorage.getItem(SESSION_ID_KEY); // Using the constant to get the session ID from the session storage 
        
        if (!sessionId) {
            sessionId = this.generateSessionId(); // Generate a new ID if none exists
            sessionStorage.setItem(SESSION_ID_KEY, sessionId); 
        }
    
        return sessionId; 
    }

    generateSessionId() {
        // Generate a random Identifier
        const generateRandomSegment = (length) => {
            return Math.random().toString(36).substring(2, 2 + length);
        };
    
        // Create two segments of 4 characters and one segment of 12 characters
        const segment1 = generateRandomSegment(4); 
        const segment2 = generateRandomSegment(8); 
        const segment3 = generateRandomSegment(4); 
    
        // Concatenate the segments with dashes in between
        return `${segment1}-${segment2}-${segment3}`;
    }
    
    
    /**
     * Charger les messages de defaultData.js dans le journal
     */
    loadDefaultData() {
        DEFAULT_DATA.forEach(log => {
            this.logger.add(log.text, log.level, log.session); 
        });
        this.loadLogs(); 
    }

    /**
     * Réinitialiser le journal
     */
    resetLogger() {
        this.logger.resetLogs(); 
        this.loadLogs(); 
    }

}

// TODO : Configurer les objets nécessaires pour initialiser le contrôleur de la page
// TODO : Corriger les problèmes de qualité soulevé par ESLint

const storageManager = new StorageManager();

const logger = new Logger(storageManager);

const controller = new MainPageController(logger);

controller.init();
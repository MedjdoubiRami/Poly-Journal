import Logger from './logger.js';
import StorageManager from './storageManager.js';
import { LOG_LEVEL, SESSION_ID_KEY } from "./consts.js";
import { formatDate } from './utils.js';

export default class DetailsManager {
    constructor(logger) {
        this.logger = logger;
        this.filteredLogs = [];

        this.logDisplayParent = document.getElementById('log-display-container');
        this.statsDisplayParent = document.getElementById('stats-container');

        // TODO : Ajouter les attributs nécessaires pour compléter les fonctionnalités du TP
        // attribut pour les filtres
        this.ascending = true; 
        this.descending = false; 
        this.level = {
            debug: true,
            info: true,
            warning: true,
            error: true,
        };
        this.group = false; 
        this.searchInput = ""; 
        this.undergoingReset = false; 
    }

    /**
     * TODO : Initaliser la gestion des événements et charger les messages du journal
     */
    init() {
        this.loadStats(); 

        // These are the selected filters upon loadinf the page details
        document.getElementById('date-asc').checked = true; 
        document.getElementById('debug-input').checked = true; 
        document.getElementById('info-input').checked = true;
        document.getElementById('warn-input').checked = true;
        document.getElementById('error-input').checked = true;
        document.getElementById('search-input').value = "";

        this.filteredLogs = this.logger.getLogs(); // Initially the filtered logs are in fact all the logs  
        this.loadLogs();
        this.bindEvents(); 
    }

    bindEvents() { 
        document.getElementById('date-asc').addEventListener('change', () => {
            if (this.undergoingReset) { return; }
            this.ascending = true; 
            this.descending = false;
            this.loadLogs(); 
        });
        
        document.getElementById('date-des').addEventListener('change', () => {
            if (this.undergoingReset) { return; }
            this.descending = true; 
            this.ascending = false; 
            this.loadLogs(); 
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('debug-input').addEventListener('change', (event) => {
                if (this.undergoingReset) { return; }
                this.level.debug = event.target.checked;
                this.loadLogs();
            });
        
            document.getElementById('info-input').addEventListener('change', (event) => {
                if (this.undergoingReset) { return; }
                this.level.info = event.target.checked; 
                this.loadLogs();
            });
        
            document.getElementById('warn-input').addEventListener('change', (event) => {
                if (this.undergoingReset) { return; }
                this.level.warning = event.target.checked; 
                this.loadLogs();
            });
        
            document.getElementById('error-input').addEventListener('change', (event) => {
                if (this.undergoingReset) { return; }
                this.level.error = event.target.checked;
                this.loadLogs();
            });
        });
        
        document.getElementById('session-group-btn').addEventListener('click', () => {
            if (this.undergoingReset) { return; }
            console.log("group clicked");
            this.group = !this.group; 
            this.loadLogs();
        });

        document.getElementById('search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.undergoingReset) { return; }
            this.searchInput = document.getElementById('search-input').value.toLowerCase(); 
            document.getElementById('search-input').value = ""; 
            this.loadLogs();
        });

        document.getElementById('filter-reset-btn').addEventListener('click', () => {
            this.undergoingReset = true; // Prevent change event handlers from firing during reset
    
            // Reset filters to default
            this.ascending = true; 
            this.descending = false;
            this.level = {
                debug: true,
                info: true,
                warning: true,
                error: true,
            };
            this.group = false;
            this.searchInput = ""; 
    
            document.getElementById('date-asc').checked = true; 
    
            document.getElementById('debug-input').checked = true;
            document.getElementById('info-input').checked = true;
            document.getElementById('warn-input').checked = true;
            document.getElementById('error-input').checked = true;
    
            document.getElementById('search-input').value = "";
    
            this.undergoingReset = false; 
            this.loadLogs(); 
        });
    }

    filterLogs() {
        // start with all the logs
        this.filteredLogs = this.logger.getLogs(); 

        // Filter by session if group is true
        if (this.group) { 
            this.filteredLogs = this.filteredLogs.filter(log => log.session === sessionStorage.getItem(SESSION_ID_KEY));
        }

        // Create a set of valid levels based on the current checkbox states
        const validLevels = new Set();
        if (this.level.debug) validLevels.add(LOG_LEVEL.DEBUG);
        if (this.level.info) validLevels.add(LOG_LEVEL.INFO);
        if (this.level.warning) validLevels.add(LOG_LEVEL.WARN);
        if (this.level.error) validLevels.add(LOG_LEVEL.ERROR);

        // Filter logs to keep only those that match the valid levels
        this.filteredLogs = this.filteredLogs.filter(log => validLevels.has(log.level));

        // filter logs based on the searchInput attribute 
        if (this.searchInput !== "") {
            console.log('Search Input:', this.searchInput);
            this.filteredLogs = this.filteredLogs.filter(log =>
                log.text.toLowerCase().includes(this.searchInput)
            );
        }

        // order the logs based on the ascending attribute 
        if (this.ascending) {
            // Sort the logs in ascending order (earliest first)
            this.filteredLogs.sort((a, b) => {
                return Date.parse(a.date) - Date.parse(b.date);
            });
        }
        if (this.descending) {
            // Sort the logs in descending order (latest first)
            this.filteredLogs.sort((a, b) => {
                return Date.parse(b.date) - Date.parse(a.date);
            }); 
        }

    }

    /**
     * TODO : Charger les messages du journal et l'afficher
     */
    loadLogs() {
        this.logDisplayParent.innerHTML = ""; 
        this.filterLogs(); 
        this.filteredLogs.forEach(log => {
            this.buildLoggerItem(log);
        });
    }
    
    /**
     * TODO : Construire la structure HTML d'un message du journal
     * @param {import('./storageManager.js').Log} log message du journal
     * @returns {HTMLDivElement} parent HTML du message dans la liste
     */
    buildLoggerItem(log) {
        // Crée le conteneur principal pour le message du log
        const logItem = document.createElement('div');
        logItem.className = `log-detail-message ${log.level}`; // Applique la classe du niveau de gravité
    
        // Crée le conteneur pour les informations du log
        const logDetailInfo = document.createElement('div');
        logDetailInfo.className = 'log-detail-info';
    
        // Crée l'élément pour la date et l'heure
        const timestampSpan = document.createElement('span');
        timestampSpan.textContent = `[${formatDate(log.date)}]`;
    
        // Crée l'élément pour l'identifiant du log
        const idSpan = document.createElement('span');
        idSpan.textContent = log.id;
    
        // Crée le bouton de suppression
        const deleteButton = document.createElement('button');
        deleteButton.className = 'fa fa-trash';
    
        // Écouteur pour le bouton de suppression
        deleteButton.addEventListener('click', () => {
            this.deleteLog(log);
        });
    
        // Ajoute les éléments au conteneur des informations
        logDetailInfo.appendChild(timestampSpan);
        logDetailInfo.appendChild(idSpan);
        logDetailInfo.appendChild(deleteButton);
    
        // Crée l'élément pour le message
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = log.text;
    
        // Ajoute le conteneur des informations et le message au conteneur principal
        logItem.appendChild(logDetailInfo);
        logItem.appendChild(messageParagraph);
    
        // Ajoute le message du log au conteneur d'affichage des logs
        this.logDisplayParent.appendChild(logItem);
    }
    

    /**
     * TODO : Calculer les statistiques des messages du journal en une seule itération
     * Vous ne pouvez pas utiliser des boucles `for`, `while` ou `forEach`
     * @returns { {
     * sessions: string[],
     * size: number,
     * levels : {debug: number, info : number, warn: number, error:number}
     * }} les statistiques
     */
    getCombinedStats() {
        const logs = this.logger.getLogs();
        return logs.reduce((acc, log) => {
            if (!acc.sessions.includes(log.session)) {
                acc.sessions.push(log.session);
            }
            acc.levels[log.level] = (acc.levels[log.level] || 0) + 1;
            acc.size++;
            return acc;
        }, {
            sessions: [],
            size: 0,
            levels: { debug: 0, info: 0, warning: 0, error: 0 }
        });
    }
    
    loadStats() {
        const stats = this.getCombinedStats();
        
        // Effacer tout contenu précédent
        this.statsDisplayParent.innerHTML = '';
    
        // Fonction utilitaire pour créer et ajouter les lignes de statistiques
        const createStatRow = (label, value, id) => {
            const p = document.createElement('p');
            p.textContent = `${label}: `;
    
            const span = document.createElement('span');
            span.textContent = value;
            span.id = id;  // Ajoute un ID pour que Cypress puisse les trouver
    
            p.appendChild(span);
            this.statsDisplayParent.appendChild(p);
        };
    
        // Créer et ajouter les lignes pour chaque statistique
        createStatRow('Total Messages', stats.size, 'messages-total');
        createStatRow('Debug Messages', stats.levels.debug, 'messages-debug');
        createStatRow('Info Messages', stats.levels.info, 'messages-info');
        createStatRow('Warning Messages', stats.levels.warning, 'messages-warning');
        createStatRow('Error Messages', stats.levels.error, 'messages-error');
        createStatRow('Unique Sessions', stats.sessions.length, 'sessions-total');
    }
    
    
    
    // TODO : Ajouter les méthodes nécessaires pour compléter les fonctionnalités du TP
    deleteLog(log) {
        this.logger.deleteLog(log.id); 

        this.loadStats();
    
        this.loadLogs();
    }

}

// TODO : Configurer les objets nécessaires pour initialiser le contrôleur de la page

// Initialize the DetailsManager
const storageManager = new StorageManager();
const logger = new Logger(storageManager);
const detailsManager = new DetailsManager(logger);
detailsManager.init();
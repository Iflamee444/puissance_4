"use strict";
/*
* Projet : Puissance 4
* par Marius RAVELOSON
*
* début projet : 18/09/2025
*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ce qu'il faut build :
 * - Le tableau [X]
 * - Les jetons (Cases vide, jeton) [X]
 * - Les équipes [X]
 * - Les scores [??]
 * - Le reset [X]
 */
/**
 *  Exemple avec du puissance 4 :
 *     0   1   2   3   4   5   6
 * 0  [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 1  [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 2  [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 3  [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 4  [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 5  [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 */
var Team;
(function (Team) {
    Team[Team["RED"] = 0] = "RED";
    Team[Team["YELLOW"] = 1] = "YELLOW";
})(Team || (Team = {}));
class Main {
    constructor() {
        this.score = [0, 0]; // 0 : rouge , 1 : jaune
        this.board = new Board();
        this.currentTeam = Team.RED;
        this.mechanique = new Mechanique(this.board);
    }
    // La boucle du jeu
    loop(autoPlay = true) {
        while (true) {
            this.printBoard();
            let col;
            do {
                col = Math.floor(Math.random() * this.board.getColonne());
            } while (this.mechanique.isColumFull(col));
            this.playerColonneSelected(col);
            if (this.mechanique.alignementCheck(this.currentTeam)) {
                this.printBoard();
                console.log(`Victoire de l'équipe ${this.currentTeam === Team.RED ? "Rouge" : "Jaune"} !`);
                this.giveScore(this.currentTeam);
                return;
            }
            if (this.mechanique.fullBoard()) {
                this.printBoard();
                console.log("Match nul !");
                return;
            }
            this.changeTeam();
        }
    }
    //Team Gestion
    //Mettre le team de début
    setTeam(team) {
        this.currentTeam = team;
    }
    //Obtenir le team actuelle
    getCurrentTeam() {
        return this.currentTeam;
    }
    //Changement d'équipe actif
    changeTeam() {
        this.currentTeam = this.currentTeam === Team.RED ? Team.YELLOW : Team.RED;
    }
    //Score gestion
    // Give score to
    giveScore(team) {
        team === Team.RED ? this.score[0]++ : this.score[1]++;
    }
    //Obtenir le score d'une équipe spécifique
    getScore(team) {
        return team === Team.RED ? this.score[0] : this.score[1];
    }
    //Obtenir le score du jeu
    getScoreAll() {
        return this.score;
    }
    //Nettoyer les scores
    clearScore() {
        this.score = [0, 0];
    }
    //Board gestion
    //Mise à 0 du tableau
    resetBoard() {
        this.board.clear();
    }
    //Game gestion
    //Reinitialiser le tableau
    resetAll() {
        this.clearScore();
        this.resetBoard();
        this.setTeam(Team.RED);
    }
    //Interaction joueur
    //Selectionneur de colonne
    playerColonneSelected(selection) {
        this.mechanique.dropJeton(selection, this.currentTeam);
    }
    //Victoire
    playerVictory() {
        if (this.score[0] === 10) {
            console.log("Rouge GAGNE !");
        }
        if (this.score[1] === 10) {
            console.log("Jaune GAGNE !");
        }
    }
    printBoard() {
        let header = "    "; // espace pour l’alignement avec les numéros de ligne
        for (let c = 0; c < this.board.getColonne(); c++) {
            header += ` ${c}  `;
        }
        console.log(header);
        for (let r = 0; r < this.board.getLigne(); r++) {
            let row = `${r} `; // numéro de ligne
            for (let c = 0; c < this.board.getColonne(); c++) {
                const team = this.board.table[c][r].getJetonTeam();
                if (team === Team.RED) {
                    row += "[R] ";
                }
                else if (team === Team.YELLOW) {
                    row += "[J] ";
                }
                else {
                    row += "[ ] ";
                }
            }
            console.log(row);
        }
        console.log("=".repeat(this.board.getColonne() * 4)); // ligne de séparation
    }
}
/**
 * ------------------------------------------------
 * ===================
 * Classes principale :
 * - Tableau
 * - Cases
 * - Jetons
 *
 * ===================
 * Classes secondaire :
 * - Boucle de jeu
 * - Compteur de victoire
 * - Fonctionnement du jeu / Interaction utilisateur
 *
 * ------------------------------------------------
 */
/**
 * Classe Board
 * ------------
 * Le tableau du jeu, à sa création il va se générer en tableau de 6*7 (ceux de base en Puissance 4)
 * Il sera fait à partir des objets Cases
 *
 *
 * Fonctions:
 * - constructor() : pour créer le tableau vide
 * - clear() : pour nettoyer le tableau de bas en haut
 */
class Board {
    constructor() {
        this.ligne = 6; // lignes
        this.colonne = 7; // colonnes
        this.table = []; // tableau de Cases
        this.table = [];
        // Convention: table[colonne][ligne]
        for (let c = 0; c < this.colonne; c++) {
            this.table[c] = []; // initialise la colonne
            for (let r = 0; r < this.ligne; r++) {
                this.table[c][r] = new Cases(c, r); // remplit la case
            }
        }
    }
    clear() {
        for (let c = 0; c < this.colonne; c++) {
            for (let r = 0; r < this.ligne; r++) {
                if (!this.table[c][r].isEmpty()) {
                    this.table[c][r].clearSelf();
                }
            }
        }
    }
    getColonne() { return this.colonne; }
    getLigne() { return this.ligne; }
}
class Jeton {
    //Créer un jeton avec une équipe
    constructor(equipe) {
        this.equipe = equipe;
    }
    //Récupère l'équipe du jeton (Rouge ou Jaune)
    getTeam() {
        return this.equipe;
    }
}
class Cases {
    //Créer une case vide et ses coordonnées
    constructor(x, y) {
        this.holder = null; // Case vide
        this.estVide = true; //Etat vide
        this.x = x; // Coordonnée X
        this.y = y; // Coordonnée Y
    }
    //Ajouter un jeton de l'équipe
    ajouterJeton(team) {
        this.holder = new Jeton(team);
        this.estVide = false;
    }
    isEmpty() {
        return this.estVide;
    }
    //Change l'état de la case
    changeState() {
        this.estVide = !this.isEmpty();
    }
    // Récupérer la coordonnée X (numéro de colonne)
    getX() {
        return this.x;
    }
    // Récupérer la coordonnée Y (numéro de ligne)
    getY() {
        return this.y;
    }
    //Récupère les informations du jeton dans la case
    getJetonTeam() {
        var _a, _b;
        return (_b = (_a = this.holder) === null || _a === void 0 ? void 0 : _a.getTeam()) !== null && _b !== void 0 ? _b : null;
    }
    // Nettoyer la case
    clearSelf() {
        this.holder = null;
        this.estVide = true;
    }
}
class Mechanique {
    constructor(board) {
        this.myBoard = board;
    }
    // Drop les jetons
    // Vérifier si une colonne est pleine
    // Arrête le jeu si plein
    // Vérification d'allignement (plus tard)
    //Vérifier la gravité (la case la plus basse libre) part depuis le bas
    availableCase(colone) {
        for (let i = this.myBoard.getLigne() - 1; i >= 0; i--) {
            if (this.myBoard.table[colone][i].isEmpty()) {
                return i;
            }
        }
        return -1; //Si aucun case n'est disponible
    }
    dropJeton(colonne, team) {
        // Choisir la colonne [X]
        // Vérifie si elle est pleinne
        // Vérifie la case.isEmpty = true la plus basse
        // Si oui, change l'état de cette case et rajoute le jeton
        // Si non, passe à la case au dessus
        // Si la case [X,0] .isEmpty = false alors la colonne est pleine et change l'état de cette colonne en isFull = true
        //Si la colonne est pleinne annule le movement
        if (this.isColumFull(colonne)) {
            return; //colone pleine
        }
        const ligne = this.availableCase(colonne);
        if (ligne !== -1) {
            this.myBoard.table[colonne][ligne].ajouterJeton(team);
        }
    }
    isColumFull(colonne) {
        // Vérifie si une colonne est pleine
        // Si la case 0 est pleine , alors il renvoie true
        // Si non, alors il renvoie false
        if (!this.myBoard.table[colonne][0].isEmpty()) {
            return true;
        }
        return false;
    }
    fullBoard() {
        // Après la vérification des allignements
        // Si toute les colonnes sont full alors arrête le jeu et déclare l'égalité et lance le reset du jeu
        for (let i = 0; i < this.myBoard.getColonne(); i++) {
            if (!this.isColumFull(i)) { // Si une colone n'est pas full alors false
                return false;
            }
        }
        return true; //Si tout est bien plein alors true
    }
    //Vérifie si une alignement est faite ou que la table est full
    teamVictory(team) {
        // Lance la vérification d'allignement
        // Retourne l'équipe qui a gagner
        if (this.fullBoard() || this.alignementCheck(team)) {
            //Victoire team
        }
        //Rien
    }
    // S'execute après chaque tour
    alignementCheck(team) {
        const cols = this.myBoard.getColonne();
        const rows = this.myBoard.getLigne();
        // Vérifier horizontalement
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c <= cols - 4; c++) { // -4 car on regarde 4 jetons consécutifs
                let win = true;
                for (let i = 0; i < 4; i++) {
                    if (this.myBoard.table[c + i][r].getJetonTeam() !== team) {
                        win = false;
                        break;
                    }
                }
                if (win)
                    return true;
            }
        }
        // Vérifier verticalement
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r <= rows - 4; r++) {
                let win = true;
                for (let i = 0; i < 4; i++) {
                    if (this.myBoard.table[c][r + i].getJetonTeam() !== team) {
                        win = false;
                        break;
                    }
                }
                if (win)
                    return true;
            }
        }
        // Vérifier diagonale descendante (\)
        for (let c = 0; c <= cols - 4; c++) {
            for (let r = 0; r <= rows - 4; r++) {
                let win = true;
                for (let i = 0; i < 4; i++) {
                    if (this.myBoard.table[c + i][r + i].getJetonTeam() !== team) {
                        win = false;
                        break;
                    }
                }
                if (win)
                    return true;
            }
        }
        // Vérifier diagonale ascendante (/)
        for (let c = 0; c <= cols - 4; c++) {
            for (let r = 3; r < rows; r++) { // commence à 3 car on remonte
                let win = true;
                for (let i = 0; i < 4; i++) {
                    if (this.myBoard.table[c + i][r - i].getJetonTeam() !== team) {
                        win = false;
                        break;
                    }
                }
                if (win)
                    return true;
            }
        }
        return false; // Aucun alignement trouvé
    }
}
// Point d'entrée du programme
const game = new Main();
game.loop();
//# sourceMappingURL=main.js.map
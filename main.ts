/*
* Projet : Puissance 4
* par Marius RAVELOSON
* 
* début projet : 18/09/2025
*/

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

import promptSync from "prompt-sync";
const prompt = promptSync();


enum Team {
    RED,  //Rouge
    YELLOW  //Jaune
}

class Main {
    private currentTeam: Team;
    board: Board;
    mechanique: Mechanique;
    private score : [number, number] = [0, 0]; // 0 : rouge , 1 : jaune

    constructor() {
        this.board = new Board();
        this.currentTeam = Team.RED;
        this.mechanique = new Mechanique(this.board);
    }

    // La boucle du jeu
    loop(autoPlay: boolean = true): void {
        while (true) {
            this.printBoard();

            let col: number;
/*
            // Laisser les robot jouer (Random)
            do {
                col = Math.floor(Math.random() * this.board.getColonne());
            } while (this.mechanique.isColumFull(col));
            
            console.log(col); // Affichage du move
            
            this.playerColonneSelected(col);
            */
            // Version joueur humain
            col = this.playerInput();
            this.playerColonneSelected(col);

            // Vérification victoire
            if (this.mechanique.alignementCheck(this.currentTeam)) {
                this.printBoard();
                console.log(`Victoire de l'équipe ${this.currentTeam === Team.RED ? "Rouge" : "Jaune"} !`);
                this.giveScore(this.currentTeam);
                return;  // Continue
            }

            if (this.mechanique.fullBoard()) {
                this.printBoard();
                console.log("Match nul !");
                return; // Lancer le reset
            }

            this.changeTeam();
        }

    }

    //Team Gestion

    //Mettre le team de début
    setTeam(team : Team){
        this.currentTeam = team;
    }

    //Obtenir le team actuelle
    getCurrentTeam() : Team{
        return this.currentTeam;
    }

    //Changement d'équipe actif
    changeTeam() : void{
        this.currentTeam = this.currentTeam === Team.RED ? Team.YELLOW : Team.RED;
    }

    //Score gestion

    // Give score to
    giveScore(team : Team) : void {
        team === Team.RED ? this.score[0]++ : this.score[1]++;
    }

    //Obtenir le score d'une équipe spécifique
    getScore(team : Team) : number{
        return team === Team.RED ? this.score[0] : this.score[1];
    }
    
    //Obtenir le score du jeu
    getScoreAll() : number[]{
        return this.score;
    }

    //Nettoyer les scores
    clearScore() : void {
        this.score = [0,0];
    }

    //Board gestion

    //Mise à 0 du tableau
    resetBoard(){
        this.board.clear();
    }

    //Game gestion

    //Reinitialiser le tableau
    resetAll(){
        this.clearScore();
        this.resetBoard();
        this.setTeam(Team.RED);
    }

    //Interaction joueur

    //Selectionneur de colonne
    playerColonneSelected(selection: number): void {
    this.mechanique.dropJeton(selection, this.currentTeam);
}

    //Victoire
    playerVictory(){
        if (this.score[0] === 10) { console.log("Rouge GAGNE !"); }
        if (this.score[1] === 10) { console.log("Jaune GAGNE !"); }
    }

    printBoard(): void {
        let header = "    "; // espace pour l’alignement avec les numéros de ligne
        for (let c = 0; c < this.board.getColonne(); c++) {
            header += ` ${c}  `;
        }
        console.log(header);

        for (let r = 0; r < this.board.getLigne(); r++) {
            let row = ` ${r} `; // numéro de ligne
            for (let c = 0; c < this.board.getColonne(); c++) {
                const team = this.board.table[c]![r]!.getJetonTeam();
                if (team === Team.RED) {
                    row += "[🔴] ";
                } else if (team === Team.YELLOW) {
                    row += "[🟡] ";
                } else {
                    row += "[  ] ";
                }
            }
            console.log(row);
        }
        console.log("=".repeat(this.board.getColonne() * 4)); // ligne de séparation
    }

    playerInput() : number{
        let col: number;
        do {
            const input = prompt(
                `Équipe ${
                    this.currentTeam === Team.RED ? "Rouge" : "Jaune"
                }, choisissez une colonne (1-${this.board.getColonne()}): `
            );
            col = parseInt(input) - 1; // Ajustement pour index 0
        } while (!this.playerInputChecker(col)); // Inverse la condition pour continuer tant que l'entrée est invalide
        return col;
    }

    playerInputChecker(col: number): boolean {
        if (col < 0 || col >= this.board.getColonne()) {
            console.log("Colonne invalide. Choisissez entre 0 et " + (this.board.getColonne()));
            return false;
        }
        if (this.mechanique.isColumFull(col)) {
            console.log("Colonne pleine. Choisissez une autre colonne.");
            return false;
        }
        if (isNaN(col)) {
            console.log("Entrée invalide. Veuillez entrer un numéro de colonne.");
            return false;
        }
        return true;
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
    private ligne: number = 6; // lignes
    private colonne: number = 7; // colonnes
    table: (Cases)[][] = []; // tableau de Cases

    constructor() {
        this.table = [];

        // Convention: table[colonne][ligne]
        for (let c = 0; c < this.colonne; c++) {
            this.table[c] = []; // initialise la colonne
            for (let r = 0; r < this.ligne; r++) {
                this.table[c]![r] = new Cases(c, r); // remplit la case
            }
        }
    }

    clear(): void {
        for (let c = 0; c < this.colonne; c++) {
            for (let r = 0; r < this.ligne; r++) {
                if (!this.table[c]![r]!.isEmpty()) {
                    this.table[c]![r]!.clearSelf();
                }
            }
        }
    }

    getColonne(): number { return this.colonne; }
    getLigne(): number { return this.ligne; }
}


class Jeton {
    equipe : Team;

    //Créer un jeton avec une équipe
    constructor(equipe : Team){
        this.equipe = equipe;
        
    }

    //Récupère l'équipe du jeton (Rouge ou Jaune)
    getTeam() : Team{
        return this.equipe;
    }

}

class Cases {
    public holder : Jeton | null;
    private estVide : boolean;
    private x : number; // Les colonnes
    private y : number; // Les lignes

    //Créer une case vide et ses coordonnées
    constructor(x : number, y : number){
        this.holder = null; // Case vide
        this.estVide = true; //Etat vide
        this.x = x; // Coordonnée X
        this.y = y; // Coordonnée Y
    }

    //Ajouter un jeton de l'équipe
    ajouterJeton(team: Team): void {
        this.holder = new Jeton(team);
        this.estVide = false;
    }
    
    isEmpty() : boolean {
        return this.estVide;
    }

    //Change l'état de la case
    changeState() : void {
        this.estVide = !this.isEmpty();
    }

    // Récupérer la coordonnée X (numéro de colonne)
    getX() : number | null{
        return this.x;
    }

    // Récupérer la coordonnée Y (numéro de ligne)
    getY() : number | null{
        return this.y;
    }

    //Récupère les informations du jeton dans la case
    getJetonTeam() : Team | null{
        return this.holder?.getTeam() ?? null;
    }

    // Nettoyer la case
    clearSelf() : void {
        this.holder = null;
        this.estVide = true;
    }

}

class Mechanique {

    private myBoard : Board;

    constructor(board : Board){
        this.myBoard = board;
    }
    // Drop les jetons
    // Vérifier si une colonne est pleine
    // Arrête le jeu si plein
    // Vérification d'allignement (plus tard)

    //Vérifier la gravité (la case la plus basse libre) part depuis le bas
    availableCase(colone : number) : number{
        for(let i = this.myBoard.getLigne() - 1; i >= 0; i--) {
            if(this.myBoard.table[colone]![i]!.isEmpty()){
                return i;
            }
        }
        return -1; //Si aucun case n'est disponible
    }

    dropJeton(colonne : number, team : Team){
        // Choisir la colonne [X]
        // Vérifie si elle est pleinne
        // Vérifie la case.isEmpty = true la plus basse
        // Si oui, change l'état de cette case et rajoute le jeton
        // Si non, passe à la case au dessus
        // Si la case [X,0] .isEmpty = false alors la colonne est pleine et change l'état de cette colonne en isFull = true

        //Si la colonne est pleinne annule le movement
        if(this.isColumFull(colonne)){
           return; //colone pleine
        }
        const ligne = this.availableCase(colonne);
        if (ligne !== -1) {
            this.myBoard.table[colonne]![ligne]!.ajouterJeton(team);
        }
    }

    isColumFull(colonne : number) : boolean{
        // Vérifie si une colonne est pleine
        // Si la case 0 est pleine , alors il renvoie true
        // Si non, alors il renvoie false
        if(!this.myBoard.table[colonne]![0]!.isEmpty()) {
        
            return true;
        }
        return false;
    }

    fullBoard() : boolean {
        // Après la vérification des allignements
        // Si toute les colonnes sont full alors arrête le jeu et déclare l'égalité et lance le reset du jeu

        for(let i = 0; i < this.myBoard.getColonne(); i++){
            if(!this.isColumFull(i)){ // Si une colone n'est pas full alors false
                return false;
            }
        }
        
        return true; //Si tout est bien plein alors true
    }

    //Vérifie si une alignement est faite ou que la table est full
    teamVictory(team : Team){
        // Lance la vérification d'allignement
        // Retourne l'équipe qui a gagner
        if(this.fullBoard() || this.alignementCheck(team)){
                //Victoire team
        }

        //Rien
    }

    // S'execute après chaque tour
    // Vérifie l'alignement récursivement pour 4 jetons
    private countRecursive(x: number, y: number, dx: number, dy: number, team: Team): number {
    const cols = this.myBoard.getColonne();
    const rows = this.myBoard.getLigne();

    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) return 0;
    if (this.myBoard.table[nx]![ny]!.getJetonTeam() !== team) return 0;

    return 1 + this.countRecursive(nx, ny, dx, dy, team);
    }

    alignementCheck(team: Team): boolean {
        const cols = this.myBoard.getColonne();
        const rows = this.myBoard.getLigne();

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                if (this.myBoard.table[c]![r]!.getJetonTeam() === team) {
                    const directions = [
                        [1, 0],  // horizontal
                        [0, 1],  // vertical
                        [1, 1],  // diagonale \
                        [1, -1]  // diagonale /
                    ];

                    for (const [dx, dy] of directions) {
                        const count = 1 
                            + this.countRecursive(c, r, dx!, dy!, team)
                            + this.countRecursive(c, r, -dx!, -dy!, team);
                        if (count >= 4) return true;
                    }
                }
            }
        }

        return false;
    }

}

// Point d'entrée du programme
const game = new Main();
game.loop();

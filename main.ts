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

enum Team {
    RED,
    YELLOW
}

export class Main {
    private currentTeam: Team;
    board: Board;
    mechanique: Mechanique;
    private score : number[] = [0, 0]; // 0 : rouge , 1 : jaune

    constructor() {
        this.board = new Board();
        this.currentTeam = Team.RED;
        this.mechanique = new Mechanique(this.board);
    }

    // La boucle du jeu
    loop(): void {
        // 1. Afficher le plateau
        // 2. Gérer le tour du joueur
        // 3. Vérifier victoire / égalité
        // 4. Passer au joueur suivant
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
    playerColonneSelected(selection : number) : void {
        this.mechanique.dropJeton(selection);
    }

    //Victoire
    playerVictory(){
        if (this.score[0] = 10){ console.log("Rouge GAGNE !")}
        if (this.score[1] = 10){ console.log("Jaune GAGNE !")}
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
export class Board {
    private ligne: number = 6; // les lignes
    private colonne: number = 7; // les colonnes
    table: Cases[][] = []; //Le tableau de case vide (ligne) (colone)

    // Générer la table vide
    constructor() {
        for (let r = 0; r < this.ligne; r++) {
            this.table[r] = [];
            for (let c = 0; c < this.colonne; c++) {
                this.table[c][r] = new Cases(c,r); //Création d'une case vide et lui donne ses coordonnées
            }
        }
    }

    // Restart le tableau en nettoyant les case utiliser (commence depuis le base)
    clear() : void {
        for (let r = this.ligne - 1; r > 0; r--) {
            for (let c = 0; c < this.colonne; c++) {
                if(!this.table[r][c].isEmpty()){ // Si la case n'est pas vide

                    this.table[r][c].clearSelf();
                }
            }
        }
    }

    //Obtenir les informations sur le tableau

    // Obtenir le nombre de colone
    getColonne() : number {return this.colonne;}
    
    // Obtenir le nombre de ligne
    getLigne() : number {return this.ligne;}
}

export class Jeton {
    private equipe : Team | null = null;

    //Créer un jeton avec une équipe
    constructor(equipe : Team){
        this.equipe = equipe;
        
    }

    //Récupère l'équipe du jeton (Rouge ou Jaune)
    getTeam() : Team | null{
        return this.equipe;
    }
}

export class Cases {
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

export class Mechanique {

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
            if(this.myBoard.table[colone][i].isEmpty()){
                return i;
            }
        }
        return -1; //Si aucun case n'est disponible
    }

    dropJeton(colonne : number){
        // Choisir la colonne [X]
        // Vérifie la case.isEmpty = true la plus basse
        // Si oui, change l'état de cette case et rajoute le jeton
        // Si non, passe à la case au dessus
        // Si la case [X,0] .isEmpty = false alors la colonne est pleine et change l'état de cette colonne en isFull = true
        if()
    }

    isColumFull(colonne : number) : boolean{
        // Vérifie si une colonne est pleine
        // Si la case 0 est pleine , alors il renvoie true
        // Si non, alors il renvoie false
        if(!this.myBoard.table[colonne][0].isEmpty()) {
        
            return true;
        }
        return false;
    }

    fullBoard(){
        // Après la vérification des allignements
        // Si toute les colonnes sont full alors arrête le jeu et déclare l'égalité et lance le reset du jeu
    }

    teamVictory(){
        // Lance la vérification d'allignement
        // Retourne l'équipe qui a gagner
    }
}
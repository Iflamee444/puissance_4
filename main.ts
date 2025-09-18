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
 *     0   1   2   3   4   5   6   7
 * 0  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 1  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 2  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 3  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 4  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 5  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 * 6  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
 */

enum Team {
    RED,
    YELLOW
}

export class Main {

    private board: Board;

    constructor() {
        this.board = new Board();
    }

    // La boucle du jeu
    loop(): void {
        // 1. Afficher le plateau
        // 2. Gérer le tour du joueur
        // 3. Vérifier victoire / égalité
        // 4. Passer au joueur suivant
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
    private table: Cases[][] = []; //Le tableau de case vide

    // Générer la table vide
    constructor() {
        for (let r = 0; r < this.ligne; r++) {
            this.table[r] = [];
            for (let c = 0; c < this.colonne; c++) {
                this.table[r][c] = new Cases(c,r); //Création d'une case vide et lui donne ses coordonnées
            }
        }
    }

    // Restart le tableau en nettoyant les case utiliser (commence depuis le base)
    clear() : void {
        for (let r = this.ligne; r > 0; r--) {
            this.table[r] = [];
            for (let c = 0; c < this.colonne; c++) {
                if(!this.table[r][c].isEmpty()){ // Si la case n'est pas vide

                    this.table[r][c].clearSelf();
                }
            }
        }
    }
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
        this.estVide = !this.isEmpty;
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
    // Drop les jetons
    // Vérifier si une colonne est pleine
    // Arrête le jeu si plein
    // Vérification d'allignement (plus tard)

    dropJeton(){
        // Choisir la colonne [X]
        // Vérifie la case.isEmpty = true la plus basse
        // Si oui, change l'état de cette case et rajoute le jeton
        // Si non, passe à la case au dessus
        // Si la case [X,0] .isEmpty = false alors la colonne est pleine et change l'état de cette colonne en isFull = true
    }

    isColumFull(){
        // Vérifie si une colonne est pleine
        // Si oui, alors il renvoie true
        // Si non, alors il renvoie false
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
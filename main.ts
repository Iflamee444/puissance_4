/*
* Projet : Puissance 4
* par Marius RAVELOSON
* 
* début projet : 18/09/2025
*/

/**
 * Ce qu'il faut build :
 * - Le tableau
 * - Les jetons (Cases vide, jeton)
 * - Les équipes
 * - Les scores
 * - Le reset
 */

enum Team {
    RED,
    YELLOW
}



export class Main {

    private board: Board;

    constructor() {
        this.board = new Board();
        this.board.setup();
    }

    // La boucle du jeu
    loop(): void {
        // 1. Afficher le plateau
        // 2. Gérer le tour du joueur
        // 3. Vérifier victoire / égalité
        // 4. Passer au joueur suivant
    }

}

export class Jeton {
    private equipe : Team | null = null;
    private x : number | null = null;
    private y : number | null = null;

    constructor(equipe : Team){
        this.equipe = equipe;
    }
}

export class Cases {
    public holder : Jeton | null = null;
    private isEmpty : boolean = true;

    //Change l'état de la case
    changeState() : void {
        this.isEmpty = !this.isEmpty;
    }

    //Récupère les informations du jeton dans la case
    getJetonTeam() : Team | null{
        return this.holder ? this.holder['equipe'] : null;
    }

}

export class Board {
    private row: number = 6; // les lignes
    private column: number = 7; // les colonnes
    private table: Cases[][] = [];

    // Générer la table vide
    setup(): void {
        for (let r = 0; r < this.row; r++) {
            this.table[r] = [];
            for (let c = 0; c < this.column; c++) {
                this.table[r][c] = new Cases();
            }
        }
    }
}
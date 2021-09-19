import { Injectable } from "@angular/core";
import { Tactic } from "./Tactic";


@Injectable({
    providedIn: 'root'
})
export class TacticTable {
    public tacticTable: any = {};
    constructor() {

        this.tacticTable[Tactic.quickly] = {};
        this.tacticTable[Tactic.forcefully] = {};
        this.tacticTable[Tactic.consistently] = {};
        this.tacticTable[Tactic.indirectly] = {};
        this.tacticTable[Tactic.precisely] = {};
        //                        L (GM)         R(PC)        
        this.tacticTable[Tactic.quickly][Tactic.quickly] = 0;
        this.tacticTable[Tactic.quickly][Tactic.forcefully] = -1;
        this.tacticTable[Tactic.quickly][Tactic.consistently] = 2;
        this.tacticTable[Tactic.quickly][Tactic.indirectly] = 1;
        this.tacticTable[Tactic.quickly][Tactic.precisely] = -2;

        this.tacticTable[Tactic.forcefully][Tactic.quickly] = 1;
        this.tacticTable[Tactic.forcefully][Tactic.forcefully] = 0;
        this.tacticTable[Tactic.forcefully][Tactic.consistently] = -1;
        this.tacticTable[Tactic.forcefully][Tactic.indirectly] = -2;
        this.tacticTable[Tactic.forcefully][Tactic.precisely] = 2;

        this.tacticTable[Tactic.consistently][Tactic.quickly] = -2;
        this.tacticTable[Tactic.consistently][Tactic.forcefully] = 1;
        this.tacticTable[Tactic.consistently][Tactic.consistently] = 0;
        this.tacticTable[Tactic.consistently][Tactic.indirectly] = 2;
        this.tacticTable[Tactic.consistently][Tactic.precisely] = -1;

        this.tacticTable[Tactic.indirectly][Tactic.quickly] = -1;
        this.tacticTable[Tactic.indirectly][Tactic.forcefully] = 2;
        this.tacticTable[Tactic.indirectly][Tactic.consistently] = -2;
        this.tacticTable[Tactic.indirectly][Tactic.indirectly] = 0;
        this.tacticTable[Tactic.indirectly][Tactic.precisely] = 1;

        this.tacticTable[Tactic.precisely][Tactic.quickly] = 2;
        this.tacticTable[Tactic.precisely][Tactic.forcefully] = -2;
        this.tacticTable[Tactic.precisely][Tactic.consistently] = 1;
        this.tacticTable[Tactic.precisely][Tactic.indirectly] = -1;
        this.tacticTable[Tactic.precisely][Tactic.precisely] = 0;
        console.log(this.tacticTable);
    }

    public getModification(pc: Tactic, gm: Tactic): number {
        console.log("modification: " + this.tacticTable[pc][gm]);
        return this.tacticTable[pc][gm];
    }
}

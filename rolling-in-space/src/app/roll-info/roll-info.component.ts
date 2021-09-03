import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roll-info',
  templateUrl: './roll-info.component.html',
  styleUrls: ['./roll-info.component.css']
})
export class RollInfoComponent implements OnInit {

  currentRoll : number;

  constructor() { 
    this.currentRoll = -1;
  }

  ngOnInit(): void {
  }

  rollDie() {
    this.currentRoll = Math.floor(Math.random() * 6) + 1;
  }

}

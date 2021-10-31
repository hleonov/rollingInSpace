import {Injectable}      from '@angular/core'
import { BehaviorSubject, Observable, Subject } from "rxjs"; 

@Injectable({providedIn: 'root'})
export class CharChangeService {
    
  private _charChangeSubject : Subject<CharChangeDto> = new Subject();

  charChanged$ = this._charChangeSubject.asObservable();

  changeChar(dto : CharChangeDto) {
      this._charChangeSubject.next(dto)
  }
}

export interface CharChangeDto {
    boxIndex: number
    name: string
}
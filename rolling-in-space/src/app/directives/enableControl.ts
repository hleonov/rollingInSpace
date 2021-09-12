import { Directive, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[formEnabledControl]'
})
export class EnabledControlDirective {

    @Input('enableControl') set enabledControl(condition: boolean) {
        if (this.ngControl) {
            const action = condition ? 'enable' : 'disable';
            if (this.ngControl.control) {
                this.ngControl.control[action]();
            }
        }
  }
  constructor(private ngControl : NgControl ) {
  }
}
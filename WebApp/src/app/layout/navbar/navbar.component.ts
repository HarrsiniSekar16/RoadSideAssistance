import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title : any;
  @Input() rightBtn : any;
  @Input() leftBtn : any;
  @Input() btnDisabled : boolean;
  @Output() eventEmit = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  //emit
  emit(x: string){
    this.eventEmit.emit(x);
  }
}

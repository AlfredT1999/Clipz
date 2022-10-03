import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { IsActiveMatchOptions } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  /* These lines are substituted for the async template in the 
    nav.components.html file */
  // isAuthenticated: boolean = false; -- substituted

  readonly myMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored', 
    matrixParams: 'exact', 
    paths: 'exact', 
    fragment: 'exact',
 };

  constructor(
    public modal: ModalService, 
    public auth: AuthService
  ) {
    //this.auth.isAuthenticated$.subscribe(status => {
    //  this.isAuthenticated  = status; -- substituted
    //}); 
  }

  ngOnInit(): void {
  }

  openModal($event: Event) {
    /*
    * This function is called from an anchor HTML tag <a></a> 
    * The natural behaviour of an anchor tag is to redirect the user
    * So this is why we need to call a preventDefault function 
    * Instead of calling modal.toggleModal() service function directly
    * from the anchor tag.    
    */
    $event.preventDefault();

    this.modal.toggleModal('auth');
  }
}

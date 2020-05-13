import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-lout-header',
  templateUrl: './lout-header.component.html',
  styleUrls: ['./lout-header.component.scss']
})
export class LoutHeaderComponent implements OnInit {

  logueado = false;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.logueado.subscribe((val) => 
      this.logueado = val
      );
  }

  logout() {
    this.authService.logout();
  }

}

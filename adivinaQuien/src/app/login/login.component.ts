import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
     this.route.queryParams.subscribe((params) => {
       if(params.code){
         this.authService.googleLogin(params).subscribe((data) => {
           if(this.authService.isLoggedIn()){
              this.router.navigateByUrl('profile');
           }
         })
       }
     });
  }

  //validar existencia token para redirect a profile. Usar funcion de linea 18 a 22.

  //Registro y login de usuarios sin passport, preguntar al profe.

  submit(form: NgForm){
    console.log(form.value.nombre, form.value.password);
    this.authService.login(form.value.nombre, form.value.password)
        .subscribe((data)=> console.log(data), (err)=> console.log(err))
  }

}

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
     if(this.authService.isLoggedIn()){
      this.router.navigateByUrl('profile');
    }
  }

  //Registro y login de usuarios sin passport, preguntar al profe.

  submit(form: NgForm){
    console.log(form.value.email, form.value.password);
    this.authService.login(form.value.email, form.value.password)
        .subscribe((data)=> 
        {
          if(this.authService.isLoggedIn()){
            this.router.navigateByUrl('profile');
        }
        })
}

register(form: NgForm){
  console.log(form.value.email, form.value.password, form.value.username);
  this.authService.register(form.value.email, form.value.password, form.value.username)
      .subscribe((data)=> 
      {
        if(this.authService.isLoggedIn()){
          this.router.navigateByUrl('profile');
      }
      })
}


}

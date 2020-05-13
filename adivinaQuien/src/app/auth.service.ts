import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  token="";
  logueado = new BehaviorSubject<boolean>(false);



  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token:string){
    localStorage.setItem('token', token);
    this.token = token;
  }

  public isLoggedIn ():boolean {
    const tokenData = this.getTokenData();
    console.log(tokenData);
    if(tokenData) {
      let resp = tokenData.exp > Date.now() /1000;
      console.log(this.logueado);
      this.logueado.next(true);
      return resp;
    }else{
      this.logueado.next(false);
      return false;
    }
  }

  public login(email: string, password: string): Observable<any> {
    console.log("entra a login");
    console.log(email, password);
    return this.http
                    .post('/api/login', {email, password})
                    .pipe(
                      map((data:any)=> {
                        if(data.token){
                          console.log('guardando token');
                          this.saveToken(data.token);
                          this.isLoggedIn();
                        }
                        return data;
                      })
                    );
  }

  public register(email: string, password: string, nombre: string): Observable<any> {
    console.log("entra a login");
    console.log(email, password, nombre);
    return this.http
                    .post('/api/login', {email, password, nombre})
                    .pipe(
                      map((data:any)=> {
                        if(data.token){
                          console.log('guardando token');
                          this.saveToken(data.token);
                          this.isLoggedIn();
                        }
                        return data;
                      })
                    );
  }

  

  public logout() {
    this.token='';
    window.localStorage.removeItem('token');
    this.router.navigateByUrl('/');
    this.logueado.next(false);
  }

  public getTokenData () {
    let payload;
    this.token = localStorage.getItem('token');
    if(this.token){
      payload = this.token.split('.')[1]; //obtiene el payload splieando la segunda parte del token
      payload = window.atob(payload); //obtiene la informacion embebida en el payload
      return JSON.parse(payload);
    }else{
      return null;
    }
  }

  public googleLogin(params){
    return this.http.get('/api/google/redirect',{params})
    .pipe(
      map((data:any)=> {
        if(data.token){
          this.saveToken(data.token);
          this.isLoggedIn();
        }
        return data;
      })
    )
  }
}

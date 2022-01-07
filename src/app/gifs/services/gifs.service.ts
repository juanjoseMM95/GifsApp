import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey : string = "UI67gQlviyDoxzNcrj8BCq3ZzjyF57Y4"
  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  //
  public resultados: Gif[] = [];

  constructor(private http: HttpClient){
    //1forma
    if(localStorage.getItem('imgResult')){
      this.resultados = JSON.parse( localStorage.getItem('imgResult')!)
    }

    //2forma
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
  }
  
  get historial(){
    //romper la referencia, lo vuelve por valor
    return [...this._historial];
  }

  buscarGifs( query: string = ''){
    
    query = query.trim().toLowerCase();

    if( !this._historial.includes(query) )
    {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
      localStorage.setItem('historial',JSON.stringify(this._historial));
    }  

    const params =new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q',query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params:params})
    .subscribe( (resp) => {
      this.resultados = resp.data;
      localStorage.setItem('imgResult',JSON.stringify(this.resultados));
    })
  }

}


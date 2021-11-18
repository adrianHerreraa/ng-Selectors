import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisesSmallInterface, PaisFullInterface } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesServiceService {
  
  private _baseUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) {}

  getPaisesPorRegion( region: string ): Observable<PaisesSmallInterface[]>{
    const url: string = `${this._baseUrl}/region/${region}?fields=cca3,name`
    return this.http.get<PaisesSmallInterface[]>(url);
  }

  getPaisPorCc3( codigo: string ): Observable<PaisFullInterface[] | []>{

    if(!codigo){
      return of([]);
    }

    const url: string = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<PaisFullInterface[]>(url);
  }

  getPaisPorCcn3Small( codigo: string ): Observable<PaisesSmallInterface>{
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<PaisesSmallInterface>(url);
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisesSmallInterface[]> {

    if( !borders ){
      return of([]);
    }

    const peticiones: Observable<PaisesSmallInterface>[] = [];
    
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCcn3Small(codigo);
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );

  }

}

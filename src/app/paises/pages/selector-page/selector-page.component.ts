import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisesSmallInterface, PaisFullInterface } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    lblRegion: ['', Validators.required],
    lblPais: ['', Validators.required],
    lblFronteras: ['', Validators.required],
  });

  regiones: string[] = [];
  paises: PaisesSmallInterface[] = [];
  fronteras: string[] = [];
  // fronteras: PaisesSmallInterface[] = [];

  cargando: boolean = false;

  constructor( 
    private fb: FormBuilder,
    private pService: PaisesServiceService,
  ) { }

  ngOnInit(): void {
    this.regiones = this.pService.regiones;

    // Cuando cambia la región
    this.miFormulario.get('lblRegion')?.valueChanges
      .pipe(
        tap( 
          (_) => {
            this.miFormulario.get('lblPais')?.reset('');
            this.cargando = true;
            // this.miFormulario.get('lblFronteras')?.disable();
          }
        ),
        switchMap(
          (region) => this.pService.getPaisesPorRegion(region),
        ),
      )
      .subscribe(
        (paises) => {
          this.paises = paises;
          this.cargando = false;
        }
      );

      // Cuando cambia el país
      this.miFormulario.get('lblPais')?.valueChanges
        .pipe(
          tap(
            (_) => {
              this.miFormulario.get('lblFronteras')?.reset('');
              this.cargando = true;
              // this.miFormulario.get('lblFronteras')?.enable();
            }
          ),
          switchMap(
            (cc3) => this.pService.getPaisPorCc3(cc3),
          ),
          // switchMap(
          //   (pais) => this.pService.getPaisesPorCodigos( pais[0].borders! )
          // ),
        ).subscribe(
          (pais) => {

            if(pais.length > 0){
              this.fronteras = pais[0].borders;
              this.cargando = false;
            }

          }
        );

    /*this.miFormulario.get('lblRegion')?.valueChanges
      .subscribe(
        (region) => {
          
          this.pService.getPaisesPorRegion(region)
            .subscribe(
              ( paises ) => {
                console.log(paises);
                this.paises = paises;
              },
              (err) => {
                console.log(err);
              },
            );

        }
      );*/
  }

  onSave(){
    console.log(this.miFormulario.value);
  }

}

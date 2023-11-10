import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'calculadora';
  negativo: boolean;
  vistaTotal: boolean;
  nuevoNumero: boolean;
  numeros: string[];
  resultado: string | null;

  
  constructor() {
    this.numeros = [];
    this.resultado = '';
    this.negativo = false;
    this.vistaTotal = false;
    this.nuevoNumero = true;
  }


  

  limpiar(): void {
    this.numeros = [];
    this.resultado = null;
  }

  agregarNumero(numero: number): void {
    if (this.vistaTotal) {
      this.numeros = [];
      this.vistaTotal = false;
    }
    if (this.negativo) {
      numero = numero * -1;
      this.negativo = false;
    }
    if (this.resultado === null || this.resultado === '' || this.nuevoNumero) {
      this.resultado = numero.toString();
      this.nuevoNumero = false;
    }else{
      this.resultado = this.resultado?.toString() + numero.toString();
    }
  }

  agregarOperacion(operacion: string): void {
      if (this.resultado !== null && this.resultado !== '' && operacion !== '=') {
        if (this.vistaTotal === false) {
          this.numeros.push(this.resultado?.toString() as string);
        }else{
          this.numeros = [];
          this.vistaTotal = false;
          this.numeros.push(this.resultado?.toString() as string);
        }
        this.resultado = '';
        if (operacion.length > 0) {
          this.numeros.push(operacion);
        }
        this.valorActual().then((valor) => {
          if (typeof valor === 'number') {
            this.resultado = valor.toString();
          } else {
            this.resultado = '';
          }
        });
        if (operacion === '=') {
          this.vistaTotal = true;
        }
      }else{
        if (operacion === '-'){
          this.negativo = true;
        }
        if (operacion === '='){
          if (this.vistaTotal === false && this.resultado !== null && this.resultado !== '') {
            this.numeros.push(this.resultado?.toString() as string);
          }
          this.valorActual().then((valor) => {
            if (typeof valor === 'number') {
              this.resultado = valor.toString();
            } else {
              this.resultado = '';
            }
          });
          this.vistaTotal = true;
        }
      }
      this.nuevoNumero = true;
  }

  valorActual(){
    return new Promise((resolve, reject) => {
      let valorTotal = 0;
      let operacion = '';
      let index = 0;
      
      const ejecutar = () => {
        let element = this.numeros[index];

        if (index < this.numeros.length) {
          // Validar si es un numero
          if (!isNaN(Number(element))) {
            if (operacion === '') {
              if (index === 0) {
                valorTotal = Number(element);
              }else{
                this.limpiar();
                resolve('');
                return;
              }
            }else{
              switch (operacion) {
                case '+':
                  valorTotal = valorTotal + Number(element);
                  break;
                case '-':
                  valorTotal = valorTotal - Number(element);
                  break;
                case '*':
                  valorTotal = valorTotal * Number(element);
                  break;
                case '/':
                  valorTotal = valorTotal / Number(element);
                  break;
                default:
                  break;
              }
              operacion = '';
            }
          }else{
            operacion = element;
          }
          index++;
          ejecutar();
        }else{
          resolve(valorTotal);
        }
      };
      ejecutar();
    });
  }

  calcular(): void {
    this.agregarOperacion('=');
  }
  


}

import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { validateRut } from '@fdograph/rut-utilities';
import * as moment from 'moment';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {

  //variable del group: 

  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required,
                              Validators.pattern('[0-9]{1,2}[0-9]{3}[0-9]{3}-[0-9kK]')]),
    nombre: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required,
                                Validators.pattern('[a-zA-Z]+@+(duocuc.cl)]')]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
    clave2: new FormControl('', [Validators.required])
  });

  usuarios: any[] = [];
  KEY: string = 'usuarios';

  constructor(private usuStorage:StorageService) { }

  ngOnInit() {
  }


  async registrar(){
      let fechastring = this.usuario.value.fecha_nacimiento||"";
      let fechaOk = moment(fechastring, "YYYY-MM-DD").toDate();
      if(this.usuStorage.validarEdad(fechaOk)){
        if(validateRut(this.usuario.value.rut||"")){
          var resp:boolean = await this.usuStorage.agregar(this.usuario.value, this.KEY);
          if(resp){
            alert("Usuario agregado!");
            
          }else{
            alert("NO SE GUARDÓ!")
          }
        }
      }
  }

  contraIguale(){
    let pass1 = this.usuario.value.clave||"";
    let pass2 = this.usuario.value.clave2||"";
    if(pass1 == pass2 ){
      this.registrar();
    }else{
      alert("Las contraseñas deben ser iguales!!")
    }

    
  }

}

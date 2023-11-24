import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { validateRut } from '@fdograph/rut-utilities';
import * as moment from 'moment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  //Creamos variables tipo Form Group con validadores
  usuario = new FormGroup({
    rut : new FormControl('', [Validators.required,
                               Validators.pattern('[0-9]{1,2}[0-9]{3}[0-9]{3}-[0-9kK]')]),
    nombre : new FormControl('', [Validators.required,
                                 Validators.minLength(3)]),
    fecha_nac : new FormControl('',Validators.required),
    correo : new FormControl('', [Validators.email, 
                                Validators.required,
                                Validators.pattern('[a-zA-Z]+@+(duocuc.cl||duoc.cl||profesor.duoc.cl)')]),
    clave : new FormControl('', [Validators.required,
                                  Validators.minLength(6),
                                  Validators.maxLength(20),
                                  ]),
    clave2 : new FormControl('', [Validators.required,
                                    Validators.minLength(6),
                                    Validators.maxLength(20),
                                    ]),
    perfil : new FormControl(''),
    
  });

  usuarios: any[] = [];
  KEY: string = 'usuarios';

  boton_registrar: boolean = false;
  boton_modificar: boolean = true;


  constructor(private usuStorage: StorageService, private router : Router) { }

  async ngOnInit() {
    await this.listar(); 
  }

  async listar(){
    this.usuarios = await this.usuStorage.listar(this.KEY);
  }

  async registrar(){
    let fechastring = this.usuario.value.fecha_nac||"";
    let fechaOk = moment(fechastring, "YYYY-MM-DD").toDate();
    if(this.usuStorage.validarEdad(fechaOk)){
      if(validateRut(this.usuario.value.rut||"")){
        var resp:boolean = await this.usuStorage.agregar(this.usuario.value, this.KEY);
        if(resp){
          alert("Usuario agregado!");
          await this.listar();
        }else{
          alert("NO SE GUARDÓ!")
        }
      }else{
        alert('rut no valido')
      }
    }else{
      alert('edad no valida')
    }
 
  }
  
  async eliminar(rutEliminar: string){
    await this.usuStorage.eliminar(rutEliminar, this.KEY);
    await this.listar();
    alert("Usuario eliminado!");
  }

  async buscar(rutBuscar: string){
    var usuarioEncontrado: any = await this.usuStorage.buscar(rutBuscar, this.KEY);
    this.usuario.setValue(usuarioEncontrado);
    this.boton_modificar = false;
    this.boton_registrar = true;
    //Bloqueamos el rut al buscar por nombre de usuario
    document.getElementById("rut")?.setAttribute("disabled","true");
  }

  async actualizar(){
    var resp: boolean = await this.usuStorage.actualizar(this.usuario.value, this.KEY);
    if(resp){
      alert("Usuario modificado!");
      await this.listar();
    }else{
      alert("USUARIO NO EXISTE!");
    }
    document.getElementById("rut")?.removeAttribute("disabled");
    this.boton_modificar = true;
    this.boton_registrar = false;
  }

  public limpiar(){
    document.getElementById("rut")?.setAttribute("disabled","false");
    this.boton_modificar = true;
    this.boton_registrar = false;
  }


}








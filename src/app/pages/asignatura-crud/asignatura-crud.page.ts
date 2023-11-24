import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AsignaturasService } from 'src/app/services/asignaturas.service';

@Component({
  selector: 'app-asignatura-crud',
  templateUrl: './asignatura-crud.page.html',
  styleUrls: ['./asignatura-crud.page.scss'],
})

export class AsignaturaCrudPage implements OnInit {



  //Variables auxiliares
  codigo : string = "";
  nombre : string = "";
  rut_docente : string = "";
  KEY : string = "asignaturas"

  constructor(private asignaturasService : AsignaturasService,
              private toastController : ToastController) { }

  async ngOnInit() {
    await this.listar();
  }

  asignaturita = new FormGroup({
    codigo : new FormControl('', [Validators.required]),
    nombre : new FormControl('', [Validators.required]),
    rut_docente : new FormControl('', [Validators.required])
  })

  asignaturas : any[] = [];

  //Metodos
  async listar(){
    this.asignaturas = await this.asignaturasService.listar(this.KEY);
  }

  async guardar(){
    let resp : boolean = await this.asignaturasService.agregar(this.asignaturita.value, 
                                                              this.asignaturita.value.codigo||"", this.KEY);
    if(resp){
      this.alerta('bottom', 'Asignatura Registrada', 3000, 'success');
      await this.listar();
    }else{
      this.alerta('bottom', 'No se pudo registrar la Asignatura', 3000, 'danger');
    }
  }

  async eliminar(codigoEliminar: string){
    var resp: boolean = await this.asignaturasService.eliminar(codigoEliminar, this.KEY);
    if (resp) {
      await this.listar();
      this.alerta('bottom','Asignatura Eliminada',3000,'warning');
    }else{
      this.alerta('bottom','No se pudo eliminar la Asignatura',3000,'danger');
    }

  }

  async buscar(codigoBuscar: string){
    var asignaturaEncontrado: any = await this.asignaturasService.buscar(codigoBuscar, this.KEY);
    this.asignaturita.setValue(asignaturaEncontrado);
  }

  async modificar(){
    var resp: boolean = await this.asignaturasService.modificar(this.asignaturita.value, this.KEY);
    if(resp){
      this.alerta('bottom','Asignatura Modificada',3000,'success');
      await this.listar();
    }else{
      this.alerta('bottom','No existe la asignatura',3000,'danger');
    }
  }



  //Tostada
  async alerta(position: 'top' | 'middle' | 'bottom', 
                    message: string,
                    duration: number,
                    color: 'danger'|'success'|'warning') {
    const toast = await this.toastController.create({
      message,
      duration: duration,
      position: position,
      color: color
    });

    await toast.present();
  }
}


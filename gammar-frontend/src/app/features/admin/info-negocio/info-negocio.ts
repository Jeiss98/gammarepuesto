import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InfoNegocioService } from '../../../core/services/info-negocio.service';

@Component({
  selector: 'app-info-negocio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './info-negocio.html',
  styleUrl: './info-negocio.css'
})
export class InfoNegocio implements OnInit {
  form: FormGroup;
  cargando = false;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private infoSvc: InfoNegocioService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      whatsapp: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      horario_inicio_dia: ['', Validators.required],
      horario_fin_dia: ['', Validators.required],
      hora_apertura: ['', Validators.required],
      hora_cierre: ['', Validators.required],
      descripcion_hero: ['', Validators.required],
      mensaje_wa_default: ['', Validators.required],
      link_facebook: [''],
      link_instagram: [''],
      link_tiktok: [''],
      nosotros_historia: [''],
      nosotros_filosofia: ['']
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.infoSvc.adminGet().subscribe({
      next: (res) => {
        if (res) {
          this.form.patchValue(res);
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando info:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    
    this.guardando = true;
    this.infoSvc.adminUpdate(this.form.value).subscribe({
      next: (res) => {
        this.form.patchValue(res);
        this.guardando = false;
        this.snackBar.open('Configuración guardada correctamente', 'OK', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error guardando info:', err);
        this.guardando = false;
        this.snackBar.open('Error al guardar configuración', 'OK', { duration: 4000 });
        this.cdr.detectChanges();
      }
    });
  }
}

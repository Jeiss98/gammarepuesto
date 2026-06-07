import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ServicioService } from '../../../core/services/servicio.service';
import { Servicio } from '../../../core/models/servicio.model';

@Component({
  selector: 'app-servicio-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Servicio' : 'Nuevo Servicio' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion"></textarea>
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Ícono (Emoji)</mat-label>
            <input matInput formControlName="icono">
          </mat-form-field>
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Orden</mat-label>
            <input matInput type="number" formControlName="orden">
          </mat-form-field>
        </div>
        <div class="toggle-group">
          <mat-slide-toggle formControlName="activo">Activo</mat-slide-toggle>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="guardar()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; min-width: 300px; }
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }
    .toggle-group { margin-top: 0.5rem; }
  `]
})
export class ServicioDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ServicioDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Servicio | null
  ) {
    this.form = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      icono: [data?.icono || '🔧'],
      orden: [data?.orden || 0, Validators.required],
      activo: [data ? !!data.activo : true]
    });
  }

  guardar(): void {
    if (this.form.valid) {
      const val = this.form.value;
      val.activo = val.activo ? 1 : 0;
      this.dialogRef.close(val);
    }
  }
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit {
  servicios: Servicio[] = [];

  constructor(
    private servicioSvc: ServicioService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.servicioSvc.adminGetAll().subscribe({
      next: (res) => {
        this.servicios = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando servicios:', err)
    });
  }

  abrirDialogo(srv: Servicio | null = null): void {
    const dialogRef = this.dialog.open(ServicioDialog, {
      data: srv,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (srv) {
          this.servicioSvc.adminUpdate(srv.id, result).subscribe(() => this.cargar());
        } else {
          this.servicioSvc.adminCreate(result).subscribe(() => this.cargar());
        }
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.servicioSvc.adminDelete(id).subscribe(() => this.cargar());
    }
  }
}

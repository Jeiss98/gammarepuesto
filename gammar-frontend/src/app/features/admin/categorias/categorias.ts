import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-categoria-dialog',
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
    <h2 mat-dialog-title>{{ data ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
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
        <mat-form-field appearance="outline">
          <mat-label>Ícono (Emoji)</mat-label>
          <input matInput formControlName="icono">
        </mat-form-field>
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
    .toggle-group { margin-top: 0.5rem; }
  `]
})
export class CategoriaDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoriaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria | null
  ) {
    this.form = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || ''],
      icono: [data?.icono || '📦'],
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
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {
  categorias: Categoria[] = [];

  constructor(
    private categoriaSvc: CategoriaService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaSvc.adminGetAll().subscribe({
      next: (res) => {
        this.categorias = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  abrirDialogo(cat: Categoria | null = null): void {
    const dialogRef = this.dialog.open(CategoriaDialog, {
      data: cat,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (cat) {
          this.categoriaSvc.adminUpdate(cat.id, result).subscribe(() => this.cargar());
        } else {
          this.categoriaSvc.adminCreate(result).subscribe(() => this.cargar());
        }
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriaSvc.adminDelete(id).subscribe(() => this.cargar());
    }
  }
}

import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Producto } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre">
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="categoria_id">
              <mat-option *ngFor="let cat of categorias" [value]="cat.id">{{cat.nombre}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Precio (COP)</mat-label>
            <input matInput type="number" formControlName="precio">
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Stock</mat-label>
            <input matInput type="number" formControlName="stock">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Marca</mat-label>
            <input matInput formControlName="marca">
          </mat-form-field>
        </div>

        <!-- Imagen Upload -->
        <div class="file-upload-container">
          <label>Imagen del Producto</label>
          <div class="upload-area" (click)="fileInput.click()">
            <mat-icon>cloud_upload</mat-icon>
            <span>{{ selectedFileName || 'Haz clic para seleccionar una imagen' }}</span>
          </div>
          <input type="file" #fileInput hidden accept="image/*" (change)="onFileSelected($event)">
          <img *ngIf="previewUrl" [src]="previewUrl" class="image-preview">
        </div>

        <div class="toggles">
          <mat-slide-toggle formControlName="activo">Activo</mat-slide-toggle>
          <mat-slide-toggle formControlName="es_oferta">Es Oferta</mat-slide-toggle>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="guardar()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; min-width: 400px; max-width: 600px; }
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }
    .toggles { display: flex; gap: 2rem; margin-top: 1rem; }
    .file-upload-container { display: flex; flex-direction: column; gap: 0.5rem; }
    .file-upload-container label { font-size: 0.875rem; color: #64748b; font-weight: 500; }
    .upload-area { border: 2px dashed #cbd5e1; border-radius: 8px; padding: 2rem; text-align: center; cursor: pointer; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; transition: background 0.2s; }
    .upload-area:hover { background: #f8fafc; border-color: #94a3b8; }
    .image-preview { max-width: 150px; border-radius: 8px; margin-top: 1rem; align-self: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  `]
})
export class ProductoDialog implements OnInit {
  form: FormGroup;
  categorias: Categoria[] = [];
  selectedFile: File | null = null;
  selectedFileName = '';
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriaSvc: CategoriaService,
    public dialogRef: MatDialogRef<ProductoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Producto | null
  ) {
    this.form = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      categoria_id: [data?.categoria_id || null, Validators.required],
      descripcion: [data?.descripcion || ''],
      precio: [data?.precio || 0, [Validators.required, Validators.min(0)]],
      marca: [data?.marca || ''],
      stock: [data?.stock || 0, [Validators.required, Validators.min(0)]],
      activo: [data ? !!data.activo : true],
      es_oferta: [data ? !!data.es_oferta : false]
    });
    if (data?.imagen) {
      this.previewUrl = data.imagen;
    }
  }

  ngOnInit(): void {
    this.categoriaSvc.adminGetAll().subscribe(res => this.categorias = res);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl = e.target?.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  guardar(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const formData = new FormData();
      
      Object.keys(formValue).forEach(key => {
        let value = formValue[key];
        if (typeof value === 'boolean') value = value ? 1 : 0;
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      this.dialogRef.close(formData);
    }
  }
}

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-producto-gallery-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Galería: {{ data.nombre }}</h2>
    <mat-dialog-content>
      <div class="gallery-container">
        <!-- Subir archivos -->
        <div class="upload-area" (click)="fileInput.click()">
          <mat-icon>add_photo_alternate</mat-icon>
          <span>Haz clic aquí para subir imágenes</span>
          <input type="file" #fileInput hidden multiple accept="image/*" (change)="onFilesSelected($event)">
        </div>
        
        <mat-spinner *ngIf="uploading" diameter="30" style="margin: 0 auto;"></mat-spinner>

        <!-- Lista de fotos -->
        <div class="fotos-grid" *ngIf="fotos && fotos.length > 0">
          <div class="foto-card" *ngFor="let foto of fotos">
            <img [src]="foto.ruta" [alt]="foto.nombre_original">
            <button mat-icon-button color="warn" class="delete-btn" (click)="eliminarFoto(foto.id)" [disabled]="deleting === foto.id">
              <mat-icon *ngIf="deleting !== foto.id">delete</mat-icon>
              <mat-spinner *ngIf="deleting === foto.id" diameter="20"></mat-spinner>
            </button>
          </div>
        </div>
        <div *ngIf="fotos?.length === 0 && !uploading" class="empty-state">
          No hay fotos adicionales en la galería.
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .gallery-container { display: flex; flex-direction: column; gap: 1.5rem; min-width: 500px; min-height: 300px; padding-top: 1rem; }
    .upload-area { border: 2px dashed #ccc; border-radius: 8px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; color: #555; }
    .upload-area:hover { background: #f9f9f9; border-color: #999; }
    .upload-area mat-icon { font-size: 40px; width: 40px; height: 40px; margin-bottom: 10px; color: #888; }
    .fotos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; }
    .foto-card { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid #eee; background: #f4f4f4; }
    .foto-card img { width: 100%; height: 100%; object-fit: contain; }
    .delete-btn { position: absolute; top: 4px; right: 4px; background: rgba(255,255,255,0.9); width: 32px; height: 32px; line-height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;}
    .delete-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .empty-state { text-align: center; color: #888; padding: 2rem; }
  `]
})
export class ProductGalleryDialog implements OnInit {
  fotos: any[] = [];
  uploading = false;
  deleting: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProductGalleryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private productoSvc: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarFotos();
  }

  cargarFotos() {
    this.productoSvc.getBySlug(this.data.slug).subscribe(p => {
      this.fotos = p.fotos || [];
      this.cdr.detectChanges();
    });
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.uploading = true;
      this.productoSvc.uploadFotos(this.data.id, files).subscribe({
        next: (res) => {
          this.fotos = [...this.fotos, ...res.fotos];
          this.uploading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.uploading = false;
          alert('Error al subir fotos');
        }
      });
    }
    event.target.value = '';
  }

  eliminarFoto(fotoId: number) {
    if (confirm('¿Seguro que deseas eliminar esta foto?')) {
      this.deleting = fotoId;
      this.productoSvc.deleteFoto(this.data.id, fotoId).subscribe({
        next: () => {
          this.fotos = this.fotos.filter(f => f.id !== fotoId);
          this.deleting = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.deleting = null;
          alert('Error al eliminar foto');
          this.cdr.detectChanges();
        }
      });
    }
  }
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  columnas: string[] = ['imagen', 'nombre', 'categoria', 'precio', 'stock', 'estado', 'acciones'];

  constructor(
    private productoSvc: ProductoService, 
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.productoSvc.adminGetAll().subscribe({
      next: (res) => {
        this.productos = res;
        this.cdr.detectChanges();
        console.log('Productos cargados:', res.length);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
      }
    });
  }

  abrirDialogo(prod: Producto | null = null): void {
    const dialogRef = this.dialog.open(ProductoDialog, {
      data: prod,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (prod) {
          this.productoSvc.adminUpdate(prod.id, result).subscribe(() => this.cargar());
        } else {
          this.productoSvc.adminCreate(result).subscribe(() => this.cargar());
        }
      }
    });
  }

  abrirGaleria(producto: Producto): void {
    this.dialog.open(ProductGalleryDialog, {
      width: '700px',
      data: producto
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoSvc.adminDelete(id).subscribe(() => this.cargar());
    }
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
  }
}

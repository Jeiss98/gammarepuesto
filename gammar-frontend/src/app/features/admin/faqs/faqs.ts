import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FaqService } from '../../../core/services/faq.service';
import { Faq } from '../../../core/models/faq.model';

@Component({
  selector: 'app-admin-faqs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './faqs.html',
  styleUrl: './faqs.css'
})
export class AdminFaqs implements OnInit {
  faqs: Faq[] = [];
  cargando = true;
  form: FormGroup;
  editando: Faq | null = null;
  mostrarForm = false;

  columnas: string[] = ['orden', 'pregunta', 'respuesta', 'acciones'];

  constructor(
    private faqSvc: FaqService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required],
      orden: [1, Validators.required],
      activo: [1]
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.faqSvc.getAllAdmin().subscribe({
      next: (res) => {
        this.faqs = res;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = null;
    const maxOrden = this.faqs.length > 0 ? Math.max(...this.faqs.map(f => f.orden)) : 0;
    this.form.reset({ orden: maxOrden + 1, activo: 1 });
    this.mostrarForm = true;
  }

  editar(faq: Faq): void {
    this.editando = faq;
    this.form.patchValue(faq);
    this.mostrarForm = true;
  }

  cancelar(): void {
    this.mostrarForm = false;
    this.editando = null;
  }

  guardar(): void {
    if (this.form.invalid) return;

    const req = this.editando 
      ? this.faqSvc.update(this.editando.id, this.form.value)
      : this.faqSvc.create(this.form.value);

    req.subscribe({
      next: () => {
        this.snackBar.open('FAQ guardada exitosamente', 'OK', { duration: 3000 });
        this.mostrarForm = false;
        this.cargar();
      },
      error: () => {
        this.snackBar.open('Error al guardar FAQ', 'OK', { duration: 3000 });
      }
    });
  }

  eliminar(faq: Faq): void {
    if (confirm(`¿Estás seguro de eliminar la pregunta "${faq.pregunta}"?`)) {
      this.faqSvc.delete(faq.id).subscribe({
        next: () => {
          this.snackBar.open('FAQ eliminada', 'OK', { duration: 3000 });
          this.cargar();
        }
      });
    }
  }
}

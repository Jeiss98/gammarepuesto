import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, switchMap, takeUntil, forkJoin } from 'rxjs';
import { ProductoService } from '../../../core/services/producto.service';
import { InfoNegocioService } from '../../../core/services/info-negocio.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { Producto } from '../../../core/models/producto.model';
import { InfoNegocio } from '../../../core/models/info-negocio.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css'
})
export class ProductoDetalle implements OnInit, OnDestroy {
  producto: Producto | null = null;
  info: InfoNegocio | null = null;
  categorias: any[] = [];
  servicios: any[] = [];
  cargando = true;
  error = '';
  imagenPrincipal = '';
  currentYear = new Date().getFullYear();

  // ✅ Cancelar suscripciones al destruir (evita memory leaks al navegar entre productos)
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoSvc: ProductoService,
    private infoSvc: InfoNegocioService,
    private categoriaSvc: CategoriaService,
    private servicioSvc: ServicioService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // ✅ switchMap cancela la petición anterior si el slug cambia antes de que responda
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) throw new Error('Sin slug');
        this.cargando = true;
        this.error = '';
        return forkJoin({
          producto: this.productoSvc.getBySlug(slug),
          info: this.infoSvc.get(),
          categorias: this.categoriaSvc.getAll(),
          servicios: this.servicioSvc.getAll()
        });
      })
    ).subscribe({
      next: ({ producto, info, categorias, servicios }) => {
        this.producto = producto;
        this.info = info;
        this.categorias = categorias.filter(c => c.activo);
        this.servicios = servicios.filter(s => s.activo);
        this.imagenPrincipal = producto.imagen || '';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar el producto. Intenta de nuevo.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  setImagen(url: string): void {
    this.imagenPrincipal = url;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
  }

  comprarWhatsapp(): void {
    if (!this.info || !this.producto) return;
    const msg = encodeURIComponent(`Hola, me interesa el producto: ${this.producto.nombre} (${this.formatPrecio(this.producto.precio)}).`);
    window.open(`https://wa.me/57${this.info.whatsapp}?text=${msg}`, '_blank');
  }

  filtrarPor(slug: string): void {
    this.router.navigate(['/'], { fragment: 'catalogo', queryParams: { cat: slug } });
  }

  volver(): void {
    this.location.back();
  }
}
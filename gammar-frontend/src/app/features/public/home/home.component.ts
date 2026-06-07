import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil, catchError, of } from 'rxjs';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { InfoNegocioService } from '../../../core/services/info-negocio.service';
import { Producto } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Servicio } from '../../../core/models/servicio.model';
import { InfoNegocio } from '../../../core/models/info-negocio.model';

const INFO_DEFAULT: InfoNegocio = {
    id: 0,
    nombre: 'Gama Repuestos Quibdó',
    whatsapp: '3113147815',
    descripcion_hero: 'No competimos, servimos.',
    mensaje_wa_default: 'Hola, me interesa un repuesto',
    direccion: 'Quibdó, Chocó',
    telefono: '3106109325',
    email: 'mimare0892@hotmail.com',
    horario_inicio_dia: 'Lunes',
    horario_fin_dia: 'Sábado',
    hora_apertura: '8:00',
    hora_cierre: '18:00',
    link_facebook: '',
    link_instagram: '',
    link_tiktok: ''
};

// Emojis de placeholder para el hero cuando no hay imágenes
const HERO_ICONS = ['⚙️', '🔧', '🔩', '⛽'];

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
    productos: Producto[] = [];
    categorias: Categoria[] = [];
    servicios: Servicio[] = [];
    info: InfoNegocio = { ...INFO_DEFAULT };
    categoriaActiva = 'todas';
    busqueda = '';
    cargandoProductos = true;
    errorCarga = false;
    currentYear = new Date().getFullYear();

    heroSlideActivo = 0;
    heroSlidePrev = -1;
    carouselInterval: any;

    private destroy$ = new Subject<void>();

    constructor(
        private productoSvc: ProductoService,
        private categoriaSvc: CategoriaService,
        private servicioSvc: ServicioService,
        private infoSvc: InfoNegocioService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        forkJoin({
            info: this.infoSvc.get().pipe(catchError(() => of(INFO_DEFAULT))),
            categorias: this.categoriaSvc.getAll().pipe(catchError(() => of([]))),
            servicios: this.servicioSvc.getAll().pipe(catchError(() => of([]))),
            productos: this.productoSvc.getAll().pipe(catchError(() => of(null))),
        }).pipe(takeUntil(this.destroy$)).subscribe({
            next: ({ info, categorias, servicios, productos }) => {
                this.info = info ?? INFO_DEFAULT;
                this.categorias = categorias;
                this.servicios = servicios;
                this.cargandoProductos = false;
                if (productos === null) {
                    this.errorCarga = true;
                } else {
                    this.productos = productos;
                    // Mostrar en el carrusel todos los productos marcados como oferta
                    this.productosHero = this.productos.filter(p => p.es_oferta);

                    if (this.productosHero.length > 1) {
                        this.iniciarCarrusel();
                    }
                }
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargandoProductos = false;
                this.errorCarga = true;
                this.cdr.detectChanges();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Primeros 4 productos con imagen para el hero
    productosHero: Producto[] = [];
    placeholdersHero: string[] = [];

    iniciarCarrusel(): void {
        this.carouselInterval = setInterval(() => {
            this.siguienteSlide();
        }, 4000);
    }

    siguienteSlide(): void {
        if (!this.productosHero.length) return;
        this.heroSlidePrev = this.heroSlideActivo;
        this.heroSlideActivo = (this.heroSlideActivo + 1) % this.productosHero.length;
        this.cdr.detectChanges();
    }

    irASlide(index: number): void {
        if (this.heroSlideActivo === index) return;
        this.heroSlidePrev = this.heroSlideActivo;
        this.heroSlideActivo = index;
        
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
        }
        this.iniciarCarrusel();
        this.cdr.detectChanges();
    }

    get productosFiltrados(): Producto[] {
        let lista = this.categoriaActiva === 'todas'
            ? this.productos
            : this.productos.filter(p => p.categoria_slug === this.categoriaActiva);

        if (this.busqueda.trim()) {
            const q = this.busqueda.toLowerCase();
            lista = lista.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                (p.marca && p.marca.toLowerCase().includes(q)) ||
                (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(q))
            );
        }
        return lista;
    }

    get productosOferta(): Producto[] {
        return this.productos.filter(p => p.es_oferta === 1);
    }

    filtrarPor(slug: string): void {
        this.categoriaActiva = slug;
        this.scrollToCatalogo();
    }

    mostrarSugerencias = false;

    get sugerenciasBusqueda(): Producto[] {
        if (!this.busqueda.trim()) return [];
        const q = this.busqueda.toLowerCase();
        return this.productos.filter(p =>
            p.nombre.toLowerCase().includes(q) ||
            (p.marca && p.marca.toLowerCase().includes(q)) ||
            (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(q))
        ).slice(0, 5);
    }

    ocultarSugerencias(): void {
        setTimeout(() => this.mostrarSugerencias = false, 200);
    }

    seleccionarSugerencia(producto: Producto): void {
        this.busqueda = producto.nombre;
        this.mostrarSugerencias = false;
        this.buscar();
    }

    buscar(): void {
        this.categoriaActiva = 'todas';
        this.mostrarSugerencias = false;
        this.scrollToCatalogo();
    }

    private scrollToCatalogo(): void {
        setTimeout(() => {
            const el = document.getElementById('catalogo');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }, 50);
    }

    formatPrecio(precio: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(precio);
    }

    abrirWhatsapp(): void {
        const num = this.info.whatsapp || '3113147815';
        const msg = encodeURIComponent(this.info.mensaje_wa_default || 'Hola, me interesa un repuesto');
        window.open(`https://wa.me/57${num}?text=${msg}`, '_blank');
    }

    comprarWhatsapp(producto: Producto): void {
        const num = this.info.whatsapp || '3113147815';
        const msg = encodeURIComponent(
            `Hola, me interesa el repuesto: *${producto.nombre}* (${this.formatPrecio(producto.precio)}). ¿Está disponible?`
        );
        window.open(`https://wa.me/57${num}?text=${msg}`, '_blank');
    }
}
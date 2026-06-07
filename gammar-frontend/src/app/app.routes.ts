import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Rutas públicas
    {
        path: '',
        loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'nosotros',
        loadComponent: () => import('./features/public/nosotros/nosotros.component').then(m => m.NosotrosComponent)
    },
    {
        path: 'faq',
        loadComponent: () => import('./features/public/faq/faq.component').then(m => m.FaqComponent)
    },
    {
        path: 'productos/:slug',
        loadComponent: () => import('./features/public/producto-detalle/producto-detalle').then(m => m.ProductoDetalle)
    },

    // Rutas admin
    {
        path: 'admin/login',
        loadComponent: () => import('./features/admin/login/login').then(m => m.Login)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard),
        children: [
            { path: '', redirectTo: 'productos', pathMatch: 'full' },
            {
                path: 'productos',
                loadComponent: () => import('./features/admin/productos/productos').then(m => m.Productos)
            },
            {
                path: 'categorias',
                loadComponent: () => import('./features/admin/categorias/categorias').then(m => m.Categorias)
            },
            {
                path: 'servicios',
                loadComponent: () => import('./features/admin/servicios/servicios').then(m => m.Servicios)
            },
            {
                path: 'configuracion',
                loadComponent: () => import('./features/admin/info-negocio/info-negocio').then(m => m.InfoNegocio)
            },
            {
                path: 'faqs',
                loadComponent: () => import('./features/admin/faqs/faqs').then(m => m.AdminFaqs)
            }
        ]
    },

    // Catch all
    { path: '**', redirectTo: '' }
];
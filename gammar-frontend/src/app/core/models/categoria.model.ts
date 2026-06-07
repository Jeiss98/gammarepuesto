export interface Categoria {
    id: number;
    nombre: string;
    slug: string;
    descripcion?: string;
    icono?: string;
    activo: number;
    orden: number;
}

export interface CategoriaForm {
    nombre: string;
    icono?: string;
    activo?: number;
    orden?: number;
}
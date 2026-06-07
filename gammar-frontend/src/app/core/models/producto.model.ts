export interface Producto {
    id: number;
    categoria_id?: number;
    categoria_nombre?: string;
    categoria_slug?: string;
    nombre: string;
    slug: string;
    descripcion?: string;
    precio: number;
    marca?: string;
    imagen?: string;
    es_oferta: number;
    activo: number;
    stock: number;
    fotos?: Foto[];
}

export interface Foto {
    id: number;
    ruta: string;
    nombre_original: string;
    producto_id: number;
    orden: number;
}

export interface ProductoForm {
    categoria_id?: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    marca?: string;
    es_oferta?: number;
    activo?: number;
    stock?: number;
}
export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    icono: string;
    activo: number | boolean;
    orden: number;
    created_at?: string;
    updated_at?: string;
}

export type ServicioForm = Omit<Servicio, 'id' | 'created_at' | 'updated_at'>;
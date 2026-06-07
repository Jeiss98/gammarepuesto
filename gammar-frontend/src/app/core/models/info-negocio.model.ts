export interface InfoNegocio {
    id: number;
    nombre: string;
    whatsapp: string;
    telefono: string;
    email: string;
    direccion: string;
    horario_inicio_dia: string;
    horario_fin_dia: string;
    hora_apertura: string;
    hora_cierre: string;
    descripcion_hero: string;
    mensaje_wa_default: string;
    link_facebook: string;
    link_instagram: string;
    link_tiktok: string;
    nosotros_historia?: string;
    nosotros_filosofia?: string;
    created_at?: string;
    updated_at?: string;
}

export type InfoNegocioForm = Omit<InfoNegocio, 'id' | 'created_at' | 'updated_at'>;
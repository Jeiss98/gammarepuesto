export interface Faq {
    id: number;
    pregunta: string;
    respuesta: string;
    orden: number;
    activo: number;
    created_at?: string;
    updated_at?: string;
}

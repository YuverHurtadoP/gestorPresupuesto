export class Budget {
  id?: string;
  nombre: string;
  descripcion?: string;
  valor: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    nombre: string,
    valor: number,
    userId: string,
    descripcion?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.nombre = nombre;
    this.valor = valor;
    this.userId = userId;
    this.descripcion = descripcion;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('El correo electrónico ya está registrado.');
    this.name = EmailAlreadyRegisteredError.name;
  }
}

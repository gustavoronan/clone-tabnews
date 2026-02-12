export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno inesperado aconteceu", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o Suporte";
    this.statusCode = 503;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause }) {
    super("Servico indisponivel no momento", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique se o Servico esta disponivel";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class MethodNotAllowed extends Error {
  constructor() {
    super("Metodo nao permitido para este endpoint");
    this.name = "MethodNotAllowed";
    this.action = "Verifique o metodo HTTP enviado para este endpoint";
    this.statusCode = 405;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "erro de vaidacao", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados e tente novamente";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

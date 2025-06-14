export function normalizarDynamoItem(item: Record<string, any>) {
  const resultado: Record<string, any> = {};

  for (const clave in item) {
    const valor = item[clave];

    // Si es un objeto tipo DynamoDB AttributeValue
    if (valor && typeof valor === 'object' && 'S' in valor) {
      resultado[clave] = valor.S;
    } else if (valor && typeof valor === 'object' && 'N' in valor) {
      resultado[clave] = Number(valor.N);
    } else if (valor && typeof valor === 'object' && 'BOOL' in valor) {
      resultado[clave] = valor.BOOL;
    } else {
      // Si ya es un tipo primitivo o no identificado, lo dejamos igual
      resultado[clave] = valor;
    }
  }

  return resultado;
}

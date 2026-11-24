import type { Dict } from "./en";

export const es: Dict = {
  common: {
    appName: "Drive a QR",
    back: "Atrás",
    loading: "Cargando…",
  },
  home: {
    title: "Drive a QR",
    tagline:
      "Inicia sesión con Google, elige carpetas de Drive y obtén una hoja imprimible de códigos QR, uno por archivo.",
    signIn: "Iniciar sesión con Google",
  },
  select: {
    title: "Seleccionar carpetas",
    subtitle: "Elige una o más carpetas. Se escaneará todo su subárbol.",
    selectAll: "Seleccionar todo",
    clear: "Limpiar",
    generate: "Generar códigos QR",
    empty: "No se encontraron carpetas en tu Drive.",
    selectedCount: "{count} seleccionadas",
    signOut: "Cerrar sesión",
    scanning: "Escaneando carpetas…",
  },
  result: {
    title: "Códigos QR",
    columns: "Columnas",
    size: "Tamaño QR",
    labelMode: "Etiqueta",
    labelPath: "Ruta",
    labelName: "Nombre",
    print: "Imprimir",
    back: "Volver a carpetas",
    empty: "No se encontraron archivos en las carpetas seleccionadas.",
    fileCount: "{count} archivos",
    editLabel: "Editar etiqueta",
    cropMarks: "Marcas de corte",
    include: "Incluir en la impresión",
  },
};

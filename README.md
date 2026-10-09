# Descubre Isla Mujeres

Guía digital para conocer Isla Mujeres, Quintana Roo. La primera edición es una experiencia de descubrimiento: la isla, su historia, su mar, sus lugares, su mesa y la manera de recorrer un día.

No incluye reservas, usuarios, pagos ni autenticación. La sección Lugares incluye un mapa real de la isla.

## Requisitos

- Node.js 20 o superior

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
npm run build
npm start
```

## GitHub y Vercel

El proyecto es una aplicación Next.js. Para publicarlo:

1. Crea un repositorio y sube esta carpeta.
2. En Vercel, importa ese repositorio. El framework se detecta como Next.js.
3. Opcional: copia `.env.example` a `.env.local` y define `NEXT_PUBLIC_SITE_URL` con la dirección pública, por ejemplo `https://tu-dominio.com`, para el mapa del sitio y las vistas previas.

## Mapa

La guía de `/lugares` usa MapLibre GL JS y el estilo público de [OpenFreeMap](https://openfreemap.org/). No hace falta una clave. La atribución del mapa debe seguir visible: OpenFreeMap, OpenMapTiles y OpenStreetMap.

El estilo se puede cambiar con `NEXT_PUBLIC_MAP_STYLE_URL`. El valor de ejemplo usa el estilo `fiord`. El worker de MapLibre se copia a `public/maplibre-gl-worker.mjs` al instalar dependencias.

Los lugares salen del catálogo local `lib/places/catalog.ts`. No hay conexión con Supabase. Los registros marcados como demostración no son negocios reales, y no se publican teléfonos ni direcciones que no estén verificados. Un borrador en ese archivo no aparece en la guía.

`supabase/schema.sql` es un borrador para una fase posterior. No está aplicado.

## Fotografías

Las imágenes de `public/media` son fotografías de Isla Mujeres publicadas en Wikimedia Commons con licencias Creative Commons. Los autores y las licencias están en la página Créditos. Si más adelante se sustituyen por fotografías propias, conviene actualizar también `lib/media.ts`.

## Tipografía

Los títulos usan Cormorant Garamond. La navegación y el texto usan Outfit.

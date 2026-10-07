# Descubre Isla Mujeres

Guía digital para conocer Isla Mujeres, Quintana Roo. La primera edición es una experiencia de descubrimiento: la isla, su historia, su mar, sus lugares, su mesa y la manera de recorrer un día.

No incluye reservas, usuarios, pagos ni autenticación.

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
3. Opcional: define `NEXT_PUBLIC_SITE_URL` con la dirección pública, por ejemplo `https://tu-dominio.com`, para el mapa del sitio y las vistas previas.

No hace falta base de datos ni variables secretas en esta versión.

## Fotografías

Las imágenes de `public/media` son fotografías de Isla Mujeres publicadas en Wikimedia Commons con licencias Creative Commons. Los autores y las licencias están en la página Créditos. Si más adelante se sustituyen por fotografías propias, conviene actualizar también `lib/media.ts`.

## Tipografía

Los títulos usan Cormorant Garamond. La navegación y el texto usan Outfit.

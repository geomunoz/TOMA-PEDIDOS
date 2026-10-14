import { Order, DoughFlavor, CakeShape, PaymentMethod } from '../types/order';

export const BAKERY_INFO = {
  name: 'La Viña Dulce',
  subtitle: 'Pastelería y Panadería',
  address: 'Loja, 18 de Noviembre 211-11 y Mercadillo',
  city: 'Loja, Ecuador',
  phone: '0995639050',
  whatsappUrl: 'https://wa.me/593995639050',
  legalWarning: 'CUALQUIER CAMBIO DE PEDIDO MÁXIMO CON 24 HORAS DE ANTICIPACIÓN EN CASO DE ANULAR SU PEDIDO, EL CLIENTE PERDERÁ UN VALOR DE $5.00 DE SU ANTICIPO. PRECAUCIÓN: ALGUNOS PASTELES PUEDEN CONTENER EN SU INTERIOR PALILLOS DE SOPORTE. ALGUNOS PASTELES NO SE DESPACHAN CON CAJAS.',
  acceptedPaymentMethods: 'PAGUE CON: EFECTIVO, AHORITA BANCO DE LOJA, DE UNA BANCO PICHINCHA, PAGO MEGO O JEP FAST'
};

export const PAYMENT_METHODS_LIST: { id: PaymentMethod; name: string; bankLabel: string; desc: string; placeholderTx: string }[] = [
  { id: 'efectivo', name: 'EFECTIVO', bankLabel: 'Caja Taller', desc: 'Pago directo en mostrador', placeholderTx: 'CAJA-004128' },
  { id: 'ahorita', name: 'AHORITA BANCO DE LOJA', bankLabel: 'Banco de Loja', desc: 'Transferencia / QR Ahorita!', placeholderTx: 'AHO-981240' },
  { id: 'deuna', name: 'DE UNA BANCO PICHINCHA', bankLabel: 'Banco Pichincha', desc: 'App Deuna! o QR Pichincha', placeholderTx: 'DEU-772910' },
  { id: 'pago_mego', name: 'PAGO MEGO', bankLabel: 'Coop. Mego', desc: 'Transferencia directa CoopMego', placeholderTx: 'MEGO-491204' },
  { id: 'jep_fast', name: 'JEP FAST', bankLabel: 'Coop. JEP', desc: 'Canal digital JEP Fast', placeholderTx: 'JEP-330192' },
];

export const CAKE_IMAGES = {
  chocolate: '/src/assets/images/cake_chocolate_truffle_1791899773810.jpg',
  vanilla: '/src/assets/images/cake_vanilla_floral_1791899774042.jpg',
  birthdayTopper: '/src/assets/images/cake_red_velvet_topper_1791899774886.jpg',
  workshop: '/src/assets/images/bakery_workshop_artisan_1791899775815.jpg',
};

export const OCCASIONS = [
  'Cumpleaños Infantil',
  'Cumpleaños Adulto',
  'Bautizo',
  'Primera Comunión',
  'Boda / Matrimonio',
  'Baby Shower',
  'Aniversario',
  'Graduación',
  'Evento Corporativo',
  'Otro Motivo Especial'
];

// Dough flavors: Vainilla, Chocolate, Mixta, and Otra (con especificación)
export const DOUGH_FLAVORS: { id: DoughFlavor; name: string; pricePerPortion: number; description: string }[] = [
  { id: 'Vainilla', name: 'Vainilla', pricePerPortion: 1.40, description: 'Bizcocho clásico y suave perfumado con vainilla pura' },
  { id: 'Chocolate', name: 'Chocolate', pricePerPortion: 1.50, description: 'Bizcocho húmedo e intenso de cacao fino artesanal' },
  { id: 'Mixta', name: 'Mixta', pricePerPortion: 1.45, description: 'Deliciosa combinación de bizcocho de vainilla y chocolate' },
  { id: 'Otra', name: 'Otra (Especifique)', pricePerPortion: 1.50, description: 'Sabor especial personalizado (Red Velvet, Zanahoria, Naranja, etc.)' },
];

export const CAKE_SHAPES: { id: CakeShape; name: string }[] = [
  { id: 'Redondo', name: 'Redondo' },
  { id: 'Cuadrado', name: 'Cuadrado' },
  { id: 'Corazón', name: 'Corazón' },
  { id: 'Rectangular', name: 'Rectangular' },
];

// Specific fillings requested: Manjar, Gelatina, Durazno, CREMA MOCCA, Otros especifique
export const AVAILABLE_FILLINGS = [
  { id: 'manjar', name: 'Manjar', tag: 'Clásico Lojano' },
  { id: 'gelatina', name: 'Gelatina', tag: 'Refrescante' },
  { id: 'durazno', name: 'Durazno', tag: 'Fruta Selecta' },
  { id: 'crema_mocca', name: 'CREMA MOCCA', tag: 'Especial Café & Cacao' },
  { id: 'otros', name: 'Otros (Especifique)', tag: 'Personalizado' },
];

// Exact list of suggested molds requested
export const SUGGESTED_MOLDS = [
  'Molde 5',
  'Molde 6',
  'Molde 8',
  'Molde 10',
  'Molde 12',
  'Molde 16',
  'Molde 20',
  'Molde 30',
  'Molde 16 cuadrado',
  'Molde 25 rectangular',
  'Molde 30 rectangular',
  'Molde 40 rectangular',
  'Molde 50 rectangular',
  'Molde 50 1 relleno',
  'Plancha entera',
  'Otro especifique',
] as const;

// Portions in ranges of 5 from 5 up to more than 100
export const PORTION_OPTIONS = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105
];

export const STATUS_LABELS: Record<string, { label: string; description: string; step: number; colorClass: string }> = {
  recibido: {
    label: 'Nota Registrada',
    description: 'Pedido recibido en el sistema de La Viña Dulce',
    step: 1,
    colorClass: 'text-pink-700 bg-pink-50 border-pink-200'
  },
  anticipo_confirmado: {
    label: 'Anticipo Confirmado',
    description: 'Abono validado y reserva confirmada en taller',
    step: 2,
    colorClass: 'text-sky-700 bg-sky-50 border-sky-200'
  },
  en_horneado: {
    label: 'En Horneado',
    description: 'Preparando masa artesanal y bizcochuelo en el horno',
    step: 3,
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  en_decoracion: {
    label: 'En Decoración',
    description: 'Aplicando rellenos, cubierta, topper y detalles solicitados',
    step: 4,
    colorClass: 'text-pink-700 bg-pink-50 border-pink-200'
  },
  control_calidad: {
    label: 'Control de Calidad',
    description: 'Inspección final de acabados, refrigeración y empaque seguro',
    step: 5,
    colorClass: 'text-sky-700 bg-sky-50 border-sky-200'
  },
  listo_despacho: {
    label: 'Listo para Entrega',
    description: 'Listo en mostrador de Loja o en ruta con repartidor',
    step: 6,
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  entregado: {
    label: 'Entregado con Éxito',
    description: 'Pastel entregado al cliente satisfecho',
    step: 7,
    colorClass: 'text-stone-700 bg-stone-100 border-stone-200'
  },
  cancelado: {
    label: 'Cancelado',
    description: 'Pedido anulado según políticas de anticipo',
    step: 0,
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200'
  }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-000051404',
    orderNumber: '000051404',
    customer: {
      name: 'María Elena Carrión',
      idNumber: '1104829102',
      phone: '0995639050',
      address: 'Calle Bernardo Valdivieso y Rocafuerte, Loja'
    },
    cake: {
      occasion: 'Cumpleaños Infantil',
      cakeCount: 1,
      portions: 25,
      moldType: 'Molde Redondo 26cm',
      dough: 'Chocolate',
      shape: 'Redondo',
      fillings: ['Manjar', 'Durazno'],
      hasEdiblePaper: false,
      hasTopper: true,
      topperText: '¡Feliz Cumple Sofía!',
      decorationNotes: 'Drip cake de chocolate semi-amargo con duraznos frescos y perlas pastel.',
      referencePhotoUrl: CAKE_IMAGES.chocolate,
      cakeMessage: '¡Feliz Cumple Sofía! #5'
    },
    deliveryDate: '2026-10-14',
    deliveryTime: '15:30',
    deliveryType: 'pickup',
    financials: {
      totalValue: 43.00,
      depositPaid: 25.00,
      balanceDue: 18.00,
      currency: 'USD',
      paymentMethod: 'deuna',
      paymentReference: 'DEU-8829410',
      isPaidInFull: false
    },
    status: 'en_decoracion',
    statusHistory: [
      {
        status: 'recibido',
        timestamp: '2026-10-13 08:30',
        comment: 'Nota de pedido creada y registrada en ventanilla.',
        updatedBy: 'Cajero Loja'
      },
      {
        status: 'anticipo_confirmado',
        timestamp: '2026-10-13 08:35',
        comment: 'Abono de $25.00 acreditado vía Deuna! Banco Pichincha.',
        updatedBy: 'Sistema Deuna'
      },
      {
        status: 'en_horneado',
        timestamp: '2026-10-13 11:00',
        comment: 'Bizcocho de chocolate gourmet horneado a la perfección.',
        updatedBy: 'Maestro Pastelero Juan'
      },
      {
        status: 'en_decoracion',
        timestamp: '2026-10-13 14:15',
        comment: 'Montando relleno de manjar y durazno, topper colocado.',
        updatedBy: 'Chef Decoradora Lucía'
      }
    ],
    createdAt: '2026-10-13 08:30',
    updatedAt: '2026-10-13 14:15',
    notes: 'Cliente solicita avisar por WhatsApp apenas esté en vitrina refrigerada.'
  },
  {
    id: 'ord-000051405',
    orderNumber: '000051405',
    customer: {
      name: 'Carlos Alvarado Aguirre',
      idNumber: '1103987123',
      phone: '0981234567',
      address: 'Av. Salvador Bustamante Celi y Gran Colombia'
    },
    cake: {
      occasion: 'Boda / Matrimonio',
      cakeCount: 1,
      portions: 50,
      moldType: 'Molde Redondo 2 Pisos Grande (45-50 porciones)',
      dough: 'Mixta',
      shape: 'Redondo',
      fillings: ['CREMA MOCCA', 'Manjar'],
      hasEdiblePaper: false,
      hasTopper: true,
      topperText: 'Carlos & Diana 2026',
      decorationNotes: 'Estilo rústico pastel con rosas rosa y celeste pastel, espátula marfil y detalles perlados.',
      referencePhotoUrl: CAKE_IMAGES.vanilla,
      cakeMessage: 'Nuestra Boda - Carlos & Diana'
    },
    deliveryDate: '2026-10-15',
    deliveryTime: '17:00',
    deliveryType: 'pickup',
    financials: {
      totalValue: 78.00,
      depositPaid: 50.00,
      balanceDue: 28.00,
      currency: 'USD',
      paymentMethod: 'pago_mego',
      paymentReference: 'MEGO-491204',
      isPaidInFull: false
    },
    status: 'anticipo_confirmado',
    statusHistory: [
      {
        status: 'recibido',
        timestamp: '2026-10-12 16:20',
        comment: 'Nota de pedido agendada para recepción de boda.',
        updatedBy: 'Recepción'
      },
      {
        status: 'anticipo_confirmado',
        timestamp: '2026-10-12 16:45',
        comment: 'Transferencia CoopMego por $50.00 confirmada.',
        updatedBy: 'Caja CoopMego'
      }
    ],
    createdAt: '2026-10-12 16:20',
    updatedAt: '2026-10-12 16:45',
    notes: 'Llevar con sumo cuidado en vehículo climatizado. Entrega directa en salón social.'
  },
  {
    id: 'ord-000051406',
    orderNumber: '000051406',
    customer: {
      name: 'Gabriela Sotomayor',
      idNumber: '1105544332',
      phone: '0991122334',
      address: 'Cdla. Zamora, Calle París 14-22'
    },
    cake: {
      occasion: 'Cumpleaños Infantil',
      cakeCount: 1,
      portions: 15,
      moldType: 'Molde Redondo 18cm (10-12 porciones)',
      dough: 'Vainilla',
      shape: 'Redondo',
      fillings: ['Gelatina', 'Manjar'],
      hasEdiblePaper: true,
      hasTopper: false,
      decorationNotes: 'Decoración infantil en tonos celeste y rosa pastel, detalles en azúcar y lámina comestible.',
      referencePhotoUrl: CAKE_IMAGES.birthdayTopper,
      cakeMessage: 'Feliz Cumple Matías'
    },
    deliveryDate: '2026-10-14',
    deliveryTime: '11:00',
    deliveryType: 'pickup',
    financials: {
      totalValue: 25.00,
      depositPaid: 25.00,
      balanceDue: 0.00,
      currency: 'USD',
      paymentMethod: 'ahorita',
      paymentReference: 'AHO-119280',
      isPaidInFull: true
    },
    status: 'listo_despacho',
    statusHistory: [
      {
        status: 'recibido',
        timestamp: '2026-10-12 10:10',
        comment: 'Pedido recibido por la aplicación móvil.',
        updatedBy: 'App Web'
      },
      {
        status: 'anticipo_confirmado',
        timestamp: '2026-10-12 10:12',
        comment: 'Pago total del 100% procesado mediante Ahorita!',
        updatedBy: 'Pasarela Ahorita'
      },
      {
        status: 'en_horneado',
        timestamp: '2026-10-13 07:00',
        comment: 'Horneado de bizcocho vainilla concluido.',
        updatedBy: 'Pastelería'
      },
      {
        status: 'en_decoracion',
        timestamp: '2026-10-13 09:30',
        comment: 'Relleno de gelatina y manjar colocado.',
        updatedBy: 'Decoración'
      },
      {
        status: 'listo_despacho',
        timestamp: '2026-10-13 10:30',
        comment: 'Listo para retiro en local central (18 de Noviembre).',
        updatedBy: 'Mostrador'
      }
    ],
    createdAt: '2026-10-12 10:10',
    updatedAt: '2026-10-13 10:30',
    notes: 'Pagado en su totalidad. Entregar en caja decorada con lazos rosa y celeste.'
  }
];

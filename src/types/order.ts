export type DoughFlavor = 'Vainilla' | 'Chocolate' | 'Mixta' | 'Otra';
export type CakeShape = 'Redondo' | 'Cuadrado' | 'Corazón' | 'Rectangular';

export type OrderStatus = 
  | 'recibido'
  | 'anticipo_confirmado'
  | 'en_horneado'
  | 'en_decoracion'
  | 'control_calidad'
  | 'listo_despacho'
  | 'entregado'
  | 'cancelado';

export type PaymentMethod = 
  | 'efectivo'
  | 'ahorita'
  | 'deuna'
  | 'pago_mego'
  | 'jep_fast';

export interface CustomerInfo {
  name: string; // Sr. (es)
  idNumber: string; // RUC / CI
  phone: string; // Teléfono
  address: string; // Dirección
}

export interface CakeCustomization {
  occasion: string; // MOTIVO
  cakeCount: number; // #Pasteles (1 a 10)
  portions: number; // #Porciones (de 5 en 5, hasta más de 100)
  moldType: string; // #Molde(s)
  customMoldText?: string;
  dough: DoughFlavor; // MASA: Vainilla | Chocolate | Mixta | Otra
  customDoughText?: string; // Especificación de otra masa
  shape: CakeShape;
  fillings: string[]; // Rellenos: Manjar, Gelatina, Durazno, CREMA MOCCA, otros
  customFillingText?: string;
  hasEdiblePaper: boolean; // Papel comestible
  hasTopper: boolean; // Topper personalizados
  topperText?: string;
  hasCustomTopper?: boolean; // Otros especifique topper
  customTopperText?: string;
  decorationNotes: string; // Decoración
  referencePhotoUrl?: string;
  cakeMessage: string; // Mensaje sobre el pastel
}

export interface FinancialDetails {
  totalValue: number; // Valor
  depositPaid: number; // Abono
  balanceDue: number; // Saldo
  currency: 'USD';
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  isPaidInFull: boolean;
}

export interface StatusLog {
  status: OrderStatus;
  timestamp: string;
  comment: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., '000051404'
  customer: CustomerInfo;
  cake: CakeCustomization;
  deliveryDate: string; // Fecha de entrega: YYYY-MM-DD
  deliveryTime: string; // Hora: HH:mm
  deliveryType: 'pickup' | 'delivery';
  financials: FinancialDetails;
  status: OrderStatus;
  statusHistory: StatusLog[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  orderId: string;
  orderNumber: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_update' | 'payment_confirmed' | 'reminder';
}

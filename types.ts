
export enum TransactionStatus {
  LEGIT = 'LEGIT',
  SUSPICIOUS = 'SUSPICIOUS',
  FRAUD = 'FRAUD'
}

export interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  sender: string;
  receiver: string;
  type: 'TRANSFER' | 'ATM' | 'POS' | 'ONLINE';
  location: string;
  status: TransactionStatus;
  riskScore: number;
  aiReasoning?: string;
}

export interface DetectionRule {
  id: string;
  name: string;
  threshold: number;
  enabled: boolean;
  type: 'AMOUNT' | 'FREQUENCY' | 'LOCATION';
}

export interface DashboardStats {
  totalVolume: number;
  fraudRate: number;
  blockedAttempts: number;
  activeAlerts: number;
}

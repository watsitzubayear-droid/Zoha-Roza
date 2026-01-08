
import { MarketPair } from './types';

export const MARKET_PAIRS: MarketPair[] = [
  // Major Pairs
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', isOtc: false },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', isOtc: false },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', isOtc: false },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', isOtc: false },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', isOtc: false },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', isOtc: false },
  
  // OTC Pairs (Quotex Favorites)
  { symbol: 'EUR/USD (OTC)', name: 'EUR/USD OTC', isOtc: true },
  { symbol: 'GBP/USD (OTC)', name: 'GBP/USD OTC', isOtc: true },
  { symbol: 'USD/JPY (OTC)', name: 'USD/JPY OTC', isOtc: true },
  { symbol: 'AUD/CAD (OTC)', name: 'AUD/CAD OTC', isOtc: true },
  { symbol: 'EUR/GBP (OTC)', name: 'EUR/GBP OTC', isOtc: true },
  { symbol: 'USD/CHF (OTC)', name: 'USD/CHF OTC', isOtc: true },
  { symbol: 'USD/INR (OTC)', name: 'USD/INR OTC', isOtc: true },
  { symbol: 'USD/BRL (OTC)', name: 'USD/BRL OTC', isOtc: true },
  { symbol: 'USD/PKR (OTC)', name: 'USD/PKR OTC', isOtc: true },
  { symbol: 'USD/TRY (OTC)', name: 'USD/TRY OTC', isOtc: true },
  { symbol: 'USD/IDR (OTC)', name: 'USD/IDR OTC', isOtc: true },
  { symbol: 'NZD/USD (OTC)', name: 'NZD/USD OTC', isOtc: true },
  
  // Crypto
  { symbol: 'Bitcoin', name: 'BTC/USD', isOtc: false },
  { symbol: 'Ethereum', name: 'ETH/USD', isOtc: false },
  { symbol: 'Solana', name: 'SOL/USD', isOtc: false },
  { symbol: 'Litecoin', name: 'LTC/USD', isOtc: false },
  
  // Commodities
  { symbol: 'Gold (XAU/USD)', name: 'Gold', isOtc: false },
  { symbol: 'Silver (XAG/USD)', name: 'Silver', isOtc: false },
  { symbol: 'UKO USD', name: 'Brent Oil', isOtc: false },
  { symbol: 'USO USD', name: 'Crude Oil', isOtc: false },
  
  // Indices
  { symbol: 'S&P 500', name: 'US 500', isOtc: false },
  { symbol: 'Dow Jones', name: 'US 30', isOtc: false },
  { symbol: 'Nasdaq 100', name: 'USTEC', isOtc: false },
];

export const BDT_TIMEZONE = 'Asia/Dhaka';

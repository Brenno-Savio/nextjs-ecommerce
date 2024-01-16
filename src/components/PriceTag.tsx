import { formatPrice } from '@/lib/format';

interface PriceTagProps {
  price: number;
  classname?: string;
}

export default function PriceTag({ price, classname }: PriceTagProps) {
  return <span className={`badge ${classname} p-3`}>{formatPrice(price)}</span>;
}

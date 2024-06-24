import dayjs from 'dayjs';
import Swiper from 'swiper';

export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatCreatedAt = ( date ) => {
  return dayjs( date).format( 'YYYY-MM-DD HH:mm' );
};

export const handlStatusOrder = ( status ) => {
  switch ( status ) {
    case 'pending':
      return {
        text: 'Pending',
        color: 'text-yellow-500',
        bg: 'bg-yellow-50'
      };
    case 'processing':
      return {
        text: 'Processing',
        color: 'text-blue-500',
        bg: 'bg-blue-50'
      };
    case 'shipping':
      return {
        text: 'Shipping',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50'
      };
    case 'delivered':
      return {
        text: 'Delivered',
        color: 'text-green-500',
        bg: 'bg-green-50'
      };
    case 'canceled':
      return {
        text: 'Canceled',
        color: 'text-red-500',
        bg: 'bg-red-50'
      };
    default:
      break;
  }
};
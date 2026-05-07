export type SelectedCottage = {
  name: string;
  description: string;
  price: number;
};

export type BookingRequestPayload = {
  name: string;
  email?: string;
  phone?: string;
  cottage: SelectedCottage[];
  number_of_adult: string;
  number_of_kids: string;
  total_price: number;
  summary?: string;
  checkIn?: string;
  checkOut?: string;
};

export type BookingResponse = {
  booking: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    number_of_adult: string;
    number_of_kids: string;
    total_price: number;
    summary: string | null;
    checkIn: string | null;
    checkOut: string | null;
    checkoutTime: string;
    createdAt: string;
    cottage: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
    }>;
  };
  message: string;
};

export type Slot = {
  id: string;
  start: string;
  end: string;
  isBooked: boolean;
};

export type BookingPayload = {
  slotId: string;
  studentName: string;
  studentEmail: string;
  goal: string;
};

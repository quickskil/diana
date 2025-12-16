type Slot = {
  id: string;
  start: Date;
  end: Date;
  isBooked: boolean;
};

type Booking = {
  id: string;
  slotId: string;
  studentEmail: string;
  studentName: string;
  goal: string;
  amountCents: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  checkoutId?: string | null;
  paymentIntentId?: string | null;
  createdAt: Date;
};

type Reminder = {
  id: string;
  bookingId: string;
  sendAt: Date;
  sent: boolean;
};

const store = {
  slots: [] as Slot[],
  bookings: [] as Booking[],
  reminders: [] as Reminder[]
};

const sortByDateDesc = <T extends { createdAt: Date }>(items: T[]) =>
  [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export const prisma = {
  slot: {
    count: async () => store.slots.length,
    findUnique: async ({ where: { id } }: { where: { id: string } }) => store.slots.find((slot) => slot.id === id) || null,
    findMany: async ({ where, orderBy }: { where?: { isBooked?: boolean }; orderBy?: { start?: 'asc' | 'desc' } }) => {
      let results = [...store.slots];
      if (where?.isBooked !== undefined) {
        results = results.filter((slot) => slot.isBooked === where.isBooked);
      }
      if (orderBy?.start) {
        results.sort((a, b) => (orderBy.start === 'asc' ? a.start.getTime() - b.start.getTime() : b.start.getTime() - a.start.getTime()));
      }
      return results;
    },
    create: async ({ data }: { data: { start: Date; end: Date; isBooked?: boolean } }) => {
      const slot: Slot = {
        id: crypto.randomUUID(),
        start: data.start,
        end: data.end,
        isBooked: data.isBooked ?? false
      };
      store.slots.push(slot);
      return slot;
    },
    update: async ({ where: { id }, data }: { where: { id: string }; data: Partial<Slot> }) => {
      const slot = store.slots.find((s) => s.id === id);
      if (!slot) throw new Error('Slot not found');
      Object.assign(slot, data);
      return slot;
    }
  },
  booking: {
    findMany: async ({ include, orderBy }: { include?: { slot?: boolean }; orderBy?: { createdAt?: 'asc' | 'desc' } }): Promise<
      (Booking & { slot?: Slot })[]
    > => {
      let results = [...store.bookings];
      if (orderBy?.createdAt) {
        results = orderBy.createdAt === 'desc' ? sortByDateDesc(results) : [...sortByDateDesc(results)].reverse();
      }
      if (include?.slot) {
        return results.map((booking) => ({ ...booking, slot: store.slots.find((s) => s.id === booking.slotId)! }));
      }
      return results;
    },
    findUnique: async ({ where: { id } }: { where: { id: string } }) => store.bookings.find((b) => b.id === id) || null,
    create: async ({ data, include }: { data: Omit<Booking, 'id' | 'createdAt'>; include?: { slot?: boolean } }) => {
      const booking: Booking = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
      store.bookings.push(booking);
      if (include?.slot) {
        return { ...booking, slot: store.slots.find((s) => s.id === booking.slotId)! };
      }
      return booking;
    },
    update: async ({ where: { id }, data, include }: { where: { id: string }; data: Partial<Booking>; include?: { slot?: boolean } }) => {
      const booking = store.bookings.find((b) => b.id === id);
      if (!booking) throw new Error('Booking not found');
      Object.assign(booking, data);
      if (include?.slot) {
        return { ...booking, slot: store.slots.find((s) => s.id === booking.slotId)! };
      }
      return booking;
    }
  },
  reminder: {
    findMany: async ({ where, include }: { where?: { sent?: boolean }; include?: { booking?: { include?: { slot?: boolean } } } }) => {
      let reminders = [...store.reminders];
      if (where?.sent !== undefined) {
        reminders = reminders.filter((r) => r.sent === where.sent);
      }

      if (include?.booking?.include?.slot) {
        return reminders.map((reminder) => ({
          ...reminder,
          booking: {
            ...store.bookings.find((b) => b.id === reminder.bookingId)!,
            slot: store.slots.find((s) => s.id === store.bookings.find((b) => b.id === reminder.bookingId)!.slotId)!
          }
        }));
      }

      if (include?.booking) {
        return reminders.map((reminder) => ({
          ...reminder,
          booking: store.bookings.find((b) => b.id === reminder.bookingId)!
        }));
      }

      return reminders;
    },
    create: async ({ data }: { data: Omit<Reminder, 'id'> }) => {
      const reminder: Reminder = { ...data, id: crypto.randomUUID() };
      store.reminders.push(reminder);
      return reminder;
    },
    update: async ({ where: { id }, data }: { where: { id: string }; data: Partial<Reminder> }) => {
      const reminder = store.reminders.find((r) => r.id === id);
      if (!reminder) throw new Error('Reminder not found');
      Object.assign(reminder, data);
      return reminder;
    }
  }
};

export type { Slot, Booking, Reminder };

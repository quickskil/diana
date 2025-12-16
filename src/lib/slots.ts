import { addDays, setTimeParts, startOfDay } from './date-utils';
import { prisma } from './prisma';

export async function ensureBaseAvailability() {
  const existing = await prisma.slot.count();
  if (existing > 0) return;

  const today = startOfDay(new Date());
  const creationPromises = Array.from({ length: 7 }).flatMap((_, index) => {
    const day = addDays(today, index + 1);
    const slots = [
      setTimeParts(day, { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 }),
      setTimeParts(day, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
    ];

    return slots.map((startTime) =>
      prisma.slot.create({
        data: {
          start: startTime,
          end: new Date(startTime.getTime() + 60 * 60 * 1000)
        }
      })
    );
  });

  await Promise.all(creationPromises);
}

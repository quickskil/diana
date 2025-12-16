import { render, screen, fireEvent } from '@testing-library/react';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { Slot } from '@/types';

const slots: Slot[] = [
  { id: '1', start: '2024-11-10T16:00:00.000Z', end: '2024-11-10T17:00:00.000Z', isBooked: false },
  { id: '2', start: '2024-11-11T18:00:00.000Z', end: '2024-11-11T19:00:00.000Z', isBooked: false }
];

describe('AvailabilityCalendar', () => {
  it('renders dates and allows selection', () => {
    const onSelect = jest.fn();
    render(<AvailabilityCalendar slots={slots} onSelect={onSelect} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);

    fireEvent.click(buttons[0]);
    expect(onSelect).toHaveBeenCalled();
  });
});

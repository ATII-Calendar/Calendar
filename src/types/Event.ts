interface IEvent {
  getStartDate: () => Date | null;
  getEndDate: () => Date | null;
  getAllDay: () => boolean;
  getTitle: () => string;
  setStartDate: (startDate: Date) => void;
  setEndDate: (endDate: Date) => void;
  setAllDay: (allDay: boolean) => void;
  setTitle: (title: string) => void;
}

class Event implements IEvent {
  startDate: Date | null;
  endDate: Date | null;
  allDay: boolean;
  title: string;

  constructor(title: string, startDate: Date, endDate: Date, allDay: boolean) {
    this.startDate = startDate || null;
    this.endDate = endDate || null;
    this.allDay = allDay || false;
    this.title = title;
  }

  getStartDate(): Date | null {
    return this.startDate;
  }

  getEndDate(): Date | null {
    return this.endDate;
  }

  getAllDay(): boolean {
    return this.allDay;
  }

  getTitle(): string {
    return this.title;
  }

  setStartDate (startDate: Date): void {
    this.startDate = startDate;
  }

  setEndDate (endDate: Date): void {
    this.endDate = endDate;
  }

  setAllDay(allDay: boolean): void {
    this.allDay = allDay;
  }

  setTitle(title: string): void {
    this.title = title;
  }
}

export default Event;

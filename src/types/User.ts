interface IUser {
  getFirstName: () => string;
  getLastName: () => string;
  getEmail: () => string;
  getId: () => string;
  getClass: (block: string) => string | null;
  getSchedule: () => Map<string, string>;
}

class User implements IUser {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
  schedule: Map<string, string>;

  constructor(firstname: string, lastname: string, email: string, id: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.id = id
    this.schedule = new Map()
  }

  getFirstName(): string {
    return this.firstname;
  }

  getLastName(): string {
    return this.lastname;
  }

  getEmail(): string {
    return this.email;
  }

  getId(): string {
    return this.id;
  }

  getClass(block: string): string | null {
    return this.schedule.get(block) || null;
  }

  getSchedule(): Map<string, string> {
    return this.schedule;
  }

  setClass(block: string, c: string) {
    this.schedule.set(block, c);
  }
}

export default User;

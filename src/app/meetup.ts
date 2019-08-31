export interface Meetup {
  date: string,
  locationX: number,
  locationY: number,
  name: string,
  description: string,
  attendees: string[],
  prereqs: string[],
  owner: number
}
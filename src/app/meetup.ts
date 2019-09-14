export interface Meetup {
  id: number,
  date: string,
  locationX: number,
  locationY: number,
  name: string,
  description: string,
  attendees: string[],
  prereqs: string[],
  owner: number
}
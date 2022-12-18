export interface ISender {
  id: string
  names: string[]
}

export interface IMessageFrequencies {
  month: string
  senders: {
    id: string 
    count: number
  }[]
}
import { uuid } from "uuidv4";
import { shortMonths } from "../config/months";
import { ISender, IMessageFrequencies } from "../models/data.model";
import { IMessage } from "../models/message.model";

export const getSenders = (messages: IMessage[]): string[] =>
  messages.reduce((p, c) => {
    if (!p.find(m => m === c.sender)) p.push(c.sender)

    return p
  }, [] as string[])

export const getTotalMessageFrequencies = (messages: IMessage[], senders: ISender[]): IMessageFrequencies[] => {
  return messages.reduce((p, c) => {
    let monthSent = new Date(c.sentDate).getMonth()
    let month = p.find(m => m.month === shortMonths[monthSent])

    if (month) {
      let sender = senders.find(s => s.names.includes(c.sender))

      if (sender !== undefined) {
        if (!month.senders.map(s => s.id).includes(sender?.id)) month.senders.push({ id: senders.find(s => s.names.includes(c.sender))?.id ?? uuid(), count: 0 })
  
        month.senders.map(s => s.id === sender?.id ? { ...s, count: s.count++ } : s)
      }
    }

    return p
  }, Array.from(shortMonths).map(m => ({ month: m, senders: [] })) as { month: string, senders: { id: string, count: number }[] }[])
}
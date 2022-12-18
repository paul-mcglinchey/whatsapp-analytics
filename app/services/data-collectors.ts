import { shortMonths } from "../config/months";
import { IMessageFrequencies } from "../models/data.model";
import { IMessage } from "../models/message.model";

export const getMembers = (messages: IMessage[]): string[] =>
  messages.reduce((p, c) => {
    if (!p.find(m => m === c.sender)) p.push(c.sender)

    return p
  }, [] as string[])

export const getTotalMessageFrequencies = (messages: IMessage[]): IMessageFrequencies[] => {
  
  console.log(messages.length)
  
  return messages.reduce((p, c) => {
    let monthSent = new Date(c.sentDate).getMonth()
    let month = p.find(m => m.month === shortMonths[monthSent])

    if (month) {
      let key = c.sender as string
      if (!month.members.map(m => m.name).includes(key)) month.members.push({ name: c.sender, count: 0 })

      month.members.map(m => m.name === c.sender ? { ...m, count: m.count++ } : m)
    }

    return p
  }, Array.from(shortMonths).map(m => ({ month: m, members: [] })) as { month: string, members: { name: string, count: number }[] }[])
}
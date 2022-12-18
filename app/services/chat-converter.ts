import { IMessage } from "../models/message.model"
import { uuid } from 'uuidv4';

export default function(text: string): IMessage[] {
  var lines = text.split("\n")
  var messages: IMessage[] = []

  for (let line of lines) {
    let match = line.match(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - [(\w* )(\w*)]+:/)

    if (!match) {
      let anonMessageMatch = line.match(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2} - [\w*\-., ]*/)
      
      if (!anonMessageMatch) {
        messages[messages.length - 1].content += "\n" + line
      }
    } else {
      messages.push({
        id: uuid(),
        sentDate: line.split(",")[0],
        sentTime: line.split(", ")[1].split(" -")[0],
        sender: line.split(" -")[1].split(":")[0].trim(),
        content: line.split(": ").slice(1).join()
      })
    }
  }

  return messages
}
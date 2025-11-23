
export type Messages = Record<string, string>;
import pt from '../messages/pt-BR.json';
import en from '../messages/en.json';

export function getMessages(locale: string): Messages {
  if (locale?.toLowerCase().startsWith('en')) return en as Messages;
  return pt as Messages;
}

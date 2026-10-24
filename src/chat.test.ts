import { describe, expect, it } from 'vitest';
import { isTerminalInput } from './lib/chat';

describe('terminal vs chat routing', () => {
  it('keeps SQL and commands in the terminal', () => {
    for (const q of ['SELECT * FROM me;', 'select name from projects', '\\dt', '\\shoot', 'clear', 'help', 'DROP TABLE me;', 'delete from skills']) {
      expect(isTerminalInput(q), q).toBe(true);
    }
  });

  it('sends plain questions to the chat', () => {
    for (const q of ['Ko je Veljko?', 'sta radis', 'What does Veljko do?', 'Selektuje li on klijente?', 'Da li zna SQL?']) {
      expect(isTerminalInput(q), q).toBe(false);
    }
  });
});

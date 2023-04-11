import { filterFunction, getLangName, getRandNumber, mapResourceFilesToTableRows } from './utils';
import { TextResourceFile } from './types';

describe('getLangName', () => {
  it('should return empty string when language code is undefined', () => {
    const result = getLangName({ code: undefined });
    expect(result).toBe('');
  });

  it('should return "norsk bokmål" when language code is nb', () => {
    const result = getLangName({ code: 'nb' });
    expect(result).toBe('norsk bokmål');
  });

  it('should fallback to other method of getting language name, when Intl.DisplayNames returns code', () => {
    const mockIntl = {
      of: (code: string) => {
        return code;
      },
      resolvedOptions: jest.fn(),
    };

    const result = getLangName({ code: 'nb', intlDisplayNames: mockIntl });

    expect(result).toBe('norwegian bokmål');
  });

  it('should return code when language code is something unknown', () => {
    const code = 'xx';
    const result = getLangName({ code });
    expect(result).toBe(code);
  });
});

describe('getRandNumber', () => {
  it('should return different numbers', () => {
    const n1 = getRandNumber();
    const n2 = getRandNumber();

    expect(n1).not.toEqual(n2);
  });
});

test('that filter function works as intended', () => {
  const entry = [{ lang: 'nb', translation: 'spock' }];
  expect(filterFunction('test', entry, 'ock')).toBe(true);
  expect(filterFunction('test', entry, 'rock')).toBe(false);
  expect(filterFunction('test', entry, '')).toBe(true);
  expect(filterFunction('test', entry, 'test')).toBe(true);
  expect(filterFunction('test', entry, 'testen')).toBe(false);
  expect(filterFunction('test', entry, undefined)).toBe(true);
  expect(filterFunction('test', undefined, undefined)).toBe(true);
});

test('that we can map two resource files to a text table', () => {
  const file1: TextResourceFile = {
    language: 'nb',
    resources: [
      {
        id: 'my-key',
        value: 'Min nøkkel',
      },
    ],
  };
  const file2: TextResourceFile = {
    language: 'en',
    resources: [
      {
        id: 'my-key',
        value: 'My key',
      },
    ],
  };
  const rows = mapResourceFilesToTableRows([file1, file2]);
  expect(rows).toHaveLength(1);
  expect(rows[0].textKey).toBe('my-key');
  expect(rows[0].translations).toHaveLength(2);
});

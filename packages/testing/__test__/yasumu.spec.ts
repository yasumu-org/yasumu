import { describe, test, expect } from 'vitest';
import {
  ApplicationMock,
  CommandsMock,
  yasumu,
  StoreMock,
  DialogMock,
  EventsMock,
  FileSystemMock,
  PathMock,
  ProcessMock,
  ShellMock,
  WebSocketMock,
} from '../src/index';
import { Yasumu } from '@yasumu/core';

describe('Yasumu', () => {
  test('should be an instance of Yasumu', () => {
    expect(yasumu).toBeInstanceOf(Yasumu);
  });

  describe('Yasumu properties', () => {
    test('should have an app property as an instance of ApplicationMock', () => {
      expect(yasumu.app).toBeInstanceOf(ApplicationMock);
    });

    test('should have a command property as an instance of CommandsMock', () => {
      expect(yasumu.command).toBeInstanceOf(CommandsMock);
    });

    test('should have a store property as an instance of StoreMock', () => {
      expect(yasumu.store).toBeInstanceOf(StoreMock);
    });

    test('should have a dialog property as an instance of DialogMock', () => {
      expect(yasumu.dialog).toBeInstanceOf(DialogMock);
    });

    test('should have an events property as an instance of EventsMock', () => {
      expect(yasumu.events).toBeInstanceOf(EventsMock);
    });

    test('should have a fs property as an instance of FileSystemMock', () => {
      expect(yasumu.fs).toBeInstanceOf(FileSystemMock);
    });

    test('should have a path property as an instance of PathMock', () => {
      expect(yasumu.path).toBeInstanceOf(PathMock);
    });

    test('should have a process property as an instance of ProcessMock', () => {
      expect(yasumu.process).toBeInstanceOf(ProcessMock);
    });

    test('should have a shell property as an instance of ShellMock', () => {
      expect(yasumu.shell).toBeInstanceOf(ShellMock);
    });

    test('should have a websocket property as an instance of WebSocketMock', () => {
      expect(yasumu.websocket).toBeInstanceOf(WebSocketMock);
    });
  });
});

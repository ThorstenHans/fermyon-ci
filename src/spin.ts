/* eslint-disable @typescript-eslint/space-before-function-paren */
import { type Command, type CommandResult, type Host } from './host'

export class Spin {
  constructor(private readonly _host: Host) { }

  public async build(): Promise<CommandResult> {
    const cmd = {
      command: 'spin',
      args: ['build'],
      captureOutput: false
    }

    return await this._invokeCommand(cmd)
  }

  public async getVersion(): Promise<string> {
    const cmd = {
      command: 'spin',
      args: ['--version'],
      captureOutput: true
    }

    try {
      const result = await this._invokeCommand(cmd)
      if (result.exitCode !== 0) {
        throw new Error(`Failed to get version: ${result.exitCode}`)
      }
      return result.stdout?.trim() ?? ''
    } catch (err: any) {
      throw new Error(`Failed to get version of Fermyon Spin: ${err.message}`)
    }
  }

  public async invokeCommand(command: string, ...args: string[]): Promise<CommandResult> {
    const cmd = {
      command: 'spin',
      args: [command, ...args],
      captureOutput: false
    }
    return await this._invokeCommand(cmd)
  }

  private async _invokeCommand(cmd: Command): Promise<CommandResult> {
    try {
      this._host.debug(`Running spin ${JSON.stringify(cmd)}`)
      const result = await this._host.execute(cmd)

      this._host.debug(`Spin ${JSON.stringify(cmd)} result: ${result.exitCode}`)
      return result
    } catch (err: any) {
      throw new Error(`Failed to invoke command ${JSON.stringify(cmd)}: ${err.message}`)
    }
  }
}

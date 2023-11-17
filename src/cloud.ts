/* eslint-disable @typescript-eslint/space-before-function-paren */

import { type Host } from './host'

export interface KeyValue {
  key: string
  value: string
}

export interface DeployOptions {
  environmentName?: string
  noBuildInfo?: boolean
  readinessTimeout?: number
  variables?: KeyValue[]
  keyValues?: KeyValue[]
}

export class Cloud {
  constructor(private readonly _host: Host) { }

  public async login(pat: string): Promise<boolean> {
    if (pat.length === 0) {
      throw new Error('Failed to login: PAT is required')
    }
    const cmd = {
      command: 'spin',
      args: ['cloud', 'login', '--auth-method', 'token', '--token', pat],
      captureOutput: false
    }
    try {
      const result = await this._host.execute(cmd)
      return result.exitCode === 0
    } catch (err: any) {
      throw new Error(`Failed to login: ${err.message}`)
    }
  }

  public async deploy(options?: DeployOptions): Promise<boolean> {
    const cmd = {
      command: 'spin',
      args: ['cloud', 'deploy'],
      captureOutput: false
    }

    if (options != null) {
      if (options.environmentName != null) {
        cmd.args.push('--environment-name', options.environmentName)
      }
      if (options.noBuildInfo === true) {
        cmd.args.push('--no-buildinfo')
      }
      if (options.readinessTimeout != null && options.readinessTimeout !== 60) {
        cmd.args.push('--readiness-timeout', options.readinessTimeout.toString())
      }
      if (options.variables != null) {
        options.variables.forEach((kv) => {
          cmd.args.push('--variable', `${kv.key}=${kv.value}`)
        })
      }
      if (options.keyValues != null) {
        options.keyValues.forEach((kv) => {
          cmd.args.push('--key-value', `${kv.key}=${kv.value}`)
        })
      }
    }
    try {
      const result = await this._host.execute(cmd)
      return result.exitCode === 0
    } catch (err: any) {
      throw new Error(`Failed to deploy app to Fermyon Cloud: ${err.message}`)
    }
  }
}

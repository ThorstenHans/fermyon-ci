import { Cloud, type DeployOptions } from '../src/cloud'
import { FakeHost } from './fakes'

test('Cloud.login() should throw an error when PAT is empty', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  await expect(cloud.login('')).rejects.toThrow('Failed to login: PAT is required')
})

test('Cloud.login() should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  await cloud.login('my-pat')

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'login', '--auth-method', 'token', '--token', 'my-pat'])
})

test('Cloud.deploy() without opts should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  await cloud.deploy()

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy'])
})

test('Cloud.deploy() with readiness timeout should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = { readinessTimeout: 120 } as DeployOptions
  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy', '--readiness-timeout', '120'])
})

test('Cloud.deploy() with environment name should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = { environmentName: 'my-env' } as DeployOptions
  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy', '--environment-name', 'my-env'])
})

test('Cloud.deploy() with no build info should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = { noBuildInfo: true } as DeployOptions
  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy', '--no-buildinfo'])
})

test('Cloud.deploy() with single variable should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = { variables: [{ key: 'var1', value: 'value1' }] } as DeployOptions
  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy', '--variable', 'var1=value1'])
})

test('Cloud.deploy() with variables should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = {
    variables: [
      { key: 'var1', value: 'value1' },
      { key: 'var2', value: 'value2' }
    ]
  } as DeployOptions
  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy', '--variable', 'var1=value1', '--variable', 'var2=value2'])
})

test('Cloud.deploy() with single key-value should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = { keyValues: [{ key: 'kv1', value: 'value1' }] } as DeployOptions
  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy', '--key-value', 'kv1=value1'])
})

test('Cloud.deploy() with key-values should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = {
    keyValues: [
      { key: 'kv1', value: 'value1' },
      { key: 'kv2', value: 'value2' }
    ]
  } as DeployOptions
  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual(['cloud', 'deploy', '--key-value', 'kv1=value1', '--key-value', 'kv2=value2'])
})

test('Cloud.deploy() with all options should invoke proper command on host', async () => {
  const host = new FakeHost()
  const cloud = new Cloud(host)

  const opts = {
    readinessTimeout: 120,
    environmentName: 'my-env',
    noBuildInfo: true,
    variables: [
      { key: 'var1', value: 'value1' },
      { key: 'var2', value: 'value2' }
    ],
    keyValues: [
      { key: 'kv1', value: 'value1' },
      { key: 'kv2', value: 'value2' }
    ]
  } as DeployOptions

  await cloud.deploy(opts)

  expect(host.commands.length).toBe(1)
  expect(host.commands[0].command).toBe('spin')
  expect(host.commands[0].args).toEqual([
    'cloud',
    'deploy',
    '--environment-name', 'my-env',
    '--no-buildinfo',
    '--readiness-timeout', '120',
    '--variable', 'var1=value1',
    '--variable', 'var2=value2',
    '--key-value', 'kv1=value1',
    '--key-value', 'kv2=value2'])
})

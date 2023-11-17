export interface Command {
  command: string
  args: string[]
  captureOutput: boolean
}

export interface CommandResult {
  exitCode: number
  stdout?: string
}
export interface Host {
  addFolderToPath: (folder: string) => void
  chmod: (file: string, mode: number) => Promise<void>
  execute: (command: Command) => Promise<CommandResult>
  extractZip: (path: string) => Promise<string>
  extractTarGz: (path: string) => Promise<string>
  download: (url: string) => Promise<string>
  log: (message: string) => void
  debug: (message: string) => void
}

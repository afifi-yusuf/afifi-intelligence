'use client'

const NOW = 'Fri May 22 09:58 BST 2026'

interface GpuRow {
  idx: number
  name: string
  temp: number
  pwr: number
  mem: number
  util: number
}

const GPUS: GpuRow[] = [
  { idx: 0, name: 'NVIDIA H100 80GB', temp: 62, pwr: 315, mem: 54237, util: 68 },
  { idx: 1, name: 'NVIDIA H100 80GB', temp: 65, pwr: 342, mem: 58102, util: 73 },
  { idx: 2, name: 'NVIDIA H100 80GB', temp: 59, pwr: 287, mem: 47891, util: 61 },
  { idx: 3, name: 'NVIDIA H100 80GB', temp: 63, pwr: 320, mem: 54980, util: 70 },
  { idx: 4, name: 'NVIDIA H100 80GB', temp: 64, pwr: 335, mem: 56812, util: 72 },
  { idx: 5, name: 'NVIDIA H100 80GB', temp: 61, pwr: 308, mem: 51445, util: 66 },
  { idx: 6, name: 'NVIDIA H100 80GB', temp: 66, pwr: 348, mem: 59587, util: 74 },
  { idx: 7, name: 'NVIDIA H100 80GB', temp: 62, pwr: 312, mem: 53108, util: 69 },
]

const MEM_TOTAL = 81920
const PWR_CAP = 700

function pad(s: string | number, n: number, leftAlign = false) {
  const str = String(s)
  if (str.length >= n) return str
  return leftAlign ? str + ' '.repeat(n - str.length) : ' '.repeat(n - str.length) + str
}

function utilColor(u: number) {
  if (u >= 90) return 'var(--terminal-red)'
  if (u >= 75) return 'var(--terminal-yellow)'
  return 'var(--terminal-green)'
}

export default function GpuBlock() {
  return (
    <div className="font-mono text-[11px] sm:text-[12.5px] leading-snug text-terminal-fg overflow-x-auto terminal-scrollbar">
      <div className="text-terminal-green">
        nvidia-smi <span className="text-terminal-dim">· {NOW}</span>
      </div>
      <div className="text-terminal-dim mb-2">
        Driver Version: 550.54.15   CUDA Version: 12.6
      </div>

      <div className="whitespace-pre text-terminal-dim">
        {'  GPU  Name              Temp   Power           Memory                 Util'}
      </div>

      {GPUS.map(g => (
        <div key={g.idx} className="whitespace-pre">
          <span className="text-terminal-fg">{pad(g.idx, 5)}</span>
          <span className="text-terminal-fg">{'  '}</span>
          <span className="text-terminal-fg">{pad(g.name, 16, true)}</span>
          <span className="text-terminal-dim">{'  '}</span>
          <span className="text-terminal-fg">{pad(`${g.temp} C`, 4)}</span>
          <span className="text-terminal-dim">{'   '}</span>
          <span className="text-terminal-fg">{pad(`${g.pwr} / ${PWR_CAP} W`, 13, true)}</span>
          <span className="text-terminal-dim">{'   '}</span>
          <span className="text-terminal-fg">{pad(`${g.mem} / ${MEM_TOTAL} MiB`, 20, true)}</span>
          <span className="text-terminal-dim">{'   '}</span>
          <span style={{ color: utilColor(g.util) }}>{pad(`${g.util}%`, 4)}</span>
        </div>
      ))}

      <div className="mt-3 text-terminal-dim">Processes:</div>
      <div className="whitespace-pre text-terminal-dim">
        {'  GPU   PID     Mem        Process'}
      </div>
      <div className="whitespace-pre">
        <span className="text-terminal-fg">{'  0-7   12847   78228 MiB  '}</span>
        <span className="text-terminal-accent">vllm-serve --model openai/gpt-oss-20b --tp 8</span>
      </div>
      <div className="whitespace-pre">
        <span className="text-terminal-fg">{'   0    12943       0 MiB  '}</span>
        <span className="text-terminal-dim">yusuf@afifi.dev (interactive ssh)</span>
      </div>
    </div>
  )
}

import { checkLabels } from '../src/main'
// import * as process from 'process'
// import * as cp from 'child_process'
// import * as path from 'path'

test('properly detects label', async () => {
  const input = parseInt('foo', 10)
  await expect(checkLabels([{ color: 'C5DEF5',
    default: false,
    description: 'Merge the thing',
    id: 2593147934,
    name: 'MergeMe',
    node_id: 'MDU6TGFiZWwyNTkzMTQ3OTM0',
    url:
      'https://api.github.com/repos/helloextend/pr-bot/labels/MergeMe' }])).toBeTruthy()
})

// test('wait 500 ms', async () => {
//   const start = new Date()
//   await wait(500)
//   const end = new Date()
//   var delta = Math.abs(end.getTime() - start.getTime())
//   expect(delta).toBeGreaterThan(450)
// })

// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = '500'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })

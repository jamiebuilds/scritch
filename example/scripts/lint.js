#!/usr/bin/env node

let sleep = ms => new Promise(res => setTimeout(res, ms))

async function main() {
  let start = Date.now()

  console.log("Linting files...")

  for (let i = 0; i < 10; i++) {
    await sleep(100)
    console.log(`- File ${i} linted.`)
  }

  let end = Date.now()
  let total = end - start
  let rounded = Math.round(total * 1000) / 1000

  console.log(`10 files linted in ${(rounded / 1000)}s.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

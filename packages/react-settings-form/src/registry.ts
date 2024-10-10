import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

const Registry = {
  cdn: '//cdn.jsdelivr.net/npm',
}

loader.config({
  monaco,
})

// export const setNpmCDNRegistry = (registry: string) => {
//   Registry.cdn = registry;
//   // loader.config({
//   //   monaco,
//   // });

//   // loader.config({
//   //   paths: {
//   //     vs: `${registry}/monaco-editor@0.30.1/min/vs`,
//   //   },
//   // })
//   // if (registry) {
//   // } else {

//   // }
// }

export const getNpmCDNRegistry = () => String(Registry.cdn).replace(/\/$/, '')

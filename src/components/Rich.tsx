import { Fragment } from 'react'

/** Renders `*gold italic*` segments and `\n` line breaks. */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split('*').map((seg, i) => (i % 2 === 1 ? <span key={i} className="gold-i">{seg}</span> : <Fragment key={i}>{seg}</Fragment>))}
        </Fragment>
      ))}
    </>
  )
}

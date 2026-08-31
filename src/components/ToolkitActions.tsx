'use client'

export function ToolkitActions() {
  return (
    <div className="toolkit-actions no-print">
      <button className="button primary" type="button" onClick={() => window.print()}>Print or save this pack as PDF</button>
      <a className="button secondary" href="/#assessment">Create an assessment result first</a>
    </div>
  )
}

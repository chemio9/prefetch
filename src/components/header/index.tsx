import ScrollHeader from "./header"
import { Link } from "wouter-preact"

import Css from "./header.module.css"

console.log(Css)
export default function() {
  return <>
    <ScrollHeader
      className={Css.header}
      showClass={Css['is--shown']}
      readyClass={Css['is--ready']}
      fixClass={Css['is--fixed']}
      listenTo={document.body}
      buffer={24}
    >
      <nav>
        <Link to="/">Home</Link>
        <Link to="/">Home</Link>
        <Link to="/">Home</Link>
        <Link to="/">Home</Link>
        <Link to="/">Home</Link>
      </nav>

    </ScrollHeader>
  </>
}

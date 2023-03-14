import classes from './styles.module.css'

interface Props {
  children: JSX.Element
}

export default function Board ({ children }: Props) {
  return (
    <article className={classes.board}>
      <div></div>
      {children}
      <div></div>
    </article>
  )
}

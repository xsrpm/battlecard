import classes from './styles.module.css'

interface Props {
  children?: JSX.Element
}

export default function Player ({ children }: Props) {
  return (
    <article className={classes.player}>
      {children}
    </article>
  )
}

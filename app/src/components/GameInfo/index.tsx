import classes from './styles.module.css'

interface Props {
  message: string
}

export default function GameInfo ({ message }: Props) {
  return (
    <div className={classes.info}>
    <h1>{message}</h1>
    </div>
  )
}

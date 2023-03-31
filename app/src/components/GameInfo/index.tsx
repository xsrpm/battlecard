import { useGameStore } from '../../hooks/useGameStore'
import classes from './styles.module.css'

interface Props {
  message: string
}

export default function GameInfo ({ message }: Props) {
  const ocultarGameInfo = useGameStore(state => state.ocultarGameInfo)
  const handleClick = () => {
    ocultarGameInfo()
  }
  return (
    <div className={classes.info} onClick={handleClick}>
    <h1>{message}</h1>
    </div>
  )
}

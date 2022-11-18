export default function Welcome() {
  const handleClick = () => {};
  return (
    <article className="flex flex-col justify-center items-center w-screen h-screen bg-yellow-200">
      <h1>BattleCard</h1>
      <button
        id="btnJugar"
        className="rounded-lg border-2 p-1 bg-blue-200 hover:bg-blue-400 active:bg-blue-500"
        onClick={handleClick}
      >
        Jugar
      </button>
    </article>
  );
}

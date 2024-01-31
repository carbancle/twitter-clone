import styles from "../css/Loading.module.scss";

export default function LoadingScreen() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>Loading...</p>
    </div>
  )
}
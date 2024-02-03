import { Outlet } from "react-router-dom"
import styles from "../css/Layout.module.scss"
import Navigation from "./navigation";

export default function Layout() {
  return (
    <div className={styles.wrapper}>
      <Navigation />
      <Outlet />
    </div>
  )
}
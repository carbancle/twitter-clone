import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "../css/OAuth.module.scss";
import { auth } from "../firebase";

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // await signInWithRedirect(auth, provider);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <button className={styles.button} onClick={onClick}>
      <img className={styles.logo} src="/github-logo.svg" alt="" />
      Continue with Github
    </button>
  );
}

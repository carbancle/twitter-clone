import { auth } from "../firebase";
import styles from "../css/Home.module.scss"
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";

export default function Home() {
  const logOut = () => {
    auth.signOut();
  }
  return (
    <div className={styles.wrapper}>
      <PostTweetForm />
      <Timeline />
    </div>
  );
}
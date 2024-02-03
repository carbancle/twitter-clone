import { Unsubscribe } from "firebase/auth";
import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import styles from "../css/Timeline.module.scss";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  let unsubscribe: Unsubscribe | null = null;
  const [tweets, setTweet] = useState<ITweet[]>([]);


  useEffect(() => {
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25),
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map(doc => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return { tweet, createdAt, userId, username, photo, id: doc.id }
      // });
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map(doc => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return { tweet, createdAt, userId, username, photo, id: doc.id }
        });
        setTweet(tweets);
      });
    }
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      {tweets.map((tweet) =>
        <Tweet key={tweet.id} {...tweet} />
      )}
    </div>
  );
}
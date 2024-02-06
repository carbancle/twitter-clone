import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { collection, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import styles from "../css/profile.module.scss";

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editName, setEditName] = useState("");
  const [editMode, setEditMode] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];

      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      })
    }
  }

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map(doc => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return { tweet, createdAt, userId, username, photo, id: doc.id }
    });
    setTweets(tweets);
  }
  useEffect(() => {
    fetchTweets();
  }, [])

  const onNameChange = async () => {
    setEditMode(true);
    if (!user || !editMode || editName == "" || editName.length >= 10) return;

    // profile 이름 변경
    await updateProfile(user, {
      displayName: editName,
    });


    const nameQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid)
    )
    const snapshot = await getDocs(nameQuery)
    snapshot.docs.map(async (doc) => {
      const docRef = doc.ref
      await updateDoc(docRef, { username: editName })
    });
    // db에서 변경된 username를 실시간 반영시키기 위해 fetchTweets 실행
    fetchTweets();
    setEditMode(false);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.avatarUpload} htmlFor="avatar">
        {avatar ?
          <img className={styles.avatarImg} src={avatar} />
          :
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        }
      </label>
      <input className={styles.avatarInput} id="avatar" onChange={onAvatarChange} type="file" accept="image/*" />
      <span className={styles.name}>
        {user?.displayName ?
          (!editMode ? user.displayName : <input type="text" onChange={onChange} value={editName} />)
          : "Anonymous"
        }
        &nbsp;
        {user?.displayName ?
          <button onClick={onNameChange}>{!editMode ? "Name Edit" : "Change Name"}</button>
          : null
        }
      </span>
      <div className={styles.tweets}>
        {tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)}
      </div>
    </div>
  );
}
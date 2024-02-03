import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import styles from "../css/Post.module.scss"
import { auth, db, storage } from "../firebase";

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        alert("Please select a file that is 1MB or less.")
        return;
      }
      setFile(files[0]);
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        console.log(url);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <textarea className={styles.textarea} onChange={onChange} placeholder="What is happening?!" rows={5} maxLength={180} required />
      <label className={styles.label} htmlFor="file">{file ? "Photo added ✅" : "Add photo"}</label>
      <input className={styles.fileInput} onChange={onFileChange} id="file" type="file" accept="image/*" />
      <input className={styles.submit}
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </form>
  );
}
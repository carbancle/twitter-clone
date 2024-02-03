import { ITweet } from "./timeline";
import styles from "../css/Tweets.module.scss"
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [isLoading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);

  const user = auth.currentUser;

  const onEdit = () => {
    // edit 모드 활성화 edit 버튼 > save 버튼으로 변경됨
    setEdit((prev) => !prev);
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onSubmit = async () => {
    try {
      // 유저 정보 미일치시 함수 종료
      if (user?.uid !== userId) return;
      setLoading(true);
      // 이미지가 있으면, 이미지 경로를 확인하여 해당 경로에 업로드 실행,
      // 덮어쓰기가 실행되어 delete 필요하지 않고 이미지 경로 또한 변하지 않는다.
      if (file) {
        const photoRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${id}`);
        // update image
        await uploadBytes(photoRef, file);
        // update tweet
        await updateDoc(doc(db, "tweets", id), {
          tweet: editTweet,
          updatedAt: Date.now(),
        });
        setFile(null);
      } else {
        // 파일이 존재하지 않거나, 파일은 존재하지만 이미지 변경 사항은 없을 때,
        await updateDoc(doc(db, "tweets", id), {
          tweet: editTweet,
          updatedAt: Date.now(),
        })
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setEdit(false);
    }
  }


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

  const onCancel = () => {
    setEdit(false);
  }

  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e)
    } finally {

    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        <span className={styles.username}>{username}</span>
        {edit ? <textarea className={styles.editTextarea} onChange={onChange} value={editTweet} rows={3} />
          : <p className={styles.payload}>{tweet}</p>
        }
        <div>
          {user?.uid === userId ?
            <button className={styles.editButton} onClick={edit ? onSubmit : onEdit}>
              {edit ?
                isLoading ? "Saving..." : "Save"
                : "Edit"}
            </button>
            : null
          }
          {user?.uid === userId ?
            <>
              {edit ? <button className={styles.deleteButton} onClick={onCancel}>Cancel</button> : <button className={styles.deleteButton} onClick={onDelete}>Delete</button>}
            </>
            : null}
        </div>
      </div>

      {photo ? (
        <div className={`${styles.column} ${styles.photoDiv}`}>
          {edit ?
            <div className={styles.positionDiv}>
              <label htmlFor="editFile">
                <img src={photo} alt=""
                  className={`${styles.photo} ${styles.editPhoto}`}
                />
                <span>{file ? "Photo changed ✅" : "Change photo"}</span>
              </label>
              <input className={styles.fileInput} onChange={onFileChange} id="editFile" type="file" accept="image/*" />
            </div>
            : <img src={photo} alt="" className={styles.photo} />}
        </div>
      ) : edit ? (
        <div className={`${styles.column} ${styles.nonPhotoDiv}`}>
          <label className={styles.label} htmlFor="editFile">{file ? "Photo Added ✅" : "Add photo"}</label>
          <input className={styles.fileInput} onChange={onFileChange} id="editFile" type="file" accept="image/*" />
        </div>
      ) : null}
    </div>
  )
}
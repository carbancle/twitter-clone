import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import styles from "../css/Auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      if (isLoading || email === "") return;
      await sendPasswordResetEmail(auth, email);
      alert("Send Email to Reset Password. Please check your email. Reset your password and log in again.")
      navigate("/login");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Reset Password</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} name="email" value={email} onChange={onChange} placeholder="Email" type="email" required />
        <input className={styles.input} type="submit" value={isLoading ? "Loading..." : "Change Password"} />
      </form>
      {error !== "" ? <span className={styles.error}>{error}</span> : null}
      <span className={styles.switcher}>
        Remember Password? {" "}
        <Link to="/login">Log in &rarr;</Link>
      </span>
      <span className={styles.switcher}>
        Don't have an account? {" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </span>
    </div>
  );
}
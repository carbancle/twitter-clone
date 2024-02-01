import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GithubButton from "../components/github-btn";
import styles from "../css/Auth.module.scss";
import { auth } from "../firebase";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log(credentials.user);
      await updateProfile(credentials.user, {
        displayName: name
      });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
    console.log(name, email, password);
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Join X</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} name="name" value={name} onChange={onChange} placeholder="Name" type="text" required />
        <input className={styles.input} name="email" value={email} onChange={onChange} placeholder="Email" type="email" required />
        <input className={styles.input} name="password" value={password} onChange={onChange} placeholder="Password" type="password" required />
        <input className={styles.input} type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </form>
      {error !== "" ? <span className={styles.error}>{error}</span> : null}
      <span className={styles.switcher}>
        Already an account? {" "}
        <Link to="/login">Log in &rarr;</Link>
      </span>
      <span className={styles.switcher}>
        Forget Password? <Link to="/reset-password">Reset Password &rarr;</Link>
      </span>
      <GithubButton />
    </div>
  )
}
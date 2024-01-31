import React, { useState } from "react";
import styles from "../css/Create.module.scss";

export default function CreateAccount() {
  const [isLoading, SetLoading] = useState(false);
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // create an account
      // set the name of the user.
      // redirect to the home page
    } catch (e) {
      // setError
    } finally {
      SetLoading(false);
    }
    console.log(name, email, password);
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Login into X</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} name="name" value={name} onChange={onChange} placeholder="Name" type="text" required />
        <input className={styles.input} name="email" value={email} onChange={onChange} placeholder="Email" type="email" required />
        <input className={styles.input} name="password" value={password} onChange={onChange} placeholder="Password" type="password" required />
        <input className={styles.input} type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </form>
      {error !== "" ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
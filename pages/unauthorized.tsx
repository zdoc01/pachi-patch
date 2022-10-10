import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';

const Unauthorized: NextPage = () => {
  return (
    <section className={styles.section}>
      <h1 className="title">
        Oops, you {`aren't`} authorized to access that...
      </h1>
      <p className={styles.description}>
        Hit up the Pachi fam if you think this is in error.
      </p>
    </section>
  );
}

export default Unauthorized;

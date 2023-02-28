import Link from 'next/link';
import styles from '../styles/ArchivedGameNight.module.css';

const ArchivedGameNight = () => {
  return (
    <div className={styles.ArchivedGameNight}>
      <p>
        This Game Night has been archived. More details for archived sessions
        coming soon!
      </p>
      <Link href="/gamenight">Back</Link>
    </div>
  );
};

export { ArchivedGameNight };

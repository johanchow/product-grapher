import styles from './page.module.scss';

export default function Home() {
  return (
    <div>
      <div className={styles.heroContent}>
        <button className={styles.tryButton}>Go To Try</button>
      </div>
    </div>
  );
}

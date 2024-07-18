import styles from "./TableController.module.css";

function TableController() {
  return (
    <form className={styles.controller}>
      <input placeholder="행"></input>
      <input placeholder="열"></input>
      <button>생성</button>
    </form>
  );
}

export default TableController;

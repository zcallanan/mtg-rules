import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { Chapter } from "../../../app/types";
import styles from "../../../styles/ChapterTitle.module.scss";

interface Props {
  chapter: Chapter;
  toc: number;
  tocOnClick?: (chapterNumber: number) => number;
  tocTitleRef?: HTMLElement | null;
  effectiveDate?: string;
}

const ChapterTitle = (props: Props): JSX.Element => {
  const {
    chapter,
    toc,
    tocOnClick,
    tocTitleRef,
    effectiveDate,
  } = props;
  const key = toc ? "toc" : "chapter";

  const router = useRouter();

  // Chapter prop or PH zero chapter if unavailable
  const chapterObj = chapter || { chapterNumber: 0, text: "" };

  // If url has no chapter, #100 is added. Display spinner until ready
  const handleZeroChapter = (chapterNumber: number) => (
    <div>
      { (chapterNumber === 0)
        ? (<div className={styles.spinnerDiv}>
          <Spinner
            animation="border"
            role="status"
            variant="dark"
            className={styles.spinnerComponent}
          >
          </Spinner>
        </div>)
        : (
          <div className={styles.chapterText}>
            {<span
                key={`${key}${chapterObj.chapterNumber}`}
              >
                {chapterObj.chapterNumber}. &nbsp; {chapterObj.text}
              </span>
            }
            {
              <span className={styles.effectiveDate}>
                Effective: &nbsp; {effectiveDate}
              </span>
            }
          </div>
        )
      }
    </div>
  );

  // If toc, return toc chapter title. Else rule list chapter title
  return (
    <div>
      { toc ? (
        <div ref={tocTitleRef}>
          <li
            key={`${key}${chapterObj.chapterNumber}`}
            className={styles.chapterList}
          >
            <Link
              href={"/rules/[year]/[version]"}
              as={`${router.asPath.split("#")[0]}#${chapterObj.chapterNumber}`}
              scroll={false}
            >
              <a>
                <span
                  className={styles.chapterNum}
                  onClick={() => tocOnClick(chapterObj.chapterNumber)}
                >
                  {chapterObj.chapterNumber}.
                </span>
                <span
                  className={styles.chapterTextToc}
                  onClick={() => tocOnClick(chapterObj.chapterNumber)}
                >{chapterObj.text}</span>
              </a>
            </Link>
          </li>
        </div>
      ) : handleZeroChapter(chapterObj.chapterNumber)
    }
    </div>
  );
};

export default ChapterTitle;

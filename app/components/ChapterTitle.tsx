import { MutableRefObject } from "react";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { useRouter, NextRouter } from "next/router";
import { Section, Chapter } from "../typing/types";
import styles from "../styles/ChapterTitle.module.scss";

interface Props {
  chapter: Chapter;
  i?: number;
  toc: number;
  onLinkClick?: (chapterNumber: number, dataSource: string) => void;
  tocTitleRef?: MutableRefObject<HTMLDivElement[]>;
  effectiveDate?: string;
  sections?: Section[];
}

const ChapterTitle = (props: Props): JSX.Element => {
  const { chapter, i, toc, onLinkClick, tocTitleRef, sections } = props;

  const key = toc ? "toc" : "chapter";

  const router: NextRouter = useRouter();

  // Chapter prop or PH zero chapter if unavailable
  const chapterObj = chapter || {
    chapterNumber: 0,
    text: "",
    sectionNumber: 0,
    type: "chapter",
  };

  let sectionObj: Section;
  if (chapterObj.chapterNumber && !toc) {
    sectionObj = sections.find(
      (section) => section.sectionNumber === chapterObj.sectionNumber
    );
  }

  // If url has no chapter, #100 is added. Display spinner until ready
  const handleZeroChapter = (chapterNumber: number) => (
    <div>
      {chapterNumber === 0 ? (
        <div className={styles.spinnerDiv}>
          <Spinner
            animation="border"
            role="status"
            variant="dark"
            className={styles.spinnerComponent}
          ></Spinner>
        </div>
      ) : (
        <div>
          {
            <div className={styles.chapterText}>
              <span key={`${key}${chapterObj.chapterNumber}`}>
                <h4>{`${chapterObj.chapterNumber}. ${chapterObj.text}`}</h4>
              </span>
              <span className={styles.sectionSpan}>
                <h6>{` •  ${chapterObj.sectionNumber}. ${sectionObj.text}`}</h6>
              </span>
            </div>
          }
        </div>
      )}
    </div>
  );

  // If toc, return toc chapter title. Else rule list chapter title
  return (
    <div>
      {toc ? (
        <Link
          href={"/rules/[year]/[version]"}
          as={`${router.asPath.split("#")[0]}#${chapterObj.chapterNumber}`}
          scroll={false}
        >
          <a>
            <div
              className={styles.tocChapterCard}
              // eslint-disable-next-line no-return-assign
              ref={(el) => (tocTitleRef.current[i] = el)}
            >
              <li
                key={`${key}${chapterObj.chapterNumber}`}
                className={styles.chapterList}
              >
                <span
                  className={styles.chapterNumToc}
                  onClick={() => onLinkClick(chapterObj.chapterNumber, "toc")}
                >
                  {chapterObj.chapterNumber}.
                </span>
                <span
                  className={styles.chapterTextToc}
                  onClick={() => onLinkClick(chapterObj.chapterNumber, "toc")}
                >
                  {chapterObj.text}
                </span>
              </li>
            </div>
          </a>
        </Link>
      ) : (
        handleZeroChapter(chapterObj.chapterNumber)
      )}
    </div>
  );
};

export default ChapterTitle;

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
  const { chapter, i, toc, onLinkClick, tocTitleRef, effectiveDate, sections } =
    props;

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
                {chapterObj.chapterNumber}. &nbsp; {chapterObj.text}
              </span>
              <span className={styles.effectiveDate}>
                Effective: &nbsp; {effectiveDate}
              </span>
            </div>
          }
          {
            <span className={styles.sectionSpan}>
              • &nbsp; {chapterObj.sectionNumber}. &nbsp; {sectionObj.text}
            </span>
          }
        </div>
      )}
    </div>
  );

  // If toc, return toc chapter title. Else rule list chapter title
  return (
    <div>
      {toc ? (
        // eslint-disable-next-line no-return-assign
        <div ref={(el) => (tocTitleRef.current[i] = el)}>
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
              </a>
            </Link>
          </li>
        </div>
      ) : (
        handleZeroChapter(chapterObj.chapterNumber)
      )}
    </div>
  );
};

export default ChapterTitle;

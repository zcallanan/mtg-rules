import Link from "next/link";
import { useRouter } from "next/router";
import { Chapter } from "../../../app/types";
import styles from "../../../styles/ChapterTitle.module.scss";

interface Props {
  chapter: Chapter;
  toc: number;
  tocOnClick?: (chapterNumber: number) => number;
  tocTitleRef?: HTMLElement | null;
}

const ChapterTitle = (props: Props): JSX.Element => {
  const {
    chapter,
    toc,
    tocOnClick,
    tocTitleRef,
  } = props;
  const key = toc ? "toc" : "chapter";

  const router = useRouter();

  // If toc, return toc chapter title. Else rule list chapter title
  return (
    <div>
      { toc ? (
        <div ref={tocTitleRef}>
          <li
            key={`${key}${chapter.chapterNumber}`}
            className={styles.chapterList}
          >
            <Link
              href={"/rules/[year]/[version]"}
              as={`${router.asPath.split("#")[0]}#${chapter.chapterNumber}`}
              scroll={false}
            >
              <a>
                <span
                  className={styles.chapterNum}
                  onClick={() => tocOnClick(chapter.chapterNumber)}
                >
                  {chapter.chapterNumber}.
                </span>
                <span
                  className={styles.chapterTextToc}
                  onClick={() => tocOnClick(chapter.chapterNumber)}
                >{chapter.text}</span>
              </a>
            </Link>
          </li>
        </div>
      ) : (
        <div>
          {<span
              key={`${key}${chapter.chapterNumber}`}
              className={styles.chapterText}
            >
              {chapter.chapterNumber}. &nbsp; {chapter.text}
            </span>
          }
        </div>
      )}
    </div>
  );
};

export default ChapterTitle;

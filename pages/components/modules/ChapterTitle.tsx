import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Chapter } from "../../../app/types";
import styles from "../../../styles/ChapterTitle.module.scss";

interface Props {
  chapter: Chapter;
  toc: number;
}

const ChapterTitle = (props: Props): JSX.Element => {
  const { chapter, toc } = props;
  const key = toc ? "toc" : "chapter";

  const router = useRouter();
  const { version, year }: string = router.query;
  const pathname = `/${router.pathname.split("/")[1]}/${year}/${version}/`;

  // If toc, return toc chapter title. Else rule list chapter title
  return (
    <div>
      {toc ? (
        <li
          key={`${key}${chapter.chapterNumber}`}
          className={styles.chapterList}
        >
          <Link
            href={"/rules/[year]/[version]"}
            as={`${pathname}#${chapter.chapterNumber}`}
            scroll={false}
          >
            <a>
              <span className={styles.chapterNum}>
                {chapter.chapterNumber}.
              </span>
              <span className={styles.chapterTextToc}>{chapter.text}</span>
            </a>
          </Link>
        </li>
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

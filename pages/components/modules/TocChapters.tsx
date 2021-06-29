import React from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChapterI } from '../../../app/types.ts';
import styles from '../../../styles/TocChapters.module.scss';

interface Props {
  chapters: ChapterI[];
  sectionNumber: number;
}

const TocChapters = (props: Props): JSX.Element => {
  const router = useRouter()
  const pathname = `/${router.pathname.split("/")[1]}/${router.query.version}/`;
  const { chapters, sectionNumber } = props;
  let key: string;

  const chapterArray: string[] = chapters.map((chapter) => {
    if (chapter.sectionNumber === sectionNumber) {
      const key: string = `c${chapter.chapterNumber}`;
      return (
        <li
          key={key}
          className={styles.chapterList}
        >
          <Link href={`${pathname}#${chapter.chapterNumber.toString()}`} scroll={false}>
            <a>
              <span className={styles.chapterNum}>{chapter.chapterNumber}.</span>
              <span className={styles.chapterText}>{chapter.text}</span>
            </a>
          </Link>
        </li>
      )
    }
  })
  return (
    <ul className={'list-group'}>
      {chapterArray}
    </ul>
  )
};

export default TocChapters;

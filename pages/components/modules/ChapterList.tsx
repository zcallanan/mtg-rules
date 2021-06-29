import React from 'react';
import RuleList from './RuleList.tsx';
import { ChapterI, RuleI, SubruleI } from '../../../app/types.ts';
import styles from '../../../styles/ChapterList.module.scss';

interface Props {
  chapters: ChapterI[];
  rules: RuleI[];
  subrules: Subrule[];
}

const ChapterList = (props: Props): JSX.Element => {
  const { chapters, rules, subrules } = props;
  let key: string;
  let i = 0;

  const chapterArray: string[] = chapters.map((chapter) => {
    // Filter all the rule numbers assigned to that chapter
    const ruleSubset = rules.filter((rule) => rule.chapterNumber === chapter.chapterNumber);
    i += 1;
    const dkey: number = i;

    if (ruleSubset) {
      // If the chapter has rules, include the RuleList component
      return (
        [
        <div key={dkey}>
          <section id={`${chapter.chapterNumber}`}>
            <span key={`c${chapter.chapterNumber}`} className={styles.chapterText}>
              {chapter.chapterNumber}. &nbsp; {chapter.text}
            </span>
          </section>
          <ul key={`c-u${chapter.chapterNumber}`} className={'list-group'}>
            <RuleList chapter={chapter} ruleSubset={ruleSubset} subrules={subrules}/>
          </ul>
        </div>
        ]
      )
    } else {
      /* Example: Chapter "600. General" has no rules, but should display its text.
      Since ruleList is empty, omit the ul */
      return (
        [
        <div key={dkey}>
          <section id={`${chapter.chapterNumber}`}>
            <span key={`c${chapter.chapterNumber}`} className={styles.chapterText}>
              {chapter.chapterNumber}. &nbsp; {chapter.text}
            </span>
          </section>
        </div>
        ]
      )
    }
  })
  return (
    <div>
      {chapterArray}
    </div>
  )
};

export default ChapterList;
